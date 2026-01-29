import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import Toast from "../../../components/common/Toast";
import { fetchCategories, createCategory, updateCategory, Category as APICategory } from "../../../api/products";
import CreateCategoryModal from "../../../components/ecommerce/CreateCategoryModal";
import EditCategoryModal from "../../../components/ecommerce/EditCategoryModal";

interface Category {
  id: number;
  name: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  parentId?: number | null;
  imageUrl: string;
  addedBy: string;
}

// Status mapping helper
const getStatusInfo = (status: number) => {
  const statusMap: Record<number, { label: string; className: string }> = {
    0: { label: "Inactive", className: "bg-warning bg-opacity-10 text-warning" },
    1: { label: "Active", className: "bg-success bg-opacity-10 text-success" },
    2: { label: "Deleted", className: "bg-danger bg-opacity-10 text-danger" },
  };
  return statusMap[status] || { label: "Unknown", className: "bg-secondary bg-opacity-10 text-secondary" };
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: 1,
    parentId: null as number | null,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCategories();
      
      // Map API response to component Category interface
      const allCategories: Category[] = response.data.map((cat) => ({
        id: cat.category_id,
        name: cat.category_name,
        description: cat.category_name,
        status: cat.status,
        createdAt: new Date(cat.created_at).toLocaleDateString(),
        updatedAt: new Date(cat.updated_at).toLocaleDateString(),
        parentId: cat.parent_id,
        imageUrl: cat.image_url,
        addedBy: cat.added_by,
      }));
      
      // Separate categories and subcategories
      const mainCategories = allCategories.filter(cat => !cat.parentId);
      const subCategories = allCategories.filter(cat => cat.parentId);
      
      setCategories(mainCategories);
      setSubcategories(subCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Category name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  const handleCreateCategory = async (categoryData: { name: string; parentId: number | null; image: File | null }) => {
    try {
      setIsCreating(true);
      setError(null);

      const response = await createCategory({
        category_name: categoryData.name,
        parent_id: categoryData.parentId ? String(categoryData.parentId) : undefined,
        image: categoryData.image || undefined,
      });

      // Reload categories after successful creation
      await loadCategories();
      setIsCreateModalOpen(false);
      
      // Show success toast
      setToast({ message: 'Category created successfully!', type: 'success' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingId) {
      // Update existing category
      setCategories(
        categories.map((cat) =>
          cat.id === editingId
            ? { ...cat, ...formData }
            : cat
        )
      );
    } else {
      // Add new category
      const newCategory: Category = {
        id: categories.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        imageUrl: "https://via.placeholder.com/48?text=New",
        addedBy: "Admin",
      };
      setCategories([...categories, newCategory]);
    }

    // Reset form
    setFormData({ name: "", description: "", status: 1, parentId: null });
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async (categoryData: { 
    id: number;
    name: string; 
    parentId: number | null; 
    status: number;
    image: File | null;
  }) => {
    try {
      setIsUpdating(true);
      setError(null);

      console.log('Updating category with data:', {
        id: categoryData.id,
        name: categoryData.name,
        parentId: categoryData.parentId,
        status: categoryData.status,
        hasImage: !!categoryData.image
      });

      const response = await updateCategory(categoryData.id, {
        category_name: categoryData.name,
        parent_id: categoryData.parentId !== null ? String(categoryData.parentId) : "-1",
        category_status: String(categoryData.status),
        image: categoryData.image || undefined,
      });

      console.log('Update response:', response);

      // Reload categories after successful update
      await loadCategories();
      setIsEditModalOpen(false);
      setEditingCategory(null);
      
      // Show success toast
      setToast({ message: 'Category updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Error updating category:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };



  const handleCancel = () => {
    setFormData({ name: "", description: "", status: 1, parentId: null });
    setErrors({ name: "", description: "" });
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <>
      <PageMeta
        title="Product Categories - Ecommerce"
        description="Manage product categories"
      />
      <PageBreadCrumb pageTitle="Product Categories" />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Add Category Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
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
            Add Category
          </button>
        </div>

        {/* Create Category Modal */}
        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCategory}
          categories={categories}
          isLoading={isCreating}
        />

        {/* Edit Category Modal */}
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCategory(null);
          }}
          onSubmit={handleUpdateCategory}
          categories={categories}
          category={editingCategory}
          isLoading={isUpdating}
        />

        {/* Category Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-blue/50  bg-opacity-50 px-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
              <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
                <h3 className="text-xl font-semibold text-blue dark:text-white">
                  {editingId ? "Edit Category" : "Create New Category"} 
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5">
                  {/* Category Name */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                      Category Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full rounded-lg border ${
                        errors.name
                          ? "border-meta-1"
                          : "border-stroke dark:border-form-strokedark"
                      } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-meta-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                      Description <span className="text-meta-1">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter category description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className={`w-full rounded-lg border ${
                        errors.description
                          ? "border-meta-1"
                          : "border-stroke dark:border-form-strokedark"
                      } bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-meta-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Parent Category */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                      Parent Category (Optional)
                    </label>
                    <select
                      value={formData.parentId || ""}
                      onChange={(e) =>
                        setFormData({ 
                          ...formData, 
                          parentId: e.target.value ? Number(e.target.value) : null 
                        })
                      }
                      className="w-full rounded-lg border border-stroke dark:border-form-strokedark bg-transparent px-5 py-3 text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    >
                      <option value="">None (Main Category)</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-body">
                      Leave empty to create a main category, or select a parent to create a subcategory
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value="1"
                          checked={formData.status === 1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: Number(e.target.value),
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            formData.status === 1
                              ? "border-primary"
                              : "border-body"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              formData.status === 1 ? "bg-primary" : ""
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
                          checked={formData.status === 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: Number(e.target.value),
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            formData.status === 0
                              ? "border-primary"
                              : "border-body"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              formData.status === 0 ? "bg-primary" : ""
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
                          checked={formData.status === 2}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: Number(e.target.value),
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            formData.status === 2
                              ? "border-blue-600"
                              : "border-body"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              formData.status === 2 ? "bg-blue-600" : ""
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
                    onClick={handleCancel}
                    className="rounded-lg border border-stroke px-6 py-2.5 text-center font-medium text-blue transition hover:border-blue hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:border-white dark:hover:bg-meta-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-center font-medium text-white transition hover:bg-opacity-90"
                  >
                    {editingId ? "Update Category" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 py-6 md:px-6 xl:px-7.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold text-blue dark:text-white">
                Main Categories ({categories.length})
              </h4>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-body">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mx-4 mb-4 rounded-lg border border-meta-1 bg-meta-1 bg-opacity-10 px-4 py-3 md:mx-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-meta-1">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="mb-1 font-semibold text-meta-1">Error Loading Categories</h5>
                  <p className="text-sm text-body">{error}</p>
                </div>
                <button
                  onClick={loadCategories}
                  className="rounded-lg border border-meta-1 px-4 py-2 text-sm font-medium text-meta-1 hover:bg-meta-1 hover:text-white"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[50px] px-4 py-4 font-medium text-blue dark:text-white xl:pl-11">
                    ID
                  </th>
                  <th className="min-w-[80px] px-4 py-4 font-medium text-blue dark:text-white">
                    Image
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-blue dark:text-white">
                    Name
                  </th>
                  <th className="min-w-[200px] px-4 py-4 font-medium text-blue dark:text-white">
                    Description
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-blue dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-blue dark:text-white">
                    Created At
                  </th>
                  <th className="px-4 py-4 font-medium text-blue dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="border-b border-[#eee] px-4 py-8 text-center dark:border-strokedark"
                    >
                      <div className="flex items-center justify-center gap-2 text-body">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading categories...
                      </div>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="border-b border-[#eee] px-4 py-8 text-center dark:border-strokedark"
                    >
                      <p className="text-body">No categories found. Create your first category!</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category.id}>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                        <p className="text-blue dark:text-white">
                          {category.id}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <img 
                          src={category.imageUrl} 
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="font-medium text-blue dark:text-white">
                          {category.name}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-blue dark:text-white">
                          {category.description}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusInfo(category.status).className}`}
                        >
                          {getStatusInfo(category.status).label}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-blue dark:text-white">
                          {category.createdAt}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(category)}
                            className="hover:text-primary"
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subcategories Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 py-6 md:px-6 xl:px-7.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold text-blue dark:text-white">
                Subcategories ({subcategories.length})
              </h4>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[50px] px-4 py-4 font-medium text-blue dark:text-white xl:pl-11">
                    ID
                  </th>
                  <th className="min-w-[80px] px-4 py-4 font-medium text-blue dark:text-white">
                    Image
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-blue dark:text-white">
                    Name
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-blue dark:text-white">
                    Parent Category
                  </th>
                  <th className="min-w-[200px] px-4 py-4 font-medium text-blue dark:text-white">
                    Description
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-blue dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-blue dark:text-white">
                    Created At
                  </th>
                  <th className="px-4 py-4 font-medium text-blue dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && subcategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="border-b border-[#eee] px-4 py-8 text-center dark:border-strokedark"
                    >
                      <div className="flex items-center justify-center gap-2 text-body">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading subcategories...
                      </div>
                    </td>
                  </tr>
                ) : subcategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="border-b border-[#eee] px-4 py-8 text-center dark:border-strokedark"
                    >
                      <p className="text-body">No subcategories found. Create a subcategory by selecting a parent category!</p>
                    </td>
                  </tr>
                ) : (
                  subcategories.map((category) => {
                    const parentCategory = categories.find(c => c.id === category.parentId);
                    return (
                      <tr key={category.id}>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                          <p className="text-blue dark:text-white">
                            {category.id}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
                            }}
                          />
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <p className="font-medium text-blue dark:text-white">
                            {category.name}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <span className="inline-flex rounded-full bg-primary bg-opacity-10 px-3 py-1 text-sm font-medium text-primary">
                            {parentCategory?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <p className="text-blue dark:text-white">
                            {category.description}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusInfo(category.status).className}`}
                          >
                            {getStatusInfo(category.status).label}
                          </span>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <p className="text-blue dark:text-white">
                            {category.createdAt}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(category)}
                              className="hover:text-primary"
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
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
