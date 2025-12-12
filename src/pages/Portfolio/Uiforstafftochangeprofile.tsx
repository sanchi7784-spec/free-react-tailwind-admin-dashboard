import React from 'react'

const Uiforstafftochangeprofile = () => {
 
  return (
   <div className="px-6 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold dark:text-white mb-2">
        Request Profile Changes
      </h1>
      <p className="text-red-600 font-medium mb-6">
        Only one change (Password, Email, or Phone No.) is allowed per month.
      </p>

      {/* Main Card */}
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition-all">

        {/* Title */}
        <h2 className="text-2xl font-semibold dark:text-white mb-6">
          Update Request Form
        </h2>

        {/* Dropdown Field */}
        <div className="mb-6">
          <label className="text-gray-600 dark:text-gray-300 font-medium mb-2 block">
            What would you like to change?
          </label>

          <div className="relative">
            <select
              className="w-full p-4 px-5 rounded-xl bg-gray-50 dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 text-gray-900 
              dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500 
              focus:border-purple-500 outline-none appearance-none"
            >
              <option value="">-- Select an option --</option>
              <option value="Password">Password</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone Number</option>
            </select>

            {/* Dropdown icon */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              ▼
            </span>
          </div>
        </div>

        {/* Floating Label Textarea */}
        <div className="relative mb-8">
          <textarea
            rows={4}
            placeholder=" "
            className="peer w-full p-4 pt-6 rounded-xl bg-gray-50 dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 
            shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
          ></textarea>

          <label className="absolute left-4 top-3 text-gray-500 dark:text-gray-300 
            transition-all duration-300 peer-placeholder-shown:top-5 
            peer-placeholder-shown:text-base peer-focus:top-2 
            peer-focus:text-sm peer-focus:text-purple-500">
            Reason for requesting change
          </label>
        </div>

        {/* Info Note */}
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl text-sm mb-6 border border-yellow-300 dark:border-yellow-700">
          ⚠️ You can only request one profile change per month.
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 transition-all 
          text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl"
        >
          Send Request
        </button>
      </div>
    </div>
  )
}

export default Uiforstafftochangeprofile