import { useState } from 'react';
import { Link } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

interface VirtualCard {
  id: number;
  date: string;
  user: string;
  userId: number;
  cardNumber: string;
  expiry: string;
  balance: string;
  isActive: boolean;
  cardId: string;
}

interface TopUpModalProps {
  isOpen: boolean;
  cardId: number;
  onClose: () => void;
  onSubmit: (amount: string) => void;
}

const TopUpModal = ({ isOpen, onClose, onSubmit }: TopUpModalProps) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(amount);
    setAmount('');
    onClose();
  };

  const validateDouble = (value: string) => {
    const regex = /^\d*\.?\d{0,2}$/;
    return regex.test(value) ? value : amount;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
            Card Balance Add or Subtract
          </h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                USD
              </span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(validateDouble(e.target.value))}
                className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Apply Now
          </button>
        </form>
      </div>
    </div>
  );
};

const VirtualCards = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Sample virtual card data
  const virtualCards: VirtualCard[] = [
    {
      id: 37,
      date: '2025-10-28 21:48:56',
      user: 'testuser6966',
      userId: 1635,
      cardNumber: '4000009990000997',
      expiry: '8/2028',
      balance: '$1.00',
      isActive: true,
      cardId: 'ic_1SNKlAGa5qCnacVH45BXdKtm',
    },
    {
      id: 36,
      date: '2025-10-24 18:57:32',
      user: 'troylorr9025',
      userId: 1611,
      cardNumber: '4000009990000971',
      expiry: '8/2028',
      balance: '$1.00',
      isActive: true,
      cardId: 'ic_1SLqB6Ga5qCnacVHXko2c6Qa',
    },
    {
      id: 35,
      date: '2025-10-20 12:49:43',
      user: 'troylorr9025',
      userId: 1611,
      cardNumber: '4000009990000963',
      expiry: '7/2028',
      balance: '$1.00',
      isActive: true,
      cardId: 'ic_1SKIWxGa5qCnacVHDzGkYpgs',
    },
    {
      id: 34,
      date: '2025-10-20 12:48:57',
      user: 'troylorr9025',
      userId: 1611,
      cardNumber: '4000009990000955',
      expiry: '12/2028',
      balance: '$1.00',
      isActive: true,
      cardId: 'ic_1SKIWCGa5qCnacVHErf2cAif',
    },
    {
      id: 33,
      date: '2025-10-04 12:08:40',
      user: 'haithemben ali7...',
      userId: 1533,
      cardNumber: '4000009990000922',
      expiry: '11/2028',
      balance: '$1.00',
      isActive: true,
      cardId: 'ic_1SEUGSGa5qCnacVHXB1FRHma',
    },
    {
      id: 32,
      date: '2025-09-29 07:05:34',
      user: 'ChrisBrandon804...',
      userId: 1557,
      cardNumber: '4000009990000864',
      expiry: '10/2028',
      balance: '$285.00',
      isActive: true,
      cardId: 'ic_1SCb9NGa5qCnacVHHttyLQFA',
    },
    {
      id: 31,
      date: '2025-09-25 11:37:57',
      user: 'JIMMYSEBBA6173',
      userId: 1550,
      cardNumber: '4000009990000716',
      expiry: '11/2028',
      balance: '$1.00',
      isActive: true,
      cardId: 'ic_1SBDUmGa5qCnacVHV92kkZP9',
    },
    {
      id: 30,
      date: '2025-09-22 08:45:08',
      user: 'testtest2235',
      userId: 1540,
      cardNumber: '4000009990000666',
      expiry: '10/2028',
      balance: '$1.00',
      isActive: false,
      cardId: 'ic_1SA5MuGa5qCnacVHTJykfyx8',
    },
  ];

  const totalPages = 3;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleTopUp = (amount: string) => {
    console.log(`Top up card ${selectedCardId} with amount: ${amount}`);
    // Implement actual top-up logic here
  };

  const handleToggleStatus = (cardId: string) => {
    console.log(`Toggle status for card: ${cardId}`);
    // Implement status toggle logic here
  };

  // Filter cards based on search and status
  const filteredCards = virtualCards.filter((card) => {
    const matchesSearch = 
      card.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.cardNumber.includes(searchQuery);
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && card.isActive) ||
      (filterStatus === 'inactive' && !card.isActive);

    return matchesSearch && matchesStatus;
  });

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
      <PageMeta title="Virtual Cards - Dashboard" description="View and manage virtual cards" />
      
      <div className="w-full">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Virtual Cards
          </h2>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user or card number..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="all">All Cards</option>
                <option value="active">Active Cards</option>
                <option value="inactive">Inactive Cards</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
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
                      onClick={() => handleSort('card_number')}
                      className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Card No.
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('expiration_year')}
                      className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Expiry
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No virtual cards found
                    </td>
                  </tr>
                ) : (
                  filteredCards.map((card) => (
                    <tr
                      key={card.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {card.date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/admin/user/${card.userId}/edit`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                        >
                          {card.user}
                        </Link>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {card.cardNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {card.expiry}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {card.balance}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          {/* Top Up Button */}
                          <button
                            onClick={() => setSelectedCardId(card.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            title="Top Up Card"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M8 12h8"></path>
                              <path d="M12 8v8"></path>
                            </svg>
                          </button>

                          {/* Activate/Deactivate Button */}
                          <button
                            onClick={() => handleToggleStatus(card.cardId)}
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                              card.isActive
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            title={card.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {card.isActive ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m2 2 20 20"></path>
                                <path d="M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71"></path>
                                <path d="M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264"></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={selectedCardId !== null}
        cardId={selectedCardId || 0}
        onClose={() => setSelectedCardId(null)}
        onSubmit={handleTopUp}
      />
    </>
  );
};

export default VirtualCards;
