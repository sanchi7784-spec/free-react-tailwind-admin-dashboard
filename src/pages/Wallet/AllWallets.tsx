import { useState } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

interface Wallet {
  id: number;
  date: string;
  user: string;
  userId: number;
  currency: string;
  currencySymbol: string;
  balance: string;
}

const AllWallets = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Sample wallet data
  const wallets: Wallet[] = [
    {
      id: 1,
      date: '2025-10-27 09:56:52',
      user: 'Jobijobi2050',
      userId: 1630,
      currency: 'Naira',
      currencySymbol: '₦',
      balance: '₦0.00',
    },
    {
      id: 2,
      date: '2025-10-24 17:29:26',
      user: 'RoBouley5186',
      userId: 1626,
      currency: 'Naira',
      currencySymbol: '₦',
      balance: '₦0.00',
    },
    {
      id: 3,
      date: '2025-10-23 12:30:13',
      user: 'JayeshThakkar40...',
      userId: 1621,
      currency: 'Euro',
      currencySymbol: '€',
      balance: '€0.00',
    },
    {
      id: 4,
      date: '2025-10-20 12:47:03',
      user: 'troylorr9025',
      userId: 1611,
      currency: 'Euro',
      currencySymbol: '€',
      balance: '€0.00',
    },
    {
      id: 5,
      date: '2025-10-20 12:45:33',
      user: 'troylorr9025',
      userId: 1611,
      currency: 'Naira',
      currencySymbol: '₦',
      balance: '₦0.00',
    },
    {
      id: 6,
      date: '2025-10-04 12:12:50',
      user: 'haithemben ali7...',
      userId: 1533,
      currency: 'Naira',
      currencySymbol: '₦',
      balance: '₦0.00',
    },
    {
      id: 7,
      date: '2025-10-04 12:12:23',
      user: 'haithemben ali7...',
      userId: 1533,
      currency: 'Euro',
      currencySymbol: '€',
      balance: '€0.00',
    },
    {
      id: 8,
      date: '2025-09-25 11:42:08',
      user: 'JIMMYSEBBA6173',
      userId: 1550,
      currency: 'Euro',
      currencySymbol: '€',
      balance: '€0.00',
    },
    {
      id: 9,
      date: '2025-09-21 10:55:00',
      user: 'HsjsjsjBsbsbs48...',
      userId: 1374,
      currency: 'Euro',
      currencySymbol: '€',
      balance: '€0.00',
    },
    {
      id: 10,
      date: '2025-09-20 18:47:48',
      user: 'kellybegin6721',
      userId: 1346,
      currency: 'Euro',
      currencySymbol: '€',
      balance: '€0.00',
    },
  ];

  const totalPages = 4;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block ml-1"
    >
      <path d="m3 16 4 4 4-4"></path>
      <path d="M7 4v16"></path>
      <path d="M15 4h5l-5 6h5"></path>
      <path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20"></path>
      <path d="M20 18h-5"></path>
    </svg>
  );

  return (
    <>
      <PageMeta title="All Wallets - Dashboard" description="View and manage all user wallets" />
      
      <div className="w-full">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Wallets
          </h2>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('created_at')}
                      className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Date
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('user')}
                      className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      User
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Currency
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('symbol')}
                      className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Currency Symbol
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('balance')}
                      className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Balance
                      <SortIcon />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {wallets.map((wallet) => (
                  <tr
                    key={wallet.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {wallet.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/admin/user/${wallet.userId}/edit`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                      >
                        {wallet.user}
                      </Link>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {wallet.currency}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {wallet.currencySymbol}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {wallet.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <nav className="flex items-center justify-center" aria-label="Pagination">
              <ul className="flex items-center space-x-1">
                {/* Previous Button */}
                <li>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Prev
                  </button>
                </li>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <li key={pageNumber}>
                      <button
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}

                {/* Next Button */}
                <li>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllWallets;
