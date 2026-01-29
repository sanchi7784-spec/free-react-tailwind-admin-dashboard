import { useState, useEffect } from "react";
import { submitStaffRequest } from "../../api/staff";

type StaffRequest = {
  request_id: number;
  name: string;
  email: string;
  phone: string;
  user_role: number;
  request_text: string;
  status: number;
  admin_remark: string | null;
  created_at: string;
};

const Uiforstafftochangeprofile = () => {
  const [changeType, setChangeType] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [myRequests, setMyRequests] = useState<StaffRequest[]>([]);
  const [fetchingRequests, setFetchingRequests] = useState(false);

  // Fetch user's requests on mount
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const userId = localStorage.getItem("mp_user_id");
        if (!userId) return;

        setFetchingRequests(true);
        
        const BASE = (import.meta as any).env?.VITE_API_BASE || "https://api.mastropaytech.com";
        const url = `${BASE.replace(/\/$/, "")}/dashboard/my-staff-requests/${userId}`;
        
        const apiKey = localStorage.getItem("mp_api_key");
        const headers: Record<string, string> = {
          "Accept": "application/json",
          "Content-Type": "application/json"
        };
        
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`;
        }

        const res = await fetch(url, { 
          method: "GET",
          headers 
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch requests: ${res.status}`);
        }

        const data = await res.json();
        const requests = data?.data || [];
        setMyRequests(requests);
      } catch (err: any) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setFetchingRequests(false);
      }
    };

    fetchMyRequests();
  }, []);

  const handleSubmit = async () => {
    if (!changeType || !reason.trim()) {
      setError("Please select a change type and provide a reason.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const request_text = `${changeType}: ${reason}`;
      const response = await submitStaffRequest(request_text);
      
      setMessage(response.detail || "Request submitted successfully");
      setChangeType("");
      setReason("");
      
      // Refresh requests after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      const errorMsg = err?.detail || "Failed to submit request";
      setError(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return { text: "Pending", color: "text-yellow-600 bg-yellow-100" };
      case 1: return { text: "In Review", color: "text-blue-600 bg-blue-100" };
      case 2: return { text: "Approved", color: "text-green-600 bg-green-100" };
      case 3: return { text: "Rejected", color: "text-red-600 bg-red-100" };
      case 4: return { text: "Resolved", color: "text-purple-600 bg-purple-100" };
      default: return { text: "Unknown", color: "text-gray-600 bg-gray-100" };
    }
  };

  return (
    <div className="px-6 py-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold dark:text-white mb-2">
        Request Profile Change
      </h1>
      <p className="text-red-600 font-medium mb-6">
        Only one change (Password, Email, or Phone No.) is allowed per month.
      </p>

      {/* Main Card */}
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold dark:text-white mb-6">
          Update Request Form
        </h2>

        {/* Dropdown */}
        <div className="mb-6">
          <label className="text-gray-600 dark:text-gray-300 font-medium mb-2 block">
            What would you like to change?
          </label>

          <div className="relative">
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
              className="w-full p-4 px-5 rounded-xl bg-gray-50 dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 text-gray-900 
              dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500 
              outline-none appearance-none"
            >
              <option value="">-- Select an option --</option>
              <option value="Password">Password</option>
              <option value="Email">Email</option>
              <option value="Phone Number">Phone Number</option>
            </select>

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              ▼
            </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative mb-6">
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder=" "
            className="peer w-full p-4 pt-6 rounded-xl bg-gray-50 dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 text-gray-900 
            dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500 
            outline-none resize-none"
          />

          <label
            className="absolute left-4 top-3 text-gray-500 dark:text-gray-300 
            transition-all duration-300 peer-placeholder-shown:top-5 
            peer-placeholder-shown:text-base peer-focus:top-2 
            peer-focus:text-sm peer-focus:text-purple-500"
          >
            Reason for requesting change
          </label>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 dark:bg-red-900/40 p-3 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        {message && (
          <div className="mb-4 text-green-700 bg-green-100 dark:bg-green-900/40 p-3 rounded-lg text-sm">
            ✅ {message}
          </div>
        )}

        {/* Info */}
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl text-sm mb-6 border border-yellow-300 dark:border-yellow-700">
          ⚠️ You can only request one profile change per month.
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-stone-900 hover:bg-purple-700 disabled:opacity-60
          transition-all text-white py-4 rounded-xl font-medium shadow-lg"
        >
          {loading ? "Submitting..." : "Send Request"}
        </button>
      </div>

      {/* My Requests Section */}
      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-bold dark:text-white mb-4">
          My Profile Change Requests
        </h2>

        {fetchingRequests ? (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">Loading your requests...</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No requests found.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Request ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Request Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Admin Remark
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {myRequests.map((request) => {
                    const statusInfo = getStatusText(request.status);
                    return (
                      <tr key={request.request_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          #{request.request_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {request.request_text}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {request.admin_remark || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(request.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Uiforstafftochangeprofile;
