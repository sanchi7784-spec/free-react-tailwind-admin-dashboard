import React from "react";

const AllBills: React.FC = () => {
  return (
    <div className="w-full p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 dark:text-white">All Bill</h1>

      {/* Search + Page Size */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-900 flex items-center justify-between">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="SEARCH..."
            className="border dark:border-gray-600 rounded-md px-4 py-2 w-64 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-500"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md">
            <span>🔍</span> SEARCH
          </button>
        </div>

        {/* Dropdown */}
        <div>
         <select className="border dark:border-gray-600 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white">
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 border dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-left dark:text-gray-200">
          <thead className="bg-purple-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3">METHOD</th>
              <th className="p-3">SERVICE</th>
              <th className="p-3">TYPE</th>
              <th className="p-3">AMOUNT</th>
              <th className="p-3">CHARGE</th>
              <th className="p-3">USER</th>
              <th className="p-3">CREATED</th>
              <th className="p-3">STATUS</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-3">flutterwave</td>
              <td className="p-3">AIRTIME</td>
              <td className="p-3">airtime</td>
              <td className="p-3">1.03</td>
              <td className="p-3">0.03</td>
              <td className="p-3 text-purple-600 font-semibold cursor-pointer">
                demouser
              </td>
              <td className="p-3">2025-03-25 15:15:05</td>
              <td className="p-3">
                <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-xs">
                  Completed
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-3 mt-4">
        <button className="border px-4 py-2 rounded-md dark:text-white">Prev</button>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-md dark:text-white">
          1
        </button>

        <button className="border px-4 py-2 rounded-md dark:text-white">Next</button>
      </div>
    </div>
  );
};

export default AllBills;
