import React from 'react';
import { useParams, useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

// Mock data - in production, fetch based on loan ID
const mockLoanDetails = {
  21: {
    plan: {
      name: 'Education Loan',
      interval: '30 Days',
      totalInstallment: '12 Times',
      loanAmount: '$100',
      perInstallment: '$9.17',
      givenInstallment: '0',
      paidAmount: '$0',
      payableAmount: '$110',
      status: 'Reviewing',
      bankProfit: '$10',
    },
    request: {
      gender: 'Male',
      nidCard: 'https://digibank.tdevs.co/assets/',
      idNumber: 'dhfgg',
      aboutYourself: 'fudgg',
    },
    user: 'demouser',
    loanId: 'L97417684',
  },
};

const LoanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Get loan details from mock data
  const loanData = id && mockLoanDetails[id as unknown as keyof typeof mockLoanDetails] 
    ? mockLoanDetails[id as unknown as keyof typeof mockLoanDetails] 
    : mockLoanDetails[21];

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to approve loan
    console.log('Approving loan:', id);
    alert('Loan approved (mock)');
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to reject loan
    console.log('Rejecting loan:', id);
    alert('Loan rejected (mock)');
  };

  return (
    <>
      <PageMeta title="Loan Details | Admin Dashboard" description="View loan details" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loan Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Plan Information */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Plan Information</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.plan.name}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Interval</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.plan.interval}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Installment</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.plan.totalInstallment}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</span>
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {loanData.plan.loanAmount}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Per Installment</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.plan.perInstallment}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Given Installment</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.plan.givenInstallment}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Paid Amount</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.plan.paidAmount}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payable Amount</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.plan.payableAmount}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {loanData.plan.status}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bank Profit</span>
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {loanData.plan.bankProfit}
                </span>
              </div>
            </div>
          </div>

          {/* Loan Request Information */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Loan Request Information</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gender</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.request.gender}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">NID Card</span>
                <a
                  href={loanData.request.nidCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Click here to view
                </a>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">ID Number</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.request.idNumber}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Write about yourself</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{loanData.request.aboutYourself}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprove}
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
            Approve
          </button>
          <button
            onClick={handleReject}
            className="inline-flex items-center gap-2 rounded-md bg-red-500 px-6 py-3 text-sm font-medium text-white hover:bg-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
            Reject
          </button>
        </div>
      </div>
    </>
  );
};

export default LoanDetails;
