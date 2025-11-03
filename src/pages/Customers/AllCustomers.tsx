import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

import { Customer, customers } from "../../data/customers";

export default function AllCustomers() {
  const [showMailModal, setShowMailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
    // TODO: wire to API. For now just log and close.
    console.log("Send mail to:", selectedCustomer, { subject, message });
    closeMailModal();
  }

  return (
    <>
      <PageMeta title="All Customers - Admin" description="All customers listing" />
      <PageBreadcrumb pageTitle="All Customers" />

      <div className="p-4 md:p-6">
        {/* Filters card */}
        <div className="bg-white border rounded-lg p-4 md:p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-3">
            <input
              type="text"
              name="query"
              placeholder="SEARCH"
              className="w-full md:w-64 border rounded px-3 py-2 text-sm focus:outline-none"
            />

            <select className="border rounded px-3 py-2 text-sm w-full md:w-48">
              <option>Filter By Email St</option>
              <option>Email Verified</option>
              <option>Email Unverified</option>
            </select>

            <select className="border rounded px-3 py-2 text-sm w-full md:w-48">
              <option>Filter By KYC</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>

            <select className="border rounded px-3 py-2 text-sm w-full md:w-48">
              <option>Filter By Status</option>
              <option>Active</option>
              <option>Disabled</option>
            </select>

            <button className="ml-auto md:ml-0 bg-purple-600 text-white px-4 py-2 rounded text-sm">SEARCH</button>
          </div>
        </div>

        {/* Table (desktop) */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full hidden md:table">
            <thead className="bg-[#f4eef9] text-sm">
              <tr>
                <th className="px-4 py-3 text-left">AVATAR</th>
                <th className="px-4 py-3 text-left">USER</th>
                <th className="px-4 py-3 text-left">EMAIL</th>
                <th className="px-4 py-3 text-left">ACCOUNT NUMBER</th>
                <th className="px-4 py-3 text-left">BALANCE</th>
                <th className="px-4 py-3 text-left">PAYBACK</th>
                <th className="px-4 py-3 text-left">EMAIL STATUS</th>
                <th className="px-4 py-3 text-left">KYC</th>
                <th className="px-4 py-3 text-left">STATUS</th>
                <th className="px-4 py-3 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: c.avatarColor }}>{c.initials}</div>
                  </td>
                  <td className="px-4 py-4">
                    <a href={`#/user/${c.id}`} className="text-purple-600 font-semibold">{c.name}</a>
                  </td>
                  <td className="px-4 py-4 max-w-[260px] truncate">{c.email}</td>
                  <td className="px-4 py-4">{c.account}</td>
                  <td className="px-4 py-4">{c.balance}</td>
                  <td className="px-4 py-4">{c.payback}</td>
                  <td className="px-4 py-4"><span className="inline-block bg-yellow-400 text-xs text-yellow-900 px-3 py-1 rounded-full">{c.emailStatus}</span></td>
                  <td className="px-4 py-4"><span className="inline-block bg-yellow-400 text-xs text-yellow-900 px-3 py-1 rounded-full">{c.kyc}</span></td>
                  <td className="px-4 py-4"><span className="inline-block bg-emerald-500 text-sm text-white px-3 py-1 rounded-full">{c.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openMailModal(c)} className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center">✉</button>
                      <button onClick={() => navigate(`/customers/edit/${c.id}`)} className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center">✎</button>
                      <button className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y">
            {customers.map((c) => (
              <div key={c.id} className="p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: c.avatarColor }}>{c.initials}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <a className="text-purple-600 font-semibold">{c.name}</a>
                    <span className="inline-block bg-emerald-500 text-sm text-white px-3 py-1 rounded-full">{c.status}</span>
                  </div>
                  <div className="text-sm text-slate-600 truncate mt-1">{c.email}</div>
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <span className="inline-block bg-yellow-400 text-xs text-yellow-900 px-3 py-1 rounded-full">{c.emailStatus}</span>
                    <span className="inline-block bg-yellow-400 text-xs text-yellow-900 px-3 py-1 rounded-full">{c.kyc}</span>
                    <div className="ml-auto flex gap-2">
                      <button onClick={() => openMailModal(c)} className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center">✉</button>
                      <button onClick={() => navigate(`/customers/edit/${c.id}`)} className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center">✎</button>
                      <button className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center">🗑</button>
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
            <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">Send Mail to {selectedCustomer?.name}</h3>
                <button onClick={closeMailModal} className="text-slate-500 hover:text-slate-700 text-2xl leading-none">×</button>
              </div>

              <form onSubmit={handleSendMail}>
                <label className="block text-sm text-slate-600 mb-2">Subject:</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  type="text"
                  className="w-full border rounded px-3 py-2 mb-4"
                />

                <label className="block text-sm text-slate-600 mb-2">Email Details</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full border rounded px-3 py-2 mb-4"
                />

                <div className="flex items-center gap-3">
                  <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    <span className="text-lg">✈</span>
                    <span>Send Email</span>
                  </button>
                  <button type="button" onClick={closeMailModal} className="bg-pink-500 text-white px-4 py-2 rounded">× Close</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
