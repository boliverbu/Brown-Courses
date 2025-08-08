import asyncio
import json
import re
from playwright.async_api import async_playwright
import os

CAB_URL = "https://cab.brown.edu/"

async def extract_course_data(page):
    """Extract ID, Title, Description, and Prerequisites from a course detail page."""
    course_id = await page.locator(".dtl-course-code").inner_text()
    dept_code = course_id.strip().split(" ")[0]
    title = await page.locator(".detail-title").inner_text()
    description = await page.locator(".section--description .section__content").inner_text()

    # Extract prerequisites from the Registration Restrictions section if available
    prerequisites = ""
    try:
        prereq_locator = page.locator(
            ".section--registration_restrictions .section__content .prereq"
        )
        if await prereq_locator.count() > 0:
            prerequisites = (await prereq_locator.inner_text()).strip()
    except Exception:
        prerequisites = ""

    # Extract enrollment info (maximum enrollment and seats available) if present
    max_enrollment = None
    seats_available = None
    try:
        # First, use the exact selectors provided by the user
        if await page.locator(".detail-seats .seats_max").count() > 0:
            max_text = (await page.locator(".detail-seats .seats_max").first.inner_text()).strip()
            if max_text:
                try:
                    max_enrollment = int(re.sub(r"[^0-9]", "", max_text))
                except ValueError:
                    max_enrollment = None
        if await page.locator(".detail-seats .seats_avail").count() > 0:
            avail_text = (await page.locator(".detail-seats .seats_avail").first.inner_text()).strip()
            if avail_text:
                try:
                    seats_available = int(re.sub(r"[^0-9]", "", avail_text))
                except ValueError:
                    seats_available = None

        # Fallback: try parsing from a generic enrollment section or panel text
        if max_enrollment is None or seats_available is None:
            enrollment_section = page.locator(
                ".section--enrollment .section__content"
            )
            section_text = None
            if await enrollment_section.count() > 0:
                section_text = (await enrollment_section.inner_text()).strip()
            else:
                # Fallback: parse the full visible panel content
                panel = page.locator(".panel__content").nth(-1)
                if await panel.count() > 0:
                    section_text = (await panel.inner_text()).strip()

            if section_text:
                if max_enrollment is None:
                    max_match = re.search(r"Maximum\s+Enrollment\D(\d+)", section_text, re.I)
                    if max_match:
                        try:
                            max_enrollment = int(max_match.group(1))
                        except ValueError:
                            max_enrollment = None
                if seats_available is None:
                    seats_match = re.search(r"Seats?\s+(?:Avail|Available|Remaining)\D(\d+)", section_text, re.I)
                    if seats_match:
                        try:
                            seats_available = int(seats_match.group(1))
                        except ValueError:
                            seats_available = None
    except Exception:
        max_enrollment = None
        seats_available = None

    return {
        "id": course_id.strip(),
        "department": dept_code,
        "title": title.strip(),
        "description": description.strip(),
        "prerequisites": prerequisites,
        "max_enrollment": max_enrollment,
        "seats_available": seats_available,
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
