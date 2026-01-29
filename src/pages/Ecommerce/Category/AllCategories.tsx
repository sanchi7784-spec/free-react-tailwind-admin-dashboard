import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import Toast from "../../../components/common/Toast";
import {
  fetchAds,
  createAd,
  updateAd,
  Ad,
  AdStatus,
  getAdStatusLabel,
  getAdStatusColor,
} from "../../../api/ads";

export default function AllCategories() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Create banner form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  
  // Edit banner form state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editStatus, setEditStatus] = useState<AdStatus>(AdStatus.ACTIVE);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAds();
      setAds(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createTitle.trim() || !createImage) {
      setError("Please provide both title and image");
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);
      const response = await createAd(createTitle, createImage);
      setSuccess(response.detail || "Banner created successfully!");
      setShowCreateModal(false);
      setCreateTitle("");
      setCreateImage(null);
      loadAds();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create banner");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAd) return;

    try {
      setEditLoading(true);
      setError(null);
      const response = await updateAd(
        editingAd.ad_id,
        editTitle.trim() || undefined,
        editImage || undefined,
        editStatus
      );
      setSuccess(response.detail || "Banner updated successfully!");
      setShowEditModal(false);
      setEditingAd(null);
      setEditTitle("");
      setEditImage(null);
      loadAds();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update banner");
    } finally {
      setEditLoading(false);
    }
  };

  const openEditModal = (ad: Ad) => {
    setEditingAd(ad);
    setEditTitle(ad.title);
    setEditStatus(ad.status);
    setEditImage(null);
    setShowEditModal(true);
  };

  return (
    <>
      <PageMeta title="All Banners - Ecommerce" description="Manage all banners" />
      <PageBreadCrumb pageTitle="All Banners" />
      
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      
      {success && (
        <Toast
          message={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}

      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue dark:text-white">Banners Management</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
            Create Banner
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : ads.length === 0 ? (
          <p className="text-body text-center py-10">No banners found. Create your first banner!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-blue dark:text-white">ID</th>
                  <th className="py-4 px-4 font-medium text-blue dark:text-white">Title</th>
                  <th className="py-4 px-4 font-medium text-blue dark:text-white">Image</th>
                  <th className="py-4 px-4 font-medium text-blue dark:text-white">Status</th>
                  <th className="py-4 px-4 font-medium text-blue dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.ad_id} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-5 px-4">
                      <p className="text-blue dark:text-white">{ad.ad_id}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-blue dark:text-white">{ad.title}</p>
                    </td>
                    <td className="py-5 px-4">
                      <img 
                        src={ad.image_url} 
                        alt={ad.title}
                        className="h-20 w-32 object-cover rounded"
                      />
                    </td>
                    <td className="py-5 px-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getAdStatusColor(ad.status)}`}>
                        {getAdStatusLabel(ad.status)}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <button
                        onClick={() => openEditModal(ad)}
                        className="hover:text-primary"
                      >
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-blue/50 px-4">
          <div className="relative w-full max-w-142.5 rounded-lg bg-white p-8 shadow-xl dark:bg-boxdark">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue dark:text-white">Create New Banner</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateBanner}>
              <div className="mb-4">
                <label className="mb-2.5 block text-blue dark:text-white">
                  Title <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Enter banner title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-blue dark:text-white">
                  Banner Image <span className="text-meta-1">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCreateImage(e.target.files?.[0] || null)}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="inline-flex items-center justify-center rounded-md border border-stroke py-3 px-6 text-center font-medium text-blue hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingAd && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-blue/50 px-4">
          <div className="relative w-full max-w-142.5 rounded-lg bg-white p-8 shadow-xl dark:bg-boxdark">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue dark:text-white">Edit Banner</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditBanner}>
              <div className="mb-4">
                <label className="mb-2.5 block text-blue dark:text-white">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter banner title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block text-blue dark:text-white">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(parseInt(e.target.value) as AdStatus)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 active:border-blue-600 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
                >
                  <option value={AdStatus.ACTIVE}>Active</option>
                  <option value={AdStatus.INACTIVE}>Inactive</option>
                  <option value={AdStatus.DELETED}>Deleted</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block text-blue dark:text-white">
                  Current Image
                </label>
                <img 
                  src={editingAd.image_url} 
                  alt={editingAd.title}
                  className="h-32 w-48 object-cover rounded mb-2"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-blue dark:text-white">
                  New Banner Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="inline-flex items-center justify-center rounded-md border border-stroke py-3 px-6 text-center font-medium text-blue hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                >
                  {editLoading ? "Updating..." : "Update Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
