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

  // sample paybacks data (will be replaced by real data/API)
  const paybacks = [
    {
      date: '20 Jun 2024, 12:46 AM',
      amount: '+8 USD',
      amountClass: 'text-emerald-600',
      type: 'Signup Bonus',
      from: 'System',
      description: 'Signup Bonus',
    },
  ];

  

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
                {/* Centered Profile Layout */}
                <div className="flex flex-col items-center text-center">
                  {/* Avatar with larger size */}
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg">
                      {customer?.initials ?? 'U'}
                    </div>
                  </div>

                  {/* User Info - Centered */}
                  <div className="mt-4 w-full">
                    <h2 className="font-bold text-lg sm:text-xl text-slate-900 break-words">{customer?.name || 'User Name'}</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      A/C: <span className="font-semibold">{customer?.account ?? 'N/A'}</span>
                    </p>
                    <p className="text-sm text-slate-500 break-all mt-1">{customer?.email}</p>
                    <p className="text-xs text-slate-400 mt-2">Last Login: 20-06-2024 00:46:02</p>
                  </div>

                  {/* Action Buttons Row - Centered */}
                  <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                    <button type="button" title="Send mail" aria-label="Send mail" onClick={() => setShowMailModal(true)} className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-slate-800 hover:bg-slate-900 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>

                    <button type="button" title="Login as user" aria-label="Login as user" className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>

                    <button type="button" title="Wallet" aria-label="Wallet" className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path>
                      </svg>
                    </button>

                    <button type="button" title="Delete" aria-label="Delete" onClick={() => setShowDelete(true)} className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-rose-500 hover:bg-rose-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm opacity-90 mb-1">Default Wallet</div>
                    <div className="text-xl sm:text-2xl font-bold">USD</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl sm:text-3xl font-bold">$8</div>
                    <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm2 2h12v2H6V8zm0 4h8v2H6v-2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6 text-center">
                <div className="mb-4 text-sm sm:text-base font-semibold text-slate-900">Subscribe DPS, FDR & Loan</div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button className="px-5 sm:px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors shadow-md">DPS</button>
                  <button className="px-5 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md">FDR</button>
                  <button className="px-5 sm:px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md">Loan</button>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h5 className="text-sm font-semibold mb-3">Account Informations</h5>
                <form className="space-y-4">
                  {/* Account status radio group */}
                  <div>
                    <div className="text-xs font-medium mb-2">Account Status</div>
                    <div className="flex gap-2 flex-wrap">
                      <label className={`px-2 sm:px-3 py-2 border rounded text-xs sm:text-sm ${true ? 'bg-white' : ''}`}><input type="radio" name="status" /> Active</label>
                      <label className={`px-2 sm:px-3 py-2 border rounded bg-gray-100 text-xs sm:text-sm`}><input type="radio" name="status" defaultChecked /> Disabled</label>
                      <label className={`px-2 sm:px-3 py-2 border rounded text-xs sm:text-sm`}><input type="radio" name="status" /> Closed</label>
                    </div>
                  </div>

                  {/* Verification groups: Email, KYC, 2FA, OTP etc. (radio-like) */}
                  <div>
                    <div className="text-xs font-medium mb-2">Email Verification</div>
                    <div className="flex gap-2 flex-wrap">
                      <label className="px-2 sm:px-3 py-2 border rounded text-xs sm:text-sm"><input type="radio" name="email_verified" /> Verified</label>
                      <label className="px-2 sm:px-3 py-2 border rounded bg-gray-100 text-xs sm:text-sm"><input type="radio" name="email_verified" defaultChecked /> Unverified</label>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-2">KYC Verification</div>
                    <div className="flex gap-2 flex-wrap">
                      <label className="px-2 sm:px-3 py-2 border rounded text-xs sm:text-sm"><input type="radio" name="kyc" /> Verified</label>
                      <label className="px-2 sm:px-3 py-2 border rounded bg-gray-100 text-xs sm:text-sm"><input type="radio" name="kyc" defaultChecked /> Unverified</label>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-2">2FA Verification</div>
                    <div className="flex gap-2 flex-wrap">
                      <label className="px-2 sm:px-3 py-2 border rounded text-xs sm:text-sm"><input type="radio" name="two_fa" /> Active</label>
                      <label className="px-2 sm:px-3 py-2 border rounded bg-gray-100 text-xs sm:text-sm"><input type="radio" name="two_fa" defaultChecked /> Disabled</label>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-2">OTP Verification</div>
                    <div className="flex gap-2 flex-wrap">
                      <label className="px-2 sm:px-3 py-2 border rounded bg-gray-100 text-xs sm:text-sm"><input type="radio" name="otp_status" defaultChecked /> Active</label>
                      <label className="px-2 sm:px-3 py-2 border rounded text-xs sm:text-sm"><input type="radio" name="otp_status" /> Disabled</label>
                    </div>
                  </div>

                  {/* Additional status groups (Deposit, Withdraw etc.) */}
                  {['Deposit Status','Withdraw Status','Fund Transfer Status','DPS Status','FDR Status','Loan Status','Pay Bill Status','Portfolio Status','Reward Status','Referral Status'].map((label) => (
                    <div key={label}>
                      <div className="text-xs font-medium mb-2">{label}</div>
                      <div className="flex gap-2 flex-wrap">
                        <label className="px-2 sm:px-3 py-2 border rounded bg-gray-100 text-xs sm:text-sm"><input type="radio" defaultChecked /> Active</label>
                        <label className="px-2 sm:px-3 py-2 border rounded text-xs sm:text-sm"><input type="radio" /> Disabled</label>
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
                  ['Total Fund Transfer','$0','bg-blue-600'],
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
                <ul className="flex gap-2 flex-wrap mb-4 overflow-x-auto">
                    {tabs.map((t) => (
                      <li key={t}>
                        <button type="button" onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded text-sm whitespace-nowrap ${activeTab === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-slate-700'}`}>
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Tab content */}
                  <div className="bg-white overflow-hidden">
                    {activeTab === 'Information' && (
                      <div>
                        {/* Basic Info card (converted from provided HTML) */}
                        <div className="site-card mb-4">
                          <div className="site-card-header">
                            <h3 className="title text-base md:text-lg">Basic Info</h3>
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
                            <h3 className="title text-base md:text-lg">Change Password</h3>
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
                      <div className="tab-pane p-0">
                        <div className="site-card">
                          <div className="site-card-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <h4 className="title text-base md:text-lg">Paybacks</h4>
                            <div className="card-header-info bg-emerald-100 text-emerald-800 rounded-full px-4 py-1 text-xs sm:text-sm whitespace-nowrap">Total Payback: {(() => {
                              const total = paybacks.reduce((s, p) => s + Math.abs(parseFloat(String(p.amount).replace(/[^0-9.-]+/g, ''))), 0);
                              return `${total} USD`;
                            })()}</div>
                          </div>

                          <div className="site-card-body">
                            <div className="mb-4 bg-white border rounded p-4">
                              <form className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4" onSubmit={(e) => e.preventDefault()}>
                                <label className="text-xs font-semibold uppercase whitespace-nowrap">Search:</label>
                                <input className="border rounded p-2 w-full sm:w-64" type="text" name="query" defaultValue="" />
                                <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded whitespace-nowrap" type="submit">SEARCH</button>
                              </form>
                            </div>

                            <div className="site-table overflow-x-auto">
                              <table className="w-full border-collapse min-w-[600px]">
                                <thead>
                                  <tr className="bg-indigo-50">
                                    <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">Date <span className="ml-1 text-xs">↕</span></th>
                                    <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">Amount <span className="ml-1 text-xs">↕</span></th>
                                    <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">Type <span className="ml-1 text-xs">↕</span></th>
                                    <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">Payback From <span className="ml-1 text-xs">↕</span></th>
                                    <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">Description <span className="ml-1 text-xs">↕</span></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {paybacks.map((p, idx) => (
                                    <tr key={idx} className="border-b">
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm">{p.date}</td>
                                      <td className={`py-4 px-2 sm:px-4 align-top text-xs sm:text-sm ${p.amountClass ?? ''}`}><strong>{p.amount}</strong></td>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm"><span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs">{p.type}</span></td>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm"><a className="text-indigo-600" href="#">{p.from}</a></td>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm">{p.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'DPS' && (
                      <div className="p-4 text-sm text-slate-600">
                        <div className="site-card">
                          <div className="site-card-header">
                            <h4 className="title text-base md:text-lg">DPS</h4>
                          </div>
                          <div className="site-card-body table-responsive">
                            <div className="site-table">
                              <div className="table-filter mb-4">
                                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                  <input type="hidden" name="tab" value="dps" />
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold whitespace-nowrap">SEARCH:</label>
                                    <input type="text" name="query" defaultValue="" className="border rounded p-2 w-full sm:w-auto" />
                                  </div>
                                  <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                    SEARCH
                                  </button>
                                </form>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[900px]">
                                  <thead>
                                    <tr className="bg-indigo-50">
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">DATE <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">DPS <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">DPS ID <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">RATE <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">AMOUNT <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">NEXT INSTALLMENT</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">INSTALLMENTS</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">MATURED AMOUNT</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">STATUS <span className="ml-1 text-xs">↕</span></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td colSpan={9} className="text-center py-6 text-sm">No Data Found!</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'FDR' && (
                      <div className="p-4 text-sm text-slate-600">
                        <div className="site-card">
                          <div className="site-card-header">
                            <h4 className="title text-base md:text-lg">FDR</h4>
                          </div>
                          <div className="site-card-body table-responsive">
                            <div className="site-table">
                              <div className="table-filter mb-4">
                                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                  <input type="hidden" name="tab" value="fdr" />
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold whitespace-nowrap">SEARCH:</label>
                                    <input type="text" name="query" defaultValue="" className="border rounded p-2 w-full sm:w-auto" />
                                  </div>
                                  <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                    SEARCH
                                  </button>
                                </form>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[900px]">
                                  <thead>
                                    <tr className="bg-indigo-50">
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">DATE <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">FDR <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">FDR ID <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">AMOUNT <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">PROFIT</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">NEXT RECEIVE</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">RETURNS</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">PAID</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">STATUS <span className="ml-1 text-xs">↕</span></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td colSpan={9} className="text-center py-6 text-sm">No Data Found!</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Loan' && (
                      <div className="p-4 text-sm text-slate-600">
                        <div className="site-card">
                          <div className="site-card-header">
                            <h4 className="title text-base md:text-lg">Loan</h4>
                          </div>
                          <div className="site-card-body table-responsive">
                            <div className="site-table">
                              <div className="table-filter mb-4">
                                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                  <input type="hidden" name="tab" value="loan" />
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold whitespace-nowrap">SEARCH:</label>
                                    <input type="text" name="query" defaultValue="" className="border rounded p-2 w-full sm:w-auto" />
                                  </div>
                                  <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                    SEARCH
                                  </button>
                                </form>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[900px]">
                                  <thead>
                                    <tr className="bg-indigo-50">
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">DATE <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">LOAN <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">LOAN ID <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">AMOUNT <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">INSTALLMENT AMOUNT</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">NEXT PAYMENT</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">INSTALLMENT</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">PAID</th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">STATUS <span className="ml-1 text-xs">↕</span></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td colSpan={9} className="text-center py-6 text-sm">No Data Found!</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Virtual Card' && (
                      <div className="p-4 text-sm text-slate-600">
                        <div className="flex justify-center">
                          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                            <div className="rounded-2xl shadow-lg bg-gradient-to-br from-indigo-600 via-violet-500 to-purple-700 p-6 text-white relative">
                              {/* Card chip icon */}
                              <div className="absolute top-6 right-6 w-10 h-7 bg-yellow-300 rounded-md flex items-center justify-center shadow">
                                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-700">
                                  <rect x="2" y="4" width="20" height="8" rx="2" fill="currentColor" />
                                  <rect x="6" y="7" width="12" height="2" rx="1" fill="#fff" />
                                </svg>
                              </div>
                              {/* Card number */}
                              <div className="mt-8 mb-4 text-lg sm:text-xl font-mono tracking-widest select-all">1234 5678 9012 3456</div>
                              {/* Cardholder name and expiry */}
                              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                                <div>
                                  <div className="text-xs uppercase opacity-80">Card Holder</div>
                                  <div className="text-base font-semibold">{customer?.name || 'User Name'}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs uppercase opacity-80">Expires</div>
                                  <div className="text-base font-semibold">12/28</div>
                                </div>
                              </div>
                              {/* Card type */}
                              <div className="mt-6 flex items-center gap-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Virtual Card</span>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">USD</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Transactions' && (
                      <div className="p-4 text-sm text-slate-600">
                        <div className="site-card">
                          <div className="site-card-header">
                            <h4 className="title text-base md:text-lg">Transactions</h4>
                          </div>
                          <div className="site-card-body table-responsive">
                            <div className="site-table">
                              <div className="table-filter mb-4">
                                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                  <input type="hidden" name="tab" value="transactions" />
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold whitespace-nowrap">SEARCH:</label>
                                    <input type="text" name="query" defaultValue="" className="border rounded p-2 w-full sm:w-auto" />
                                  </div>
                                  <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                    SEARCH
                                  </button>
                                </form>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[900px]">
                                  <thead>
                                    <tr className="bg-indigo-50">
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">DATE <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">TRANSACTION ID <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">TYPE <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">AMOUNT <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">GATEWAY <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">STATUS <span className="ml-1 text-xs">↕</span></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm">03 Nov 2025, 04:39 PM</td>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm">TRXGBJPMBZQFE</td>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm"><span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">Signup Bonus</span></td>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm text-emerald-600 font-semibold">+8 USD</td>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm">System</td>
                                      <td className="py-4 px-2 sm:px-4 align-top text-xs sm:text-sm"><span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-semibold">Success</span></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Referral' && (
                      <div className="p-4">
                        <div className="border rounded-lg bg-white shadow-sm" style={{borderColor: '#ede9fe'}}>
                          <div className="px-4 py-3 border-b" style={{borderColor: '#ede9fe'}}>
                            <span className="font-semibold text-base text-slate-800">Referral</span>
                          </div>
                          <div className="py-8 px-4 text-center text-slate-800">
                            No Referral user found
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Ticket' && (
                      <div className="p-4 text-sm text-slate-600">
                        <div className="site-card">
                          <div className="site-card-header">
                            <h4 className="title text-base md:text-lg">Support Tickets</h4>
                          </div>
                          <div className="site-card-body table-responsive">
                            <div className="site-table">
                              <div className="table-filter mb-4">
                                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                  <input type="hidden" name="tab" value="ticket" />
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold whitespace-nowrap">SEARCH:</label>
                                    <input type="text" name="query" defaultValue="" className="border rounded p-2 w-full sm:w-auto" />
                                  </div>
                                  <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                    SEARCH
                                  </button>
                                </form>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[900px]">
                                  <thead>
                                    <tr className="bg-indigo-50">
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">TICKET NAME <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">OPENING DATE <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">STATUS <span className="ml-1 text-xs">↕</span></th>
                                      <th className="text-xs sm:text-sm text-slate-600 uppercase py-3 px-2 sm:px-4 whitespace-nowrap">ACTION</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td colSpan={4} className="py-8 px-2 sm:px-4 text-center text-slate-600 bg-indigo-50">No Data Found!</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowMailModal(false)} />
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg z-10 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">Send Email to {customer?.name}</h3>
            <form onSubmit={handleSendMail} className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm mb-1">Subject</label>
                <input value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} className="w-full border rounded p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm mb-1">Message</label>
                <textarea value={mailBody} onChange={(e) => setMailBody(e.target.value)} className="w-full border rounded p-2 h-32 text-sm" />
              </div>
              <div className="flex gap-2 justify-end flex-wrap">
                <button type="button" onClick={() => setShowMailModal(false)} className="px-4 py-2 rounded border text-sm">Close</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white text-sm">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowDelete(false)} />
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">You want to delete this user?</p>
            <div className="flex gap-2 justify-end flex-wrap">
              <button type="button" onClick={() => setShowDelete(false)} className="px-4 py-2 rounded border text-sm">Cancel</button>
              <button type="button" onClick={handleConfirmDelete} className="px-4 py-2 rounded bg-rose-500 text-white text-sm">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
