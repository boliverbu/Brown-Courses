"use client";
import { useState } from "react";
import "../styles/main.css";

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
    <div className="input-container" aria-live="polite">
      <textarea
        className="input-textarea"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Describe the vibe, topics, or structure you're looking for..."
        aria-label="Course description input"
        rows={4}
      />
      <button
        className="submit-button"
        onClick={handleSubmit}
        aria-label="Submit course blurb"
      >
        Find Courses
      </button>
    </div>
  );
}
