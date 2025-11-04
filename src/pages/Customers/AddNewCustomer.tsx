import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function AddNewCustomer() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    branch: "",
    gender: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    city: "",
    zipCode: "",
    address: "",
    password: "",
    nidNo: "",
  });

  const [kycFiles, setKycFiles] = useState({
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    panFront: null as File | null,
    panBack: null as File | null,
    cancelledCheck: null as File | null,
    passportDLFront: null as File | null,
    passportDLBack: null as File | null,
  });

  const [kycData, setKycData] = useState({
    nidNumber: "",
    nidFrontPage: null as File | null,
    aboutYourself: "",
    yourSelfie: null as File | null,
    passportDLFrontPage: null as File | null,
    passportDLBackPage: null as File | null,
    passportDLName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKycInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKycData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    if (fieldName.startsWith('kyc_')) {
      const kycField = fieldName.replace('kyc_', '') as keyof typeof kycData;
      setKycData(prev => ({ ...prev, [kycField]: file }));
    } else {
      setKycFiles(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('KYC Files:', kycFiles);
    console.log('KYC Data:', kycData);
    // TODO: Submit to API
  };

  return (
    <>
      <PageMeta title="Add New Customer - Admin" description="Add new customer form" />
      <PageBreadcrumb pageTitle="Add New Customer" />

      <div className="w-full max-w-full overflow-x-hidden">
        <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Basic Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Country:</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                >
                  <option value="">Select Country</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="India">India</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Branch:</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                >
                  <option value="">Select Branch:</option>
                  <option value="Main Branch">Main Branch</option>
                  <option value="Branch A">Branch A</option>
                  <option value="Branch B">Branch B</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Email Address:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Zip Code:</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* NID No */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                  NID No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nidNo"
                  value={formData.nidNo}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          {/* KYC Submission Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">KYC Submission</h3>

            {/* Aadhaar Card Section */}
            <div className="mb-8">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Aadhaar Card</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar Front */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Front Page <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                    <input
                      type="file"
                      id="aadhaarFront"
                      onChange={(e) => handleFileChange(e, 'aadhaarFront')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="aadhaarFront" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                      {kycFiles.aadhaarFront && (
                        <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycFiles.aadhaarFront.name}</p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Aadhaar Back */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Back Page <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                    <input
                      type="file"
                      id="aadhaarBack"
                      onChange={(e) => handleFileChange(e, 'aadhaarBack')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="aadhaarBack" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                      {kycFiles.aadhaarBack && (
                        <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycFiles.aadhaarBack.name}</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* PAN Card Section */}
            <div className="mb-8">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">PAN Card</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PAN Front */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Front Page <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                    <input
                      type="file"
                      id="panFront"
                      onChange={(e) => handleFileChange(e, 'panFront')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="panFront" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                      {kycFiles.panFront && (
                        <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycFiles.panFront.name}</p>
                      )}
                    </label>
                  </div>
                </div>

                {/* PAN Back */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Back Page <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                    <input
                      type="file"
                      id="panBack"
                      onChange={(e) => handleFileChange(e, 'panBack')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="panBack" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                      {kycFiles.panBack && (
                        <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycFiles.panBack.name}</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancelled Check Section */}
            <div className="mb-8">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Cancelled Check</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Upload Cancelled Check <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                    <input
                      type="file"
                      id="cancelledCheck"
                      onChange={(e) => handleFileChange(e, 'cancelledCheck')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="cancelledCheck" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                      {kycFiles.cancelledCheck && (
                        <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycFiles.cancelledCheck.name}</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* NID Card Section */}
            <div className="mb-8">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">NID Card</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* NID Number */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    NID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nidNumber"
                    value={kycData.nidNumber}
                    onChange={handleKycInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                  />
                </div>

                {/* NID Front Page */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Front Page <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                    <input
                      type="file"
                      id="nidFrontPage"
                      onChange={(e) => handleFileChange(e, 'kyc_nidFrontPage')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="nidFrontPage" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                      {kycData.nidFrontPage && (
                        <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycData.nidFrontPage.name}</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Write about yourself */}
              <div className="mb-6">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Write about yourself <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="aboutYourself"
                  value={kycData.aboutYourself}
                  onChange={handleKycInputChange}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                />
              </div>

              {/* Your Selfie */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Your Selfie <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50 max-w-md">
                  <input
                    type="file"
                    id="yourSelfie"
                    onChange={(e) => handleFileChange(e, 'kyc_yourSelfie')}
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="yourSelfie" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                    {kycData.yourSelfie && (
                      <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycData.yourSelfie.name}</p>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Passport or Driving Licence Section */}
            <div className="mb-8">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Passport or Driving Licence</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Page */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Front Page <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                    <input
                      type="file"
                      id="passportDLFront"
                      onChange={(e) => handleFileChange(e, 'passportDLFront')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="passportDLFront" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                      {kycFiles.passportDLFront && (
                        <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycFiles.passportDLFront.name}</p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Back Page */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Back Page <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                    <input
                      type="file"
                      id="passportDLBack"
                      onChange={(e) => handleFileChange(e, 'passportDLBack')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="passportDLBack" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Upload Icon</p>
                      {kycFiles.passportDLBack && (
                        <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">{kycFiles.passportDLBack.name}</p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="passportDLName"
                    value={kycData.passportDLName}
                    onChange={handleKycInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white px-6 py-3 rounded inline-flex items-center gap-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add New
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
