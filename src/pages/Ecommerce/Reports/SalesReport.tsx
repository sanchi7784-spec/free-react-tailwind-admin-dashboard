import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { getProfile, updateProfile, ProfileData, UpdateProfileData } from "../../../api/profile";
import Toast from "../../../components/common/Toast";

// Role mapping
const ROLE_NAMES: Record<number, string> = {
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

const getRoleName = (roleId: number): string => {
  return ROLE_NAMES[roleId] || `Unknown (${roleId})`;
};

export default function SalesReport() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateProfileData>({});
  const [shopLogoPreview, setShopLogoPreview] = useState<string | null>(null);
  const [shopBannerPreview, setShopBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      setProfile(response.data);
      // Initialize form data with current profile values
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || "",
        gender: response.data.gender || "",
        dob: response.data.dob || "",
        shop_name: response.data.shop_name || "",
        shop_address: response.data.shop_address || "",
        shop_description: response.data.shop_description || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "shop_logo" | "shop_banner") => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "shop_logo") {
          setShopLogoPreview(reader.result as string);
        } else {
          setShopBannerPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateProfile(formData);
      setSuccess(response.detail || "Profile updated successfully");
      setIsEditing(false);
      // Refresh profile data
      await fetchProfile();
      // Reset previews
      setShopLogoPreview(null);
      setShopBannerPreview(null);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShopLogoPreview(null);
    setShopBannerPreview(null);
    // Reset form data to current profile
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
        gender: profile.gender || "",
        dob: profile.dob || "",
        shop_name: profile.shop_name || "",
        shop_address: profile.shop_address || "",
        shop_description: profile.shop_description || "",
      });
    }
  };

  if (loading) {
    return (
      <>
        <PageMeta title="Profile - Loading" description="Loading profile" />
        <PageBreadCrumb pageTitle="Profile" />
        <div className="flex h-96 items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Profile Details - Dashboard" description="View and manage your profile" />
      <PageBreadCrumb pageTitle="Profile Details" />

      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess(null)} />}

      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue dark:text-white">
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-lg border border-stroke bg-gray-2 p-5 dark:border-strokedark dark:bg-meta-4">
              <h3 className="mb-4 text-lg font-semibold text-blue dark:text-white">
                Basic Information
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Name</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {profile?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Email</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {profile?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Phone</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {profile?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Role</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {getRoleName(profile?.role_id || 0)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Date of Birth</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {profile?.dob || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Gender</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {profile?.gender === 1 ? "Male" : profile?.gender === 2 ? "Female" : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">KYC Status</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    profile?.kyc_status === 1 
                      ? "bg-success bg-opacity-10 text-success" 
                      : "bg-warning bg-opacity-10 text-warning"
                  }`}>
                    {profile?.kyc_status === 1 ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Account Status</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    profile?.status === 1 
                      ? "bg-success bg-opacity-10 text-success" 
                      : "bg-danger bg-opacity-10 text-danger"
                  }`}>
                    {profile?.status === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Information */}
            <div className="rounded-lg border border-stroke bg-gray-2 p-5 dark:border-strokedark dark:bg-meta-4">
              <h3 className="mb-4 text-lg font-semibold text-blue dark:text-white">
                Shop Information
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Shop Name</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {profile?.shop_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-bodydark">Shop Status</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    profile?.shop_status === 1 
                      ? "bg-success bg-opacity-10 text-success" 
                      : "bg-meta-1 bg-opacity-10 text-meta-1"
                  }`}>
                    {profile?.shop_status === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-1 text-sm font-medium text-bodydark">Shop Address</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {profile?.shop_address || "N/A"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-1 text-sm font-medium text-bodydark">Shop Description</p>
                  <p className="font-semibold text-blue dark:text-white">
                    {profile?.shop_description || "N/A"}
                  </p>
                </div>
                {profile?.shop_logo_url && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-bodydark">Shop Logo</p>
                    <img
                      src={profile.shop_logo_url}
                      alt="Shop Logo"
                      className="h-24 w-24 rounded-lg border border-stroke object-cover"
                    />
                  </div>
                )}
                {profile?.shop_banner_url && (
                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm font-medium text-bodydark">Shop Banner</p>
                    <img
                      src={profile.shop_banner_url}
                      alt="Shop Banner"
                      className="h-32 w-full rounded-lg border border-stroke object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-lg border border-stroke bg-gray-2 p-5 dark:border-strokedark dark:bg-meta-4">
              <h3 className="mb-4 text-lg font-semibold text-blue dark:text-white">
                Basic Information
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="+911234567890"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shop Information */}
            <div className="rounded-lg border border-stroke bg-gray-2 p-5 dark:border-strokedark dark:bg-meta-4">
              <h3 className="mb-4 text-lg font-semibold text-blue dark:text-white">
                Shop Information
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="shop_name"
                    value={formData.shop_name || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Enter shop name"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Shop Address
                  </label>
                  <input
                    type="text"
                    name="shop_address"
                    value={formData.shop_address || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Enter shop address"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Shop Description
                  </label>
                  <textarea
                    name="shop_description"
                    value={formData.shop_description || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Enter shop description"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Shop Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "shop_logo")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {(shopLogoPreview || profile?.shop_logo_url) && (
                    <img
                      src={shopLogoPreview || profile?.shop_logo_url || ""}
                      alt="Shop Logo Preview"
                      className="mt-3 h-24 w-24 rounded-lg border border-stroke object-cover"
                    />
                  )}
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Shop Banner
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "shop_banner")}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {(shopBannerPreview || profile?.shop_banner_url) && (
                    <img
                      src={shopBannerPreview || profile?.shop_banner_url || ""}
                      alt="Shop Banner Preview"
                      className="mt-3 h-32 w-full rounded-lg border border-stroke object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={updating}
                className="inline-flex items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium text-blue hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
