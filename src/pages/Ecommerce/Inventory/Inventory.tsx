import { useEffect, useState, useMemo } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { fetchProducts, Product, updateProductStockQuantity, fetchCategories, Category } from "../../../api/products";

type StockFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";

const LOW_STOCK_THRESHOLD = 10;

function getStockStatus(qty: number): { label: string; color: string } {
  if (qty <= 0)
    return {
      label: "Out of Stock",
      color:
        "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    };
  if (qty <= LOW_STOCK_THRESHOLD)
    return {
      label: "Low Stock",
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    };
  return {
    label: "In Stock",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  };
}

function getProductStatusLabel(status: number) {
  const map: Record<number, string> = {
    1: "Active",
    0: "Inactive",
    2: "Pending",
  };
  return map[status] ?? "Unknown";
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockInput, setStockInput] = useState<string>("");
  const [savingStock, setSavingStock] = useState(false);
  const [stockModalError, setStockModalError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsRes = await fetchProducts();
      setProducts(productsRes.data);
    } catch (err: any) {
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
    // Load categories independently — don't block the page if it fails
    try {
      const catsRes = await fetchCategories();
      setAllCategories(catsRes.data);
    } catch {
      // silently ignore; fall back to product-derived categories
    }
  };

  // Fall back to product-derived names when the categories API is unavailable
  const productCategoryNames = useMemo(() => {
    const names = Array.from(new Set(products.map((p) => p.category_name).filter(Boolean)));
    return names.sort();
  }, [products]);

  const usesApiCategories = allCategories.length > 0;

  const topLevelCats = useMemo(() => allCategories.filter((c) => !c.parent_id), [allCategories]);

  const allSubcategories = useMemo(() => allCategories.filter((c) => c.parent_id), [allCategories]);

  const subcatsMap = useMemo(() => {
    const map: Record<number, Category[]> = {};
    allCategories.filter((c) => c.parent_id).forEach((c) => {
      const pid = c.parent_id!;
      if (!map[pid]) map[pid] = [];
      map[pid].push(c);
    });
    return map;
  }, [allCategories]);

  const availableSubcats = useMemo(() => {
    if (categoryFilter === "all") return allSubcategories;
    return subcatsMap[Number(categoryFilter)] ?? [];
  }, [allSubcategories, categoryFilter, subcatsMap]);

  const categoryById = useMemo(() => {
    const map: Record<number, Category> = {};
    allCategories.forEach((c) => { map[c.category_id] = c; });
    return map;
  }, [allCategories]);

  const normalizedCategoryName = (value?: string | null) =>
    (value ?? "").trim().toLowerCase();

  const matchesCategorySelection = (product: Product) => {
    if (categoryFilter === "all" && subcategoryFilter === "all") return true;

    if (!usesApiCategories) {
      return product.category_name === categoryFilter;
    }

    const selectedCategoryId = categoryFilter !== "all" ? Number(categoryFilter) : undefined;
    const selectedCategory = selectedCategoryId ? categoryById[selectedCategoryId] : undefined;
    const selectedSubcategory = subcategoryFilter !== "all"
      ? categoryById[Number(subcategoryFilter)]
      : undefined;

    const productCategory = categoryById[product.category_id];
    const productParentCategory = productCategory?.parent_id
      ? categoryById[Number(productCategory.parent_id)]
      : undefined;
    const productCategoryName = normalizedCategoryName(product.category_name);
    const selectedCategoryName = normalizedCategoryName(selectedCategory?.category_name);
    const selectedSubcategoryName = normalizedCategoryName(selectedSubcategory?.category_name);

    if (selectedSubcategory) {
      return (
        product.category_id === selectedSubcategory.category_id ||
        normalizedCategoryName(productCategory?.category_name) === selectedSubcategoryName ||
        productCategoryName === selectedSubcategoryName
      );
    }

    if (!selectedCategoryId) return true;

    return (
      product.category_id === selectedCategoryId ||
      normalizedCategoryName(productCategory?.category_name) === selectedCategoryName ||
      normalizedCategoryName(productParentCategory?.category_name) === selectedCategoryName ||
      productCategoryName === selectedCategoryName ||
      (subcatsMap[selectedCategoryId] ?? []).some((subcat) => (
        product.category_id === subcat.category_id ||
        normalizedCategoryName(productCategory?.category_name) === normalizedCategoryName(subcat.category_name) ||
        productCategoryName === normalizedCategoryName(subcat.category_name)
      ))
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (stockFilter === "in_stock" && p.stock_quantity <= LOW_STOCK_THRESHOLD) return false;
      if (stockFilter === "low_stock" && !(p.stock_quantity > 0 && p.stock_quantity <= LOW_STOCK_THRESHOLD)) return false;
      if (stockFilter === "out_of_stock" && p.stock_quantity > 0) return false;
      if (!matchesCategorySelection(p)) return false;
      if (q && !`${p.product_name} ${p.category_name} ${p.added_by}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, stockFilter, search, matchesCategorySelection]);

  useEffect(() => {
    setSubcategoryFilter("all");
  }, [categoryFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stockFilter, categoryFilter, subcategoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / productsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filtered.slice(start, start + productsPerPage);
  }, [filtered, currentPage]);

  const visiblePages = useMemo(() => {
    const windowSize = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + windowSize - 1);
    const adjustedStart = Math.max(1, end - windowSize + 1);
    const pages: number[] = [];
    for (let page = adjustedStart; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [currentPage, totalPages]);

  // Summary counts
  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stock_quantity > LOW_STOCK_THRESHOLD).length;
  const lowStock = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= LOW_STOCK_THRESHOLD).length;
  const outOfStock = products.filter((p) => p.stock_quantity <= 0).length;
  const totalUnits = products.reduce((s, p) => s + p.stock_quantity, 0);

  const summaryCards = [
    { label: "Total Products", value: totalProducts, gradient: "from-blue-500 to-indigo-600", icon: "📦" },
    { label: "In Stock", value: inStock, gradient: "from-emerald-500 to-teal-600", icon: "✅" },
    { label: "Low Stock", value: lowStock, gradient: "from-amber-400 to-orange-500", icon: "⚠️" },
    { label: "Out of Stock", value: outOfStock, gradient: "from-red-500 to-rose-600", icon: "❌" },
    { label: "Total Units", value: totalUnits.toLocaleString(), gradient: "from-fuchsia-500 to-pink-600", icon: "🗂️" },
  ];

  const handleOpenEditStock = (product: Product) => {
    setSelectedProduct(product);
    setStockInput(String(product.stock_quantity));
    setStockModalError(null);
    setShowEditStockModal(true);
  };

  const handleCloseEditStock = () => {
    if (savingStock) return;
    setShowEditStockModal(false);
    setSelectedProduct(null);
    setStockInput("");
    setStockModalError(null);
  };

  const handleSubmitEditStock = async () => {
    if (!selectedProduct) return;

    const parsed = Number(stockInput);
    if (!Number.isInteger(parsed) || parsed < 0) {
      setStockModalError("Stock quantity must be a whole number (0 or more).");
      return;
    }

    try {
      setSavingStock(true);
      setStockModalError(null);
      await updateProductStockQuantity(selectedProduct.product_id, parsed);
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === selectedProduct.product_id
            ? { ...p, stock_quantity: parsed, updated_at: new Date().toISOString() }
            : p
        )
      );
      handleCloseEditStock();
    } catch (err: any) {
      setStockModalError(err.message || "Failed to update stock quantity");
    } finally {
      setSavingStock(false);
    }
  };

  return (
    <>
      <PageMeta title="Inventory - Ecommerce" description="Manage product inventory and stock levels" />
      <PageBreadCrumb pageTitle="Inventory" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg flex flex-col gap-1`}
          >
            <span className="text-2xl">{card.icon}</span>
            <p className="text-2xl font-extrabold leading-tight">{card.value}</p>
            <p className="text-sm font-medium opacity-90">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-slate-200 dark:border-strokedark bg-gradient-to-r from-blue-50 via-fuchsia-50 to-pink-50 dark:from-blue-900/30 dark:via-fuchsia-900/30 dark:to-pink-900/30 rounded-t-2xl">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600 dark:from-blue-300 dark:via-fuchsia-300 dark:to-pink-300">
            Inventory Management
          </h2>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white dark:bg-meta-4 dark:border-strokedark text-slate-700 dark:text-white w-52"
            />
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white dark:bg-meta-4 dark:border-strokedark text-slate-700 dark:text-white min-w-[140px]"
            >
              <option value="all">All Categories</option>
              {usesApiCategories
                ? topLevelCats.map((c) => (
                    <option key={c.category_id} value={String(c.category_id)}>{c.category_name}</option>
                  ))
                : productCategoryNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))
              }
            </select>
            {/* Subcategory Filter */}
            <select
              value={subcategoryFilter}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              disabled={usesApiCategories && availableSubcats.length === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white dark:bg-meta-4 dark:border-strokedark text-slate-700 dark:text-white min-w-[160px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="all">All Subcategories</option>
              {usesApiCategories && availableSubcats.map((c) => (
                <option key={c.category_id} value={String(c.category_id)}>{c.category_name}</option>
              ))}
            </select>
            {/* Refresh */}
            <button
              onClick={loadInventory}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Refreshing...
                </span>
              ) : (
                "Refresh"
              )}
            </button>
          </div>
        </div>

        {/* Stock Filter Tabs */}
        <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-slate-100 dark:border-strokedark">
          {(
            [
              { key: "all", label: "All", count: totalProducts },
              { key: "in_stock", label: "In Stock", count: inStock },
              { key: "low_stock", label: "Low Stock", count: lowStock },
              { key: "out_of_stock", label: "Out of Stock", count: outOfStock },
            ] as { key: StockFilter; label: string; count: number }[]
          ).map((tab) => {
            const active = stockFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStockFilter(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border-2 transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600 text-white border-transparent scale-105 shadow"
                    : "bg-white dark:bg-meta-4 text-slate-700 dark:text-white border-slate-200 dark:border-strokedark hover:bg-slate-50 dark:hover:bg-meta-3"
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                    active ? "bg-white text-blue-600" : "bg-slate-200 text-slate-700 dark:bg-meta-3 dark:text-white"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          {error && !loading && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/30 p-4 text-center text-red-700 dark:text-red-300 font-semibold">
              {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-lg">
              No products found.
            </div>
          )}
          {!loading && !error && filtered.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-strokedark shadow">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 via-fuchsia-100 to-pink-100 dark:from-blue-900/50 dark:via-fuchsia-900/50 dark:to-pink-900/50 text-left">
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">#</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Product</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Category</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Price</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Discount (Rs)</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Stock Qty</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Stock Status</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Product Status</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Added By</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Updated</th>
                    <th className="px-4 py-3 font-bold text-slate-700 dark:text-white whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, idx) => {
                    const stockStatus = getStockStatus(product.stock_quantity);
                    const primaryImage = product.images?.find((img) => img.is_primary === 1) ?? product.images?.[0];
                    return (
                      <tr
                        key={product.product_id}
                        className="border-b border-slate-100 dark:border-strokedark hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 dark:hover:from-blue-900/20 dark:hover:to-pink-900/20 transition-all"
                      >
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {(currentPage - 1) * productsPerPage + idx + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {primaryImage ? (
                              <img
                                src={primaryImage.image_url}
                                alt={product.product_name}
                                className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-strokedark shadow-sm flex-shrink-0"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-meta-4 flex items-center justify-center text-xl flex-shrink-0">
                                📦
                              </div>
                            )}
                            <span className="font-semibold text-slate-800 dark:text-white max-w-[180px] truncate" title={product.product_name}>
                              {product.product_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {(() => {
                            const cat = categoryById[product.category_id];
                            if (cat?.parent_id) {
                              const parent = categoryById[cat.parent_id];
                              return (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs text-slate-400 dark:text-slate-500">{parent?.category_name ?? "—"}</span>
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{cat.category_name}</span>
                                </div>
                              );
                            }
                            return <span className="text-sm text-slate-600 dark:text-slate-300">{product.category_name || "—"}</span>;
                          })()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{Number(product.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {product.discount > 0 ? (
                            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 text-xs font-bold">
                              ₹{Number(product.discount).toFixed(2)} off
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`text-base font-extrabold ${
                              product.stock_quantity <= 0
                                ? "text-red-600 dark:text-red-400"
                                : product.stock_quantity <= LOW_STOCK_THRESHOLD
                                ? "text-amber-500 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {product.stock_quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold shadow ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold shadow ${
                              product.status === 1
                                ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                : product.status === 2
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {getProductStatusLabel(product.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300 text-xs">
                          {product.added_by || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                          {product.updated_at
                            ? new Date(product.updated_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEditStock(product)}
                            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-bold text-white shadow hover:from-amber-600 hover:to-orange-600 transition-all"
                          >
                            Edit Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 dark:text-slate-400 font-medium">
              <div>
                Showing <span className="font-bold text-blue-600 dark:text-blue-300">{paginatedProducts.length}</span> of{" "}
                <span className="font-bold text-fuchsia-600 dark:text-fuchsia-300">{filtered.length}</span> filtered products
                {filtered.length !== totalProducts && (
                  <span> (from {totalProducts} total)</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 dark:border-strokedark px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-meta-3 disabled:opacity-50"
                >
                  Prev
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white"
                        : "border border-slate-200 dark:border-strokedark text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-meta-3"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 dark:border-strokedark px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-meta-3 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditStockModal && selectedProduct && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-boxdark shadow-2xl border border-slate-200 dark:border-strokedark">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-strokedark px-6 py-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Edit Stock Quantity
              </h3>
              <button
                onClick={handleCloseEditStock}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                disabled={savingStock}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-white">{selectedProduct.product_name}</p>
                <p>Current stock: <span className="font-bold">{selectedProduct.stock_quantity}</span></p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-meta-4 dark:border-strokedark dark:text-white"
                  placeholder="Enter stock quantity"
                  disabled={savingStock}
                />
              </div>

              {stockModalError && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                  {stockModalError}
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-slate-200 dark:border-strokedark px-6 py-4">
              <button
                onClick={handleCloseEditStock}
                disabled={savingStock}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEditStock}
                disabled={savingStock}
                className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-bold text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-60"
              >
                {savingStock ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
