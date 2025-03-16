import React from "react";

const Summary = ({ summary }) => {
  return (
    <>
      <div className="p-3 rounded-lg shadow-md overflow-auto max-h-96 bg-teal-900">
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {summary ||
            "Tap the button below to quickly transform lengthy content into a clear, concise summary."}
        </p>
      </div>
    </>
  );
};

export default Summary;
