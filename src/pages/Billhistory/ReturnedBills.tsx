import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
type SortOrder = "asc" | "desc";
const ReturnedBills = () => {
  const [sort, setSort] = useState<{ key: string; order: SortOrder }>({
    key: "",
    order: "asc",
  });
  const handleSort = (key: string) => {
    setSort((prev) => ({
      key,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };
  const SortIcon = ({ column }: { column: string }) => {
    if (sort.key !== column) return <ChevronDown size={14} className="text-gray-400 dark:text-gray-500" />;
    return sort.order === "asc" ? (
      <ChevronUp size={14} className="text-gray-700 dark:text-gray-200" />
    ) : (
      <ChevronDown size={14} className="text-gray-700 dark:text-gray-200" />
    );
  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Returned Bills</h1>
      {/* Search Row */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            placeholder="SEARCH..."
            className="border dark:border-gray-600 rounded-md px-4 py-2 w-64 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white placeholder-gray-500"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md">
            SEARCH
          </button>
        </div>
        {/* Page Size Dropdown */}
        <select className="border dark:border-gray-600 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white">
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
      {/* Table */}
      <div className="mt-5 border dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-left dark:text-gray-200">
          <thead>
            <tr className="bg-purple-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              {[
                "METHOD",
                "SERVICE",
                "TYPE",
                "AMOUNT",
                "CHARGE",
                "USER",
                "CREATED",
                "STATUS",
                "ACTION",
              ].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 cursor-pointer select-none font-semibold text-sm"
                >
                  <div className="flex items-center gap-1">
                    {col}
                    <SortIcon column={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={9} className="text-center py-10 text-gray-500 dark:text-gray-400">
                No Data Found!
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-4 mt-4">
        <button className="px-4 py-2 border dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">Prev</button>
        <span className="bg-purple-600 text-white px-4 py-2 rounded-md">1</span>
        <button className="px-4 py-2 border dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">Next</button>
      </div>
    </div>
  )
}

export default ReturnedBills