import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

import { Customer, customers } from "../../data/customers";

export default function ActiveCustomers() {
  const [showMailModal, setShowMailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Filter only active customers
  const activeCustomers = customers.filter(c => c.status.toLowerCase() === 'active');

  function openMailModal(c: Customer) {
    setSelectedCustomer(c);
    setSubject("");
    setMessage("");
    setShowMailModal(true);
  }

  function closeMailModal() {
    setShowMailModal(false);
    setSelectedCustomer(null);
  }

  function handleSendMail(e: React.FormEvent) {
    e.preventDefault();
    console.log("Send mail to:", selectedCustomer, { subject, message });
    closeMailModal();
  }

  return (
    <>
      <PageMeta title="Active Customers - Admin" description="Active customers listing" />
      <PageBreadcrumb pageTitle="Active Customers" />

      <div className="w-full max-w-full overflow-x-hidden">
        {/* Filters card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-5 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <input
              type="text"
              name="query"
              placeholder="SEARCH"
              className="w-full md:w-auto md:flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />

            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option>Filter By Email St</option>
              <option>Email Verified</option>
              <option>Email Unverified</option>
            </select>

            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option>Filter By KYC</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>

            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option>Filter By Status</option>
              <option>Active</option>
              <option>Disabled</option>
            </select>

            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              SEARCH
            </button>
          </div>
        </div>

        {/* Table (desktop) with horizontal scroll */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] hidden md:table">
              <thead className="bg-[#ede9fe] dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    AVATAR
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    USER <span className="ml-1">⇅</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    EMAIL <span className="ml-1">⇅</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    ACCOUNT NUMBER <span className="ml-1">⇅</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    BALANCE <span className="ml-1">⇅</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    PAYBACK
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    EMAIL STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    KYC
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    STATUS <span className="ml-1">⇅</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {activeCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase" 
                        style={{ backgroundColor: c.avatarColor }}
                      >
                        {c.initials}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <a href={`#/user/${c.id}`} className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium text-sm">
                        {c.name}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                      {c.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {c.account}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {c.balance}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {c.payback}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-medium">
                        {c.emailStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-medium">
                        {c.kyc}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openMailModal(c)} 
                          className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
                          title="Send Email"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={() => navigate(`/customers/edit/${c.id}`)} 
                          className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                          title="Edit Customer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                            <path d="m15 5 4 4"></path>
                          </svg>
                        </button>
                        <button 
                          className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                          title="Delete Customer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {activeCustomers.map((c) => (
              <div key={c.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase flex-shrink-0" 
                    style={{ backgroundColor: c.avatarColor }}
                  >
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <a className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium text-sm break-words">
                        {c.name}
                      </a>
                      <span className="inline-block bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                        {c.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 break-all mb-2">
                      {c.email}
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                      <div className="mb-1"><span className="font-medium">Account:</span> {c.account}</div>
                      <div className="flex gap-4">
                        <span><span className="font-medium">Balance:</span> {c.balance}</span>
                        <span><span className="font-medium">Payback:</span> {c.payback}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-3">
                      <span className="inline-block bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-medium">
                        {c.emailStatus}
                      </span>
                      <span className="inline-block bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-medium">
                        {c.kyc}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openMailModal(c)} 
                        className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => navigate(`/customers/edit/${c.id}`)} 
                        className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                          <path d="m15 5 4 4"></path>
                        </svg>
                      </button>
                      <button 
                        className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination (simple) */}
        <div className="mt-4 flex justify-end">
          <nav>
            <ul className="inline-flex items-center -space-x-px">
              <li><button className="px-3 py-1 border rounded-l">Prev</button></li>
              <li><button className="px-3 py-1 border">1</button></li>
              <li><button className="px-3 py-1 border">2</button></li>
              <li><button className="px-3 py-1 border">3</button></li>
              <li><button className="px-3 py-1 border rounded-r">Next</button></li>
            </ul>
          </nav>
        </div>

        {/* Mail modal */}
        {showMailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeMailModal} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg mx-4 p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Send Mail to {selectedCustomer?.name}</h3>
                <button onClick={closeMailModal} className="text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 text-2xl leading-none">×</button>
              </div>

              <form onSubmit={handleSendMail}>
                <label className="block text-sm text-slate-600 dark:text-gray-300 mb-2">Subject:</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />

                <label className="block text-sm text-slate-600 dark:text-gray-300 mb-2">Email Details</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />

                <div className="flex items-center gap-3">
                  <button type="submit" className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                    <span className="text-lg">✈</span>
                    <span>Send Email</span>
                  </button>
                  <button type="button" onClick={closeMailModal} className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded">× Close</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
