import { useEffect, useState } from "react";

type StaffRequest = {
  request_id: string;
  staff_id: string;
  name: string;
  email: string;
  phone_no: string;
  request_text: string;
  status: string;
  raw_status: number;
  action?: string;
};

const CreatePortfolios = () => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [tableData, setTableData] = useState<StaffRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  /* ---------------- HELPERS ---------------- */
  const getStatusText = (status: number): string => {
    switch (status) {
      case 0: return "Pending";
      case 1: return "In Review";
      case 2: return "Approved";
      case 3: return "Rejected";
      case 4: return "Resolved";
      default: return "Unknown";
    }
  };

  const getStatusColor = (status: number): string => {
    switch (status) {
      case 0: return "text-yellow-600 bg-yellow-100";
      case 1: return "text-blue-600 bg-blue-100";
      case 2: return "text-green-600 bg-green-100";
      case 3: return "text-red-600 bg-red-100";
      case 4: return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    try {
      const mpId = localStorage.getItem("mp_user_id");
      // Allow access if user ID exists (logged in)
      setIsAllowed(!!mpId);
    } catch {
      setIsAllowed(false);
    }
  }, []);

  /* ---------------- FETCH STAFF REQUESTS ---------------- */
  useEffect(() => {
    const fetchStaffRequests = async () => {
      try {
        const userId = localStorage.getItem("mp_user_id");
        const apiKey = localStorage.getItem("mp_api_key");
        
        if (!userId) {
          setError("No user ID found. Please login.");
          return;
        }

        setLoading(true);
        setError(null);

        const BASE = (import.meta as any).env?.VITE_API_BASE || "https://api.mastropaytech.com";
        const url = `${BASE.replace(/\/$/, "")}/dashboard/get/staff-requests/${userId}`;
        
        const headers: Record<string, string> = {
          "Accept": "application/json",
          "Content-Type": "application/json"
        };
        
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`;
        }

        console.log("Fetching staff requests from:", url);
        console.log("Headers:", headers);

        const res = await fetch(url, { 
          method: "GET",
          headers,
          mode: "cors"
        });

        console.log("Response status:", res.status);
        console.log("Response headers:", Object.fromEntries(res.headers.entries()));

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error response:", errorText);
          
          let errorMessage;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData?.detail || `HTTP ${res.status}`;
          } catch {
            errorMessage = errorText || `HTTP ${res.status}: ${res.statusText}`;
          }
          
          throw new Error(errorMessage);
        }

        const text = await res.text();
        console.log("Response body:", text);
        
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch (e) {
          console.error("JSON parse error:", e);
          throw new Error("Invalid JSON response from server");
        }

        // Map API response to table structure
        // Handle both array response and object with requests array
        const requests = Array.isArray(data) ? data : (data?.data || data?.staff_requests || data?.requests || []);
        console.log("Parsed requests:", requests);
        
        const formatted = requests.map((item: any) => ({
          request_id: item.request_id?.toString() || "",
          staff_id: item.request_id?.toString() || item.staff_id || "",
          name: item.name || "",
          email: item.email || "",
          phone_no: item.phone || item.phone_no || "",
          request_text: item.request_text || "",
          status: getStatusText(item.status ?? 0),
          raw_status: item.status ?? 0,
          action: "Pending",
        }));

        setTableData(formatted);
        console.log("Formatted data:", formatted);
      } catch (err: any) {
        console.error("Staff requests fetch error:", err);
        setError(err.detail || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (isAllowed) fetchStaffRequests();
  }, [isAllowed]);

  /* ---------------- ACTION CHANGE ---------------- */
  const handleActionChange = (index: number, value: string) => {
    if (value === "Done") {
      setCurrentIndex(index);
      setSelectedStatus(tableData[index].raw_status);
      setShowModal(true);
    }

    const updated = [...tableData];
    updated[index].action = value;
    setTableData(updated);
  };

  /* ---------------- ACCESS CONTROL ---------------- */
  if (isAllowed === null) return null;

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Access Denied</h2>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div>
      <h1 className="text-4xl font-bold dark:text-gray-200">
        Staff Profiles
      </h1>

      {loading && (
        <p className="mt-6 text-blue-600 dark:text-blue-400">Loading staff requests...</p>
      )}

      {error && (
        <p className="mt-6 text-red-600 dark:text-red-400">❌ {error}</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto mt-10">
          <table className="w-full border-collapse">
            <thead className="bg-purple-50 dark:bg-gray-800">
              <tr>
                <th className="py-4 px-4 text-left dark:text-gray-200">User ID</th>
                <th className="py-4 px-4 text-left dark:text-gray-200">Name</th>
                <th className="py-4 px-4 text-left dark:text-gray-200">Email</th>
                <th className="py-4 px-4 text-left dark:text-gray-200">Phone</th>
                <th className="py-4 px-4 text-left dark:text-gray-200">Reason</th>
                <th className="py-4 px-4 text-left dark:text-gray-200">Status</th>
                <th className="py-4 px-4 text-left dark:text-gray-200">Action</th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                  <td className="py-4 px-4 dark:text-gray-200">{item.staff_id}</td>
                  <td className="py-4 px-4 dark:text-gray-200">{item.name}</td>
                  <td className="py-4 px-4 dark:text-gray-200">{item.email}</td>
                  <td className="py-4 px-4 dark:text-gray-200">{item.phone_no}</td>
                  <td className="py-4 px-4 dark:text-gray-200">{item.request_text}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.raw_status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={item.action}
                      onChange={(e) =>
                        handleActionChange(index, e.target.value)
                      }
                      className="border rounded px-3 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Done">Done</option>
                      <option value="Undone">Undone</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-blue/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
            <h2 className="font-semibold mb-4 text-lg dark:text-white">
              Update Staff Request
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(Number(e.target.value))}
                className="border w-full px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={0}>Pending</option>
                <option value={1}>In Review</option>
                <option value={2}>Approved</option>
                <option value={3}>Rejected</option>
                <option value={4}>Resolved</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Admin Remark
              </label>
              <textarea
                rows={3}
                className="border w-full px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your remark or message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
                onClick={async () => {
                  if (currentIndex === null) return;
                  
                  try {
                    setLoading(true);
                    const userId = localStorage.getItem("mp_user_id");
                    const apiKey = localStorage.getItem("mp_api_key");
                    const staffRequest = tableData[currentIndex];
                    
                    const BASE = (import.meta as any).env?.VITE_API_BASE || "https://api.mastropaytech.com";
                    const url = `${BASE.replace(/\/$/, "")}/dashboard/update/staff-requests/${staffRequest.request_id}/${userId}`;
                    
                    const headers: Record<string, string> = {
                      "Accept": "application/json",
                      "Content-Type": "application/json"
                    };
                    
                    if (apiKey) {
                      headers["Authorization"] = `Bearer ${apiKey}`;
                    }
                    
                    const body = {
                      status: selectedStatus,
                      admin_remark: message
                    };
                    
                    console.log("Updating staff request:", url, body);
                    
                    const res = await fetch(url, {
                      method: "PATCH",
                      headers,
                      body: JSON.stringify(body)
                    });
                    
                    if (!res.ok) {
                      const errorText = await res.text();
                      console.error("Error response:", errorText);
                      throw new Error(`Failed to update: ${errorText}`);
                    }
                    
                    const result = await res.json();
                    console.log("Update result:", result);
                    
                    alert(result?.detail || "Staff request updated successfully!");
                    setShowModal(false);
                    setMessage("");
                    setSelectedStatus(1);
                    
                    // Refresh the data
                    window.location.reload();
                  } catch (err: any) {
                    console.error("Update error:", err);
                    alert(`Error: ${err.detail}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreatePortfolios;
