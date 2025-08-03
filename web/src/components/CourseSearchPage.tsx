"use client";
import { useState } from "react";
import "../styles/main.css";
import { BlurbInput } from "./BlurbInput";
import { CourseResults } from "./CourseResults";

export interface Course {
  title: string;
  department: string;
  description: string;
  id: string;
}

const useMockData = false;

export function CourseSearchPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedBlurb, setSubmittedBlurb] = useState<string>("");

  const handleBlurbSubmit = async (blurb: string) => {
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
          }),
        });

        if (!response.ok) throw new Error("Server error");

        const result = await response.json();
        const parsedCourses = result.results.map((entry: any) => ({
          id: entry.id,
          title: entry.title,
          department: entry.department,
          description: entry.description || "No description provided",
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
  };

  return (
    <div className="min-h-[95vh] relative">
      <div className="w-full">
        <div
          className="search-container"
          aria-label="Course recommendation container"
        >
          {!submittedBlurb && <BlurbInput onSubmit={handleBlurbSubmit} />}
        </div>

        {submittedBlurb && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p className="results-message">
              <strong>These are your results for:</strong> "{submittedBlurb}"
            </p>
            <button
              onClick={handleNewSearch}
              className="border px-4 py-2 rounded hover:bg-gray-100"
              aria-label="Start a new course search"
            >
              New Search
            </button>
          </div>
        )}

        <hr />

        {loading && (
          <div className="loading-message" aria-live="polite">
            Finding courses for you...
          </div>
        )}

        {error && (
          <div className="error-message" aria-live="assertive">
            {error}
          </div>
        )}

        {!loading && submittedBlurb && courses.length === 0 && (
          <div className="no-results-message">
            <p>
              <strong>No courses found for:</strong> "{submittedBlurb}"
            </p>
          </div>
        )}

        {!submittedBlurb && courses.length === 0 && !loading && (
          <div className="example-message" aria-label="Example blurb">
            <p>
              <em>Try typing something like: "I want an Economics Class"</em>
            </p>
          </div>
        )}

        <CourseResults courses={courses} />

        <div className="text-center mt-8 text-sm text-gray-500">
          Not finding what you're looking for? You can also browse the{" "}
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
