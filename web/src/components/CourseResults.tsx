import { Course } from "./CourseSearchPage";

interface CourseResultsProps {
  courses: Course[];
}

export function CourseResults({ courses }: CourseResultsProps) {
  return (
    <div
      className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
      aria-label="recommended courses"
    >
      {courses.length === 0
        ? null
        : courses.map((course, index) => (
            <div
              key={index}
              className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 flex flex-col gap-2 hover:shadow-md transition"
              aria-label={`Recommended course ${index + 1}`}
            >
              <h2 className="text-lg font-bold text-neutral-900 mb-1">
                {course.title}
              </h2>
              <h4 className="text-xs text-neutral-500 font-mono">
                {course.id}
              </h4>
              <h3 className="text-sm text-blue-700 font-semibold mb-1">
                {course.department}
              </h3>
              <p className="text-neutral-700 text-sm">
                {course.description || "No description available."}
              </p>
            </div>
          ))}
    </div>
  );
}
