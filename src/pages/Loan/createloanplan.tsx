import { Bold, Italic, Underline, Image, LinkIcon } from "lucide-react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router';
export default function AddLoanPlan() {
  const [featured, setFeatured] = useState(true);
  const [status, setStatus] = useState(true);

  return (
    
    <div className="p-6 max-w-6xl mx-auto">
         <div className="flex items-center justify-between mb-6">
      {/* Left Title */}
      <h1 className="text-3xl font-bold dark:text-white">Add New Plan</h1>

      {/* Right Back Link */}
        <Link to="/loan/loan-plans" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md">
        <ArrowLeft size={18} />
        BACK
      </Link>
    </div>
      {/* Form Grid 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Plan Name */}
        <div>
          <label className="font-medium dark:text-gray-200">Plan Name: *</label>
          <input
            className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Plan name"
          />
        </div>

        {/* Empty right column for alignment */}
        <div />

        {/* Min Amount */}
        <div>
          <label className="font-medium dark:text-gray-200">Min Amount: *</label>
          <div className="relative">
            <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span className="absolute right-3 top-3 text-sm dark:text-gray-400">USD</span>
          </div>
        </div>

        {/* Max Amount */}
        <div>
          <label className="font-medium dark:text-gray-200">Max Amount: *</label>
          <div className="relative">
            <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span className="absolute right-3 top-3 text-sm dark:text-gray-400">USD</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="font-medium dark:text-gray-200">Interest Rate: *</label>
          <div className="relative">
            <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span className="absolute right-3 top-3 text-sm dark:text-gray-400">%</span>
          </div>
        </div>

        {/* Installment Interval */}
        <div>
          <label className="font-medium dark:text-gray-200">Installment Interval: *</label>
          <div className="relative">
            <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span className="absolute right-3 top-3 text-sm dark:text-gray-400">Days</span>
          </div>
        </div>

        {/* Total Installment */}
        <div>
          <label className="font-medium dark:text-gray-200">Total Installment: *</label>
          <div className="relative">
            <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span className="absolute right-3 top-3 text-sm dark:text-gray-400">Times</span>
          </div>
        </div>

        {/* Loan Processing Fee */}
        <div>
          <label className="font-medium dark:text-gray-200">Loan Processing Fee:</label>
          <div className="relative">
            <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span className="absolute right-3 top-3 text-sm dark:text-gray-400">%</span>
          </div>
        </div>

        {/* Add Field Option Button */}
        <div className="col-span-2">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
            Add Field Option
          </button>
        </div>
      </div>

      {/* Loan Instructions */}
      <div className="mt-6">
        <label className="font-medium dark:text-gray-200">Loan Instructions:</label>

        {/* Editor Toolbar */}
        <div className="border rounded-t-md p-2 flex items-center gap-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mt-1">
          <Bold size={18} className="dark:text-gray-200" />
          <Italic size={18} className="dark:text-gray-200" />
          <Underline size={18} className="dark:text-gray-200" />
          <span className="border-l h-5 dark:border-gray-500" />
          <LinkIcon size={18} className="dark:text-gray-200" />
          <Image size={18} className="dark:text-gray-200" />
        </div>

        {/* Editor Area */}
        <textarea
          className="w-full border rounded-b-md p-4 h-40 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Write..."
        />
      </div>

      {/* Delay Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="font-medium dark:text-gray-200">Charge will Apply if Delay: *</label>
          <div className="relative">
            <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span className="absolute right-3 top-3 text-sm dark:text-gray-400">Days</span>
          </div>
        </div>

        <div>
          <label className="font-medium dark:text-gray-200">Delay Charge: *</label>
          <div className="relative">
            <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span className="absolute right-3 top-3 text-sm dark:text-gray-400">%</span>
          </div>
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="mt-6">
        <label className="font-medium dark:text-gray-200">Featured</label>

        <div className="grid grid-cols-2">
          <button
            className={`px-6 py-3 rounded-l-lg ${
              featured ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setFeatured(true)}
          >
            Yes
          </button>

          <button
            className={`px-6 py-3 rounded-r-lg ${
              !featured ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setFeatured(false)}
          >
            No
          </button>
        </div>
      </div>

      {/* Badge */}
      <div className="mt-6">
        <label className="font-medium dark:text-gray-200">Badge:</label>
        <input className="w-full border rounded-md px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>

      {/* Status Toggle */}
      <div className="mt-6">
        <label className="font-medium dark:text-gray-200">Status:</label>

        <div className="grid grid-cols-2">
          <button
            className={`px-6 py-3 rounded-l-lg ${
              status ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setStatus(true)}
          >
            Active
          </button>

          <button
            className={`px-6 py-3 rounded-r-lg ${
              !status ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setStatus(false)}
          >
            Deactivate
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button className="w-full bg-purple-700 text-white text-center py-4 rounded-md mt-8 text-lg font-medium">
        Add New Plan
      </button>
    </div>
  );
}
