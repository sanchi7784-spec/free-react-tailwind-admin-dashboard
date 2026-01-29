import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
interface KYCRecord {
  id: string;
  date: string;
  username: string;
  type: string;
  status: string;
  aadhaarNumber: string;
  aadhaarSubmissionDate: string;
  aadhaarFrontPage: string;
  aadhaarBackPage: string;
  panNumber: string;
  panSubmissionDate: string;
  panFrontPage: string;
  panBackPage: string;
  cancelledCheckSubmissionDate: string;
  cancelledCheck: string;
  approvalDate?: string;
  approvedBy?: string;
}
export default function ApprovedKYC() {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedKYC, setSelectedKYC] = useState<KYCRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const kycRecords: KYCRecord[] = [
    {
      id: "1",
      date: "June 16 2025 06:16",
      username: "sagorkhan8196",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Approved",
      aadhaarNumber: "1234-5678-9012",
      aadhaarSubmissionDate: "16 Jun 2025 06:00 AM",
      aadhaarFrontPage: "/images/user/user-01.png",
      aadhaarBackPage: "/images/user/user-01.png",
      panNumber: "ABCDE1234F",
      panSubmissionDate: "16 Jun 2025 06:05 AM",
      panFrontPage: "/images/user/user-01.png",
      panBackPage: "/images/user/user-01.png",
      cancelledCheckSubmissionDate: "16 Jun 2025 06:10 AM",
      cancelledCheck: "/images/user/user-01.png",
      approvalDate: "16 Jun 2025 02:30 PM",
      approvedBy: "Admin User",
    },
    {
      id: "2",
      date: "June 17 2024 11:34",
      username: "admin",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Approved",
      aadhaarNumber: "2345-6789-0123",
      aadhaarSubmissionDate: "17 Jun 2024 11:00 AM",
      aadhaarFrontPage: "/images/user/user-02.png",
      aadhaarBackPage: "/images/user/user-02.png",
      panNumber: "BCDEF2345G",
      panSubmissionDate: "17 Jun 2024 11:15 AM",
      panFrontPage: "/images/user/user-02.png",
      panBackPage: "/images/user/user-02.png",
      cancelledCheckSubmissionDate: "17 Jun 2024 11:25 AM",
      cancelledCheck: "/images/user/user-02.png",
      approvalDate: "17 Jun 2024 05:20 PM",
      approvedBy: "Admin User",
    },
    {
      id: "3",
      date: "June 24 2024 01:45",
      username: "Bhubai",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Approved",
      aadhaarNumber: "3456-7890-1234",
      aadhaarSubmissionDate: "24 Jun 2024 01:20 AM",
      aadhaarFrontPage: "/images/user/user-03.png",
      aadhaarBackPage: "/images/user/user-03.png",
      panNumber: "CDEFG3456H",
      panSubmissionDate: "24 Jun 2024 01:30 AM",
      panFrontPage: "/images/user/user-03.png",
      panBackPage: "/images/user/user-03.png",
      cancelledCheckSubmissionDate: "24 Jun 2024 01:40 AM",
      cancelledCheck: "/images/user/user-03.png",
      approvalDate: "24 Jun 2024 10:15 AM",
      approvedBy: "Admin User",
    },
    {
      id: "4",
      date: "June 20 2024 08:54",
      username: "barbellajo",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Approved",
      aadhaarNumber: "4567-8901-2345",
      aadhaarSubmissionDate: "20 Jun 2024 08:30 AM",
      aadhaarFrontPage: "/images/user/user-04.png",
      aadhaarBackPage: "/images/user/user-04.png",
      panNumber: "DEFGH4567I",
      panSubmissionDate: "20 Jun 2024 08:40 AM",
      panFrontPage: "/images/user/user-04.png",
      panBackPage: "/images/user/user-04.png",
      cancelledCheckSubmissionDate: "20 Jun 2024 08:50 AM",
      cancelledCheck: "/images/user/user-04.png",
      approvalDate: "20 Jun 2024 03:45 PM",
      approvedBy: "Admin User",
    },
    {
      id: "5",
      date: "June 18 2024 03:22",
      username: "johndoe",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Approved",
      aadhaarNumber: "5678-9012-3456",
      aadhaarSubmissionDate: "18 Jun 2024 03:00 AM",
      aadhaarFrontPage: "/images/user/user-05.png",
      aadhaarBackPage: "/images/user/user-05.png",
      panNumber: "EFGHI5678J",
      panSubmissionDate: "18 Jun 2024 03:10 AM",
      panFrontPage: "/images/user/user-05.png",
      panBackPage: "/images/user/user-05.png",
      cancelledCheckSubmissionDate: "18 Jun 2024 03:20 AM",
      cancelledCheck: "/images/user/user-05.png",
      approvalDate: "18 Jun 2024 11:30 AM",
      approvedBy: "Admin User",
    },
    {
      id: "6",
      date: "June 19 2024 09:15",
      username: "maryjane",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Approved",
      aadhaarNumber: "6789-0123-4567",
      aadhaarSubmissionDate: "19 Jun 2024 09:00 AM",
      aadhaarFrontPage: "/images/user/user-06.png",
      aadhaarBackPage: "/images/user/user-06.png",
      panNumber: "FGHIJ6789K",
      panSubmissionDate: "19 Jun 2024 09:05 AM",
      panFrontPage: "/images/user/user-06.png",
      panBackPage: "/images/user/user-06.png",
      cancelledCheckSubmissionDate: "19 Jun 2024 09:10 AM",
      cancelledCheck: "/images/user/user-06.png",
      approvalDate: "19 Jun 2024 04:20 PM",
      approvedBy: "Admin User",
    },
  ];
  const handleViewDetails = (kyc: KYCRecord) => {
    setSelectedKYC(kyc);
    setIsModalOpen(true);
  };
  const filteredRecords = kycRecords.filter(
    (record) =>
      record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <PageMeta title="Approved KYC - Admin" description="View all approved KYC submissions" />
      <div>
        <PageBreadcrumb pageTitle="Approved KYC" />
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Approved KYC Submissions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View all approved KYC documents
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by username or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Approved Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {record.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {record.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {record.approvalDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No approved KYC found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
          {/* Pagination Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">entries</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing 1 to {Math.min(itemsPerPage, filteredRecords.length)} of{" "}
                {filteredRecords.length} entries
              </div>
            </div>
          </div>
        </div>
        {/* Beautiful Modal */}
        {isModalOpen && selectedKYC && (
          <div 
            className="fixed inset-0 bg-blue/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Gradient */}
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 flex items-center justify-between z-10 shadow-lg">
                <div>
                  <h2 className="text-2xl font-bold text-white">KYC Document Review</h2>
                  <p className="text-green-100 text-sm mt-1">Approved submission details</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:bg-white/20 transition-all p-2.5 rounded-full duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              {/* Modal Body */}
              <div className="p-8 overflow-y-auto max-h-[calc(95vh-80px)]">
                {/* Status Banner with Icon */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 mb-8 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">Application Approved</h3>
                      <p className="text-green-100 text-sm">KYC submission for {selectedKYC.username}</p>
                    </div>
                  </div>
                </div>
                {/* Approval Info */}
                {selectedKYC.approvalDate && (
                  <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-600 dark:text-green-400"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-bold text-green-900 dark:text-green-200 mb-2">
                          Approval Information
                        </h5>
                        <div className="space-y-2">
                          <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="font-medium">Approved on:</span> {selectedKYC.approvalDate}
                          </p>
                          {selectedKYC.approvedBy && (
                            <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              <span className="font-medium">Approved by:</span> {selectedKYC.approvedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Aadhaar Card Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="0" y="4" width="24" height="16" rx="2" />
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <path d="M3 10h18" />
                        </svg>
                        <h3 className="text-xl font-bold text-white">
                          Aadhaar Card
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      {/* Document Information Cards */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.aadhaarSubmissionDate}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Aadhaar Number
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.aadhaarNumber}
                          </p>
                        </div>
                      </div>
                      {/* Front Page with Hover Effect */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Front Page
                        </p>
                        <a 
                          href={selectedKYC.aadhaarFrontPage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block relative group rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.aadhaarFrontPage}
                            alt="Aadhaar Front"
                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        </a>
                      </div>
                      {/* Back Page with Hover Effect */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Back Page
                        </p>
                        <a 
                          href={selectedKYC.aadhaarBackPage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block relative group rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.aadhaarBackPage}
                            alt="Aadhaar Back"
                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* PAN Card Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <h3 className="text-xl font-bold text-white">
                          PAN Card
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      {/* Document Information Cards */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.panSubmissionDate}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            PAN Number
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.panNumber}
                          </p>
                        </div>
                      </div>
                      {/* Front Page with Hover Effect */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Front Page
                        </p>
                        <a 
                          href={selectedKYC.panFrontPage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block relative group rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.panFrontPage}
                            alt="PAN Front"
                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        </a>
                      </div>
                      {/* Back Page with Hover Effect */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Back Page
                        </p>
                        <a 
                          href={selectedKYC.panBackPage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block relative group rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.panBackPage}
                            alt="PAN Back"
                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Cancelled Cheque Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        <h3 className="text-xl font-bold text-white">
                          Cancelled Cheque
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      {/* Document Information Cards */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.cancelledCheckSubmissionDate}
                          </p>
                        </div>
                      </div>
                      {/* Cheque Image with Hover Effect */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Cheque Image
                        </p>
                        <a 
                          href={selectedKYC.cancelledCheck} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block relative group rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.cancelledCheck}
                            alt="Cancelled Cheque"
                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}