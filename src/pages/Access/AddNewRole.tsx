import { useState } from "react";
import { Link } from "react-router";

interface Permission {
  id: string;
  label: string;
  value: number;
}

interface PermissionCategory {
  title: string;
  id: string;
  permissions: Permission[];
}

const permissionCategories: PermissionCategory[] = [
  {
    title: "Statistics Management",
    id: "StatisticsManagement",
    permissions: [
      { id: "total-users", label: "Total Users", value: 1 },
      { id: "active-users", label: "Active Users", value: 2 },
      { id: "disabled-users", label: "Disabled Users", value: 3 },
      { id: "total-staff", label: "Total Staff", value: 4 },
      { id: "total-deposits", label: "Total Deposits", value: 5 },
      { id: "total-withdraw", label: "Total Withdraw", value: 6 },
      { id: "total-referral", label: "Total Referral", value: 7 },
      { id: "total-fund-transfer", label: "Total Fund Transfer", value: 8 },
      { id: "total-dps", label: "Total Dps", value: 9 },
      { id: "total-fdr", label: "Total Fdr", value: 10 },
      { id: "total-loan", label: "Total Loan", value: 11 },
      { id: "total-pay-bill", label: "Total Pay Bill", value: 12 },
      { id: "total-reward-points", label: "Total Reward Points", value: 13 },
      { id: "deposit-bonus", label: "Deposit Bonus", value: 14 },
      { id: "total-automatic-gateway", label: "Total Automatic Gateway", value: 15 },
      { id: "total-ticket", label: "Total Ticket", value: 16 },
      { id: "site-statistics-chart", label: "Site Statistics Chart", value: 17 },
      { id: "top-country-statistics", label: "Top Country Statistics", value: 18 },
      { id: "top-browser-statistics", label: "Top Browser Statistics", value: 19 },
      { id: "top-os-statistics", label: "Top Os Statistics", value: 20 },
      { id: "latest-users", label: "Latest Users", value: 21 },
      { id: "fund-transfer-statistics", label: "Fund Transfer Statistics", value: 150 },
    ],
  },
  {
    title: "Customer Management",
    id: "CustomerManagement",
    permissions: [
      { id: "customer-list", label: "Customer List", value: 22 },
      { id: "customer-login", label: "Customer Login", value: 23 },
      { id: "customer-mail-send", label: "Customer Mail Send", value: 24 },
      { id: "customer-basic-manage", label: "Customer Basic Manage", value: 25 },
      { id: "customer-balance-add-or-subtract", label: "Customer Balance Add Or Subtract", value: 26 },
      { id: "customer-change-password", label: "Customer Change Password", value: 27 },
      { id: "all-type-status", label: "All Type Status", value: 28 },
      { id: "user-paybacks-tab", label: "User Paybacks Tab", value: 151 },
      { id: "user-cards", label: "User Cards", value: 152 },
      { id: "user-dps", label: "User Dps", value: 153 },
      { id: "user-fdr", label: "User Fdr", value: 154 },
      { id: "user-loan", label: "User Loan", value: 155 },
      { id: "customer-create", label: "Customer Create", value: 161 },
      { id: "customer-edit", label: "Customer Edit", value: 162 },
      { id: "customer-delete", label: "Customer Delete", value: 163 },
    ],
  },
  {
    title: "Kyc Management",
    id: "KycManagement",
    permissions: [
      { id: "kyc-list", label: "Kyc List", value: 29 },
      { id: "kyc-action", label: "Kyc Action", value: 30 },
      { id: "kyc-form-manage", label: "Kyc Form Manage", value: 31 },
    ],
  },
  {
    title: "Role Management",
    id: "RoleManagement",
    permissions: [
      { id: "role-list", label: "Role List", value: 32 },
      { id: "role-create", label: "Role Create", value: 33 },
      { id: "role-edit", label: "Role Edit", value: 34 },
    ],
  },
  {
    title: "Staff Management",
    id: "StaffManagement",
    permissions: [
      { id: "staff-list", label: "Staff List", value: 35 },
      { id: "staff-create", label: "Staff Create", value: 36 },
      { id: "staff-edit", label: "Staff Edit", value: 37 },
    ],
  },
  {
    title: "Transaction Management",
    id: "TransactionManagement",
    permissions: [
      { id: "transaction-list", label: "Transaction List", value: 38 },
      { id: "user-paybacks", label: "User Paybacks", value: 39 },
      { id: "bank-profit", label: "Bank Profit", value: 40 },
    ],
  },
  {
    title: "Branch Management",
    id: "BranchManagement",
    permissions: [
      { id: "branch-list", label: "Branch List", value: 41 },
      { id: "branch-create", label: "Branch Create", value: 42 },
      { id: "branch-edit", label: "Branch Edit", value: 43 },
      { id: "branch-delete", label: "Branch Delete", value: 44 },
      { id: "branch-staff-list", label: "Branch Staff List", value: 45 },
      { id: "branch-staff-create", label: "Branch Staff Create", value: 46 },
      { id: "branch-staff-edit", label: "Branch Staff Edit", value: 47 },
      { id: "branch-staff-delete", label: "Branch Staff Delete", value: 48 },
    ],
  },
  {
    title: "Fund Transfer Management",
    id: "FundTransferManagement",
    permissions: [
      { id: "pending-transfers", label: "Pending Transfers", value: 49 },
      { id: "rejected-transfers", label: "Rejected Transfers", value: 50 },
      { id: "all-transfers", label: "All Transfers", value: 51 },
      { id: "allied-transfers", label: "Allied Transfers", value: 52 },
      { id: "other-bank-transfers", label: "Other Bank Transfers", value: 53 },
      { id: "wire-transfer", label: "Wire Transfer", value: 54 },
      { id: "others-bank-list", label: "Others Bank List", value: 55 },
      { id: "others-bank-create", label: "Others Bank Create", value: 56 },
      { id: "others-bank-edit", label: "Others Bank Edit", value: 57 },
      { id: "others-bank-delete", label: "Others Bank Delete", value: 58 },
      { id: "fund-transfer-approval", label: "Fund Transfer Approval", value: 59 },
    ],
  },
  {
    title: "DPS Management",
    id: "DPSManagement",
    permissions: [
      { id: "dps-plan-list", label: "Dps Plan List", value: 60 },
      { id: "dps-plan-create", label: "Dps Plan Create", value: 61 },
      { id: "dps-plan-edit", label: "Dps Plan Edit", value: 62 },
      { id: "dps-plan-delete", label: "Dps Plan Delete", value: 63 },
      { id: "ongoing-dps", label: "Ongoing Dps", value: 64 },
      { id: "payable-dps", label: "Payable Dps", value: 65 },
      { id: "complete-dps", label: "Complete Dps", value: 66 },
      { id: "closed-dps", label: "Closed Dps", value: 67 },
      { id: "all-dps", label: "All Dps", value: 68 },
      { id: "view-dps-details", label: "View Dps Details", value: 69 },
    ],
  },
  {
    title: "FDR Management",
    id: "FDRManagement",
    permissions: [
      { id: "fdr-plan-list", label: "Fdr Plan List", value: 70 },
      { id: "fdr-plan-create", label: "Fdr Plan Create", value: 71 },
      { id: "fdr-plan-edit", label: "Fdr Plan Edit", value: 72 },
      { id: "fdr-plan-delete", label: "Fdr Plan Delete", value: 73 },
      { id: "running-fdr", label: "Running Fdr", value: 74 },
      { id: "due-fdr", label: "Due Fdr", value: 75 },
      { id: "closed-fdr", label: "Closed Fdr", value: 76 },
      { id: "all-fdr", label: "All Fdr", value: 77 },
      { id: "view-fdr-details", label: "View Fdr Details", value: 78 },
    ],
  },
  {
    title: "Loan Management",
    id: "LoanManagement",
    permissions: [
      { id: "loan-plan-list", label: "Loan Plan List", value: 79 },
      { id: "loan-plan-create", label: "Loan Plan Create", value: 80 },
      { id: "loan-plan-edit", label: "Loan Plan Edit", value: 81 },
      { id: "loan-plan-delete", label: "Loan Plan Delete", value: 82 },
      { id: "pending-loan", label: "Pending Loan", value: 83 },
      { id: "running-loan", label: "Running Loan", value: 84 },
      { id: "due-loan", label: "Due Loan", value: 85 },
      { id: "paid-loan", label: "Paid Loan", value: 86 },
      { id: "rejected-loan", label: "Rejected Loan", value: 87 },
      { id: "all-loan", label: "All Loan", value: 88 },
      { id: "view-loan-details", label: "View Loan Details", value: 89 },
      { id: "loan-approval", label: "Loan Approval", value: 90 },
    ],
  },
  {
    title: "Bill Management",
    id: "BillManagement",
    permissions: [
      { id: "bill-service-import", label: "Bill Service Import", value: 91 },
      { id: "bill-service-list", label: "Bill Service List", value: 92 },
      { id: "bill-service-edit", label: "Bill Service Edit", value: 93 },
      { id: "bill-convert-rate", label: "Bill Convert Rate", value: 94 },
      { id: "all-bills", label: "All Bills", value: 95 },
      { id: "pending-bills", label: "Pending Bills", value: 96 },
      { id: "complete-bills", label: "Complete Bills", value: 97 },
      { id: "return-bills", label: "Return Bills", value: 98 },
    ],
  },
  {
    title: "Deposit Management",
    id: "DepositManagement",
    permissions: [
      { id: "automatic-gateway-manage", label: "Automatic Gateway Manage", value: 99 },
      { id: "manual-gateway-manage", label: "Manual Gateway Manage", value: 100 },
      { id: "deposit-list", label: "Deposit List", value: 101 },
      { id: "deposit-action", label: "Deposit Action", value: 102 },
    ],
  },
  {
    title: "Withdraw Management",
    id: "WithdrawManagement",
    permissions: [
      { id: "withdraw-list", label: "Withdraw List", value: 103 },
      { id: "withdraw-method-manage", label: "Withdraw Method Manage", value: 104 },
      { id: "withdraw-action", label: "Withdraw Action", value: 105 },
      { id: "withdraw-schedule", label: "Withdraw Schedule", value: 106 },
    ],
  },
  {
    title: "Portfolio Management",
    id: "PortfolioManagement",
    permissions: [
      { id: "manage-portfolio", label: "Manage Portfolio", value: 107 },
      { id: "portfolio-create", label: "Portfolio Create", value: 108 },
      { id: "portfolio-edit", label: "Portfolio Edit", value: 109 },
    ],
  },
  {
    title: "Referral Management",
    id: "ReferralManagement",
    permissions: [
      { id: "manage-referral", label: "Manage Referral", value: 110 },
      { id: "referral-create", label: "Referral Create", value: 111 },
      { id: "referral-edit", label: "Referral Edit", value: 112 },
      { id: "referral-delete", label: "Referral Delete", value: 113 },
    ],
  },
  {
    title: "Reward Management",
    id: "RewardManagement",
    permissions: [
      { id: "reward-earning-list", label: "Reward Earning List", value: 114 },
      { id: "reward-earning-create", label: "Reward Earning Create", value: 115 },
      { id: "reward-earning-edit", label: "Reward Earning Edit", value: 116 },
      { id: "reward-earning-delete", label: "Reward Earning Delete", value: 117 },
      { id: "reward-redeem-list", label: "Reward Redeem List", value: 118 },
      { id: "reward-redeem-create", label: "Reward Redeem Create", value: 119 },
      { id: "reward-redeem-edit", label: "Reward Redeem Edit", value: 120 },
      { id: "reward-redeem-delete", label: "Reward Redeem Delete", value: 121 },
    ],
  },
  {
    title: "Frontend Management",
    id: "FrontendManagement",
    permissions: [
      { id: "landing-page-manage", label: "Landing Page Manage", value: 122 },
      { id: "page-manage", label: "Page Manage", value: 123 },
      { id: "footer-manage", label: "Footer Manage", value: 124 },
      { id: "navigation-manage", label: "Navigation Manage", value: 125 },
      { id: "custom-css", label: "Custom Css", value: 126 },
    ],
  },
  {
    title: "Subscriber Management",
    id: "SubscriberManagement",
    permissions: [
      { id: "subscriber-list", label: "Subscriber List", value: 127 },
      { id: "subscriber-mail-send", label: "Subscriber Mail Send", value: 128 },
    ],
  },
  {
    title: "Support Ticket Management",
    id: "SupportTicketManagement",
    permissions: [
      { id: "support-ticket-list", label: "Support Ticket List", value: 129 },
      { id: "support-ticket-action", label: "Support Ticket Action", value: 130 },
    ],
  },
  {
    title: "Setting Management",
    id: "SettingManagement",
    permissions: [
      { id: "site-setting", label: "Site Setting", value: 131 },
      { id: "email-setting", label: "Email Setting", value: 132 },
      { id: "plugin-setting", label: "Plugin Setting", value: 133 },
      { id: "language-setting", label: "Language Setting", value: 134 },
      { id: "page-setting", label: "Page Setting", value: 135 },
      { id: "sms-setting", label: "Sms Setting", value: 136 },
      { id: "push-notification-setting", label: "Push Notification Setting", value: 137 },
      { id: "notification-tune-setting", label: "Notification Tune Setting", value: 138 },
    ],
  },
  {
    title: "Template Management",
    id: "TemplateManagement",
    permissions: [
      { id: "sms-template", label: "Sms Template", value: 139 },
      { id: "email-template", label: "Email Template", value: 140 },
      { id: "push-notification-template", label: "Push Notification Template", value: 141 },
    ],
  },
  {
    title: "System Management",
    id: "SystemManagement",
    permissions: [
      { id: "manage-cron-job", label: "Manage Cron Job", value: 142 },
      { id: "cron-job-create", label: "Cron Job Create", value: 143 },
      { id: "cron-job-edit", label: "Cron Job Edit", value: 144 },
      { id: "cron-job-delete", label: "Cron Job Delete", value: 145 },
      { id: "cron-job-logs", label: "Cron Job Logs", value: 146 },
      { id: "cron-job-run", label: "Cron Job Run", value: 147 },
      { id: "clear-cache", label: "Clear Cache", value: 148 },
      { id: "application-details", label: "Application Details", value: 149 },
    ],
  },
  {
    title: "Wallet Management",
    id: "WalletManagement",
    permissions: [
      { id: "wallet-list", label: "Wallet List", value: 156 },
    ],
  },
  {
    title: "Virtual Card Management",
    id: "VirtualCardManagement",
    permissions: [
      { id: "virtual-card-list", label: "Virtual Card List", value: 157 },
      { id: "virtual-card-topup", label: "Virtual Card Topup", value: 158 },
      { id: "virtual-card-status-change", label: "Virtual Card Status Change", value: 159 },
    ],
  },
  {
    title: "App Setting Management",
    id: "AppSettingManagement",
    permissions: [
      { id: "app-settings", label: "App Settings", value: 160 },
    ],
  },
];

const AddNewRole = () => {
  const [roleName, setRoleName] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const togglePermission = (value: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Role Name:", roleName);
    console.log("Selected Permissions:", selectedPermissions);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Add New Role
        </h1>
        <Link
          to="/access/roles"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
          {/* Role Name Input */}
          <div className="mb-8">
            <label
              htmlFor="roleName"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter role name"
            />
          </div>

          {/* All Permissions Section */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                All Permissions
              </h3>
            </div>

            <div className="p-6">
              {/* Accordions */}
              <div className="space-y-3">
                {permissionCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden"
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(category.id)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left font-medium transition-colors ${
                        openAccordion === category.id
                          ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                          : "bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"
                      }`}
                    >
                      {/* Checkbox Icon */}
                      <span
                        className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                          openAccordion === category.id
                            ? "bg-indigo-600 border-indigo-600"
                            : "bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500"
                        }`}
                      >
                        {openAccordion === category.id && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1">{category.title}</span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          openAccordion === category.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Accordion Body */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openAccordion === category.id
                          ? "max-h-[2000px]"
                          : "max-h-0"
                      }`}
                    >
                      <div className="p-4 bg-white dark:bg-slate-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {category.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                            >
                              <label
                                htmlFor={permission.id}
                                className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                {permission.label}
                              </label>
                              <input
                                type="checkbox"
                                id={permission.id}
                                checked={selectedPermissions.includes(
                                  permission.value
                                )}
                                onChange={() =>
                                  togglePermission(permission.value)
                                }
                                className="w-5 h-5 text-indigo-600 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Add New Role
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewRole;
