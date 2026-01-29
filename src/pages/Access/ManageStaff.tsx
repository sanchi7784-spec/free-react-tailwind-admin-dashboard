import { useState, useEffect } from "react";
import { fetchStaff, updateStaffRole, createStaff, StaffUser } from "../../api/staff";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role_id?: number | null;
  role_name?: string | null;
  role: string;
  status: "Active" | "Inactive";
}
const staffData: Staff[] = [];

const ManageStaff = () => {
  const [staff, setStaff] = useState<Staff[]>(staffData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mpin: "",
    role: "0",
  });
  const [editFormData, setEditFormData] = useState({
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          mpin: formData.mpin || undefined,
          role_id: Number(formData.role),
        };
        const resp = await createStaff(payload as any);
        const created: Staff = {
          id: String(resp.user_id ?? (staff.length + 1)),
          name: resp.name ?? formData.name,
          email: resp.email ?? formData.email,
          phone: formData.phone,
          role_id: resp.role_id ?? Number(formData.role),
          role_name: resp.role_name ?? null,
          role: resp.role_name ?? String(resp.role_id ?? formData.role),
          status: "Active",
        };
        setStaff((prev) => [...prev, created]);
        // Reset form and close modal
        setFormData({ name: "", email: "", phone: "", mpin: "", role: "0" });
        setIsModalOpen(false);
        alert("Staff created successfully!");
      } catch (err: any) {
        console.error("Failed to create staff:", err);
        const errorMessage = err?.detail || "Failed to create staff";
        alert(errorMessage);
      }
    })();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "", mpin: "", role: "0" });
  };
  const handleEditClick = (member: Staff) => {
    setEditingStaff(member);
    setEditFormData({
      role: member.role_id != null ? String(member.role_id) : (member.role || ""),
    });
    setIsEditModalOpen(true);
  };
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    (async () => {
      const targetId = Number(editingStaff.id);
      const prev = staff.find((m) => m.id === editingStaff.id);
      const prevRoleId = prev?.role_id ?? null;
      const newRoleId = editFormData.role ? Number(editFormData.role) : null;
      try {
        // If role changed and we have a numeric role id, call API to update
        if (newRoleId != null && !Number.isNaN(newRoleId) && newRoleId !== prevRoleId) {
          const resp = await updateStaffRole(targetId, newRoleId);
          // resp contains updated user info (role_id, role_name, etc.) per API
          const updatedStaff = staff.map((member) =>
            member.id === editingStaff.id
              ? {
                  ...member,
                  role_id: resp?.role_id ?? newRoleId,
                  role_name: resp?.role_name ?? member.role_name ?? String(newRoleId),
                  role: resp?.role_name ?? member.role_name ?? String(newRoleId),
                }
              : member
          );
          setStaff(updatedStaff);
        } else {
          // No role change; nothing to update on server
          // simply close the modal
        }
        setIsEditModalOpen(false);
        setEditingStaff(null);
      } catch (err: any) {
        console.error("Failed to update staff role:", err);
        const errorMessage = err?.detail || "Failed to update staff";
        alert(errorMessage);
      }
    })();
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStaff(null);
  };
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchStaff()
      .then((res) => {
        if (!mounted) return;
        const mapped: Staff[] = (res.staff_users || []).map((s: StaffUser) => ({
          id: String(s.user_id),
          name: s.name ?? "-",
          email: s.email ?? "",
          phone: s.phone ?? "",
          role_id: s.role_id ?? null,
          role_name: s.role_name ?? null,
          role: s.role_name ?? (s.role_id != null ? String(s.role_id) : ""),
          status: (s.status as "Active" | "Inactive") || "Inactive",
        }));
        setStaff(mapped);
      })
      .catch((err: any) => {
        if (!mounted) return;
        console.error("Failed to load staff:", err);
        setError(err?.detail || "Failed to load staff");
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Manage Staffs
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            ADD NEW STAFF
          </button>
        </div>
        {loading && (
          <div className="mb-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200">
            Loading staff users...
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-700 dark:text-red-200">
            Error: {error}
          </div>
        )}
      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-100 dark:bg-indigo-900/30">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  NAME
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  EMAIL
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  PHONE
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  ROLE
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  STATUS
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {staff.map((member, index) => (
                <tr
                  key={member.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-800"
                      : "bg-gray-50 dark:bg-slate-700"
                  } hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors`}
                >
                  <td className="px-6 py-5">
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-base text-indigo-600 dark:text-indigo-400">
                      {member.email}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-base text-gray-700 dark:text-gray-300">
                      {member.phone}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        member.status === "Active"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleEditClick(member)}
                      className="inline-flex items-center justify-center w-9 h-9 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden">
          {staff.map((member) => (
            <div
              key={member.id}
              className="border-b border-gray-200 dark:border-slate-600 p-4 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors"
            >
              {/* Staff Info */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Name
                  </div>
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Email
                  </div>
                  <div className="text-base text-indigo-600 dark:text-indigo-400">
                    {member.email}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Phone
                  </div>
                  <div className="text-base text-gray-700 dark:text-gray-300">
                    {member.phone}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Role
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                      {member.role}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Status
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        member.status === "Active"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
                {/* Action Button */}
                <div className="pt-2">
                  <button 
                    onClick={() => handleEditClick(member)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Add New Staff Modal */}
    {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Staff
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Staff Name"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Staff Email"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              {/* Password Field */}
              <div>
                <label
                  htmlFor="mpin"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  MPIN:
                </label>
                <input
                  type="password"
                  id="mpin"
                  name="mpin"
                  value={formData.mpin}
                  onChange={handleInputChange}
                  required
                  placeholder="4-digit MPIN"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              {/* (No confirm password field required) */}
              {/* Select Role Field */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Select Role:
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="0">User</option>
                  <option value="1">Admin</option>
                  <option value="2">Gold Price Manager</option>
                  <option value="3">Transaction Manager</option>
                  <option value="4">Document Manager</option>
                  <option value="5">User Manager</option>
                </select>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md"
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
                  Add Staff
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors shadow-md"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Staff Modal */}
      {isEditModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Staff
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            {/* Modal Body (Roles-only edit) */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              {/* Select Role Field */}
              <div>
                <label
                  htmlFor="edit-role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Select Role:
                </label>
                <select
                  id="edit-role"
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditInputChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="0">User</option>
                  <option value="1">Admin</option>
                  <option value="2">Gold Price Manager</option>
                  <option value="3">Transaction Manager</option>
                  <option value="4">Document Manager</option>
                  <option value="5">User Manager</option>
                </select>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md"
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
                  Update Role
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors shadow-md"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default ManageStaff;
