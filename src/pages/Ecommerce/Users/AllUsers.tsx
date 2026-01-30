import { useState, useEffect, useMemo } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import Badge from "../../../components/ui/badge/Badge";
import { getEcommerceToken } from "../../../utils/ecommerceAuth";
import { updateUserStatus } from "../../../api/users";

type ViewMode = "table" | "grid";
type StatusFilter = "all" | "active" | "inactive" | "deactivated";

type User = {
  user_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: number;
  kyc_status: number;
  role_id?: number;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields for display
  gender?: number | string | null;
  dob?: string | null;
  kyc_verified?: string | null;
  wallet_balance?: number | null;
  mpin?: string | null;
};

type EditUserFormData = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  status: string;
  kyc_verified: string;
  role_id: string;
};

type CreateUserFormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role_id: number;
};

// API Configuration
const API_BASE_URL = "https://api.mastrokart.com";

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditUserFormData>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    status: "",
    kyc_verified: "",
    role_id: "0",
  });
  const [createFormData, setCreateFormData] = useState<CreateUserFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role_id: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = getEcommerceToken();
      
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 403) {
        throw new Error('Access denied. Your session may have expired. Please login again.');
      }

      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('API Response:', result); // Debug log
      
      if (result.data && Array.isArray(result.data)) {
        // Map API response to component structure
        const mappedUsers: User[] = result.data.map((user: any) => {
          console.log('User data:', user); // Debug log for each user
          return {
            ...user,
            // Explicitly map role_id (fallback to 0 if not provided)
            role_id: user.role_id !== undefined ? user.role_id : 0,
            // Map kyc_status to kyc_verified for display compatibility
            kyc_verified: user.kyc_status === 1 ? 'verified' : 'unverified',
            // Add default wallet balance if needed
            wallet_balance: user.wallet_balance || 0,
          };
        });
        setUsers(mappedUsers);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const searchMatch =
        searchQuery === "" ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery) ||
        user.user_id?.toString().includes(searchQuery);

      // Status filter - API uses numeric status (1 = active, 0 = inactive)
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && user.status === 1) ||
        (statusFilter === "inactive" && user.status === 0) ||
        (statusFilter === "deactivated" && user.status === 2);

      return searchMatch && statusMatch;
    });
  }, [users, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, []);

  // Default to grid view on small screens for better mobile UX
  useEffect(() => {
    try {
      if (window && window.innerWidth < 640) {
        setViewMode("grid");
      }
    } catch (e) {
      // ignore (SSR-safe)
    }
  }, []);

  const getStatusBadge = (status: number | string | null) => {
    if (status === 1 || status === "active") {
      return (
        <Badge variant="light" color="success" size="sm">
          Active
        </Badge>
      );
    } else if (status === 0 || status === "inactive") {
      return (
        <Badge variant="light" color="warning" size="sm">
          Inactive
        </Badge>
      );
    } else if (status === 2 || status === "deactivated") {
      return (
        <Badge variant="light" color="error" size="sm">
          Deactivated
        </Badge>
      );
    }
    return (
      <Badge variant="light" color="light" size="sm">
        Unknown
      </Badge>
    );
  };

  const getKycBadge = (kyc: string | null | undefined) => {
    if (kyc === "verified" || kyc === "1") {
      return (
        <Badge variant="light" color="success" size="sm">
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="light" color="warning" size="sm">
        Unverified
      </Badge>
    );
  };

  const getGenderText = (gender: number | string | null | undefined) => {
    if (gender === 1 || gender === "male") return "Male";
    if (gender === 2 || gender === "female") return "Female";
    if (gender === 3 || gender === "other") return "Other";
    return "N/A";
  };

  const getRoleText = (roleId: number | null | undefined) => {
    const roleMap: { [key: number]: string } = {
      0: "User",
      1: "Vendor",
      2: "Admin",
      3: "User Manager",
      4: "Product Manager",
      5: "Ad Manager",
      6: "KYC Manager",
      7: "Business Setting Manager",
      8: "Order Manager",
      9: "Shop Vendor Manager",
      10: "Delivery Manager",
    };
    return roleId !== null && roleId !== undefined ? roleMap[roleId] || "Unknown" : "N/A";
  };

  const formatBalance = (balance: number | null | undefined) => {
    if (balance === null || balance === undefined) return "$0.00";
    return `$${balance.toFixed(2)}`;
  };

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (id: number) => {
    const colors = [
      "#1e3a5f",
      "#6b7d4f",
      "#dc5656",
      "#6b5d99",
      "#3b5366",
      "#2b7a8b",
      "#d14d72",
    ];
    return colors[id % colors.length];
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      dob: user.dob || "",
      gender: user.gender?.toString() || "",
      status: user.status?.toString() || "",
      kyc_verified: user.kyc_verified || "",
      role_id: user.role_id?.toString() || "0",
    });
    setIsEditModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setCreateFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role_id: 0,
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateFormChange = (field: keyof CreateUserFormData, value: string | number) => {
    setCreateFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditFormChange = (field: keyof EditUserFormData, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    setIsCreating(true);
    try {
      const token = getEcommerceToken();
      
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const payload = {
        name: createFormData.name,
        email: createFormData.email,
        password: createFormData.password,
        phone: createFormData.phone,
        role_id: createFormData.role_id,
      };

      const response = await fetch(`${API_BASE_URL}/dashboard/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 403) {
        throw new Error('Access denied. You may not have permission to create users.');
      }

      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || JSON.stringify(errorData) || `Failed to create user: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      console.log('Create user response:', result); // Debug log
      
      // Close modal first
      handleCloseModals();
      
      // Reload users from API to get complete data
      await loadUsers();
      
      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      let errorMessage = "Failed to create user";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    setIsSaving(true);
    try {
      // Get token from localStorage
      const token = getEcommerceToken();
      
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      // Check if status has changed and update it separately
      const statusChanged = editFormData.status !== selectedUser.status?.toString();
      
      if (statusChanged) {
        // Update status using the dedicated status endpoint
        const statusValue = parseInt(editFormData.status);
        await updateUserStatus(selectedUser.user_id, statusValue);
      }

      // Check if other fields have changed
      const otherFieldsChanged = 
        editFormData.name !== (selectedUser.name || "") ||
        editFormData.email !== (selectedUser.email || "") ||
        editFormData.phone !== (selectedUser.phone || "") ||
        editFormData.role_id !== (selectedUser.role_id?.toString() || "0");

      // Only make PATCH request if other fields have changed
      if (otherFieldsChanged) {
        // Prepare the payload according to API specification
        const payload = {
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          role_id: parseInt(editFormData.role_id),
        };

        console.log('PATCH payload:', payload); // Debug log

        // Make PATCH request to update user
        const response = await fetch(`${API_BASE_URL}/dashboard/users/${selectedUser.user_id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('PATCH response status:', response.status); // Debug log

        if (response.status === 403) {
          throw new Error('Access denied. You may not have permission to update this user.');
        }

        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response text:', errorText); // Debug log
          
          let errorData = null;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            // Not JSON
          }
          
          const errorMessage = errorData?.detail || errorData?.message || errorText || `Failed to update user: ${response.status}`;
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('PATCH response data:', result); // Debug log
      }
      
      // Close modal first
      handleCloseModals();
      
      // Reload users from API to get fresh data
      await loadUsers();
      
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      
      let errorMessage = "Failed to update user";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageMeta title="All Users - Ecommerce" description="View all ecommerce users" />
      <PageBreadCrumb pageTitle="All Users" />

      <div className="rounded-sm border border-stroke dark:bg-gray-900 shadow-default dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="border-b border-stroke px-7.5 py-6 dark:border-strokedark">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue dark:text-white">All Users</h2>
              <p className="text-sm text-body mt-1 dark:text-white">
                Manage and view all registered users ({filteredUsers.length} of {users.length})
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 rounded-md border border-stroke p-1 dark:border-strokedark">
                <button
                  onClick={() => setViewMode("table")}
                  className={`rounded px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-blue-500 dark:text-white"
                      : "text-body hover:bg-gray-2 dark:hover:bg-meta-4 dark:text-white"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-700 dark:text-white"
                      : "text-body hover:bg-gray-2 dark:hover:bg-meta-4 dark:text-white"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-white hover:bg-opacity-90"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create User
              </button>
              <button
                onClick={loadUsers}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                <svg
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => {
                  // Export all users to CSV (Excel can open CSV files)
                  const escapeCSV = (val: any) => {
                    if (val === null || val === undefined) return "";
                    const s = String(val);
                    if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
                      return '"' + s.replace(/"/g, '""') + '"';
                    }
                    return s;
                  };

                  const headers = [
                    'user_id',
                    'name',
                    'email',
                    'phone',
                    'status',
                    'kyc_status',
                    'role_id',
                    'last_login_at',
                    'created_at',
                    'updated_at',
                    'gender',
                    'dob',
                    'kyc_verified',
                    'wallet_balance',
                    'mpin',
                  ];

                  const rows = users.map((u) =>
                    headers
                      .map((h) => {
                        // Pick value from user object; support both `kyc_status` and `kyc_verified` names
                        const val = (u as any)[h] ?? (h === 'kyc_status' && (u as any).kyc_verified ? (u as any).kyc_verified : (u as any)[h]);
                        return escapeCSV(val);
                      })
                      .join(',')
                  );

                  const csv = [headers.join(','), ...rows].join('\r\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.setAttribute('download', `users_export_${new Date().toISOString().slice(0,10)}.csv`);
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-white hover:bg-opacity-90"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-stroke px-7.5 py-4 dark:border-strokedark">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, email, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:text-white"
              />
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-body dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue dark:text-white">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="rounded-md border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:text-white"
              >
                <option value="all" className="text-blue">All</option>
                <option value="active" className="text-blue">Active</option>
                <option value="inactive" className="text-blue">Inactive</option>
                <option value="deactivated" className="text-blue">Deactivated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-7.5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-6 text-center dark:bg-red-900/20">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400">
                Error Loading Users
              </h3>
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p>
              <button
                onClick={loadUsers}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-md bg-gray-50 p-12 text-center dark:bg-meta-4">
              <svg
                className="mx-auto h-16 w-16 text-body"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-blue dark:text-white">
                No Users Found
              </h3>
              <p className="mt-2 text-sm text-body">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters or search query"
                  : "No users are registered yet"}
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto ">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-stroke text-left dark:border-strokedark">
                      <th className="px-3 py-3 sm:px-4 sm:py-4 font-semibold text-blue dark:text-white">
                      User
                    </th>
                      <th className="px-3 py-3 sm:px-4 sm:py-4 font-semibold text-blue dark:text-white">
                      Contact
                    </th>
                      <th className="px-3 py-3 sm:px-4 sm:py-4 font-semibold text-blue dark:text-white">
                      Status
                    </th>
                      <th className="px-3 py-3 sm:px-4 sm:py-4 font-semibold text-blue dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      className="border-b border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    >
                      <td className="px-3 py-3 sm:px-4 sm:py-5">
                        <div className="flex items-center gap-3 ">
                          <div
                            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: getAvatarColor(user.user_id) }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-medium text-blue dark:text-white">
                              {user.name || "N/A"}
                            </p>
                            <p className="text-xs text-body dark:text-white">ID: {user.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-5">
                        <div className="text-sm">
                          <p className="text-blue dark:text-white">{user.email || "N/A"}</p>
                          <p className="text-body dark:text-white">{user.phone || "N/A"}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-5">{getStatusBadge(user.status)}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="rounded p-1.5 hover:bg-gray-3 dark:hover:bg-meta-4"
                            title="View Details"
                          >
                            <svg
                              className="h-5 w-5 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="rounded p-1.5 hover:bg-gray-3 dark:hover:bg-meta-4"
                            title="Edit User"
                          >
                            <svg
                              className="h-5 w-5 text-body text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="rounded-lg border border-stroke bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md dark:border-strokedark dark:bg-boxdark"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-base font-semibold text-white"
                        style={{ backgroundColor: getAvatarColor(user.user_id) }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue dark:text-white">
                          {user.name || "N/A"}
                        </h3>
                        <p className="text-xs text-body">ID: {user.user_id}</p>
                      </div>
                    </div>
                    {getStatusBadge(user.status)}
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="h-4 w-4 text-body"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-blue dark:text-white">
                        {user.email || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="h-4 w-4 text-body"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-blue dark:text-white">
                        {user.phone || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-stroke pt-3 dark:border-strokedark">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-body">KYC:</span>
                        {getKycBadge(user.kyc_verified)}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-body">Balance</span>
                        <p className="font-semibold text-blue dark:text-white">
                          {formatBalance(user.wallet_balance)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="flex-1 rounded-md border border-stroke py-2 text-xs sm:text-sm font-medium text-body hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="rounded-md border border-stroke px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    >
                      <svg
                        className="h-4 w-4 text-body"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-body">
                Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-stroke px-3 py-2 hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:hover:bg-meta-4 dark:text-white"
                >
                  <svg
                    className="h-5 w-5 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          currentPage === pageNum
                            ? "bg-blue-500 text-white"
                            : "border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 dark:text-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-stroke px-3 py-2 hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:hover:bg-meta-4"
                >
                  <svg
                    className="h-5 w-5 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-blue bg-opacity-50 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-blue dark:text-white">
                User Details
              </h3>
              <button
                onClick={handleCloseModals}
                className="rounded-full p-1 hover:bg-gray-2 dark:hover:bg-meta-4"
              >
                <svg
                  className="h-6 w-6 text-body"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 dark:bg-gray-900">
              {/* User Information Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-body dark:text-white">
                    Name
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <svg
                      className="h-5 w-5 text-body dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p className="text-blue dark:text-white">
                      {selectedUser.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body dark:text-white">
                    Status
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body dark:text-white">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <svg
                      className="h-5 w-5 text-body dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-blue dark:text-white">
                      {selectedUser.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body dark:text-white">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <svg
                      className="h-5 w-5 text-body dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <p className="text-blue dark:text-white">
                      {selectedUser.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body dark:text-white">
                    Role
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <svg
                      className="h-5 w-5 text-body dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-blue dark:text-white">
                      {getRoleText(selectedUser.role_id)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
              <button
                onClick={() => {
                  handleCloseModals();
                  handleEditUser(selectedUser);
                }}
                className="rounded-md border border-stroke px-6 py-2.5 text-sm font-medium text-body hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              >
                Edit User
              </button>
              <button
                onClick={handleCloseModals}
                className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center  bg-opacity-50 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-blue dark:text-white">
                Edit User
              </h3>
              <button
                onClick={handleCloseModals}
                className="rounded-full p-1 hover:bg-gray-2 dark:hover:bg-meta-4"
              >
                <svg
                  className="h-6 w-6 text-body"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 dark:bg-gray-900">
              {/* Edit Form */}
              <div className="space-y-5">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => handleEditFormChange("name", e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Account Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => handleEditFormChange("status", e.target.value)}
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                  >
                    <option value="" className="text-blue">Select status</option>
                    <option value="1" className="text-blue">Active</option>
                    <option value="0" className="text-blue">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.role_id}
                    onChange={(e) => handleEditFormChange("role_id", e.target.value)}
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                  >
                    <option value="0" className="text-blue">User</option>
                    <option value="1" className="text-blue">Vendor</option>
                    <option value="2" className="text-blue">Admin</option>
                    <option value="3" className="text-blue">User Manager</option>
                    <option value="4" className="text-blue">Product Manager</option>
                    <option value="5" className="text-blue">Ad Manager</option>
                    <option value="6" className="text-blue">KYC Manager</option>
                    <option value="7" className="text-blue">Business Setting Manager</option>
                    <option value="8" className="text-blue">Order Manager</option>
                    <option value="9" className="text-blue">Shop Vendor Manager</option>
                    <option value="10" className="text-blue">Delivery Manager</option>
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => handleEditFormChange("email", e.target.value)}
                      placeholder="Enter email"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => handleEditFormChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
              <button
                onClick={handleCloseModals}
                disabled={isSaving}
                className="rounded-md border border-stroke px-6 py-2.5 text-sm font-medium text-body hover:bg-gray-2 disabled:opacity-50 dark:border-strokedark dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                disabled={isSaving || !editFormData.name || !editFormData.email}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 bg-blue-600"
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
                    Done
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center  bg-opacity-50 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-blue dark:text-white">
                Create New User
              </h3>
              <button
                onClick={handleCloseModals}
                className="rounded-full p-1 hover:bg-gray-2 dark:hover:bg-meta-4"
              >
                <svg
                  className="h-6 w-6 text-body"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 dark:bg-gray-900">
              {/* Create Form */}
              <div className="space-y-5">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createFormData.name}
                    onChange={(e) => handleCreateFormChange("name", e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={createFormData.email}
                      onChange={(e) => handleCreateFormChange("email", e.target.value)}
                      placeholder="Enter email"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={createFormData.phone}
                      onChange={(e) => handleCreateFormChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={createFormData.password}
                    onChange={(e) => handleCreateFormChange("password", e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                  />
                  <p className="mt-1 text-xs text-body dark:text-bodydark">
                    Password should be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={createFormData.role_id}
                    onChange={(e) => handleCreateFormChange("role_id", parseInt(e.target.value))}
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark dark:text-white"
                  >
                    <option value={0} className="text-blue">User</option>
                    <option value={1} className="text-blue">Vendor</option>
                    <option value={2} className="text-blue">Admin</option>
                    <option value={3} className="text-blue">User Manager</option>
                    <option value={4} className="text-blue">Product Manager</option>
                    <option value={5} className="text-blue">Ad Manager</option>
                    <option value={6} className="text-blue">KYC Manager</option>
                    <option value={7} className="text-blue">Business Setting Manager</option>
                    <option value={8} className="text-blue">Order Manager</option>
                    <option value={9} className="text-blue">Shop Vendor Manager</option>
                    <option value={10} className="text-blue">Delivery Manager</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
              <button
                onClick={handleCloseModals}
                disabled={isCreating}
                className="rounded-md border border-stroke px-6 py-2.5 text-sm font-medium text-body hover:bg-gray-2 disabled:opacity-50 dark:border-strokedark dark:hover:bg-meta-4 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={isCreating || !createFormData.name || !createFormData.email || !createFormData.password || !createFormData.phone}
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
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
                    Create User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
