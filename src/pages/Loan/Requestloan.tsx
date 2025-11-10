import React, { useState } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

const sampleLoans = [
  { id: 21, plan: 'Education Loan', user: 'demouser', userId: 1, loanId: 'L97417684', amount: 'Rs 20,000', installmentAmount: '$10', nextInstallment: '-', requestedAt: '22 Oct 2025 05:41 AM', status: 'Reviewing' },
  { id: 19, plan: 'House Loan', user: 'SHAKEELahmad4697', userId: 1579, loanId: 'L85086446', amount: 'Rs 30000', installmentAmount: '$10', nextInstallment: '-', requestedAt: '07 Oct 2025 03:04 PM', status: 'Reviewing' },
  { id: 18, plan: 'Marriage Loan', user: 'nahomnigussie9895', userId: 1549, loanId: 'L96172776', amount: 'Rs 500', installmentAmount: '$50', nextInstallment: '-', requestedAt: '25 Sep 2025 07:19 AM', status: 'Reviewing' },
  { id: 17, plan: 'Business Loan', user: 'HsjsjsjBsbsbs4828', userId: 1374, loanId: 'L95339644', amount: '$155', installmentAmount: '$15.5', nextInstallment: '-', requestedAt: '21 Sep 2025 10:50 AM', status: 'Reviewing' },
  { id: 12, plan: 'Startup Loan', user: 'tajirkhan7726', userId: 1492, loanId: 'L38466986', amount: '$250', installmentAmount: '$25', nextInstallment: '-', requestedAt: '06 Sep 2025 08:28 PM', status: 'Reviewing' },
  { id: 10, plan: 'Education Loan', user: 'ShehabSul3207', userId: 1411, loanId: 'L49445617', amount: '$500', installmentAmount: '$50', nextInstallment: '-', requestedAt: '19 Aug 2025 09:51 PM', status: 'Reviewing' },
  { id: 9, plan: 'Study Loan', user: 'huuuuu4772', userId: 1409, loanId: 'L93988062', amount: '$100', installmentAmount: '$10', nextInstallment: '-', requestedAt: '19 Aug 2025 10:23 AM', status: 'Reviewing' },
];

const Requestloan: React.FC = () => {
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState('15');

  return (
    <>
      <PageMeta title="Requested Loan | Admin Dashboard" description="Manage requested loans" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Requested Loan</h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b p-4 dark:border-gray-700">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                  Search
                </button>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>
              </div>
            </form>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      Plan
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      User
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      Loan ID
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      Amount
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Installment Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Next Installment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      Requested At
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      Status
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="m3 16 4 4 4-4"></path>
                        <path d="M7 4v16"></path>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {sampleLoans.map((loan) => (
                  <tr key={loan.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{loan.plan}</td>
                    <td className="px-6 py-4">
                      <a href={`#/user/${loan.userId}/edit`} className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                        {loan.user}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{loan.loanId}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{loan.amount}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{loan.installmentAmount}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{loan.nextInstallment}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{loan.requestedAt}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/loan/details/${loan.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600"
                        aria-label="View Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {sampleLoans.map((loan) => (
              <div key={loan.id} className="p-4 bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loan.plan}</div>
                    <a href={`#/user/${loan.userId}/edit`} className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400">
                      {loan.user}
                    </a>
                  </div>
                  <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    {loan.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Loan ID:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{loan.loanId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{loan.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Installment:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{loan.installmentAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Requested:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{loan.requestedAt}</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <Link
                    to={`/loan/details/${loan.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="border-t p-4 dark:border-gray-700">
            <nav className="flex items-center gap-2">
              <button
                disabled
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-400 dark:bg-gray-800 dark:border-gray-700"
              >
                Prev
              </button>
              <button className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white">1</button>
              <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                2
              </button>
              <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Requestloan;