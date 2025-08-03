import asyncio
import json
from playwright.async_api import async_playwright
import os

CAB_URL = "https://cab.brown.edu/"

async def extract_course_data(page):
    """Extract ID, Title, and Description from a course detail page."""
    course_id = await page.locator(".dtl-course-code").inner_text()
    dept_code = course_id.strip().split(" ")[0]
    title = await page.locator(".detail-title").inner_text()
    description = await page.locator(".section--description .section__content").inner_text()
    return {
        "id": course_id.strip(),
        "department": dept_code,
        "title": title.strip(),
        "description": description.strip()
    }

async def scrape_courses(max_courses=None):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(CAB_URL)
        await page.click("#search-button")
        await page.wait_for_selector(".result__link")
        course_links = page.locator(".result__link")
        count = await course_links.count()
        print(f"Found {count} courses.")
        all_courses = []
        # Use min(count, max_courses) if max_courses is set
        limit = min(count, max_courses) if max_courses else count
        for idx in range(limit):
            link = course_links.nth(idx)
            await link.scroll_into_view_if_needed()
            await link.click()
            await asyncio.sleep(0.05)
            try:
                await page.wait_for_selector(".dtl-course-code", timeout=10000)
                course_data = await extract_course_data(page)
                all_courses.append(course_data)
                print(f"Scraped {idx + 1}/{count}: {course_data['id']}")
            except Exception as e:
                print(f"Error scraping course {idx + 1}: {e}")
            try:
                await page.wait_for_selector(".panel__content")
                panel = page.locator(".panel__content").nth(-1)
                await panel.locator(".panel__back").click()
                await asyncio.sleep(0.05)
                await page.wait_for_selector(".result__link")
            except Exception as e:
                print(f"Error clicking back after course {idx + 1}: {e}")
        await browser.close()
        return all_courses
