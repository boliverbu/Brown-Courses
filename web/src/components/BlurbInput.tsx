"use client";
import { useEffect, useState } from "react";

interface BlurbInputProps {
  onSubmit: (blurb: string, departments: string[], levels: string[]) => void;
}

export function BlurbInput({ onSubmit }: BlurbInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    []
  );
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  useEffect(() => {
    fetch("/departments.json")
      .then((r) => r.json())
      .then((list: string[]) => setAvailableDepartments(list))
      .catch(() => setAvailableDepartments([]));
  }, []);

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      onSubmit(inputValue.trim(), selectedDepartments, selectedLevels);
      setInputValue("");
      setSelectedDepartments([]);
      setSelectedLevels([]);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 items-center w-full max-w-xl mx-auto mt-6"
      aria-live="polite"
    >
      <textarea
        className="w-full rounded-lg border border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-4 text-base resize-none shadow-sm transition outline-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Describe the vibe, topics, or structure you're looking for..."
        aria-label="Course description input"
        rows={4}
      />
      {availableDepartments.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          <span className="text-sm text-neutral-700">
            Departments (optional)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 border border-neutral-200 rounded-lg p-3 max-h-56 overflow-auto">
            {availableDepartments.map((dept) => {
              const checked = selectedDepartments.includes(dept);
              return (
                <label key={dept} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={checked}
                    onChange={(e) => {
                      setSelectedDepartments((prev) =>
                        e.target.checked
                          ? [...prev, dept]
                          : prev.filter((d) => d !== dept)
                      );
                    }}
                  />
                  <span>{dept}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
      <div className="w-full flex flex-col gap-2">
        <span className="text-sm text-neutral-700">
          Course level (optional)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 border border-neutral-200 rounded-lg p-3">
          {["0-999", "1000-1999", "2000-2999"].map((band) => {
            const checked = selectedLevels.includes(band);
            return (
              <label key={band} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={checked}
                  onChange={(e) => {
                    setSelectedLevels((prev) =>
                      e.target.checked
                        ? [...prev, band]
                        : prev.filter((b) => b !== band)
                    );
                  }}
                />
                <span>{band}</span>
              </label>
            );
          })}
        </div>
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        aria-label="Submit course blurb"
        disabled={inputValue.trim() === ""}
      >
        Find Courses
      </button>
    </div>
  );
}
