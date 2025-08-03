import "../styles/main.css";
import { Course } from "./CourseSearchPage";

interface CourseResultsProps {
  courses: Course[];
}

export function CourseResults({ courses }: CourseResultsProps) {
  return (
    <div className="results-container" aria-label="recommended courses">
      {courses.length === 0
        ? null
        : courses.map((course, index) => (
            <div
              key={index}
              className="course-card"
              aria-label={`Recommended course ${index + 1}`}
            >
              <h2 className="course-title">{course.title}</h2>
              <h4 className="course-id text-sm text-gray-500">{course.id}</h4>
              <h3 className="course-department">{course.department}</h3>
              <p className="course-description">
                {course.description || "No description available."}
              </p>
            </div>
          ))}
    </div>
  );
}
