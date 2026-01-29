import { useState, useEffect, useMemo } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { fetchVendors, createVendor, updateVendor, Vendor } from "../../../api/vendors";

type ModalType = "add" | "edit" | "view" | null;

export default function AllVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch vendors from API
  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const vendorsData = await fetchVendors();
      setVendors(vendorsData);
    } catch (err: any) {
      console.error('Error fetching vendors:', err);
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<Partial<Vendor> & { 
    password?: string;
    shopLogo?: File | null;
    shopBanner?: File | null;
  }>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    taxId: "",
    status: "1", // Default to active (1)
    password: "",
    gender: 1,
    dob: "",
    description: "",
    shopLogo: null,
    shopBanner: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const displayedVendors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return vendors;
    return vendors.filter((v) => {
      try {
        const data = `${v.id} ${v.companyName} ${v.contactPerson} ${v.email} ${v.phone} ${v.address} ${v.city} ${v.country} ${v.zipCode} ${v.taxId} ${v.description}`.toLowerCase();
        return data.includes(term);
      } catch {
        return false;
      }
    });
  }, [vendors, searchTerm]);

  const exportCSV = (rows: Vendor[]) => {
    if (!rows || rows.length === 0) {
      alert('No vendors to export');
      return;
    }

    const headers = [
      'ID',
      'Company',
      'Contact Person',
      'Email',
      'Phone',
      'Status',
      'Orders',
      'Address',
      'City',
      'Country',
      'Zip Code',
      'Tax ID',
      'Joined Date',
      'DOB',
      'Rating',
      'Description'
    ];

    const escapeCell = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    };

    const csvRows = [headers.join(',')];
    for (const r of rows) {
      const row = [
        r.id,
        r.companyName,
        r.contactPerson,
        r.email,
        r.phone,
        formatStatus(r.status),
        r.totalOrders,
        r.address,
        r.city,
        r.country,
        r.zipCode,
        r.taxId,
        r.joinedDate ? new Date(r.joinedDate).toLocaleDateString() : '',
        r.dob ? new Date(r.dob).toLocaleDateString() : '',
        r.rating ?? '',
        r.description ?? ''
      ].map(escapeCell).join(',');
      csvRows.push(row);
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendors${searchTerm ? `-${searchTerm}` : ''}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName?.trim()) {
      newErrors.companyName = "Shop name is required";
    }
    if (!formData.contactPerson?.trim()) {
      newErrors.contactPerson = "Vendor name is required";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!formData.address?.trim()) {
      newErrors.address = "Shop address is required";
    }
    
    // Only validate these for add mode
    if (modalType === "add") {
      if (!formData.password?.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 4) {
        newErrors.password = "Password must be at least 4 characters";
      }
      if (!formData.dob) {
        newErrors.dob = "Date of birth is required";
      }
      if (!formData.shopLogo) {
        newErrors.shopLogo = "Shop logo is required";
      }
      if (!formData.shopBanner) {
        newErrors.shopBanner = "Shop banner is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (type: ModalType, vendor?: Vendor) => {
    setModalType(type);
    if (type === "add") {
      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        zipCode: "",
        taxId: "",
        status: "pending",
        password: "",
        gender: 1,
        dob: "",
        description: "",
        shopLogo: null,
        shopBanner: null,
      });
      setErrors({});
    } else if (type === "edit" && vendor) {
      setSelectedVendor(vendor);
      setFormData({
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
        country: vendor.country,
        zipCode: vendor.zipCode,
        taxId: vendor.taxId,
        status: String(vendor.status), // Convert to string for consistency
        gender: vendor.gender,
        dob: vendor.dob,
        description: vendor.description,
      });
      setErrors({});
    } else if (type === "view" && vendor) {
      setSelectedVendor(vendor);
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedVendor(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);

    try {
      if (modalType === "add") {
        // Call API to create vendor
        await createVendor({
          vendor_name: formData.contactPerson!,
          phone: formData.phone!,
          email: formData.email!,
          password: formData.password!,
          gender: String(formData.gender || 1),
          dob: formData.dob!,
          shop_name: formData.companyName!,
          shop_address: formData.address!,
          description: formData.description || "",
          shop_logo: formData.shopLogo!,
          shop_banner: formData.shopBanner!,
        });
        
        // Reload vendors list
        await loadVendors();
        
        alert('Vendor created successfully!');
      } else if (modalType === "edit" && selectedVendor) {
        // Call API to update vendor
        await updateVendor(selectedVendor.id, {
          vendor_name: formData.contactPerson!,
          phone: formData.phone!,
          email: formData.email!,
          password: formData.password || undefined,
          gender: String(formData.gender || 1),
          dob: formData.dob!,
          shop_name: formData.companyName!,
          shop_address: formData.address!,
          description: formData.description || "",
          shop_status: formData.status !== undefined ? String(formData.status) : undefined,
          shop_logo: formData.shopLogo || null,
          shop_banner: formData.shopBanner || null,
        });
        
        // Reload vendors list
        await loadVendors();
        
        alert('Vendor updated successfully!');
      }

      handleCloseModal();
    } catch (err: any) {
      console.error('Error submitting vendor:', err);
      alert(err.message || 'Failed to save vendor');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((v) => v.id !== id));
    }
  };

  // Helper function to normalize status from API
  // Shop status: 0 = inactive, 1 = active, 2 = deleted
  const normalizeStatus = (status: any): "active" | "inactive" | "deleted" => {
    if (typeof status === 'number') {
      if (status === 1) return "active";
      if (status === 0) return "inactive";
      if (status === 2) return "deleted";
      return "inactive";
    }
    if (typeof status === 'string') {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus === 'active' || lowerStatus === '1') return "active";
      if (lowerStatus === 'inactive' || lowerStatus === '0') return "inactive";
      if (lowerStatus === 'deleted' || lowerStatus === '2') return "deleted";
      return "inactive";
    }
    return "inactive";
  };

  // Helper function to format status display
  const formatStatus = (status: any): string => {
    const normalized = normalizeStatus(status);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const getStatusColor = (status: any) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case "active":
        return "bg-success bg-opacity-10 text-success";
      case "inactive":
        return "bg-warning bg-opacity-10 text-warning";
      case "deleted":
        return "bg-danger bg-opacity-10 text-danger";
      default:
        return "bg-body bg-opacity-10 text-body";
    }
  };

  return (
    <>
      <PageMeta
        title="All Vendors - Ecommerce"
        description="View all vendors"
      />
      <PageBreadCrumb pageTitle="All Vendors" />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-sm border border-red-500 bg-red-50 p-4 mb-6 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500">
              <svg className="fill-white" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7v-2h2v2zm0-4H7V4h2v4z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h5 className="text-base font-semibold text-red-800 dark:text-red-300">Error Loading Vendors</h5>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={loadVendors}
              className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading */}
      {!loading && (
      <div className="grid grid-cols-1 gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-dark dark:bg-gray-900">
            <div className="flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-blue dark:text-white">
                  {vendors.length}
                </h4>
                <span className="text-sm font-medium dark:text-white">Total Vendors</span>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg
                  className="fill-blue dark:fill-white"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path d="M11 0C8.82441 0 6.69767 0.645139 4.88873 1.85383C3.07979 3.06253 1.66989 4.78049 0.83733 6.79048C0.00476617 8.80047 -0.213071 11.0122 0.211367 13.146C0.635804 15.2798 1.68345 17.2398 3.22183 18.7782C4.76021 20.3166 6.72022 21.3642 8.85401 21.7886C10.9878 22.2131 13.1995 21.9952 15.2095 21.1627C17.2195 20.3301 18.9375 18.9202 20.1462 17.1113C21.3549 15.3023 22 13.1756 22 11C22 8.08262 20.8411 5.28473 18.7782 3.22183C16.7153 1.15893 13.9174 0 11 0ZM11 20C9.21997 20 7.47991 19.4722 5.99987 18.4832C4.51983 17.4943 3.36628 16.0887 2.68509 14.4442C2.0039 12.7996 1.82567 10.99 2.17294 9.24419C2.5202 7.49836 3.37737 5.89471 4.63604 4.63604C5.89471 3.37737 7.49836 2.5202 9.24419 2.17294C10.99 1.82567 12.7996 2.0039 14.4442 2.68509C16.0887 3.36628 17.4943 4.51983 18.4832 5.99987C19.4722 7.47991 20 9.21997 20 11C20 13.3869 19.0518 15.6761 17.364 17.364C15.6761 19.0518 13.3869 20 11 20Z" />
                  <path d="M11 5C10.7348 5 10.4804 5.10536 10.2929 5.29289C10.1054 5.48043 10 5.73478 10 6V11C10 11.2652 10.1054 11.5196 10.2929 11.7071C10.4804 11.8946 10.7348 12 11 12C11.2652 12 11.5196 11.8946 11.7071 11.7071C11.8946 11.5196 12 11.2652 12 11V6C12 5.73478 11.8946 5.48043 11.7071 5.29289C11.5196 5.10536 11.2652 5 11 5Z" />
                  <path d="M11 13C10.7348 13 10.4804 13.1054 10.2929 13.2929C10.1054 13.4804 10 13.7348 10 14C10 14.2652 10.1054 14.5196 10.2929 14.7071C10.4804 14.8946 10.7348 15 11 15C11.2652 15 11.5196 14.8946 11.7071 14.7071C11.8946 14.5196 12 14.2652 12 14C12 13.7348 11.8946 13.4804 11.7071 13.2929C11.5196 13.1054 11.2652 13 11 13Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-white dark:bg-gray-900">
            <div className="flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-blue dark:text-white">
                  {vendors.filter((v) => normalizeStatus(v.status) === "active").length}
                </h4>
                <span className="text-sm font-medium dark:text-white">Active Vendors</span>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg
                  className="fill-blue dark:fill-white"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path d="M9.5 16.5L4.5 11.5L5.91 10.09L9.5 13.67L16.09 7.08L17.5 8.5L9.5 16.5Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-white dark:bg-gray-900">
            <div className="flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-blue dark:text-white">
                  {vendors.filter((v) => normalizeStatus(v.status) === "inactive").length}
                </h4>
                <span className="text-sm font-medium dark:text-white ">Inactive Vendors</span>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg
                  className="fill-blue dark:fill-white"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path d="M11 1L1 6L11 11L21 6L11 1Z" />
                  <path d="M1 16L11 21L21 16" />
                  <path d="M1 11L11 16L21 11" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-white dark:bg-gray-900">
            <div className="flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-blue dark:text-white">
                  {vendors.reduce((sum, v) => sum + v.totalOrders, 0)}
                </h4>
                <span className="text-sm font-medium dark:text-white">Total Orders</span>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg
                  className="fill-blue dark:fill-white"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" />
                  <path d="M3 6H21" />
                  <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-1/2">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendors by any detail..."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-blue outline-none transition focus:border-primary dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportCSV(displayedVendors)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-stroke bg-white px-4 py-2 text-center text-sm font-medium text-blue hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              Export CSV
            </button>

            <button
              onClick={() => handleOpenModal("add")}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 transition-all duration-200 lg:px-8 xl:px-10"
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
              Add Vendor
            </button>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-800 dark:bg-gray-900">
          <div className="px-4 py-6 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-blue dark:text-white">
              All Vendors ({vendors.length})
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[50px] px-4 py-4 font-medium text-blue dark:text-white xl:pl-11">
                    ID
                  </th>
                  <th className="min-w-[200px] px-4 py-4 font-medium text-blue dark:text-white">
                    Company
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-blue dark:text-white">
                    Contact Person
                  </th>
                  <th className="min-w-[200px] px-4 py-4 font-medium text-blue dark:text-white">
                    Email
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-blue dark:text-white">
                    Phone
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-blue dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-blue dark:text-white">
                    Orders
                  </th>
                  <th className="px-4 py-4 font-medium text-blue dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {vendors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="border-b border-[#eee] px-4 py-8 text-center dark:border-strokedark"
                    >
                      <p className="text-body">
                        No vendors found. Add your first vendor!
                      </p>
                    </td>
                  </tr>
                ) : (
                  displayedVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                        <p className="text-blue dark:text-white">
                          {vendor.id}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="font-medium text-blue dark:text-white">
                          {vendor.companyName}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-blue dark:text-white">
                          {vendor.contactPerson}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-blue dark:text-white">
                          {vendor.email}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-blue dark:text-white">
                          {vendor.phone}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-green-700">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium dark:text-white ${getStatusColor(
                            vendor.status
                          )}`}
                        >
                          {formatStatus(vendor.status)}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-blue dark:text-white">
                          {vendor.totalOrders}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-white">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenModal("view", vendor)}
                            className="dark:text-white hover:text-primary"
                            title="View Details"
                          >
                            <svg
                              className="h-5 w-5"
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
                            onClick={() => handleOpenModal("edit", vendor)}
                            className="dark:text-white hover:text-primary"
                            title="Edit"
                          >
                            <svg
                              className="h-5 w-5"
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
                          <button
                            onClick={() => handleDelete(vendor.id)}
                            className="dark:text-white hover:text-meta-1"
                            title="Delete"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
      {/* End Main Content */}

      {/* Add/Edit Vendor Modal */}
      {(modalType === "add" || modalType === "edit") && (
        <div className="fixed inset-0 z-99999 flex items-start md:items-center justify-center bg-blue bg-opacity-50 px-4 py-6">
          <div className="w-full max-w-lg md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-blue dark:text-white">
                {modalType === "add" ? "Add New Vendor" : "Edit Vendor"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Shop Name */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Shop Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shop name"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className={`w-full rounded-lg border ${
                      errors.companyName
                        ? "border-meta-1"
                        : "border-stroke dark:border-form-strokedark"
                    } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-meta-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* Vendor Name */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Vendor Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter vendor name"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                    className={`w-full rounded-lg border ${
                      errors.contactPerson
                        ? "border-meta-1"
                        : "border-stroke dark:border-form-strokedark"
                    } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-meta-1">
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full rounded-lg border ${
                      errors.email
                        ? "border-meta-1"
                        : "border-stroke dark:border-form-strokedark"
                    } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-meta-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Phone <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number with country code"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`w-full rounded-lg border ${
                      errors.phone
                        ? "border-meta-1"
                        : "border-stroke dark:border-form-strokedark"
                    } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-meta-1">{errors.phone}</p>
                  )}
                </div>

                {/* Password (only for add mode) */}
                {modalType === "add" && (
                  <div>
                    <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                      Password <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`w-full rounded-lg border ${
                        errors.password
                          ? "border-meta-1"
                          : "border-stroke dark:border-form-strokedark"
                      } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-meta-1">{errors.password}</p>
                    )}
                  </div>
                )}

                {/* Gender */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Gender <span className="text-meta-1">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value={1}>Male</option>
                    <option value={2}>Female</option>
                    <option value={3}>Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Date of Birth <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className={`w-full rounded-lg border ${
                      errors.dob
                        ? "border-meta-1"
                        : "border-stroke dark:border-form-strokedark"
                    } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                  />
                  {errors.dob && (
                    <p className="mt-1 text-sm text-meta-1">{errors.dob}</p>
                  )}
                </div>

                {/* Shop Address */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Shop Address <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shop address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className={`w-full rounded-lg border ${
                      errors.address
                        ? "border-meta-1"
                        : "border-stroke dark:border-form-strokedark"
                    } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-meta-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter shop description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>

                {/* Shop Logo */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Shop Logo {modalType === "add" && <span className="text-meta-1">*</span>}
                  </label>
                  
                  {/* Current Image Preview (edit mode) */}
                  {modalType === "edit" && selectedVendor?.shopLogoUrl && (
                    <div className="mb-3 rounded-lg border border-stroke p-3 dark:border-strokedark">
                      <p className="mb-2 text-xs text-body dark:text-bodydark">Current Logo:</p>
                      <img
                        src={selectedVendor.shopLogoUrl}
                        alt="Current Logo"
                        className="h-24 w-24 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, shopLogo: file });
                    }}
                    className={`w-full rounded-lg border ${
                      errors.shopLogo
                        ? "border-meta-1"
                        : "border-stroke dark:border-form-strokedark"
                    } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white file:mr-4 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-opacity-90`}
                  />
                  {errors.shopLogo && (
                    <p className="mt-1 text-sm text-meta-1">{errors.shopLogo}</p>
                  )}
                  {formData.shopLogo && (
                    <p className="mt-2 text-sm text-body">
                      New file selected: {formData.shopLogo.name}
                    </p>
                  )}
                  {modalType === "edit" && !formData.shopLogo && (
                    <p className="mt-1 text-xs text-body dark:text-bodydark">
                      Leave empty to keep current logo
                    </p>
                  )}
                </div>

                {/* Shop Banner */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Shop Banner {modalType === "add" && <span className="text-meta-1">*</span>}
                  </label>
                  
                  {/* Current Image Preview (edit mode) */}
                  {modalType === "edit" && selectedVendor?.shopBannerUrl && (
                    <div className="mb-3 rounded-lg border border-stroke p-3 dark:border-strokedark">
                      <p className="mb-2 text-xs text-body dark:text-bodydark">Current Banner:</p>
                      <img
                        src={selectedVendor.shopBannerUrl}
                        alt="Current Banner"
                        className="h-24 w-full rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, shopBanner: file });
                    }}
                    className={`w-full rounded-lg border ${
                      errors.shopBanner
                        ? "border-meta-1"
                        : "border-stroke dark:border-form-strokedark"
                    } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white file:mr-4 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-opacity-90`}
                  />
                  {errors.shopBanner && (
                    <p className="mt-1 text-sm text-meta-1">{errors.shopBanner}</p>
                  )}
                  {formData.shopBanner && (
                    <p className="mt-2 text-sm text-body">
                      New file selected: {formData.shopBanner.name}
                    </p>
                  )}
                  {modalType === "edit" && !formData.shopBanner && (
                    <p className="mt-1 text-xs text-body dark:text-bodydark">
                      Leave empty to keep current banner
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="1"
                        checked={String(formData.status) === "1"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          String(formData.status) === "1"
                            ? "border-green-500"
                            : "border-body"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            String(formData.status) === "1" ? "bg-green-500" : ""
                          }`}
                        />
                      </div>
                      <span className="text-sm text-blue dark:text-white">
                        Active
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="0"
                        checked={String(formData.status) === "0"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          String(formData.status) === "0"
                            ? "border-yellow-500"
                            : "border-body"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            String(formData.status) === "0" ? "bg-yellow-500" : ""
                          }`}
                        />
                      </div>
                      <span className="text-sm text-blue dark:text-white">
                        Inactive
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="2"
                        checked={String(formData.status) === "2"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          String(formData.status) === "2"
                            ? "border-red-500"
                            : "border-body"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            String(formData.status) === "2" ? "bg-red-500" : ""
                          }`}
                        />
                      </div>
                      <span className="text-sm text-blue dark:text-white">
                        Deleted
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitLoading}
                  className="rounded-lg border border-stroke px-6 py-2.5 text-center font-medium text-blue transition hover:border-blue hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:border-white dark:hover:bg-meta-4 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="rounded-lg bg-blue-700 px-6 py-2.5 text-center font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitLoading && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                  )}
                  {submitLoading ? 'Saving...' : modalType === "add" ? "Add Vendor" : "Update Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Vendor Modal */}
      {modalType === "view" && selectedVendor && (
        <div className="fixed inset-0 z-99999 flex items-start md:items-center justify-center bg-blue bg-opacity-50 px-4 py-6">
          <div className="w-full max-w-lg md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
            {/* Banner and Profile Section */}
            <div className="relative">
              {/* Banner Image */}
              <div className="h-36 sm:h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600">
                {selectedVendor.shopBannerUrl ? (
                  <img
                    src={selectedVendor.shopBannerUrl}
                    alt="Shop Banner"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                )}
              </div>

              {/* Profile Logo - Overlapping banner */}
              <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 -translate-x-1/2 transform">
                <div className="relative">
                  <div className="h-20 w-20 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg dark:border-boxdark dark:bg-boxdark">
                    {selectedVendor.shopLogoUrl ? (
                      <img
                        src={selectedVendor.shopLogoUrl}
                        alt="Shop Logo"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/128?text=Logo';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <svg
                          className="h-16 w-16 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Status Badge on Profile */}
                  <div className="absolute -bottom-1.5 -right-1.5 sm:bottom-0 sm:right-0 bg-green-600 rounded-full text-white">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        selectedVendor.status
                      )}`}
                    >
                      {formatStatus(selectedVendor.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Info Section */}
            <div className="px-6 pb-6 pt-20">
              {/* Name and Basic Info */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue dark:text-white mb-1">
                  {selectedVendor.companyName}
                </h3>
                <p className="text-base text-body dark:text-bodydark">
                  {selectedVendor.contactPerson}
                </p>
                {selectedVendor.description && (
                  <p className="mt-3 text-sm text-body dark:text-bodydark max-w-2xl mx-auto">
                    {selectedVendor.description}
                  </p>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg border border-stroke bg-gray-2 px-4 py-3 text-center dark:border-strokedark dark:bg-meta-4">
                  <h4 className="text-2xl font-bold text-blue dark:text-white">
                    {selectedVendor.totalOrders}
                  </h4>
                  <p className="text-sm text-body dark:text-bodydark">Total Orders</p>
                </div>
                <div className="rounded-lg border border-stroke bg-gray-2 px-4 py-3 text-center dark:border-strokedark dark:bg-meta-4">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-bold text-blue dark:text-white">
                      {selectedVendor.rating}
                    </span>
                    <svg
                      className="h-5 w-5 fill-warning"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                  <p className="text-sm text-body dark:text-bodydark">Rating</p>
                </div>
                <div className="rounded-lg border border-stroke bg-gray-2 px-4 py-3 text-center dark:border-strokedark dark:bg-meta-4">
                  <h4 className="text-2xl font-bold text-blue dark:text-white">
                    #{selectedVendor.id}
                  </h4>
                  <p className="text-sm text-body dark:text-bodydark">Vendor ID</p>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue dark:text-white border-b border-stroke pb-2 dark:border-strokedark">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-body dark:text-bodydark">Email</h5>
                      <p className="text-base font-semibold text-blue dark:text-white break-all">
                        {selectedVendor.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <svg className="h-5 w-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-body dark:text-bodydark">Phone</h5>
                      <p className="text-base font-semibold text-blue dark:text-white">
                        {selectedVendor.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <svg className="h-5 w-5 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-body dark:text-bodydark">Address</h5>
                    <p className="text-base font-semibold text-blue dark:text-white">
                      {selectedVendor.address || 'N/A'}
                      {selectedVendor.city && `, ${selectedVendor.city}`}
                      {selectedVendor.zipCode && ` - ${selectedVendor.zipCode}`}
                      {selectedVendor.country && `, ${selectedVendor.country}`}
                    </p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-blue dark:text-white border-b border-stroke pb-2 pt-4 dark:border-strokedark">
                  Additional Details
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h5 className="text-sm font-medium text-body dark:text-bodydark mb-1">Tax ID</h5>
                    <p className="text-base font-semibold text-blue dark:text-white">
                      {selectedVendor.taxId}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-body dark:text-bodydark mb-1">Joined Date</h5>
                    <p className="text-base font-semibold text-blue dark:text-white">
                      {new Date(selectedVendor.joinedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {selectedVendor.dob && (
                    <div>
                      <h5 className="text-sm font-medium text-body dark:text-bodydark mb-1">Date of Birth</h5>
                      <p className="text-base font-semibold text-blue dark:text-white">
                        {new Date(selectedVendor.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {selectedVendor.gender !== undefined && (
                    <div>
                      <h5 className="text-sm font-medium text-body dark:text-bodydark mb-1">Gender</h5>
                      <p className="text-base font-semibold text-blue dark:text-white">
                        {selectedVendor.gender === 1 ? 'Male' : selectedVendor.gender === 2 ? 'Female' : 'Other'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-stroke pt-6 dark:border-strokedark">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-stroke px-6 py-2.5 text-center font-medium text-blue transition hover:border-blue hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:border-white dark:hover:bg-meta-4"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                    handleOpenModal("edit", selectedVendor);
                  }}
                  className="rounded-lg bg-blue-700 px-6 py-2.5 text-center font-medium text-white transition hover:bg-opacity-90"
                >
                  Edit Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
