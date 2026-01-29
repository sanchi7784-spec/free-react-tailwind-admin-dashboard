import { useState, useMemo, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import Badge from "../../../components/ui/badge/Badge";
import { fetchProducts, Product as APIProduct, updateProduct, fetchCategories } from "../../../api/products";
import { getProfile } from "../../../api/profile";

type ViewMode = "table" | "grid";
type CategoryFilter = "all" | string;
type StatusFilter = "all" | "active" | "inactive" | "out-of-stock" | "pending";

type Product = APIProduct;

type EditProductFormData = {
  product_name: string;
  category_id: string;
  price: string;
  stock_quantity: string;
  description: string;
  discount: string;
  status: string;
};

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<Array<{ category_id: number; category_name: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditProductFormData>({
    product_name: "",
    category_id: "",
    price: "",
    stock_quantity: "",
    description: "",
    discount: "",
    status: "1",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserRoleId, setCurrentUserRoleId] = useState<number | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(null);

  // Load products from API
  useEffect(() => {
    loadProducts();
    loadCategories();
    // load current user profile to determine role
    (async () => {
      try {
        const profile = await getProfile();
        setCurrentUserRoleId(profile.data?.role_id ?? null);
      } catch (e) {
        console.warn('Failed to load profile for role check', e);
        setCurrentUserRoleId(null);
      }
    })();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategoriesData(response.data.map(cat => ({
        category_id: cat.category_id,
        category_name: cat.category_name
      })));
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProducts();
      setProducts(response.data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(response.data.map((p) => p.category_name))
      );
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch =
        searchQuery === "" ||
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.added_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product_id.toString().includes(searchQuery);

      const categoryMatch =
        categoryFilter === "all" || product.category_name === categoryFilter;

      const statusMatch =
        statusFilter === "all" || 
        (statusFilter === "active" && product.status === 1) ||
        (statusFilter === "inactive" && product.status === 0) ||
        (statusFilter === "out-of-stock" && product.stock_quantity === 0) ||
        (statusFilter === "pending" && product.status === 3);

      // Role filter: prefer explicit `added_by_role_id` if provided by API,
      // otherwise match by `added_by` text containing role name.
      const roleMap: Record<string, string> = {
        '1': 'Vendor',
        '2': 'Admin',
        '4': 'Product Manager',
        '99': 'Super Admin',
      };

      let roleMatch = true;
      if (roleFilter !== 'all') {
        const explicitRole = (product as any).role_id ?? (product as any).added_by_role_id;
        if (explicitRole !== undefined && explicitRole !== null) {
          roleMatch = explicitRole.toString() === roleFilter;
        } else if (product.added_by) {
          const roleName = roleMap[roleFilter];
          roleMatch = roleName ? product.added_by.toLowerCase().includes(roleName.toLowerCase()) : false;
        } else {
          roleMatch = false;
        }
      }

      return searchMatch && categoryMatch && statusMatch && roleMatch;
    });
  }, [products, searchQuery, categoryFilter, statusFilter, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, roleFilter]);

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <Badge variant="light" color="success" size="sm">
          Active / Approved
        </Badge>
      );
    }
    if (status === 0) {
      return (
        <Badge variant="light" color="warning" size="sm">
          Inactive / Rejected
        </Badge>
      );
    }
    if (status === 2) {
      return (
        <Badge variant="light" color="error" size="sm">
          Deleted
        </Badge>
      );
    }
    if (status === 3) {
      return (
        <Badge variant="light" color="info" size="sm">
          Pending Approval
        </Badge>
      );
    }
    return (
      <Badge variant="light" color="light" size="sm">
        Unknown
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, any> = {
      "Fruits": "success",
      "Vegetables": "info",
      "Flour": "warning",
      "Dairy Products": "primary",
    };
    return (
      <Badge variant="light" color={colors[category] || "light"} size="sm">
        {category}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const getProductInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getProductColor = (id: number) => {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
    ];
    return colors[id % colors.length];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData({
      product_name: product.product_name,
      category_id: product.category_id.toString(),
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      description: product.description,
      discount: product.discount.toString(),
      status: product.status.toString(),
    });
    setImagePreview(product.image_url);
    setSelectedImage(null);
    setIsEditModalOpen(true);
  };

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

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;

    setIsSaving(true);
    setError(null);

    try {
      console.log('Updating product with data:', {
        id: selectedProduct.product_id,
        ...editFormData,
        hasImage: !!selectedImage
      });

      await updateProduct(selectedProduct.product_id, {
        product_name: editFormData.product_name,
        description: editFormData.description,
        category_id: editFormData.category_id,
        price: editFormData.price,
        discount: editFormData.discount,
        stock_quantity: editFormData.stock_quantity,
        product_image: selectedImage || undefined,
      });

      // Reload products after successful update
      await loadProducts();
      handleCloseModals();
      
      // Show success message
      alert('Product updated successfully!');
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleEditFormChange = (field: keyof EditProductFormData, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    setIsSaving(true);
    setError(null);

    try {
      console.log('Updating product with data:', {
        id: selectedProduct.product_id,
        ...editFormData,
        hasImage: !!selectedImage
      });

      await updateProduct(selectedProduct.product_id, {
        product_name: editFormData.product_name,
        description: editFormData.description,
        category_id: editFormData.category_id,
        price: editFormData.price,
        discount: editFormData.discount,
        stock_quantity: editFormData.stock_quantity,
        status: editFormData.status,
        product_image: selectedImage || undefined,
      });

      // Reload products after successful update
      await loadProducts();
      handleCloseModals();
      
      // Show success message
      alert('Product updated successfully!');
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeProductStatus = async (productId: number, newStatus: number) => {
    setUpdatingProductId(productId);
    try {
      await updateProduct(productId, { status: String(newStatus) });
      await loadProducts();
    } catch (err) {
      console.error('Failed to update product status:', err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Remove the renderStars function as we don't have rating data from API

  return (
    <>
      <PageMeta title="All Products - Ecommerce" description="View all ecommerce products" />
      <PageBreadCrumb pageTitle="All Products" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-600 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-stroke px-7.5 py-6 dark:border-gray-600">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue dark:text-white">All Products</h2>
              <p className="text-sm text-body mt-1 dark:text-white">
                Manage your product inventory ({filteredProducts.length} of {products.length})
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 rounded-md border border-stroke p-1 dark:border-strokedark">
                <button
                  onClick={() => setViewMode("table")}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-blue-700 dark:text-white"
                      : "text-body hover:bg-gray-2 dark:hover:bg-meta-4"
                  }`}
                >
                  <svg
                    className="h-4 w-4 dark:text-white "
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
                  className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 dark:text-white"
                      : "text-body hover:bg-gray-2 dark:hover:bg-meta-4"
                  }`}
                >
                  <svg
                    className="h-4 w-4 dark:text-white"
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
                onClick={loadProducts}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
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
            </div>
          </div>
        </div>

        {/* NOTE for vendor products */}
        {(roleFilter === '1' || currentUserRoleId === 1) && (
          <div className="px-7.5 py-4">
            <div className="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20">
              <strong className="block font-medium text-yellow-800">Note for Vendors !!</strong>
              <p className="mt-1">
                Products added by vendors are not published directly on the ecommerce website. After adding a product,
                the vendor must wait for approval or rejection by Admin, Product Manager, or Super Admin. The product will
                remain in "Pending" status until it is approved or rejected.
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="border-b border-stroke px-7.5 py-4 dark:border-strokedark">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, category, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-700 dark:border-gray-700 dark:text-white"
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

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue dark:text-white whitespace-nowrap">
                Category:
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                className="rounded-md border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gray-800 dark:border-gray-800 text-blue dark:text-white"
              >
                <option value="all" className="text-blue">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-blue">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue dark:text-white whitespace-nowrap">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="rounded-md border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gray-800 dark:border-gray-800 text-blue dark:text-white"
              >
                <option value="all" className="text-blue">All</option>
                <option value="active" className="text-blue">Active</option>
                <option value="inactive" className="text-blue">Inactive</option>
                <option value="out-of-stock" className="text-blue">Out of Stock</option>
                <option value="pending" className="text-blue">Pending</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue dark:text-white whitespace-nowrap">Added By:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-md border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gray-800 dark:border-gray-800 text-blue dark:text-white"
              >
                <option value="all" className="text-blue">All</option>
                <option value="1" className="text-blue">Vendor</option>
                <option value="2" className="text-blue">Admin</option>
                <option value="4" className="text-blue">Product Manager</option>
                <option value="99" className="text-blue">Super Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-7.5">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-center dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={loadProducts}
                className="mt-2 text-sm font-medium text-red-700 underline dark:text-red-300"
              >
                Try Again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-2  border-solid border-gray-900 border-t-gray-900"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-blue dark:text-white">
                No Products Found
              </h3>
              <p className="mt-2 text-sm text-body">
                {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters or search query"
                  : "No products available"}
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-stroke text-left dark:border-strokedark">
                    <th className="px-4 py-4 font-semibold text-blue dark:text-white">
                      Product
                    </th>
                    <th className="px-4 py-4 font-semibold text-blue dark:text-white">
                      Category
                    </th>
                    <th className="px-4 py-4 font-semibold text-blue dark:text-white">
                      Price / Discount
                    </th>
                    <th className="px-4 py-4 font-semibold text-blue dark:text-white">
                      Stock
                    </th>
                    <th className="px-4 py-4 font-semibold text-blue dark:text-white">
                      Status
                    </th>
                    <th className="px-4 py-4 font-semibold text-blue dark:text-white">
                      Added By
                    </th>
                    <th className="px-4 py-4 font-semibold text-blue dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.product_id}
                      className="border-b border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    >
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.product_name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold text-white"
                              style={{ backgroundColor: getProductColor(product.product_id) }}
                            >
                              {getProductInitials(product.product_name)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-blue dark:text-white">
                              {product.product_name}
                            </p>
                            <p className="text-xs text-body">ID: {product.product_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">{getCategoryBadge(product.category_name)}</td>
                      <td className="px-4 py-5">
                        <div>
                          <span className="font-semibold text-blue dark:text-white">
                            {formatPrice(product.price)}
                          </span>
                          {product.discount > 0 && (
                            <p className="text-xs text-green-600">
                              {product.discount}% off
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`font-medium ${
                            product.stock_quantity === 0
                              ? "text-red-500"
                              : product.stock_quantity < 5
                              ? "text-orange-500"
                              : "text-blue dark:text-white"
                          }`}
                        >
                          {product.stock_quantity} units
                        </span>
                      </td>
                      <td className="px-4 py-5">{getStatusBadge(product.status)}</td>
                      <td className="px-4 py-5">
                        <span className="text-sm text-body">{product.added_by}</span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="rounded p-1.5 hover:bg-gray-3 dark:hover:bg-meta-4"
                            title="View Details"
                          >
                            <svg
                              className="h-5 w-5 text-primary"
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
                            onClick={() => handleEditProduct(product)}
                            className="rounded p-1.5 hover:bg-gray-3 dark:hover:bg-meta-4"
                            title="Edit Product"
                          >
                            <svg
                              className="h-5 w-5 text-body"
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
                          {product.role_id === 1 && currentUserRoleId !== null && [2,4,99].includes(currentUserRoleId) && (
                            <select
                              value={String(product.status)}
                              onChange={(e) => handleChangeProductStatus(product.product_id, parseInt(e.target.value))}
                              disabled={updatingProductId === product.product_id}
                              className="rounded-md border border-stroke bg-transparent px-2 py-1 text-sm outline-none"
                              title="Change Status"
                            >
                              <option value="1">Approve</option>
                              <option value="0">Reject</option>
                              <option value="3">Pending</option>
                              <option value="2">Delete</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="rounded-lg border border-stroke bg-white transition-shadow hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
                >
                  {/* Product Image */}
                  {product.image_url ? (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-48 items-center justify-center rounded-t-lg text-3xl font-bold text-white"
                      style={{ backgroundColor: getProductColor(product.product_id) }}
                    >
                      {getProductInitials(product.product_name)}
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue dark:text-white line-clamp-2">
                          {product.product_name}
                        </h3>
                        <p className="mt-1 text-xs text-body">{product.added_by}</p>
                      </div>
                      {getStatusBadge(product.status)}
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      {getCategoryBadge(product.category_name)}
                      <span className="text-xs text-body">ID: {product.product_id}</span>
                    </div>

                    <div className="mb-4 flex items-center justify-between border-t border-stroke pt-3 dark:border-strokedark">
                      <div>
                        <span className="text-xs text-body">Price</span>
                        <p className="text-lg font-bold text-blue dark:text-white">
                          {formatPrice(product.price)}
                        </p>
                        {product.discount > 0 && (
                          <p className="text-xs text-green-600">{product.discount}% off</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-body">Stock</span>
                        <p
                          className={`font-semibold ${
                            product.stock_quantity === 0
                              ? "text-red-500"
                              : product.stock_quantity < 5
                              ? "text-orange-500"
                              : "text-blue dark:text-white"
                          }`}
                        >
                          {product.stock_quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="flex-1 rounded-md border border-stroke py-2 text-sm font-medium text-body hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="rounded-md border border-stroke px-4 py-2 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
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
                      {product.role_id === 1 && currentUserRoleId !== null && [2,4,99].includes(currentUserRoleId) && (
                        <select
                          value={String(product.status)}
                          onChange={(e) => handleChangeProductStatus(product.product_id, parseInt(e.target.value))}
                          disabled={updatingProductId === product.product_id}
                          className="rounded-md border border-stroke bg-transparent px-2 py-1 text-sm outline-none"
                        >
                          <option value="1">Approve</option>
                          <option value="0">Reject</option>
                          <option value="3">Pending</option>
                          <option value="2">Delete</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-body">
                Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                {Math.min(currentPage * productsPerPage, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-stroke px-3 py-2 hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:hover:bg-meta-4"
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
                            ? "bg-primary text-white"
                            : "border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
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
                    className="h-5 w-5"
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

      {/* View Product Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-blue/50 bg-opacity-50 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-blue dark:text-white">
                Product Details
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

            <div className="p-6">
              <div className="mb-6 flex items-center gap-4">
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.product_name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-lg text-3xl font-bold text-white"
                    style={{ backgroundColor: getProductColor(selectedProduct.product_id) }}
                  >
                    {getProductInitials(selectedProduct.product_name)}
                  </div>
                )}
                <div>
                  <h4 className="text-2xl font-bold text-blue dark:text-white">
                    {selectedProduct.product_name}
                  </h4>
                  <p className="text-sm text-body">Product ID: {selectedProduct.product_id}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatusBadge(selectedProduct.status)}
                    {getCategoryBadge(selectedProduct.category_name)}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-body">Category ID</label>
                  <div className="rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <p className="font-mono text-blue dark:text-white">
                      {selectedProduct.category_id}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body">Added By</label>
                  <div className="rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <p className="text-blue dark:text-white">
                      {selectedProduct.added_by}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body">Price</label>
                  <div className="flex items-center gap-2 rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <svg
                      className="h-5 w-5 text-body"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-blue dark:text-white">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body">Discount</label>
                  <div className="flex items-center gap-2 rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <p className="text-lg font-semibold text-green-600">
                      {selectedProduct.discount}%
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body">
                    Stock Quantity
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <svg
                      className="h-5 w-5 text-body"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <p
                      className={`font-semibold ${
                        selectedProduct.stock_quantity === 0
                          ? "text-red-500"
                          : selectedProduct.stock_quantity < 5
                          ? "text-orange-500"
                          : "text-blue dark:text-white"
                      }`}
                    >
                      {selectedProduct.stock_quantity} units
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body">Created At</label>
                  <div className="rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <p className="text-sm text-blue dark:text-white">
                      {formatDate(selectedProduct.created_at)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body">Updated At</label>
                  <div className="rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                    <p className="text-sm text-blue dark:text-white">
                      {formatDate(selectedProduct.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-body">Description</label>
                <div className="rounded-md border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                  <p className="text-blue dark:text-white">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              {selectedProduct.image_url && (
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-body">Product Image</label>
                  <div className="rounded-md border border-stroke p-4 dark:border-strokedark">
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.product_name}
                      className="max-h-64 w-full rounded-lg object-contain"
                    />
                    <p className="mt-2 text-xs text-body break-all">{selectedProduct.image_url}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
              <button
                onClick={() => {
                  handleCloseModals();
                  handleEditProduct(selectedProduct);
                }}
                className="rounded-md border border-stroke px-6 py-2.5 text-sm font-medium text-body hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              >
                Edit Product
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

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-blue/50 bg-opacity-50 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-blue dark:text-white">
                Edit Product
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

            <div className="p-6">
              <div className="mb-6 flex items-center gap-4 rounded-lg bg-gray-2 p-4 dark:bg-meta-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={selectedProduct.product_name}
                    className="h-16 w-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Image';
                    }}
                  />
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-lg text-xl font-semibold text-white"
                    style={{ backgroundColor: getProductColor(selectedProduct.product_id) }}
                  >
                    {getProductInitials(selectedProduct.product_name)}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold text-blue dark:text-white">
                    {selectedProduct.product_name}
                  </h4>
                  <p className="text-sm text-body">ID: {selectedProduct.product_id}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.product_name}
                    onChange={(e) => handleEditFormChange("product_name", e.target.value)}
                    placeholder="Enter product name"
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => handleEditFormChange("description", e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.category_id}
                    onChange={(e) => handleEditFormChange("category_id", e.target.value)}
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark"
                  >
                    <option value="">Select category</option>
                    {categoriesData.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.price}
                      onChange={(e) => handleEditFormChange("price", e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark"
                    />
                  </div>

                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.discount}
                      onChange={(e) => handleEditFormChange("discount", e.target.value)}
                      placeholder="0"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editFormData.stock_quantity}
                    onChange={(e) => handleEditFormChange("stock_quantity", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => handleEditFormChange("status", e.target.value)}
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-strokedark"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                    <option value="2">Deleted</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-blue dark:text-white">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full cursor-pointer rounded-md border border-stroke bg-transparent px-5 py-3 outline-none transition file:mr-4 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-opacity-90 focus:border-primary dark:border-strokedark"
                  />
                  <p className="mt-1 text-sm text-body">
                    Upload a new image to replace the current one (JPG, PNG, max 2MB)
                  </p>
                </div>

                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex gap-3">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-sm">
                      <p className="font-medium text-blue-700 dark:text-blue-400">Note</p>
                      <p className="mt-1 text-blue-600 dark:text-blue-300">
                        Make sure to update stock quantity accurately. Changes will be
                        reflected immediately in the inventory.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
              <button
                onClick={handleCloseModals}
                disabled={isSaving}
                className="rounded-md border border-stroke px-6 py-2.5 text-sm font-medium text-body hover:bg-gray-2 disabled:opacity-50 dark:border-strokedark dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={
                  isSaving ||
                  !editFormData.product_name ||
                  !editFormData.price ||
                  !editFormData.stock_quantity
                }
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
                    Done
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
