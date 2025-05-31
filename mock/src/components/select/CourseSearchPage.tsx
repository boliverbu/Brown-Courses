// Import
import { useState } from "react";

// Import shared CSS styles
import "../../styles/main.css";

// Import child components and mock data
import { BlurbInput } from "./BlurbInput";
import { CourseResults } from "./CourseResults";

// Define the structure of a Course object to ensure strong typing across components
export interface Course {
  title: string;
  department: string;
  description: string; // Description is now expected from backend
  id: string; // Course Nu
}

// Toggle between using mock data and real backend calls
const useMockData = false;

// Main component that handles user interaction, data fetching, and rendering
export function CourseSearchPage() {
  // State hooks
  const [courses, setCourses] = useState<Course[]>([]); // List of courses to display
  const [error, setError] = useState<string | null>(null); // Error message (if any)
  const [loading, setLoading] = useState<boolean>(false); // Indicates loading state
  const [submittedBlurb, setSubmittedBlurb] = useState<string>(""); // Stores the user's input

  // Handler function triggered when the user submits a blurb
  const handleBlurbSubmit = async (blurb: string) => {
    setSubmittedBlurb(blurb); // Save the blurb
    setError(null); // Clear previous errors
    setCourses([]); // Reset courses list
    setLoading(true); // Show loading message

    try {
      if (useMockData) {
        // Simulate backend delay and use mock data
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        // Make POST request to FastAPI ML backend
        const response = await fetch("http://127.0.0.1:8000/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_blurb: blurb, // User's input
            pref_departments: [], // Currently unused, could filter by department
            num_courses: 10, // Number of courses to return
            alpha: 0.5, // Hyperparameter (e.g., weighting for filtering)
          }),
        });

        if (!response.ok) throw new Error("Server error");

        // Parse response and map results to course format
        const result = await response.json();
        const parsedCourses = result.results.map((entry: any) => ({
          id: entry.id,
          title: entry.course,
          department: entry.id.split(" ")[0], // Fallback for department name
          description: entry.description || "No description provided", // Fallback if description is missing
        }));

        // Update state with fetched results
        setCourses(parsedCourses);
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Server error. Showing fallback mock data.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Handler to reset the search page so the user can submit a new blurb
  const handleNewSearch = () => {
    setSubmittedBlurb("");
    setCourses([]);
    setError(null);
    setLoading(false);
  };

  // JSX to render the UI
  return (
    <div className="min-h-[95vh] relative">
      <div className="w-full">
        {/* Container for the input form */}
        <div
          className="search-container"
          aria-label="Course recommendation container"
        >
          {/* Only show input form if user hasn't submitted a blurb yet */}
          {!submittedBlurb && <BlurbInput onSubmit={handleBlurbSubmit} />}
        </div>

        {/* If a blurb has been submitted, show the result label and a reset button */}
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

        {/* Show a loading message while waiting for backend response */}
        {loading && (
          <div className="loading-message" aria-live="polite">
            Finding courses for you...
          </div>
        )}

        {/* Show an error message if something went wrong */}
        {error && (
          <div className="error-message" aria-live="assertive">
            {error}
          </div>
        )}

        {/* Show a "no results" message if backend responds but returns nothing */}
        {!loading && submittedBlurb && courses.length === 0 && (
          <div className="no-results-message">
            <p>
              <strong>No courses found for:</strong> "{submittedBlurb}"
            </p>
          </div>
        )}

        {/* Initial example text to guide the user before they type anything */}
        {!submittedBlurb && courses.length === 0 && !loading && (
          <div className="example-message" aria-label="Example blurb">
            <p>
              <em>Try typing something like: "I want an Economics Class"</em>
            </p>
          </div>
        )}

        {/* Display the list of course results */}
        <CourseResults courses={courses} />

        {/* Optional help link to external CAB (Courses at Brown) website */}
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
