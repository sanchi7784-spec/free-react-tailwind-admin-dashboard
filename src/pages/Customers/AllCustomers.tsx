import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { fetchUsers, ApiUser, updateUser } from "../../api/users";
type DisplayCustomer = {
  id: number;
  initials: string;
  name: string;
  email: string | null;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  account: string;
  balance: string;
  balanceNumber?: number;
  payback: string;
  emailStatus: string;
  kyc: string;
  status: string;
  avatarColor?: string;
};
export default function AllCustomers() {
  const [showMailModal, setShowMailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<DisplayCustomer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<ApiUser | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteCustomers, setRemoteCustomers] = useState<DisplayCustomer[]>([]);
  const [allCustomers, setAllCustomers] = useState<DisplayCustomer[]>([]);
  // Filters / sorting
  const [query, setQuery] = useState("");
  const [filterEmail, setFilterEmail] = useState<string>("all");
  const [filterKyc, setFilterKyc] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  function openMailModal(c: DisplayCustomer) {
    setSelectedCustomer(c);
    setSubject("");
    setMessage("");
    setShowMailModal(true);
  }
  async function openEditModal(display: DisplayCustomer) {
    // Do not call single-user GET automatically (avoids repeated 405 logs in browser).
    setEditError(null);
    setEditingCustomer({
      user_id: display.id,
      name: display.name,
      email: display.email,
      phone: display.phone,
      dob: display.dob,
      gender: display.gender ?? null,
      status: display.status === "Active" ? 1 : 0,
      kyc_verified: display.kyc ?? null,
      wallet_balance: display.balanceNumber ?? 0,
      mpin: null,
    });
    setShowEditModal(true);
  }
  function closeEditModal() {
    setShowEditModal(false);
    setEditingCustomer(null);
    setEditError(null);
  }
  async function handleSaveEdit() {
    if (!editingCustomer) return;
    setEditSaving(true);
    setEditError(null);
    const id = editingCustomer.user_id;
    // build payload based on current editingCustomer fields
    const payload: any = {
      name: editingCustomer.name ?? undefined,
      email: editingCustomer.email ?? undefined,
      phone: editingCustomer.phone ?? undefined,
      dob: editingCustomer.dob ?? undefined,
    };

    // Include mpin only when admin provided a non-empty value
    if (editingCustomer.mpin != null && String(editingCustomer.mpin).trim() !== "") {
      payload.mpin = String(editingCustomer.mpin).trim();
    }

    const gCode = genderToCode(editingCustomer.gender);
    if (gCode !== undefined) payload.gender = gCode; // API accepts numeric code

    const sCode = statusToCode(editingCustomer.status);
    if (sCode !== undefined) payload.status = sCode;

    if (editingCustomer.wallet_balance != null && editingCustomer.wallet_balance !== undefined) {
      const w = Number(editingCustomer.wallet_balance);
      if (!Number.isNaN(w)) payload.wallet_balance = w;
    }

    try {
      await updateUser(id, payload);
      // update local list
      setRemoteCustomers((prev) => prev.map((c) => (c.id === id ? {
        ...c,
        name: editingCustomer.name ?? c.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        dob: editingCustomer.dob,
        gender: typeof editingCustomer.gender === 'number' ? mapGender(editingCustomer.gender) : mapGender(String(editingCustomer.gender)),
        balance: formatCurrency(Number(editingCustomer.wallet_balance ?? c.balanceNumber ?? 0)),
        balanceNumber: Number(editingCustomer.wallet_balance ?? c.balanceNumber ?? 0),
        status: mapStatus(editingCustomer.status),
      } : c)));

      closeEditModal();
    } catch (err: any) {
      console.error(err);
      // Extract error message from API response or error object
      let errorMsg = 'Update failed';
      if (err?.detail) {
        // Parse JSON detail from error message if present
        try {
          const match = err.detail.match(/\{.*\}/);
          if (match) {
            const jsonErr = JSON.parse(match[0]);
            errorMsg = jsonErr.detail || err.detail;
          } else {
            errorMsg = err.detail;
          }
        } catch {
          errorMsg = err.detail;
        }
      } else if (err?.detail) {
        errorMsg = err.detail;
      }
      setEditError(errorMsg);
    } finally {
      setEditSaving(false);
    }
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

  function initialsFromName(n?: string | null) {
    if (!n) return "--";
    return n
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join("");
  }
  function applyFilters() {
    let list = allCustomers.slice();

    // Query search (name, email, phone)
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        return (
          String(c.name).toLowerCase().includes(q) ||
          String(c.email ?? "").toLowerCase().includes(q) ||
          String(c.phone ?? "").toLowerCase().includes(q)
        );
      });
    }
    // Email filter
    if (filterEmail === "verified") {
      list = list.filter((c) => !!c.email);
    } else if (filterEmail === "unverified") {
      list = list.filter((c) => !c.email);
    }

    // KYC filter
    if (filterKyc !== "all") {
      list = list.filter((c) => String(c.kyc) === filterKyc);
    }

    // Status filter
    if (filterStatus !== "all") {
      list = list.filter((c) => String(c.status) === filterStatus);
    }

    // Sorting
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = String(a.name ?? "").localeCompare(String(b.name ?? ""));
      else if (sortBy === "balance") cmp = (Number(a.balanceNumber ?? 0) - Number(b.balanceNumber ?? 0));
      else cmp = (Number(a.id) - Number(b.id));

      if (sortDir === "desc") cmp = -cmp;
      return cmp;
    });

    setRemoteCustomers(list);
  }
  useEffect(() => {
    const q = query.trim();
    const filtersAreDefault = filterEmail === "all" && filterKyc === "all" && filterStatus === "all";
    if (q === "") {
      if (filtersAreDefault) {
        setRemoteCustomers(allCustomers);
      } else {
        applyFilters();
      }
    }
  }, [query, filterEmail, filterKyc, filterStatus, allCustomers]);

  function colorFromId(id: number) {
    const colors = ["#1e3a5f", "#6b7d4f", "#dc5656", "#6b5d99", "#3b5366", "#2b7a8b", "#d14d72"];
    return colors[id % colors.length];
  }

  function formatCurrency(v?: number | null) {
    if (v == null) return "₹0.00";
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);
    } catch {
      return `₹${Number(v).toFixed(2)}`;
    }
  }

  function formatDate(d?: string | null) {
    if (!d) return "-";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString();
  }

  function mapGender(g?: number | string | null) {
    if (g == null) return null;
    // numeric codes
    if (typeof g === "number") {
      if (g === 1) return "Male";
      if (g === 2) return "Female";
      if (g === 3) return "Other";
      return "-";
    }
 
    const s = String(g).toLowerCase();
    if (s === "1") return "Male";
    if (s === "2") return "Female";
    if (s === "3") return "Other";
    if (s === "male" || s === "m") return "Male";
    if (s === "female" || s === "f") return "Female";
    if (s === "other" || s === "o") return "Other";
    return g as string;
  }

  function mapStatus(s?: number | string | null) {
    if (s == null) return "Unknown";
    if (typeof s === "number") return s === 1 ? "Active" : "Inactive";
    const st = String(s).toLowerCase();
    if (st === "1" || st === "active") return "Active";
    if (st === "0" || st === "inactive") return "Inactive";
    return s as string;
  }

  function genderToCode(g?: number | string | null): number | undefined {
    if (g == null) return undefined;
    if (typeof g === 'number') return g;
    const s = String(g).toLowerCase();
    if (s === '1' || s === 'male' || s === 'm') return 1;
    if (s === '2' || s === 'female' || s === 'f') return 2;
    if (s === '3' || s === 'other' || s === 'o') return 3;
    const n = Number(s);
    return Number.isNaN(n) ? undefined : n;
  }

  function statusToCode(s?: number | string | null): number | undefined {
    if (s == null) return undefined;
    if (typeof s === 'number') return s;
    const st = String(s).toLowerCase();
    if (st === '1' || st === 'active') return 1;
    if (st === '0' || st === 'inactive') return 0;
    const n = Number(st);
    return Number.isNaN(n) ? undefined : n;
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchUsers()
      .then((res) => {
        if (!mounted) return;
        const mapped: DisplayCustomer[] = res.users.map((u: ApiUser) => ({
          id: u.user_id,
          initials: initialsFromName(u.name),
          name: u.name ?? "-",
          email: u.email,
          phone: u.phone ?? null,
          dob: u.dob ?? null,
          gender: mapGender(u.gender),
          account: u.phone ?? `ID-${u.user_id}`,
          balance: formatCurrency(u.wallet_balance ?? 0),
          balanceNumber: u.wallet_balance ?? 0,
          payback: "-",
          emailStatus: u.email ? "Verified" : "Unverified",
          kyc: u.kyc_verified ?? "Pending",
          status: mapStatus(u.status),
          avatarColor: colorFromId(u.user_id),
        }));
        setAllCustomers(mapped);
        setRemoteCustomers(mapped);
      })
      .catch((err: any) => {
        console.error(err);
        if (!mounted) return;
        setError(err?.detail ?? "Failed to load users");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <PageMeta title="All Customers - Admin" description="All customers listing" />
      <PageBreadcrumb pageTitle="All Customers" />

      <div className="w-full max-w-full overflow-x-hidden">
  
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-5 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <input
              type="text"
              name="query"
              placeholder="SEARCH"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-auto md:flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />

            <select value={filterEmail} onChange={(e) => setFilterEmail(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">Filter By Email St</option>
              <option value="verified">Email Verified</option>
              <option value="unverified">Email Unverified</option>
            </select>

            <select value={filterKyc} onChange={(e) => setFilterKyc(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">Filter By KYC</option>
              <option value="Verified">Verified</option>
              <option value="Unverified">Unverified</option>
              <option value="Pending">Pending</option>
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="all">Filter By Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="id">Sort By ID</option>
              <option value="name">Sort By Name</option>
              <option value="balance">Sort By Balance</option>
            </select>

            <select value={sortDir} onChange={(e) => setSortDir(e.target.value as "asc" | "desc")} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>

            <button onClick={() => applyFilters()} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              SEARCH
            </button>
          </div>
        </div>

        
          {loading && (
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200">
              Loading users...
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-700 dark:text-red-200">
              Error: {error}
            </div>
          )}

      
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] hidden md:table">
              <thead className="bg-[#ede9fe] dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    AVATAR
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    USER ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    USER <span className="ml-1">⇅</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    EMAIL <span className="ml-1">⇅</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    PHONE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    DOB
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    GENDER
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap">
                    WALLET BALANCE (INR) <span className="ml-1">⇅</span>
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
              {remoteCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase" 
                      style={{ backgroundColor: c.avatarColor }}
                    >
                      {c.initials}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {c.id}
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
                    {c.phone ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(c.dob)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {c.gender ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {c.balance}
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
                        onClick={() => openEditModal(c)} 
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


          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {remoteCustomers.map((c) => (
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
                      <div><span className="font-medium">Email:</span> {c.email}</div>
                      <div><span className="font-medium">Phone:</span> {c.phone ?? "-"}</div>
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                      <div className="mb-1"><span className="font-medium">DOB:</span> {formatDate(c.dob)}</div>
                      <div className="mb-1"><span className="font-medium">Gender:</span> {c.gender ?? "-"}</div>
                      <div className="flex gap-4">
                        <span><span className="font-medium">Balance (INR):</span> {c.balance}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-3">
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
                        onClick={() => openEditModal(c)} 
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
        {/* Edit User modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeEditModal} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4 p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit User {editingCustomer?.user_id ?? ''}</h3>
                <button onClick={closeEditModal} className="text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 text-2xl leading-none">×</button>
              </div>

              {!editingCustomer ? (
                <div className="py-8 text-center">{editError ? <div className="text-red-600">{editError}</div> : <div>Loading user...</div>}</div>
              ) : (
                <div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        value={editingCustomer.name ?? ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        type="text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-300 mb-1">Email</label>
                      <input
                        value={editingCustomer.email ?? ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        type="email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-300 mb-1">Phone</label>
                      <input
                        value={editingCustomer.phone ?? ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        type="text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-300 mb-1">DOB</label>
                      <input
                        value={editingCustomer.dob ?? ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, dob: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        type="date"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-300 mb-1">Gender</label>
                      <select
                        value={editingCustomer.gender ?? ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, gender: e.target.value ? Number(e.target.value) : null })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select</option>
                        <option value={1}>Male</option>
                        <option value={2}>Female</option>
                        <option value={3}>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-300 mb-1">Status</label>
                      <select
                        value={editingCustomer.status ?? ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, status: e.target.value ? Number(e.target.value) : null })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-300 mb-1">Wallet Balance (INR)</label>
                      <input
                        value={editingCustomer.wallet_balance ?? ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, wallet_balance: e.target.value ? Number(e.target.value) : 0 })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        type="number"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600 dark:text-gray-300 mb-1">MPIN</label>
                      <input
                        type="password"
                        value={(editingCustomer.mpin as string) ?? ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, mpin: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Set new MPIN (leave blank to keep)"
                      />
                    </div>

                  
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={handleSaveEdit} disabled={editSaving} className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                      {editSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={closeEditModal} disabled={editSaving} className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
