"use client";
import { useState } from "react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<null | "success" | "error" | "sending">(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      if (res.ok) {
        setStatus("success");
        setFeedback("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen(true)}
        aria-label="Open feedback form"
      >
        Feedback
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 text-xl"
              onClick={() => {
                setOpen(false);
                setStatus(null);
              }}
              aria-label="Close feedback form"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2">Anonymous Feedback</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <textarea
                className="w-full border border-neutral-300 rounded-lg p-3 min-h-[80px] resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                minLength={3}
                maxLength={1000}
                aria-label="Feedback textarea"
                disabled={status === "sending"}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
                disabled={feedback.length < 3 || status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Submit"}
              </button>
            </form>
            {status === "success" && (
              <div className="text-green-600 mt-2">
                Thank you for your feedback!
              </div>
            )}
            {status === "error" && (
              <div className="text-red-600 mt-2">
                Something went wrong. Please try again.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
