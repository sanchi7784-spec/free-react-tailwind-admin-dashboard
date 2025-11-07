import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  PencilIcon,
  TrashBinIcon,
  AlertIcon,
  CheckLineIcon,
  CloseLineIcon,
} from '../../icons';
import PageMeta from '../../components/common/PageMeta';

interface BranchStaff {
  id: number;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  branch: string;
  status: 'active' | 'inactive';
}

// Simple SVG Icon Components
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>

  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const PlusCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 12h8"></path>
    <path d="M12 8v8"></path>
  </svg>
);

const AllBranchStaff = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState('15');
  const [branchFilter, setBranchFilter] = useState('');
  const [orderFilter, setOrderFilter] = useState('asc');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<BranchStaff | null>(null);

  // Sample data - empty initially as shown in the image
  const [staffMembers] = useState<BranchStaff[]>([]);

  const handleDelete = (staff: BranchStaff) => {
    setSelectedStaff(staff);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting staff:', selectedStaff);
    setShowDeleteModal(false);
    setSelectedStaff(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Searching:', searchTerm);
  };

  const applyFilters = () => {
    // Handle filter logic
    console.log('Applying filters:', { branchFilter, orderFilter });
    setShowFilterDropdown(false);
  };

  const resetFilters = () => {
    setBranchFilter('');
    setOrderFilter('asc');
    setShowFilterDropdown(false);
  };

  return (
    <>
      <PageMeta title="Branch Staff" description="Manage all branch staff members" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Branch Staff</h2>
          <button 
            onClick={() => navigate('/staff/add')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <PlusCircleIcon />
            <span>Add New</span>
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Search and Filter Bar */}
          <form onSubmit={handleSearch} className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              {/* Search */}
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <SearchIcon />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

              {/* Per Page and Filter */}
              <div className="flex gap-2">
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>

                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <FilterIcon />
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filter</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Branch
                              </label>
                              <select
                                value={branchFilter}
                                onChange={(e) => setBranchFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                              >
                                <option value="">Branch</option>
                                <option value="0">All</option>
                                <option value="1">US Branch</option>
                                <option value="2">UK Branch</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Order
                              </label>
                              <select
                                value={orderFilter}
                                onChange={(e) => setOrderFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                              >
                                <option value="asc">ASC</option>
                                <option value="desc">DESC</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-between pt-2">
                            <button
                              type="button"
                              onClick={applyFilters}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                            >
                              Apply Filter
                            </button>
                            <button
                              type="button"
                              onClick={resetFilters}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                              Reset Filter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Table - Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {staffMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No Data Found!
                    </td>
                  </tr>
                ) : (
                  staffMembers.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {staff.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {staff.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {staff.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {staff.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {staff.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            staff.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {staff.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/staff/edit/${staff.id}`)}
                            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(staff)}
                            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                            title="Delete"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {staffMembers.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                No Data Found!
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {staffMembers.map((staff) => (
                  <div key={staff.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{staff.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{staff.designation}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          staff.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {staff.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Email:</span>
                        <span className="ml-1 text-gray-900 dark:text-gray-200">{staff.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Mobile:</span>
                        <span className="ml-1 text-gray-900 dark:text-gray-200">{staff.mobile}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">Branch:</span>
                        <span className="ml-1 text-gray-900 dark:text-gray-200">{staff.branch}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => navigate(`/staff/edit/${staff.id}`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(staff)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <TrashBinIcon className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex justify-center">
              <ul className="flex items-center gap-1">
                <li>
                  <button
                    disabled
                    className="px-3 py-2 text-sm text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-not-allowed"
                  >
                    Prev
                  </button>
                </li>
                <li>
                  <button className="px-3 py-2 text-sm text-white bg-indigo-600 rounded-lg">
                    1
                  </button>
                </li>
                <li>
                  <button
                    disabled
                    className="px-3 py-2 text-sm text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-not-allowed"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            {/* Modal */}
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <CloseLineIcon className="w-6 h-6" />
              </button>

              <div className="sm:flex sm:items-start">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <AlertIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Are you sure?
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You want to delete <strong>{selectedStaff?.name}</strong>?
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                <button
                  onClick={confirmDelete}
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                >
                  <CheckLineIcon className="w-4 h-4" />
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 mt-3 text-base font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  <CloseLineIcon className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllBranchStaff;
