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
              <div className="text-xs text-neutral-600 font-mono mb-1">
                {course.id}
              </div>
              <div className="text-xs text-neutral-600 mt-1 flex gap-3">
                <span>
                  <span className="font-semibold">Max: </span>
                  {course.max_enrollment != null
                    ? course.max_enrollment
                    : "Uncapped"}
                </span>
                {course.seats_available != null && (
                  <span>
                    <span className="font-semibold">Seats: </span>
                    {course.seats_available}
                  </span>
                )}
              </div>
              <p className="text-neutral-700 text-sm">
                {course.description || "No description available."}
              </p>
              {course.prerequisites && (
                <div className="text-xs text-neutral-600 mt-2">
                  <span className="font-semibold">Prerequisites: </span>
                  <span>{course.prerequisites}</span>
                </div>
              )}
            </div>
          ))}
    </div>
  );
}
