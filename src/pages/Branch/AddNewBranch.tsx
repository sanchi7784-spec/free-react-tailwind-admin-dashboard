import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

// Back Arrow Icon
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 10 4 15 9 20"></polyline>
    <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
  </svg>
);

const AddNewBranch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    branchName: '',
    branchCode: '',
    gstNumber: '',
    phone: '',
    email: '',
    mobile: '',
    address: '',
    mapLocation: '',
    status: 'active',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (status: 'active' | 'inactive') => {
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add API call here
    // navigate('/branch/all'); // Redirect after successful submission
  };

  const handleBack = () => {
    navigate('/branch/all');
  };

  return (
    <>
      <PageMeta title="Add New Branch" description="Create a new bank branch" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Branch</h2>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <BackIcon />
            <span>Back</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Branch Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="branchName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Branch Name:
                  </label>
                  <input
                    type="text"
                    id="branchName"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    placeholder="Branch Name"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Branch Code */}
                <div className="space-y-2">
                  <label
                    htmlFor="branchCode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Branch Code:
                  </label>
                  <input
                    type="text"
                    id="branchCode"
                    name="branchCode"
                    value={formData.branchCode}
                    onChange={handleInputChange}
                    placeholder="Branch Code"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* GST Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="gstNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    GST Number:
                  </label>
                  <input
                    type="text"
                    id="gstNumber"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="GST Number"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone:
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Alternate Mobile:
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Mobile Number"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Address - Full Width */}
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Address:
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Google Map Location - Full Width */}
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="mapLocation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Google Map Location:
                  </label>
                  <textarea
                    id="mapLocation"
                    name="mapLocation"
                    value={formData.mapLocation}
                    onChange={handleInputChange}
                    placeholder="Google Map Link"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Status Toggle */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Status:
                  </label>
                  <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('active')}
                      className={`px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${
                        formData.status === 'active'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('inactive')}
                      className={`px-6 py-2.5 text-sm font-medium transition-colors duration-200 border-l border-gray-300 dark:border-gray-600 ${
                        formData.status === 'inactive'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Deactivate
                    </button>
                  </div>
                </div>

                {/* Submit Button - Full Width */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add New Branch
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewBranch;
