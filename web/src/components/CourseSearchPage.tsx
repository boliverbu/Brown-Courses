"use client";
import { useMemo, useState } from "react";
import "../styles/main.css";
import { BlurbInput } from "./BlurbInput";
import { CourseResults } from "./CourseResults";

export interface Course {
  title: string;
  department: string;
  description: string;
  id: string;
  prerequisites?: string;
  max_enrollment?: number | null;
  seats_available?: number | null;
}

const useMockData = false;

// Define a type for course entry
interface CourseEntry {
  id: string;
  title: string;
  department: string;
  description?: string;
  prerequisites?: string;
  max_enrollment?: number | null;
  seats_available?: number | null;
}

export function CourseSearchPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedBlurb, setSubmittedBlurb] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const availableDepartments = useMemo(() => {
    const set = new Set<string>();
    for (const c of courses) {
      if (c.department) set.add(c.department);
    }
    return Array.from(set).sort();
  }, [courses]);

  const displayedCourses = useMemo(() => {
    if (!selectedDepartment) return courses;
    return courses.filter((c) => c.department === selectedDepartment);
  }, [courses, selectedDepartment]);

  const handleBlurbSubmit = async (blurb: string, departments: string[]) => {
    setSubmittedBlurb(blurb);
    setError(null);
    setCourses([]);
    setLoading(true);

    try {
      if (useMockData) {
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_blurb: blurb,
            num_courses: 10,
            departments,
          }),
        });

        if (!response.ok) throw new Error("Server error");

        const result = await response.json();
        const parsedCourses = result.results.map((entry: CourseEntry) => ({
          id: entry.id,
          title: entry.title,
          department: entry.department,
          description: entry.description || "No description provided",
          prerequisites: entry.prerequisites || "",
          max_enrollment: entry.max_enrollment ?? null,
          seats_available: entry.seats_available ?? null,
        }));

        setCourses(parsedCourses);
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Server error. Showing fallback mock data.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setSubmittedBlurb("");
    setCourses([]);
    setError(null);
    setLoading(false);
    setSelectedDepartment("");
  };

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-start">
      <div className="w-full">
        <div className="w-full" aria-label="Course recommendation container">
          {!submittedBlurb && <BlurbInput onSubmit={handleBlurbSubmit} />}
        </div>

        {submittedBlurb && (
          <div className="mt-6 text-center">
            <p className="text-base text-neutral-700 mb-2">
              <strong>These are your results for:</strong> &quot;
              {submittedBlurb}&quot;
            </p>
            <button
              onClick={handleNewSearch}
              className="inline-block bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium px-4 py-2 rounded-lg border border-neutral-300 shadow-sm transition mt-2"
              aria-label="Start a new course search"
            >
              New Search
            </button>
          </div>
        )}

        <hr className="my-8 border-neutral-200" />

        {loading && (
          <div
            className="text-blue-600 text-center font-medium animate-pulse"
            aria-live="polite"
          >
            Finding courses for you...
          </div>
        )}

        {error && (
          <div
            className="text-red-600 text-center font-semibold mt-4"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {!loading && submittedBlurb && courses.length === 0 && (
          <div className="text-center text-neutral-600 mt-6">
            <p>
              <strong>No courses found for:</strong> &quot;{submittedBlurb}
              &quot;
            </p>
          </div>
        )}

        {!submittedBlurb && courses.length === 0 && !loading && (
          <div
            className="text-center text-neutral-500 mt-6"
            aria-label="Example blurb"
          >
            <p>
              <em>
                Try typing something like: &quot;I want an Economics Class&quot;
              </em>
            </p>
          </div>
        )}

        {courses.length > 0 && (
          <div className="mb-4 flex items-center gap-3">
            <label htmlFor="dept-filter" className="text-sm text-neutral-700">
              Department
            </label>
            <select
              id="dept-filter"
              className="border border-neutral-300 bg-white text-neutral-800 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}

        <CourseResults courses={displayedCourses} />

        <div className="text-center mt-12 text-sm text-neutral-400">
          Not finding what you&apos;re looking for? You can also browse the{" "}
          <a
            href="https://cab.brown.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Courses at Brown (CAB) website
          </a>
          .
        </div>
      </div>
    </div>
  );
}
