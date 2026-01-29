import { useState } from "react";

interface Category {
  id: number;
  name: string;
  description: string;
  status: number;
  parentId?: number | null;
}

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryData: { name: string; parentId: number | null; image: File | null }) => void;
  categories: Category[];
  isLoading?: boolean;
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  isLoading = false,
}: CreateCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    parentId: null as number | null,
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    name: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Category name must be at least 3 characters";
    }

    setErrors(newErrors);
    return !newErrors.name;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name,
      parentId: formData.parentId,
      image: selectedImage,
    });
    
    // Reset form
    setFormData({ name: "", parentId: null });
    setSelectedImage(null);
    setImagePreview(null);
    setErrors({ name: "" });
  };

  const handleCancel = () => {
    setFormData({ name: "", parentId: null });
    setSelectedImage(null);
    setImagePreview(null);
    setErrors({ name: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-blue/50 bg-opacity-50 px-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
        {/* Modal Header */}
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-blue dark:text-white">
              Create New Category
            </h3>
            <button
              onClick={handleCancel}
              className="text-body hover:text-blue dark:hover:text-white transition-colors"
            >
              <svg
                className="h-6 w-6"
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
        </div>

        {/* Modal Body */}
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

            {/* Image Upload */}
            <div>
              <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                Category Image
              </label>
              
              {imagePreview && (
                <div className="mb-3 flex items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-lg object-cover border border-stroke dark:border-strokedark"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-meta-1 hover:text-red-600 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full cursor-pointer rounded-lg border border-stroke dark:border-form-strokedark bg-transparent px-5 py-3 text-blue outline-none transition file:mr-4 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-opacity-90 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
              <p className="mt-1 text-sm text-body">
                Upload an image for the category (JPG, PNG, max 2MB)
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-lg border border-stroke px-6 py-2.5 text-center font-medium text-blue transition hover:border-blue hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:border-white dark:hover:bg-meta-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-center font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
