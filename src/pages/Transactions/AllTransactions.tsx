import React, { useState } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

// Sample transaction data
const transactionsData = [
  {
    id: 1,
    date: '06 Nov 2025, 11:21 PM',
    user: 'KALIDOUsavadogo8225',
    userId: 1662,
    transactionId: 'TRXAWOKFICNRY',
    type: 'Signup Bonus',
    amount: '+8 USD',
    gateway: 'System',
    status: 'Success',
  },
  {
    id: 2,
    date: '06 Nov 2025, 09:13 PM',
    user: 'AsadbekNorturaev3751',
    userId: 1661,
    transactionId: 'TRXK0UTFYAKBC',
    type: 'Signup Bonus',
    amount: '+8 USD',
    gateway: 'System',
    status: 'Success',
  },
  {
    id: 3,
    date: '06 Nov 2025, 08:42 PM',
    user: 'MaherAl-Yamany5489',
    userId: 1660,
    transactionId: 'TRX7LCQTYTRCX',
    type: 'Signup Bonus',
    amount: '+8 USD',
    gateway: 'System',
    status: 'Success',
  },
  {
    id: 4,
    date: '06 Nov 2025, 01:27 PM',
    user: 'KerryAbia2329',
    userId: 1659,
    transactionId: 'TRX4G7AMWQMNT',
    type: 'Signup Bonus',
    amount: '+8 USD',
    gateway: 'System',
    status: 'Success',
  },
  {
    id: 5,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    transactionId: 'TRXHULEDBVDAH',
    type: 'Dps Installment',
    amount: '+500 USD',
    gateway: 'System',
    status: 'Success',
  },
  {
    id: 6,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    transactionId: 'TRXQWEASHRJ3J',
    type: 'Dps Installment',
    amount: '+2000 USD',
    gateway: 'System',
    status: 'Success',
  },
  {
    id: 7,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    transactionId: 'TRXIUS0X5ZGHM',
    type: 'Dps Installment',
    amount: '+100 USD',
    gateway: 'System',
    status: 'Success',
  },
];

const AllTransactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState('15');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log('Searching for:', searchTerm);
  };

  return (
    <>
      <PageMeta
        title="All Transactions | Admin Dashboard"
        description="View and manage all transactions"
      />

      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
        </div>

        {/* Table Container */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Filter Section */}
          <form onSubmit={handleSearch} className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Search */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH..."
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                  SEARCH
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Status</option>
                  <option value="all">All</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Type</option>
                  <option value="all">All</option>
                  <option value="deposit">Deposit</option>
                  <option value="subtract">Subtract</option>
                  <option value="manual_deposit">Manual Deposit</option>
                  <option value="send_money">Send Money</option>
                  <option value="exchange">Exchange</option>
                  <option value="referral">Referral</option>
                  <option value="signup_bonus">Signup Bonus</option>
                  <option value="portfolio_bonus">Portfolio Bonus</option>
                  <option value="reward_redeem">Reward Redeem</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="withdraw_auto">Withdraw Auto</option>
                  <option value="receive_money">Receive Money</option>
                  <option value="refund">Refund</option>
                  <option value="fund_transfer">Fund Transfer</option>
                  <option value="loan">Loan</option>
                  <option value="loan_applied">Loan Apply</option>
                  <option value="loan_installment">Loan Installment</option>
                  <option value="dps_installment">Dps Installment</option>
                  <option value="dps_increase">Dps Increase</option>
                  <option value="dps_decrease">Dps Decrease</option>
                  <option value="fdr_increase">Fdr Increase</option>
                  <option value="fdr_decrease">Fdr Decrease</option>
                  <option value="dps_maturity">Dps Maturity</option>
                  <option value="dps_cancelled">Dps Cancelled</option>
                  <option value="fdr">Fdr</option>
                  <option value="fdr_installment">Fdr Installment</option>
                  <option value="fdr_maturity_fee">Fdr Maturity Fee</option>
                  <option value="fdr_cancelled">Fdr Cancelled</option>
                  <option value="pay_bill">Pay Bill</option>
                  <option value="card_create">Card Create</option>
                  <option value="card_load">Card Load</option>
                  <option value="card_deposit">Card Deposit</option>
                </select>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M12 18v-6"></path>
                    <path d="m9 15 3 3 3-3"></path>
                  </svg>
                  EXPORT AS CSV
                </button>
              </div>
            </div>
          </form>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      DATE
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      USER
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      TRANSACTION ID
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      TYPE
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      AMOUNT
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      GATEWAY
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      STATUS
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {transaction.date}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/customers/${transaction.userId}/edit`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400"
                      >
                        {transaction.user}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {transaction.transactionId}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {transaction.amount}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {transaction.gateway}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-center border-t border-gray-200 p-4 dark:border-gray-700">
            <nav className="flex items-center gap-2">
              <button
                disabled
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-400 dark:border-gray-600"
              >
                Prev
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700">
                1
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                2
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                3
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                4
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                5
              </button>
              <span className="px-2 text-sm text-gray-500">...</span>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                240
              </button>
              
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTransactions;
