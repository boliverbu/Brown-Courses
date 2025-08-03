"use client";
import { useState } from "react";

interface BlurbInputProps {
  onSubmit: (blurb: string) => void;
}

export function BlurbInput({ onSubmit }: BlurbInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      onSubmit(inputValue.trim());
      setInputValue("");
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
