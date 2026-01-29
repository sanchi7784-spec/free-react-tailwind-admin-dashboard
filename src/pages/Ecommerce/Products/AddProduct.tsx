import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { createProduct, fetchCategories, Category } from "../../../api/products";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    discount: "",
    quantity: "",
    description: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Error loading categories:", err);
      // Set fallback categories if API fails
      setCategories([
        { 
          category_id: 1, 
          category_name: "Fruits",
          parent_id: null,
          status: 1,
          added_by: "System",
          image_url: "https://via.placeholder.com/48?text=Fruits",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          category_id: 2, 
          category_name: "Vegetables",
          parent_id: null,
          status: 1,
          added_by: "System",
          image_url: "https://via.placeholder.com/48?text=Vegetables",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          category_id: 3, 
          category_name: "Flour",
          parent_id: null,
          status: 1,
          added_by: "System",
          image_url: "https://via.placeholder.com/48?text=Flour",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          category_id: 4, 
          category_name: "Dairy Products",
          parent_id: null,
          status: 1,
          added_by: "System",
          image_url: "https://via.placeholder.com/48?text=Dairy",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!image) {
      setError("Please upload a product image");
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        product_name: formData.productName,
        description: formData.description,
        category_id: formData.category,
        price: formData.price,
        discount: formData.discount || "0",
        stock_quantity: formData.quantity,
        product_image: image,
      });

      setSuccess(true);
      
      // Reset form
      setFormData({
        productName: "",
        category: "",
        price: "",
        discount: "",
        quantity: "",
        description: "",
      });
      setImage(null);
      setImagePreview("");

      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        navigate("/ecommerce/products/all");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Add Product - Ecommerce" description="Add a new ecommerce product" />
      <PageBreadCrumb pageTitle="Add Product" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="rounded-md border border-green-500 bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Product created successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-md border border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Product Information Section */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6.5">
            <h3 className="font-semibold text-blue dark:text-white">
              Product Information
            </h3>
          </div>
          
          <div className="p-4 sm:p-6.5">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Product Name */}
              <div className="lg:col-span-2">
                <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                  Product Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                  Category <span className="text-meta-1">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                  Price <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body">
                    ₹
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                  Stock Quantity <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  required
                  min="0"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                  Description <span className="text-meta-1">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Enter detailed product description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-blue outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Product Image Section */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6.5">
            <h3 className="font-semibold text-blue dark:text-white">
              Product Image <span className="text-meta-1">*</span>
            </h3>
          </div>
          
          <div className="p-4 sm:p-6.5">
            <div className="flex items-center justify-center border-2 border-dashed border-stroke rounded-lg p-8 dark:border-strokedark">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="product-image"
                />
                <label
                  htmlFor="product-image"
                  className="flex cursor-pointer flex-col items-center justify-center gap-4"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                        fill=""
                      />
                      <path d="M11 7H13V13H11V7Z" fill="" />
                      <path d="M7 11H17V13H7V11Z" fill="" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm font-medium text-blue dark:text-white">
                    <span className="text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-body">PNG, JPG, WEBP up to 10MB</p>
                </label>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-6">
                <label className="mb-3 block text-sm font-medium text-blue dark:text-white">
                  Preview
                </label>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-48 rounded-lg border border-stroke object-cover dark:border-strokedark"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-meta-1 text-white hover:bg-opacity-90"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/ecommerce/products/all")}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-stroke px-6 py-3 text-center font-medium text-blue hover:shadow-1 disabled:opacity-50 dark:border-strokedark dark:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
