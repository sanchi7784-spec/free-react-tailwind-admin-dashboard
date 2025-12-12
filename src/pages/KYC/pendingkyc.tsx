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
}
export default function PendingKYC() {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedKYC, setSelectedKYC] = useState<KYCRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const kycRecords: KYCRecord[] = [
    {
      id: "1",
      date: "October 28 2025 09:41",
      username: "testuser6966",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "1234-5678-9012",
      aadhaarSubmissionDate: "28 Oct 2025 09:30 AM",
      aadhaarFrontPage: "/images/user/user-01.png",
      aadhaarBackPage: "/images/user/user-01.png",
      panNumber: "ABCDE1234F",
      panSubmissionDate: "28 Oct 2025 09:35 AM",
      panFrontPage: "/images/user/user-01.png",
      panBackPage: "/images/user/user-01.png",
      cancelledCheckSubmissionDate: "28 Oct 2025 09:40 AM",
      cancelledCheck: "/images/user/user-01.png",
    },
    {
      id: "2",
      date: "October 24 2025 10:56",
      username: "AdarshSharma645...",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "2345-6789-0123",
      aadhaarSubmissionDate: "24 Oct 2025 10:30 AM",
      aadhaarFrontPage: "/images/user/user-02.png",
      aadhaarBackPage: "/images/user/user-02.png",
      panNumber: "BCDEF2345G",
      panSubmissionDate: "24 Oct 2025 10:40 AM",
      panFrontPage: "/images/user/user-02.png",
      panBackPage: "/images/user/user-02.png",
      cancelledCheckSubmissionDate: "24 Oct 2025 10:50 AM",
      cancelledCheck: "/images/user/user-02.png",
    },
    {
      id: "3",
      date: "October 01 2025 11:10",
      username: "SaimirBaileshi3...",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "3456-7890-1234",
      aadhaarSubmissionDate: "01 Oct 2025 10:45 AM",
      aadhaarFrontPage: "/images/user/user-03.png",
      aadhaarBackPage: "/images/user/user-03.png",
      panNumber: "CDEFG3456H",
      panSubmissionDate: "01 Oct 2025 10:55 AM",
      panFrontPage: "/images/user/user-03.png",
      panBackPage: "/images/user/user-03.png",
      cancelledCheckSubmissionDate: "01 Oct 2025 11:05 AM",
      cancelledCheck: "/images/user/user-03.png",
    },
    {
      id: "4",
      date: "September 29 2025 07:03",
      username: "ChrisBrandon804...",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "4567-8901-2345",
      aadhaarSubmissionDate: "29 Sep 2025 06:30 AM",
      aadhaarFrontPage: "/images/user/user-04.png",
      aadhaarBackPage: "/images/user/user-04.png",
      panNumber: "DEFGH4567I",
      panSubmissionDate: "29 Sep 2025 06:45 AM",
      panFrontPage: "/images/user/user-04.png",
      panBackPage: "/images/user/user-04.png",
      cancelledCheckSubmissionDate: "29 Sep 2025 07:00 AM",
      cancelledCheck: "/images/user/user-04.png",
    },
    {
      id: "5",
      date: "September 22 2025 08:41",
      username: "testtest1235",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "5678-9012-3456",
      aadhaarSubmissionDate: "22 Sep 2025 08:15 AM",
      aadhaarFrontPage: "/images/user/user-05.png",
      aadhaarBackPage: "/images/user/user-05.png",
      panNumber: "EFGHI5678J",
      panSubmissionDate: "22 Sep 2025 08:25 AM",
      panFrontPage: "/images/user/user-05.png",
      panBackPage: "/images/user/user-05.png",
      cancelledCheckSubmissionDate: "22 Sep 2025 08:35 AM",
      cancelledCheck: "/images/user/user-05.png",
    },
    {
      id: "6",
      date: "August 15 2025 08:59",
      username: "HsjsjsjBsbsbs48...",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "6789-0123-4567",
      aadhaarSubmissionDate: "15 Aug 2025 08:30 AM",
      aadhaarFrontPage: "/images/user/user-06.png",
      aadhaarBackPage: "/images/user/user-06.png",
      panNumber: "FGHIJ6789K",
      panSubmissionDate: "15 Aug 2025 08:40 AM",
      panFrontPage: "/images/user/user-06.png",
      panBackPage: "/images/user/user-06.png",
      cancelledCheckSubmissionDate: "15 Aug 2025 08:50 AM",
      cancelledCheck: "/images/user/user-06.png",
    },
    {
      id: "7",
      date: "March 22 2025 05:27",
      username: "istiakahmed180",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "7890-1234-5678",
      aadhaarSubmissionDate: "22 Mar 2025 05:00 AM",
      aadhaarFrontPage: "/images/user/user-07.png",
      aadhaarBackPage: "/images/user/user-07.png",
      panNumber: "GHIJK7890L",
      panSubmissionDate: "22 Mar 2025 05:10 AM",
      panFrontPage: "/images/user/user-07.png",
      panBackPage: "/images/user/user-07.png",
      cancelledCheckSubmissionDate: "22 Mar 2025 05:20 AM",
      cancelledCheck: "/images/user/user-07.png",
    },
    {
      id: "8",
      date: "August 25 2025 04:57",
      username: "AMIR SAEIDMARAS...",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "8901-2345-6789",
      aadhaarSubmissionDate: "25 Aug 2025 04:30 AM",
      aadhaarFrontPage: "/images/user/user-08.png",
      aadhaarBackPage: "/images/user/user-08.png",
      panNumber: "HIJKL8901M",
      panSubmissionDate: "25 Aug 2025 04:40 AM",
      panFrontPage: "/images/user/user-08.png",
      panBackPage: "/images/user/user-08.png",
      cancelledCheckSubmissionDate: "25 Aug 2025 04:50 AM",
      cancelledCheck: "/images/user/user-08.png",
    },
    {
      id: "9",
      date: "August 25 2025 07:37",
      username: "lucion6477",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "9012-3456-7890",
      aadhaarSubmissionDate: "25 Aug 2025 07:15 AM",
      aadhaarFrontPage: "/images/user/user-09.png",
      aadhaarBackPage: "/images/user/user-09.png",
      panNumber: "IJKLM9012N",
      panSubmissionDate: "25 Aug 2025 07:25 AM",
      panFrontPage: "/images/user/user-09.png",
      panBackPage: "/images/user/user-09.png",
      cancelledCheckSubmissionDate: "25 Aug 2025 07:35 AM",
      cancelledCheck: "/images/user/user-09.png",
    },
  ];
  const handleViewDetails = (kyc: KYCRecord) => {
    setSelectedKYC(kyc);
    setIsModalOpen(true);
  };
  const filteredRecords = kycRecords.filter(
    (record) =>
      record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.aadhaarNumber.includes(searchTerm) ||
      record.panNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <PageMeta title="Pending KYC - Admin" description="View and manage pending KYC submissions" />
      <PageBreadcrumb pageTitle="Pending KYC" />
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Pending KYC
          </h1>
        </div>
        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 w-full sm:w-64"
              />
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded inline-flex items-center justify-center gap-2 font-medium transition-colors w-full sm:w-auto">
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
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                SEARCH
              </button>
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 w-full sm:w-auto"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-violet-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    DATE ⇅
                  </th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    USER ⇅
                  </th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    TYPE
                  </th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    STATUS ⇅
                  </th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.slice(0, itemsPerPage).map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {record.date}
                    </td>
                    <td className="px-4 py-4 text-sm text-violet-600 dark:text-violet-400 font-medium">
                      {record.username}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 uppercase">
                      {record.type}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
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
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredRecords.slice(0, itemsPerPage).map((record) => (
            <div
              key={record.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{record.date}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">User</span>
                  <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">
                    {record.username}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Type</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 uppercase">{record.type}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                      {record.status}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleViewDetails(record)}
                    className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white px-4 py-2 rounded inline-flex items-center justify-center gap-2 transition-colors"
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
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* KYC Details Modal */}
        {isModalOpen && selectedKYC && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-700 dark:to-purple-700 p-6 flex items-center justify-between z-10 rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">KYC Document Review</h2>
                  <p className="text-violet-100 text-sm">Verify and approve customer documents</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:bg-white/20 transition-colors p-2.5 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 rounded-lg p-5 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                        Waiting For Approval
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Review all documents before taking action
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Aadhaar Card Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M7 15h0M2 9.5h20" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Aadhaar Card
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.aadhaarSubmissionDate}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Aadhaar Number
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {selectedKYC.aadhaarNumber}
                          </p>
                        </div>                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Front Page
                            </p>
                            <a 
                              href={selectedKYC.aadhaarFrontPage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block group"
                              title="Click here to view document"
                            >
                              <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors">
                                <img
                                  src={selectedKYC.aadhaarFrontPage}
                                  alt="Aadhaar Front"
                                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          </div>                          
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Back Page
                            </p>
                            <a 
                              href={selectedKYC.aadhaarBackPage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block group"
                              title="Click here to view document"
                            >
                              <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors">
                                <img
                                  src={selectedKYC.aadhaarBackPage}
                                  alt="Aadhaar Back"
                                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Review Message (Optional)
                        </label>
                        <textarea
                          rows={3}
                          className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 resize-none transition-colors"
                          placeholder="Enter optional message for the customer..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            console.log("Approving Aadhaar Card for:", selectedKYC?.id);
                            // TODO: Implement approve functionality
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            console.log("Rejecting Aadhaar Card for:", selectedKYC?.id);
                            // TODO: Implement reject functionality
                          }}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
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
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* PAN Card Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          PAN Card
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.panSubmissionDate}
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            PAN Number
                          </p>
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {selectedKYC.panNumber}
                          </p>
                        </div>                       
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Front Page
                            </p>
                            <a 
                              href={selectedKYC.panFrontPage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block group"
                              title="Click here to view document"
                            >
                              <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-purple-500 dark:group-hover:border-purple-400 transition-colors">
                                <img
                                  src={selectedKYC.panFrontPage}
                                  alt="PAN Front"
                                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          </div>                         
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Back Page
                            </p>
                            <a 
                              href={selectedKYC.panBackPage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block group"
                              title="Click here to view document"
                            >
                              <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-purple-500 dark:group-hover:border-purple-400 transition-colors">
                                <img
                                  src={selectedKYC.panBackPage}
                                  alt="PAN Back"
                                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Review Message (Optional)
                        </label>
                        <textarea
                          rows={3}
                          className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 resize-none transition-colors"
                          placeholder="Enter optional message for the customer..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            console.log("Approving PAN Card for:", selectedKYC?.id);
                            // TODO: Implement approve functionality
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            console.log("Rejecting PAN Card for:", selectedKYC?.id);
                            // TODO: Implement reject functionality
                          }}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
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
                          Reject
                        </button>
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
                      <div className="mb-6">
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
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
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
                      {/* Details/Rejection Reason */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Details Message (Reason for rejection)
                        </label>
                        <textarea
                          rows={3}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 resize-none transition-all"
                          placeholder="Enter optional message..."
                        />
                      </div>
                      {/* Action Buttons with Gradient */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            console.log("Approving Cancelled Cheque for:", selectedKYC?.id);
                            // TODO: Implement approve functionality
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            console.log("Rejecting Cancelled Cheque for:", selectedKYC?.id);
                            // TODO: Implement reject functionality
                          }}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-5 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
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
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div> {/* End grid */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}