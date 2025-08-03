"use client";
import { CourseSearchPage } from "./CourseSearchPage";

/**
 * This is the highest level of the Course Recommendation Application
 */
function App() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full text-center mt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-2 drop-shadow-sm">
          Brown Course Finder
        </h1>
        <p className="text-neutral-600 text-base sm:text-lg max-w-xl mx-auto">
          Find the perfect Brown course for your interests and goals.
        </p>
      </div>
      <CourseSearchPage />
    </div>
  );
}

export default App;
