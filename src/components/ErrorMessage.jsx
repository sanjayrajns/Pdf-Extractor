import React from "react";

const ErrorMessage = ({ error, onRetry, isDarkMode }) => {
  if (!error) return null;

  return (
    <div className="max-w-2xl mx-auto mb-6">
      <div className={`border p-4 rounded-xl shadow-md ${isDarkMode ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-red-100 border-red-500 text-red-800'}`}>
        <h3 className="font-bold mb-2 flex items-center gap-2">
            🚨 Extraction Error
        </h3>
        <p>{error}</p>
        <button
            onClick={onRetry}
            className="mt-3 text-sm font-semibold underline hover:no-underline"
        >
            Clear File and Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;