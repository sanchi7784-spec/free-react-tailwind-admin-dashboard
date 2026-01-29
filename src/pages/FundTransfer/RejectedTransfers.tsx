import React, { useState } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

// Sample rejected transfer data
const rejectedTransfersData = [
  {
    id: 1486,
    date: '09 May 2025, 07:33 PM',
    transactionId: 'TRXMGVBMMQATY',
    sender: 'demouser',
    senderId: 1,
    amount: '+10 USD',
    transferType: 'Other bank transfer',
    status: 'Cancelled',
  },
  {
    id: 1485,
    date: '08 May 2025, 03:22 PM',
    transactionId: 'TRXABC123XYZ',
    sender: 'johnsmith',
    senderId: 234,
    amount: '+500 USD',
    transferType: 'Wire transfer',
    status: 'Cancelled',
  },
  {
    id: 1484,
    date: '07 May 2025, 11:15 AM',
    transactionId: 'TRXDEF456GHI',
    sender: 'maryjane',
    senderId: 567,
    amount: '+250 USD',
    transferType: 'Own bank transfer',
    status: 'Cancelled',
  },
];

const RejectedTransfers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState('15');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const handleViewDetails = (transfer: any) => {
    setSelectedTransfer(transfer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransfer(null);
  };

  return (
    <>
      <PageMeta
        title="Rejected Fund Transfer | Admin Dashboard"
        description="View and manage rejected fund transfers"
      />

      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rejected Fund Transfer</h1>
        </div>

        {/* Table Container */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Filter Section */}
          <form onSubmit={handleSearch} className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-auto"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                  Search
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-auto"
                >
                  <option value="" disabled>Type</option>
                  <option value="all">All</option>
                  <option value="wire_transfer">WireTransfer</option>
                  <option value="other_bank_transfer">OtherBankTransfer</option>
                  <option value="own_bank_transfer">OwnBankTransfer</option>
                </select>
              </div>
            </div>
          </form>

          {/* Table - Desktop View */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      Date
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      Transaction ID
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      Sender
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      Amount
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      Transfer Type
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      Status
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rejectedTransfersData.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {transfer.date}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {transfer.transactionId}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/user/${transfer.senderId}/edit`}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        {transfer.sender}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {transfer.amount}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {transfer.transferType}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {transfer.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleViewDetails(transfer)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white transition hover:bg-pink-600"
                        title="View Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700 lg:hidden">
            {rejectedTransfersData.map((transfer) => (
              <div key={transfer.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <div className="space-y-3">
                  {/* Date and Status */}
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {transfer.date}
                    </div>
                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      {transfer.status}
                    </span>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-500">Transaction ID</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                      {transfer.transactionId}
                    </div>
                  </div>

                  {/* Sender */}
                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-500">Sender</div>
                    <Link
                      to={`/user/${transfer.senderId}/edit`}
                      className="mt-1 text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      {transfer.sender}
                    </Link>
                  </div>

                  {/* Amount and Transfer Type */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-500">Amount</div>
                      <span className="mt-1 text-sm font-bold text-green-600 dark:text-green-400">
                        {transfer.amount}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-500">Transfer Type</div>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white">
                        {transfer.transferType}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleViewDetails(transfer)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white transition hover:bg-pink-600"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <nav className="flex flex-wrap items-center justify-center gap-1">
              <button
                disabled
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-400 dark:border-gray-600"
              >
                Prev
              </button>
              <button className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white">
                1
              </button>
              <button
                disabled
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-400 dark:border-gray-600"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-blue bg-opacity-50 p-4">
          <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transfer Details</h3>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Sender Information */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sender Information</h4>
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Username:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransfer.sender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Account Name:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Demo Account</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransfer.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transfer Type:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransfer.transferType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransfer.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">TRX No:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransfer.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {selectedTransfer.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receiver Information */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Receiver Information</h4>
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Account Name:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Receiver Name</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Account Number:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">123456789</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Bank Name:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Sample Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Reason:</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">Transfer Rejected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejection Details */}
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <h5 className="mb-2 font-semibold text-red-900 dark:text-red-300">Rejection Details</h5>
                <p className="text-sm text-red-800 dark:text-red-400">
                  This transfer was cancelled/rejected. No further action is required.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RejectedTransfers;