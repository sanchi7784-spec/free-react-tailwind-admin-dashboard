// import React from "react";

const ConvertRate = () => {
  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
        Convert Rate
      </h2>

      {/* White Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">

        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
          Method:
        </label>

        <div className="flex items-center gap-4">
          
          {/* Select Box */}
          <select
            className="w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 dark:bg-gray-700
                       focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
          >
            <option>Select Method</option>
            <option>Bank Transfer</option>
            <option>UPI</option>
            <option>Wallet</option>
          </select>

          {/* Search Button */}
          <button
            className="px-6 py-2 bg-purple-600 text-white rounded-md shadow 
                       hover:bg-purple-700 transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 5.64 5.64a7.5 7.5 0 0 0 10.61 10.61Z"
              />
            </svg>
            Search
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConvertRate;
