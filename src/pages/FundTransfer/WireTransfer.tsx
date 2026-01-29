import React, { useState } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { PlugInIcon } from '../../icons';

const wireTransfersData = [
  {
    id: 3060,
    date: '25 Oct 2025, 07:40 AM',
    transactionId: 'TRXGMJZDLXPNX',
    sender: 'demo1019945',
    senderId: 1351,
    accountName: 'Demo 101',
    amount: '+100 USD',
    charge: '+10',
    finalAmount: '110',
    sendAt: '25 Oct 2025, 07:40 AM',
    transferType: 'Wire transfer',
    status: 'Pending',
    receiver: {
      accountName: 'Jason chan',
      accountNumber: '104985759995',
      fullName: 'Jason chan',
      phone: '0194985566',
      swiftOrIban: 'hdjrjt',
    },
  },
  {
    id: 3021,
    date: '17 Oct 2025, 08:09 PM',
    transactionId: 'TRXXJVXCPNX24',
    sender: 'demouser',
    senderId: 1,
    accountName: 'Demo User',
    amount: '+200 USD',
    charge: '+5',
    finalAmount: '205',
    sendAt: '17 Oct 2025, 08:09 PM',
    transferType: 'Wire transfer',
    status: 'Pending',
    receiver: {
      accountName: 'Receiver One',
      accountNumber: '9876543210',
      fullName: 'Receiver One',
      phone: '0123456789',
      swiftOrIban: 'ABCDEF123',
    },
  },
  // more items can be added
];

const WireTransfer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState('15');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [detailsMessage, setDetailsMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching wire transfers:', searchTerm);
  };

  const handleViewDetails = (transfer: any) => {
    setSelectedTransfer(transfer);
    setDetailsMessage('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransfer(null);
  };

  const handleApprove = () => {
    console.log('Approve', selectedTransfer?.transactionId, detailsMessage);
    // TODO: call API
    handleCloseModal();
  };

  const handleReject = () => {
    console.log('Reject', selectedTransfer?.transactionId, detailsMessage);
    // TODO: call API
    handleCloseModal();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <>
      <PageMeta title="Wire Fund Transfer | Admin Dashboard" description="Wire transfer list" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wire Fund Transfer</h1>
          <Link to="/fund-transfer/wire" className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            <PlugInIcon className="h-4 w-4 text-white" />
            <span>Wire Transfer Settings</span>
          </Link>
        </div>

  <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <form onSubmit={handleSearch} className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 sm:w-auto" />
                <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <select value={perPage} onChange={(e) => setPerPage(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
                  <option value="" disabled>Select Status</option>
                  <option value="all">All</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </form>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Sender</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Transfer Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {wireTransfersData.map((t) => (
                  <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{t.date}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{t.transactionId}</td>
                    <td className="px-4 py-4"><Link to={`/user/${t.senderId}/edit`} className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">{t.sender}</Link></td>
                    <td className="px-4 py-4"><span className="text-sm font-bold text-green-600 dark:text-green-400">{t.amount}</span></td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-200">{t.transferType}</td>
                    <td className="px-4 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(t.status)}`}>{t.status}</span></td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleViewDetails(t)} className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600" title="View Details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700 lg:hidden">
            {wireTransfersData.map((t) => (
              <div key={t.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t.date}</div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(t.status)}`}>{t.status}</span>
                  </div>

                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Transaction ID</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">{t.transactionId}</div>
                  </div>

                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Sender</div>
                    <Link to={`/user/${t.senderId}/edit`} className="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">{t.sender}</Link>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Amount</div>
                      <span className="mt-1 text-sm font-bold text-green-600 dark:text-green-400">{t.amount}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Transfer Type</div>
                      <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">{t.transferType}</div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button onClick={() => handleViewDetails(t)} className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600" title="View Details">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (static) */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <nav className="flex flex-wrap items-center justify-center gap-1">
              <button disabled className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-400 dark:bg-gray-800 dark:border-gray-700">Prev</button>
              <button className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white">1</button>
              <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">2</button>
              <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">Next</button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-blue bg-opacity-50 p-4">
            <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Transfer Details</h3>
                <button onClick={handleCloseModal} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="site-card border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 rounded-lg">
                  <div className="p-4 border-b bg-gray-50 dark:bg-gray-900/40"><h4 className="font-semibold text-gray-900 dark:text-gray-100">Sender Information</h4></div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Username:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.sender}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Account Name:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.accountName}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Amount:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.amount.replace('+','')}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Charge:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.charge}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Final Amount:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.finalAmount}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Send at:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.sendAt}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">TRX No:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.transactionId}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Status:</div><div className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(selectedTransfer.status)}`}>{selectedTransfer.status}</div></div>
                  </div>
                </div>

                <div className="site-card border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 rounded-lg">
                  <div className="p-4 border-b bg-gray-50 dark:bg-gray-900/40"><h4 className="font-semibold text-gray-900 dark:text-gray-100">Receiver Information</h4></div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Account Name:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.receiver?.accountName}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Account Number:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.receiver?.accountNumber}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Full Name:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.receiver?.fullName}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">Phone Number:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.receiver?.phone}</div></div>
                    <div className="flex justify-between"><div className="text-sm text-gray-500 dark:text-gray-400">SWIFT Code Or IBAN Number:</div><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedTransfer.receiver?.swiftOrIban}</div></div>
                  </div>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); }}> 
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Details Message(Optional)</label>
                  <textarea value={detailsMessage} onChange={(e) => setDetailsMessage(e.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" placeholder="Details Message"></textarea>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button type="button" onClick={handleApprove} className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">Approve</button>
                  <button type="button" onClick={handleReject} className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">Reject</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WireTransfer;
