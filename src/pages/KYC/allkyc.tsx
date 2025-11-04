import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface KYCRecord {
  id: string;
  date: string;
  username: string;
  type: string;
  status: "Pending" | "Approved" | "Rejected";
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
  rejectionReason?: string;
  rejectionDate?: string;
}

export default function AllKYCLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedKYC, setSelectedKYC] = useState<KYCRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const kycRecords: KYCRecord[] = [
    // Pending Records
    {
      id: "1",
      date: "June 16 2025 06:16",
      username: "sagorkhan8196",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
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
    },
    {
      id: "2",
      date: "June 17 2024 11:34",
      username: "admin",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
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
    },
    // Approved Records
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
    // Rejected Records
    {
      id: "5",
      date: "June 18 2024 03:22",
      username: "johndoe",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Rejected",
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
      rejectionReason: "Document clarity issue",
      rejectionDate: "18 Jun 2024 11:30 AM",
    },
    {
      id: "6",
      date: "June 19 2024 09:15",
      username: "maryjane",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Rejected",
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
      rejectionReason: "Information mismatch",
      rejectionDate: "19 Jun 2024 04:20 PM",
    },
    {
      id: "7",
      date: "June 15 2024 02:30",
      username: "robertsmith",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "7890-1234-5678",
      aadhaarSubmissionDate: "15 Jun 2024 02:00 AM",
      aadhaarFrontPage: "/images/user/user-01.png",
      aadhaarBackPage: "/images/user/user-01.png",
      panNumber: "GHIJK7890L",
      panSubmissionDate: "15 Jun 2024 02:15 AM",
      panFrontPage: "/images/user/user-01.png",
      panBackPage: "/images/user/user-01.png",
      cancelledCheckSubmissionDate: "15 Jun 2024 02:25 AM",
      cancelledCheck: "/images/user/user-01.png",
    },
    {
      id: "8",
      date: "June 22 2024 07:45",
      username: "emilyjones",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Approved",
      aadhaarNumber: "8901-2345-6789",
      aadhaarSubmissionDate: "22 Jun 2024 07:30 AM",
      aadhaarFrontPage: "/images/user/user-02.png",
      aadhaarBackPage: "/images/user/user-02.png",
      panNumber: "HIJKL8901M",
      panSubmissionDate: "22 Jun 2024 07:35 AM",
      panFrontPage: "/images/user/user-02.png",
      panBackPage: "/images/user/user-02.png",
      cancelledCheckSubmissionDate: "22 Jun 2024 07:40 AM",
      cancelledCheck: "/images/user/user-02.png",
      approvalDate: "22 Jun 2024 02:15 PM",
      approvedBy: "Admin User",
    },
    {
      id: "9",
      date: "June 21 2024 05:20",
      username: "davidwilson",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Rejected",
      aadhaarNumber: "9012-3456-7890",
      aadhaarSubmissionDate: "21 Jun 2024 05:00 AM",
      aadhaarFrontPage: "/images/user/user-03.png",
      aadhaarBackPage: "/images/user/user-03.png",
      panNumber: "IJKLM9012N",
      panSubmissionDate: "21 Jun 2024 05:10 AM",
      panFrontPage: "/images/user/user-03.png",
      panBackPage: "/images/user/user-03.png",
      cancelledCheckSubmissionDate: "21 Jun 2024 05:15 AM",
      cancelledCheck: "/images/user/user-03.png",
      rejectionReason: "Expired document",
      rejectionDate: "21 Jun 2024 01:30 PM",
    },
    {
      id: "10",
      date: "June 23 2024 10:25",
      username: "sarahparker",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "0123-4567-8901",
      aadhaarSubmissionDate: "23 Jun 2024 10:00 AM",
      aadhaarFrontPage: "/images/user/user-04.png",
      aadhaarBackPage: "/images/user/user-04.png",
      panNumber: "JKLMN0123O",
      panSubmissionDate: "23 Jun 2024 10:10 AM",
      panFrontPage: "/images/user/user-04.png",
      panBackPage: "/images/user/user-04.png",
      cancelledCheckSubmissionDate: "23 Jun 2024 10:20 AM",
      cancelledCheck: "/images/user/user-04.png",
    },
    {
      id: "11",
      date: "June 25 2024 03:15",
      username: "michaelbrown",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Rejected",
      aadhaarNumber: "1234-5678-9013",
      aadhaarSubmissionDate: "25 Jun 2024 03:00 AM",
      aadhaarFrontPage: "/images/user/user-05.png",
      aadhaarBackPage: "/images/user/user-05.png",
      panNumber: "KLMNO1234P",
      panSubmissionDate: "25 Jun 2024 03:05 AM",
      panFrontPage: "/images/user/user-05.png",
      panBackPage: "/images/user/user-05.png",
      cancelledCheckSubmissionDate: "25 Jun 2024 03:10 AM",
      cancelledCheck: "/images/user/user-05.png",
      rejectionReason: "Incomplete documentation - Cancelled cheque is not clearly visible",
      rejectionDate: "25 Jun 2024 11:45 AM",
    },
    {
      id: "12",
      date: "June 26 2024 08:40",
      username: "lisaanderson",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "2345-6789-0124",
      aadhaarSubmissionDate: "26 Jun 2024 08:20 AM",
      aadhaarFrontPage: "/images/user/user-06.png",
      aadhaarBackPage: "/images/user/user-06.png",
      panNumber: "LMNOP2345Q",
      panSubmissionDate: "26 Jun 2024 08:30 AM",
      panFrontPage: "/images/user/user-06.png",
      panBackPage: "/images/user/user-06.png",
      cancelledCheckSubmissionDate: "26 Jun 2024 08:35 AM",
      cancelledCheck: "/images/user/user-06.png",
    },
    {
      id: "13",
      date: "June 27 2024 01:50",
      username: "jamesmartin",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Rejected",
      aadhaarNumber: "3456-7890-1235",
      aadhaarSubmissionDate: "27 Jun 2024 01:30 AM",
      aadhaarFrontPage: "/images/user/user-01.png",
      aadhaarBackPage: "/images/user/user-01.png",
      panNumber: "MNOPQ3456R",
      panSubmissionDate: "27 Jun 2024 01:40 AM",
      panFrontPage: "/images/user/user-01.png",
      panBackPage: "/images/user/user-01.png",
      cancelledCheckSubmissionDate: "27 Jun 2024 01:45 AM",
      cancelledCheck: "/images/user/user-01.png",
      rejectionReason: "PAN Card name does not match with Aadhaar Card",
      rejectionDate: "27 Jun 2024 09:20 AM",
    },
    {
      id: "14",
      date: "June 28 2024 06:30",
      username: "jennifertaylor",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "4567-8901-2346",
      aadhaarSubmissionDate: "28 Jun 2024 06:10 AM",
      aadhaarFrontPage: "/images/user/user-02.png",
      aadhaarBackPage: "/images/user/user-02.png",
      panNumber: "NOPQR4567S",
      panSubmissionDate: "28 Jun 2024 06:20 AM",
      panFrontPage: "/images/user/user-02.png",
      panBackPage: "/images/user/user-02.png",
      cancelledCheckSubmissionDate: "28 Jun 2024 06:25 AM",
      cancelledCheck: "/images/user/user-02.png",
    },
    {
      id: "15",
      date: "June 29 2024 04:45",
      username: "danielthomas",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Rejected",
      aadhaarNumber: "5678-9012-3457",
      aadhaarSubmissionDate: "29 Jun 2024 04:20 AM",
      aadhaarFrontPage: "/images/user/user-03.png",
      aadhaarBackPage: "/images/user/user-03.png",
      panNumber: "OPQRS5678T",
      panSubmissionDate: "29 Jun 2024 04:30 AM",
      panFrontPage: "/images/user/user-03.png",
      panBackPage: "/images/user/user-03.png",
      cancelledCheckSubmissionDate: "29 Jun 2024 04:40 AM",
      cancelledCheck: "/images/user/user-03.png",
      rejectionReason: "Poor image quality - Unable to read document details",
      rejectionDate: "29 Jun 2024 02:10 PM",
    },
    {
      id: "16",
      date: "June 30 2024 09:55",
      username: "patriciamoore",
      type: "AADHAAR CARD, PAN CARD, CANCELLED CHEQUE",
      status: "Pending",
      aadhaarNumber: "6789-0123-4568",
      aadhaarSubmissionDate: "30 Jun 2024 09:30 AM",
      aadhaarFrontPage: "/images/user/user-04.png",
      aadhaarBackPage: "/images/user/user-04.png",
      panNumber: "PQRST6789U",
      panSubmissionDate: "30 Jun 2024 09:40 AM",
      panFrontPage: "/images/user/user-04.png",
      panBackPage: "/images/user/user-04.png",
      cancelledCheckSubmissionDate: "30 Jun 2024 09:50 AM",
      cancelledCheck: "/images/user/user-04.png",
    },
  ];

  const handleViewDetails = (kyc: KYCRecord) => {
    setSelectedKYC(kyc);
    setIsModalOpen(true);
  };

  const filteredRecords = kycRecords.filter((record) => {
    const matchesSearch =
      record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {status}
          </span>
        );
      case "Approved":
        return (
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
            {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusHeaderGradient = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gradient-to-r from-violet-600 to-purple-600";
      case "Approved":
        return "bg-gradient-to-r from-green-600 to-emerald-600";
      case "Rejected":
        return "bg-gradient-to-r from-red-600 to-rose-600";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700";
    }
  };

  const getStatusBannerGradient = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gradient-to-r from-amber-600 to-amber-500";
      case "Approved":
        return "bg-gradient-to-r from-green-600 to-emerald-600";
      case "Rejected":
        return "bg-gradient-to-r from-red-600 to-rose-600";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700";
    }
  };

  const statusCounts = {
    All: kycRecords.length,
    Pending: kycRecords.filter((r) => r.status === "Pending").length,
    Approved: kycRecords.filter((r) => r.status === "Approved").length,
    Rejected: kycRecords.filter((r) => r.status === "Rejected").length,
  };

  return (
    <>
      <PageMeta title="All KYC Logs - Admin" description="View and manage all KYC submissions" />
      <div>
        <PageBreadcrumb pageTitle="All KYC Logs" />

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  All KYC Submissions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Complete log of all KYC documents
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
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

            {/* Status Filter Tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(["All", "Pending", "Approved", "Rejected"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? status === "Pending"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/50"
                        : status === "Approved"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-2 ring-green-500/50"
                        : status === "Rejected"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 ring-2 ring-red-500/50"
                        : "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 ring-2 ring-violet-500/50"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {status} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/30">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.date}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {record.username}
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {record.type}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                          record.status === "Pending"
                            ? "bg-violet-600 hover:bg-violet-700"
                            : record.status === "Approved"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
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
                        <span className="hidden sm:inline">View</span>
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
                  No KYC records found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter.
                </p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
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

        {/* Responsive Beautiful Modal */}
        {isModalOpen && selectedKYC && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Gradient */}
              <div
                className={`sticky top-0 ${getStatusHeaderGradient(
                  selectedKYC.status
                )} px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-10 shadow-lg`}
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                    KYC Document Review
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 mt-1">
                    {selectedKYC.status === "Pending"
                      ? "Pending review"
                      : selectedKYC.status === "Approved"
                      ? "Approved submission"
                      : "Rejected submission"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="ml-4 text-white hover:bg-white/20 transition-all p-2 sm:p-2.5 rounded-full duration-200 flex-shrink-0"
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
                    className="sm:w-6 sm:h-6"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-80px)]">
                {/* Status Banner with Icon */}
                <div
                  className={`${getStatusBannerGradient(
                    selectedKYC.status
                  )} text-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center">
                      {selectedKYC.status === "Pending" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      ) : selectedKYC.status === "Approved" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1">
                        {selectedKYC.status === "Pending"
                          ? "Waiting For Approval"
                          : selectedKYC.status === "Approved"
                          ? "Application Approved"
                          : "Application Rejected"}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 truncate">
                        KYC submission for {selectedKYC.username}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Approval/Rejection Info */}
                {selectedKYC.status === "Approved" && selectedKYC.approvalDate && (
                  <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg sm:rounded-xl shadow-md">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
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
                          className="text-green-600 dark:text-green-400 sm:w-6 sm:h-6"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm sm:text-base font-bold text-green-900 dark:text-green-200 mb-2">
                          Approval Information
                        </h5>
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="flex-shrink-0"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="font-medium">Approved on:</span>{" "}
                            <span className="truncate">{selectedKYC.approvalDate}</span>
                          </p>
                          {selectedKYC.approvedBy && (
                            <p className="text-xs sm:text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="flex-shrink-0"
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

                {selectedKYC.status === "Rejected" && selectedKYC.rejectionReason && (
                  <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl shadow-md">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
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
                          className="text-red-600 dark:text-red-400 sm:w-6 sm:h-6"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm sm:text-base font-bold text-red-900 dark:text-red-200 mb-2">
                          Rejection Reason
                        </h5>
                        <p className="text-xs sm:text-base text-red-800 dark:text-red-300 mb-3">
                          {selectedKYC.rejectionReason}
                        </p>
                        {selectedKYC.rejectionDate && (
                          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="flex-shrink-0"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Rejected on: {selectedKYC.rejectionDate}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Sections - Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {/* Aadhaar Card Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7 flex-shrink-0"
                        >
                          <rect x="0" y="4" width="24" height="16" rx="2" />
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <path d="M3 10h18" />
                        </svg>
                        <h3 className="text-base sm:text-xl font-bold text-white">Aadhaar Card</h3>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      {/* Document Information Cards */}
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
                            {selectedKYC.aadhaarSubmissionDate}
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Aadhaar Number
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.aadhaarNumber}
                          </p>
                        </div>
                      </div>

                      {/* Front Page with Hover Effect */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Front Page
                        </p>
                        <a
                          href={selectedKYC.aadhaarFrontPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative group rounded-lg sm:rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.aadhaarFrontPage}
                            alt="Aadhaar Front"
                            className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:w-12 sm:h-12"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        </a>
                      </div>

                      {/* Back Page with Hover Effect */}
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Back Page
                        </p>
                        <a
                          href={selectedKYC.aadhaarBackPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative group rounded-lg sm:rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.aadhaarBackPage}
                            alt="Aadhaar Back"
                            className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:w-12 sm:h-12"
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
                  <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7 flex-shrink-0"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <h3 className="text-base sm:text-xl font-bold text-white">PAN Card</h3>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      {/* Document Information Cards */}
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
                            {selectedKYC.panSubmissionDate}
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            PAN Number
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.panNumber}
                          </p>
                        </div>
                      </div>

                      {/* Front Page with Hover Effect */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Front Page
                        </p>
                        <a
                          href={selectedKYC.panFrontPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative group rounded-lg sm:rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.panFrontPage}
                            alt="PAN Front"
                            className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:w-12 sm:h-12"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        </a>
                      </div>

                      {/* Back Page with Hover Effect */}
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Back Page
                        </p>
                        <a
                          href={selectedKYC.panBackPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative group rounded-lg sm:rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.panBackPage}
                            alt="PAN Back"
                            className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:w-12 sm:h-12"
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
                  <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7 flex-shrink-0"
                        >
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        <h3 className="text-base sm:text-xl font-bold text-white">
                          Cancelled Cheque
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      {/* Document Information Cards */}
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
                            {selectedKYC.cancelledCheckSubmissionDate}
                          </p>
                        </div>
                      </div>

                      {/* Cheque Image with Hover Effect */}
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Cheque Image
                        </p>
                        <a
                          href={selectedKYC.cancelledCheck}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative group rounded-lg sm:rounded-xl overflow-hidden"
                        >
                          <img
                            src={selectedKYC.cancelledCheck}
                            alt="Cancelled Cheque"
                            className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:w-12 sm:h-12"
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
