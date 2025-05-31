import { useState } from "react";
import "@/styles/App.css";
import { CourseSearchPage } from "./CourseSearchPage";
import { Analytics } from "@vercel/analytics/next";

/**
 * This is the highest level of the Course Recommendation Application
 */
function App() {
  return (
    <div className="App">
      <div className="App-header">
        <h1 aria-label="Course Recommendation Application">
          Brown Course Finder
        </h1>
      </div>
      <CourseSearchPage />
    </div>
  );
}

export default App;
