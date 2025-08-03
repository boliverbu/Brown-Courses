"use client";
import { CourseSearchPage } from "./CourseSearchPage";
import "../styles/App.css";

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
