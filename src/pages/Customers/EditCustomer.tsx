import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Customer, customers } from "../../data/customers";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);

  // form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  
  const [country, setCountry] = useState("Afghanistan");
  // tabs for right column
  const tabs = ['Information','Paybacks','DPS','FDR','Loan','Virtual Card','Transactions','Referral','Ticket'];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  // mail modal state
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  // delete confirmation
  const [showDelete, setShowDelete] = useState(false);
  // verification states (placeholders)
  // currently these are reflected in the form controls; wire to API as needed

  useEffect(() => {
    if (!id) return;
    const cid = Number(id);
    const found = customers.find((c) => c.id === cid) || null;
    setCustomer(found);
    if (found) {
      // split name into first/last roughly
      const parts = found.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(found.email);
      setMobile("");
        // initialize any verification-related UI from found data if needed
    }
  }, [id]);

  

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to API to save user details
  console.log("Save user:", { firstName, lastName, email, mobile, country });
    navigate(-1);
  }

  // Mail modal handlers
  function handleSendMail(e: React.FormEvent) {
    e.preventDefault();
    console.log("Send mail to:", customer?.email, { subject: mailSubject, body: mailBody });
    setMailSubject("");
    setMailBody("");
    setShowMailModal(false);
  }

  function handleConfirmDelete() {
    // TODO: perform deletion (API or in-memory)
    console.log("Delete user:", customer?.id);
    setShowDelete(false);
    navigate(-1);
  }

  return (
    <>
      <PageMeta title={`Edit Customer - ${customer?.name || "User"}`} description="Edit customer details" />
      <PageBreadcrumb pageTitle={`User Detail - ${customer?.name || "User"}`} />

      <div className="p-4 md:p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column: profile, wallet, subscribe and status form */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-700 flex items-center justify-center text-white font-semibold text-xl">{customer?.initials ?? 'U'}</div>
                  <div>
                    <div className="font-semibold text-lg">{customer?.name || 'User Name'}</div>
                    <div className="text-sm text-slate-500">A/C: <strong>{customer?.account ?? 'N/A'}</strong></div>
                    <div className="text-sm text-slate-400">{customer?.email}</div>
                    <div className="text-xs text-slate-400 mt-2">Last Login: 20-06-2024 00:46:02</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button type="button" title="Send mail" aria-label="Send mail" onClick={() => setShowMailModal(true)} className="w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white bg-[#0b1b36]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>

                  <button type="button" title="Login as user" aria-label="Login as user" className="w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white bg-emerald-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 20a7 7 0 0114 0" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 8v6M16 11h6" />
                    </svg>
                  </button>

                  <button type="button" title="Wallet" aria-label="Wallet" className="w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white bg-violet-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="2" y="7" width="20" height="12" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"></rect>
                      <path d="M16 3v4" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M21 13h-6" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </button>

                  <button type="button" title="Delete" aria-label="Delete" onClick={() => setShowDelete(true)} className="w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white bg-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Default Wallet</div>
                    <div className="text-lg font-bold">USD</div>
                  </div>
                  <div className="text-xl font-bold">$8</div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="mb-3 text-sm font-semibold">Subscribe DPS, FDR &amp; Loan</div>
                <div className="flex gap-2 justify-center">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded">DPS</button>
                  <button className="px-4 py-2 bg-sky-600 text-white rounded">FDR</button>
                  <button className="px-4 py-2 bg-rose-500 text-white rounded">Loan</button>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h5 className="text-sm font-semibold mb-3">Account Informations</h5>
                <form className="space-y-4">
                  {/* Account status radio group */}
                  <div>
                    <div className="text-xs font-medium mb-2">Account Status</div>
                    <div className="flex gap-2">
                      <label className={`px-3 py-2 border rounded ${true ? 'bg-white' : ''}`}><input type="radio" name="status" /> Active</label>
                      <label className={`px-3 py-2 border rounded bg-gray-100`}><input type="radio" name="status" defaultChecked /> Disabled</label>
                      <label className={`px-3 py-2 border rounded`}><input type="radio" name="status" /> Closed</label>
                    </div>
                  </div>

                  {/* Verification groups: Email, KYC, 2FA, OTP etc. (radio-like) */}
                  <div>
                    <div className="text-xs font-medium mb-2">Email Verification</div>
                    <div className="flex gap-2">
                      <label className="px-3 py-2 border rounded"><input type="radio" name="email_verified" /> Verified</label>
                      <label className="px-3 py-2 border rounded bg-gray-100"><input type="radio" name="email_verified" defaultChecked /> Unverified</label>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-2">KYC Verification</div>
                    <div className="flex gap-2">
                      <label className="px-3 py-2 border rounded"><input type="radio" name="kyc" /> Verified</label>
                      <label className="px-3 py-2 border rounded bg-gray-100"><input type="radio" name="kyc" defaultChecked /> Unverified</label>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-2">2FA Verification</div>
                    <div className="flex gap-2">
                      <label className="px-3 py-2 border rounded"><input type="radio" name="two_fa" /> Active</label>
                      <label className="px-3 py-2 border rounded bg-gray-100"><input type="radio" name="two_fa" defaultChecked /> Disabled</label>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-2">OTP Verification</div>
                    <div className="flex gap-2">
                      <label className="px-3 py-2 border rounded bg-gray-100"><input type="radio" name="otp_status" defaultChecked /> Active</label>
                      <label className="px-3 py-2 border rounded"><input type="radio" name="otp_status" /> Disabled</label>
                    </div>
                  </div>

                  {/* Additional status groups (Deposit, Withdraw etc.) */}
                  {['Deposit Status','Withdraw Status','Fund Transfer Status','DPS Status','FDR Status','Loan Status','Pay Bill Status','Portfolio Status','Reward Status','Referral Status'].map((label) => (
                    <div key={label}>
                      <div className="text-xs font-medium mb-2">{label}</div>
                      <div className="flex gap-2">
                        <label className="px-3 py-2 border rounded bg-gray-100"><input type="radio" defaultChecked /> Active</label>
                        <label className="px-3 py-2 border rounded"><input type="radio" /> Disabled</label>
                      </div>
                    </div>
                  ))}

                  <div>
                    <button type="button" className="w-full bg-indigo-600 text-white py-2 rounded">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right column: metrics tiles, tabs, and forms */}
            <div className="lg:col-span-9 space-y-6">
              {/* Metrics tiles grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  ['Total Deposit','$0','bg-purple-600'],
                  ['Total Fund Transfer','$0','bg-violet-600'],
                  ['Total DPS','$0','bg-emerald-500'],
                  ['Total FDR','$0','bg-cyan-700'],
                  ['Total Loan','$0','bg-sky-900'],
                  ['Total Pay Bill','$0','bg-red-600'],
                  ['Total Withdraw','$0','bg-orange-500'],
                  ['Total Paybacks','$8','bg-purple-800'],
                  ['Digi Member','Portfolio','bg-slate-800'],
                  ['All Referral','0','bg-emerald-400'],
                  ['All Reward Points','0','bg-purple-600'],
                  ['Tickets','0','bg-sky-700'],
                ].map((m, idx) => (
                  <div key={idx} className={`${m[2]} text-white rounded p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">●</div>
                      <div>
                        <div className="text-sm opacity-90">{m[0]}</div>
                        <div className="text-xl font-bold">{m[1]}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabs (simple) */}
              <div className="bg-white border rounded-lg p-4">
                <ul className="flex gap-2 flex-wrap mb-4">
                    {tabs.map((t) => (
                      <li key={t}>
                        <button type="button" onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded ${activeTab === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-slate-700'}`}>
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Tab content */}
                  <div className="bg-white">
                    {activeTab === 'Information' && (
                      <div>
                        {/* Basic Info card (converted from provided HTML) */}
                        <div className="site-card mb-4">
                          <div className="site-card-header">
                            <h3 className="title">Basic Info</h3>
                          </div>
                          <div className="site-card-body">
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm mb-1">First Name:</label>
                                  <input type="text" className="w-full border rounded p-2" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Last Name:</label>
                                  <input type="text" className="w-full border rounded p-2" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Country:</label>
                                  <select name="country" id="country" className="w-full border rounded p-2" value={country} onChange={(e)=>setCountry(e.target.value)}>
                                    <option value="">Select Country</option>
                                    <option value="Afghanistan">Afghanistan</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm mb-1">Branch:</label>
                                  <select name="branch_id" className="w-full border rounded p-2"><option value="">Select Branch:</option><option value="1">US Branch</option><option value="2">UK Branch</option></select>
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Phone:</label>
                                  <input type="text" className="w-full border rounded p-2 bg-gray-50" value={mobile} disabled />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Username:</label>
                                  <input type="text" className="w-full border rounded p-2" defaultValue={customer?.name?.toLowerCase().replace(/\s+/g,'') || ''} />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm mb-1">Email:</label>
                                  <input type="email" className="w-full border rounded p-2 bg-gray-50" value={email} disabled />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Gender:</label>
                                  <select name="gender" className="w-full border rounded p-2"><option>Male</option><option>Female</option><option>Other</option></select>
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Date of Birth:</label>
                                  <input type="date" className="w-full border rounded p-2" />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm mb-1">City:</label>
                                  <input type="text" name="city" className="w-full border rounded p-2" />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Zip Code:</label>
                                  <input type="text" name="zip_code" className="w-full border rounded p-2" />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Address:</label>
                                  <input type="text" name="address" className="w-full border rounded p-2" />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm mb-1">Joining Date:</label>
                                  <input type="text" className="w-full border rounded p-2 bg-gray-50" value="20 Jun 2024 12:46 AM" disabled />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Referred By:</label>
                                  <input type="text" className="w-full border rounded p-2 bg-gray-50" disabled />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Portfolio Remarks:</label>
                                  <input type="text" className="w-full border rounded p-2 bg-gray-50" defaultValue="Level 1 - Digi Member" disabled />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm mb-1">NID No.</label>
                                  <input type="text" name="nid" className="w-full border rounded p-2" />
                                </div>
                                <div className="md:col-span-2" />
                              </div>

                              <div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded">Save Changes</button>
                              </div>
                            </form>
                          </div>
                        </div>

                        {/* Change Password card (also part of Information tab in provided HTML) */}
                        <div className="site-card">
                          <div className="site-card-header">
                            <h3 className="title">Change Password</h3>
                          </div>
                          <div className="site-card-body">
                            <form>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm mb-1">New Password:</label>
                                  <input type="password" name="new_password" className="w-full border rounded p-2" />
                                </div>
                                <div>
                                  <label className="block text-sm mb-1">Confirm Password:</label>
                                  <input type="password" name="new_confirm_password" className="w-full border rounded p-2" />
                                </div>
                              </div>
                              <div className="mt-4">
                                <button type="button" className="w-full bg-indigo-600 text-white py-2 rounded">Change Password</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Paybacks' && (
                      <div className="p-4 text-sm text-slate-600">Paybacks content placeholder.</div>
                    )}

                    {activeTab === 'DPS' && (
                      <div className="p-4 text-sm text-slate-600">DPS content placeholder.</div>
                    )}

                    {activeTab === 'FDR' && (
                      <div className="p-4 text-sm text-slate-600">FDR content placeholder.</div>
                    )}

                    {activeTab === 'Loan' && (
                      <div className="p-4 text-sm text-slate-600">Loan content placeholder.</div>
                    )}

                    {activeTab === 'Virtual Card' && (
                      <div className="p-4 text-sm text-slate-600">Virtual Card content placeholder.</div>
                    )}

                    {activeTab === 'Transactions' && (
                      <div className="p-4 text-sm text-slate-600">Transactions content placeholder.</div>
                    )}

                    {activeTab === 'Referral' && (
                      <div className="p-4 text-sm text-slate-600">Referral content placeholder.</div>
                    )}

                    {activeTab === 'Ticket' && (
                      <div className="p-4 text-sm text-slate-600">Ticket content placeholder.</div>
                    )}
                  </div>
              </div>

              {/* (Change Password moved inside Information tab) */}
            </div>
          </div>
        </div>
      </div>
      {/* Mail Modal */}
      {showMailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowMailModal(false)} />
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg z-10 p-4">
            <h3 className="text-lg font-semibold mb-2">Send Email to {customer?.name}</h3>
            <form onSubmit={handleSendMail} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Subject</label>
                <input value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Message</label>
                <textarea value={mailBody} onChange={(e) => setMailBody(e.target.value)} className="w-full border rounded p-2 h-32" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowMailModal(false)} className="px-4 py-2 rounded border">Close</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowDelete(false)} />
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md z-10 p-4">
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-sm text-slate-600 mb-4">You want to delete this user?</p>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowDelete(false)} className="px-4 py-2 rounded border">Cancel</button>
              <button type="button" onClick={handleConfirmDelete} className="px-4 py-2 rounded bg-rose-500 text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
