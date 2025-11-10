import React, { useState } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

// Sample bank profits data
const bankProfitsData = [
  {
    id: 1,
    date: '07 Nov 2025, 11:19 AM',
    user: 'demouser',
    userId: 1,
    amount: '$10',
    type: 'Dps Maturity',
    description: 'DPS Maturity Education DPS',
  },
  {
    id: 2,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$5',
    type: 'Dps Installment',
    description: 'DPS Installment House Plan DPS',
  },
  {
    id: 3,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$20',
    type: 'Dps Installment',
    description: 'DPS Installment Future DPS Plan',
  },
  {
    id: 4,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$10',
    type: 'Dps Maturity',
    description: 'DPS Maturity Education DPS',
  },
  {
    id: 5,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$10',
    type: 'Dps Maturity',
    description: 'DPS Maturity Education DPS',
  },
  {
    id: 6,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$10',
    type: 'Dps Maturity',
    description: 'DPS Maturity Education DPS',
  },
  {
    id: 7,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$10',
    type: 'Dps Maturity',
    description: 'DPS Maturity Education DPS',
  },
  {
    id: 8,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$10',
    type: 'Dps Maturity',
    description: 'DPS Maturity Education DPS',
  },
  {
    id: 9,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$10',
    type: 'Dps Maturity',
    description: 'DPS Maturity Education DPS',
  },
  {
    id: 10,
    date: '06 Nov 2025, 11:18 AM',
    user: 'demouser',
    userId: 1,
    amount: '$10',
    type: 'Dps Maturity',
    description: 'DPS Maturity Education DPS',
  },
];

const BankProfits: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState('15');
  const [typeFilter, setTypeFilter] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log('Searching for:', searchTerm);
  };

  return (
    <>
      <PageMeta
        title="Bank Profits | Admin Dashboard"
        description="View and manage bank profits"
      />

      <div className="space-y-6">
        {/* Table Container */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Bank Profits</h1>
            <div className="rounded-lg bg-blue-100 px-4 py-2 dark:bg-blue-900/30">
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                Total Profits: 3966.36 USD
              </span>
            </div>
          </div>

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
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-auto"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
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
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-auto"
                >
                  <option value="" disabled>Type</option>
                  <option value="all">All</option>
                  <option value="deposit">Deposit</option>
                  <option value="subtract">Subtract</option>
                  <option value="manual_deposit">ManualDeposit</option>
                  <option value="send_money">SendMoney</option>
                  <option value="exchange">Exchange</option>
                  <option value="referral">Referral</option>
                  <option value="signup_bonus">SignupBonus</option>
                  <option value="portfolio_bonus">PortfolioBonus</option>
                  <option value="reward_redeem">RewardRedeem</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="withdraw_auto">WithdrawAuto</option>
                  <option value="receive_money">ReceiveMoney</option>
                  <option value="refund">Refund</option>
                  <option value="fund_transfer">FundTransfer</option>
                  <option value="loan">Loan</option>
                  <option value="loan_applied">LoanApply</option>
                  <option value="loan_installment">LoanInstallment</option>
                  <option value="dps_installment">DpsInstallment</option>
                  <option value="dps_increase">DpsIncrease</option>
                  <option value="dps_decrease">DpsDecrease</option>
                  <option value="fdr_increase">FdrIncrease</option>
                  <option value="fdr_decrease">FdrDecrease</option>
                  <option value="dps_maturity">DpsMaturity</option>
                  <option value="dps_cancelled">DpsCancelled</option>
                  <option value="fdr">Fdr</option>
                  <option value="fdr_installment">FdrInstallment</option>
                  <option value="fdr_maturity_fee">FdrMaturityFee</option>
                  <option value="fdr_cancelled">FdrCancelled</option>
                  <option value="pay_bill">PayBill</option>
                  <option value="card_create">CardCreate</option>
                  <option value="card_load">CardLoad</option>
                  <option value="card_deposit">CardDeposit</option>
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
                      User
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
                      Type
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      Description
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {bankProfitsData.map((profit) => (
                  <tr
                    key={profit.id}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {profit.date}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/user/${profit.userId}/edit`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {profit.user}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {profit.amount}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {profit.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {profit.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700 lg:hidden">
            {bankProfitsData.map((profit) => (
              <div key={profit.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <div className="space-y-3">
                  {/* Date and Amount */}
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {profit.date}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {profit.amount}
                    </span>
                  </div>

                  {/* User */}
                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-500">User</div>
                    <Link
                      to={`/user/${profit.userId}/edit`}
                      className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {profit.user}
                    </Link>
                  </div>

                  {/* Type */}
                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-500">Type</div>
                    <span className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {profit.type}
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-500">Description</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                      {profit.description}
                    </div>
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
              <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white">
                1
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                2
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                3
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                4
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                5
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                6
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                7
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                8
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                9
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                10
              </button>
              <span className="px-2 text-sm text-gray-500">...</span>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                41
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                42
              </button>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankProfits;
