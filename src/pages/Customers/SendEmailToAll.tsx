import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function SendEmailToAll() {
  const [formData, setFormData] = useState({
    subject: "",
    emailDetails: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending email to all customers:", formData);
    // TODO:
  };

  return (
    <>
      <PageMeta
        title="Send Email to All - Admin"
        description="Send bulk email to all customers"
      />
      <PageBreadcrumb pageTitle="Send Email to All" />

      <div className="w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Send Email to All
          </h1>
        </div>

        {/* Email Form */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Subject Field */}
            <div className="mb-6">
              <label
                htmlFor="subject"
                className="block text-sm text-gray-600 dark:text-gray-300 mb-2"
              >
                Subject:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 transition-colors"
                placeholder="Enter email subject"
              />
            </div>

            {/* Email Details Field */}
            <div className="mb-6">
              <label
                htmlFor="emailDetails"
                className="block text-sm text-gray-600 dark:text-gray-300 mb-2"
              >
                Email Details
              </label>
              <textarea
                id="emailDetails"
                name="emailDetails"
                value={formData.emailDetails}
                onChange={handleInputChange}
                rows={8}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 transition-colors resize-y"
                placeholder="Enter your email message here..."
              />
            </div>

            {/* Send Email Button */}
            <div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded inline-flex items-center gap-2 font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
