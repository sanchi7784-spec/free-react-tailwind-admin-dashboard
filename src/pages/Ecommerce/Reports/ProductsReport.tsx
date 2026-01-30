import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import Chart from "react-apexcharts";

export default function ProductsReport() {
  const [activeTab, setActiveTab] = useState<"all" | "stock" | "wishlist">("all");

  const defaultTabs = [
    { id: "all", label: "All Products" },
    { id: "stock", label: "Product Stock" },
    { id: "wishlist", label: "Wish Listed Products" },
  ] as const;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);

  function getTokenFromStorage() {
    try {
      const candidates = ["ecommerce_token", "token", "access_token", "authToken", "mp_token"];
      for (const k of candidates) {
        const v = localStorage.getItem(k);
        if (v) return v;
      }
      const mp = localStorage.getItem("mp_auth");
      if (mp) {
        try {
          const parsed = JSON.parse(mp);
          if (parsed && parsed.token) return parsed.token;
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  function downloadCSV(filename: string, rows: string) {
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportProductsToCSV() {
    // choose dataset: productSales preferred, else report.products
    const rows = productSales && productSales.length ? productSales : report?.products ?? [];
    if (!rows || !rows.length) {
      // nothing to export
      return;
    }

    // columns for productSales expected shape
    const headers = [
      "Product",
      "Unit Price",
      "Discount",
      "Quantity Sold",
      "Amount Sold",
      "Stock",
    ];

    const csvRows = [headers.join(",")];

    rows.forEach((r: any) => {
      if (r.product_name !== undefined) {
        const vals = [
          r.product_name,
          r.unit_price,
          r.discount,
          r.total_quantity_sold,
          r.total_amount_sold,
          r.current_stock_quantity,
        ];
        csvRows.push(vals.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
      } else {
        // fallback mapping for generic product objects
        const name = r.name || r.title || r.product_name || r.product || "";
        const sku = r.sku || r.SKU || r.code || "";
        const stock = r.stock ?? r.quantity ?? r.qty ?? "";
        const sales = r.sales ?? r.sold ?? "";
        const revenue = r.revenue ?? r.total ?? r.amount ?? "";
        const vals = [name, sku, stock, sales, revenue, ""];
        csvRows.push(vals.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
      }
    });

    const now = new Date();
    const ts = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadCSV(`products_report_${ts}.csv`, csvRows.join("\n"));
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const token = getTokenFromStorage();
      if (!token) {
        setError(
          "No auth token found in localStorage (keys: ecommerce_token|token|access_token|authToken|mp_token|mp_auth)"
        );
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://api.mastrokart.com/dashboard/product-reports/overview",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        let data: any = null;
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
        const payload = data?.data ?? data;
        if (!res.ok) {
          const errMsg = payload?.detail || payload?.message || payload?.error || `HTTP ${res.status}`;
          if (!cancelled) setError(errMsg);
          return;
        }
        // prefer nested data but if payload contains an error 'detail' or 'message', surface it
        if (payload && (payload.detail || payload.message || payload.error)) {
          if (!cancelled) setError(payload.detail || payload.message || String(payload.error));
          return;
        }
        if (!cancelled) setReport(payload);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // fetch stock data lazily when user opens the stock tab
  useEffect(() => {
    let cancelled = false;
    async function loadStock() {
      if (activeTab !== "stock") return;
      // don't re-fetch if already have data
      if (stockData && stockData.length) return;
      setStockLoading(true);
      setStockError(null);
      const token = getTokenFromStorage();
      if (!token) {
        setStockError("No auth token found in localStorage for stock endpoint.");
        setStockLoading(false);
        return;
      }
      try {
        const res = await fetch(
          "https://api.mastrokart.com/dashboard/product-reports/stock",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }
        );
        let json: any = null;
        try {
          json = await res.json();
        } catch (e) {
          json = null;
        }
        const payload = json?.data ?? json;
        if (!res.ok) {
          const errMsg = payload?.detail || payload?.message || payload?.error || `HTTP ${res.status}`;
          if (!cancelled) setStockError(errMsg);
          return;
        }
        if (payload && (payload.detail || payload.message || payload.error)) {
          if (!cancelled) setStockError(payload.detail || payload.message || String(payload.error));
          return;
        }
        if (!cancelled) setStockData(payload);
      } catch (e: any) {
        if (!cancelled) setStockError(e?.message || String(e));
      } finally {
        if (!cancelled) setStockLoading(false);
      }
    }
    loadStock();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  // fetch wishlist data lazily when user opens the wishlist tab
  useEffect(() => {
    let cancelled = false;
    async function loadWishlist() {
      if (activeTab !== "wishlist") return;
      if (wishlistData && wishlistData.length) return;
      setWishlistLoading(true);
      setWishlistError(null);
      const token = getTokenFromStorage();
      if (!token) {
        setWishlistError("No auth token found in localStorage for wishlist endpoint.");
        setWishlistLoading(false);
        return;
      }
      try {
        const res = await fetch(
          "https://api.mastrokart.com/dashboard/product-reports/wishlist",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }
        );
        let json: any = null;
        try {
          json = await res.json();
        } catch (e) {
          json = null;
        }
        const payload = json?.data ?? json;
        if (!res.ok) {
          const errMsg = payload?.detail || payload?.message || payload?.error || `HTTP ${res.status}`;
          if (!cancelled) setWishlistError(errMsg);
          return;
        }
        if (payload && (payload.detail || payload.message || payload.error)) {
          if (!cancelled) setWishlistError(payload.detail || payload.message || String(payload.error));
          return;
        }
        if (!cancelled) setWishlistData(payload);
      } catch (e: any) {
        if (!cancelled) setWishlistError(e?.message || String(e));
      } finally {
        if (!cancelled) setWishlistLoading(false);
      }
    }
    loadWishlist();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const renderedTabs = useMemo(() => {
    if (report && Array.isArray(report.tabs)) return report.tabs;
    return defaultTabs;
  }, [report]);

  const overallCounts = useMemo(() => report?.overall_counts ?? null, [report]);
  const dailyCounts = useMemo(() => report?.daily_counts ?? [], [report]);
  const productSales = useMemo(() => report?.product_sales ?? [], [report]);
  const [stockData, setStockData] = useState<any[] | null>(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  const [wishlistData, setWishlistData] = useState<any[] | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  return (
    <>
      <PageMeta title="Products Report - Dashboard" description="Products report" />
      <PageBreadCrumb pageTitle="Product Report" />

      <div className="rounded-sm border border-stroke bg-white px-6 py-5 shadow-default ">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3 md:gap-0">
          <div>
            <h3 className="text-lg font-semibold text-black">Product Report</h3>       
            <p className="text-sm text-gray-500">Summary and metrics for products.</p>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto flex-wrap md:flex-nowrap w-full">
            <div className="flex items-center space-x-3 flex-wrap">
              {renderedTabs.map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={
                    "rounded-full flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-150 " +
                    (activeTab === t.id ? "bg-black text-white shadow-sm" : "text-gray-600 hover:bg-gray-100")
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="ml-auto md:ml-0 mt-2 md:mt-0">
              <button
                onClick={exportProductsToCSV}
                className="inline-flex items-center gap-2 px-10 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {loading && <div className="text-sm text-gray-600">Loading report...</div>}
          {error && <div className="text-sm text-red-600">Error: {error}</div>}

          {!loading && !error && (
            <div>
              {renderedTabs.map((t: any) => {
                const panel = report?.panels?.[t.id] ?? null;
                const isActive = activeTab === t.id;
                return (
                  <div key={t.id} className={isActive ? "block" : "hidden"}>
                    {panel ? (
                      <div>
                        {panel.title && <h4 className="font-medium mb-2">{panel.title}</h4>}
                        {panel.subtitle && <p className="text-sm text-gray-600 mb-4">{panel.subtitle}</p>}

                        {panel.charts && Array.isArray(panel.charts) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {panel.charts.map((c: any, idx: number) => {
                              const type = (c.type || "line").toLowerCase();
                              const options: any = {
                                chart: { toolbar: { show: false }, type },
                                xaxis: { categories: c.categories || [] },
                                stroke: { curve: "smooth" },
                                legend: { show: true },
                                colors: c.colors || ["#3B82F6", "#FF6B9A"],
                                responsive: [{ breakpoint: 640, options: { chart: { height: 200 } } }],
                              };
                              const series = c.series || [];
                              return (
                                <div key={idx} className="rounded-sm border border-gray-200 bg-white p-3 min-w-0">
                                  {c.title && <div className="text-sm font-medium mb-2">{c.title}</div>}
                                  <div className="w-full">
                                    <Chart options={options} series={series} type={type as any} height={220} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {panel.table && (
                          <div className="overflow-x-auto">
                            <table className="w-full table-auto text-xs sm:text-sm">
                              <thead>
                                <tr className="text-left text-gray-600">
                                  {(panel.table.columns || []).map((col: string, i: number) => (
                                    <th className="px-3 py-2" key={i}>{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(panel.table.rows || []).map((r: any, ri: number) => (
                                  <tr className="border-t" key={ri}>
                                    {(panel.table.columns || []).map((col: string, ci: number) => (
                                      <td className="px-3 py-2" key={ci}>{String(r[col] ?? r[ci] ?? "-")}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {!panel.charts && !panel.table && panel.content && (
                          <div className="text-sm text-gray-700">{panel.content}</div>
                        )}
                      </div>
                    ) : t.id === "stock" ? (
                      <div>
                        {stockLoading && <div className="text-sm text-gray-600">Loading stock...</div>}
                        {stockError && <div className="text-sm text-red-600">Error: {stockError}</div>}

                        {stockData && stockData.length > 0 && (
                          <>
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
                              <div className="rounded-lg border bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 p-3">
                                <div className="text-lg font-medium mb-2">Stock Overview</div>
                                <div className="text-sm text-gray-500 mb-2">Total items: {stockData.length}</div>
                                <div className="text-sm text-gray-500">Out of stock: {stockData.filter(s=> (s.current_stock_quantity ?? 0) <=0).length}</div>
                              </div>
                              <div className="rounded-lg border bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 p-3">
                                <div className="text-sm font-medium mb-2 ">Stock Distribution (top items)</div>
                                <div>
                                  {(() => {
                                    const top = stockData
                                      .slice()
                                      .sort((a, b) => (b.current_stock_quantity ?? 0) - (a.current_stock_quantity ?? 0))
                                      .slice(0, 12);
                                    const categories = top.map((s) => s.product_name);
                                    const values = top.map((s) => s.current_stock_quantity ?? 0);
                                    const options: any = {
                                      chart: {
                                        toolbar: { show: false },
                                        animations: { enabled: true, easing: 'easeout', speed: 600, animateGradually: { enabled: true, delay: 50 } },
                                      },
                                      plotOptions: {
                                        bar: {
                                          horizontal: false,
                                          columnWidth: '45%',
                                          borderRadius: 8,
                                        },
                                      },
                                      dataLabels: { enabled: false },
                                      stroke: { show: false },
                                      xaxis: {
                                        categories,
                                        labels: { rotate: -45, style: { fontSize: '12px' } },
                                      },
                                      yaxis: {
                                        labels: { formatter: (val: number) => String(val) },
                                      },
                                      tooltip: {
                                        y: { formatter: (val: number) => `${val}` },
                                      },
                                      colors: ['#030303'],
                                      fill: {
                                        type: 'gradient',
                                        gradient: { shade: 'light', type: 'vertical', shadeIntensity: 0.3, gradientToColors: ['#60A5FA'], inverseColors: false, opacityFrom: 0.95, opacityTo: 0.7, stops: [0, 90] },
                                      },
                                      grid: { borderColor: '#eee' },
                                    };
                                    const series = [{ name: 'Quantity', data: values }];
                                    return <Chart options={options} series={series} type="bar" height={260} />;
                                  })()}
                                </div>
                              </div>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full table-auto text-xs sm:text-sm">
                                <thead>
                                  <tr className="text-left text-gray-600">
                                    <th className="px-3 py-2">Product</th>
                                    <th className="px-3 py-2">Last Updated</th>
                                    <th className="px-3 py-2">Stock</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {stockData.map((s, i) => (
                                    <tr className="border-t" key={i}>
                                      <td className="px-3 py-2">{s.product_name}</td>
                                      <td className="px-3 py-2">{new Date(s.last_updated_stock).toLocaleString()}</td>
                                      <td className="px-3 py-2">{String(s.current_stock_quantity)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {!stockLoading && !stockData && !stockError && (
                          <div className="text-sm text-gray-600">No stock data available.</div>
                        )}

                      </div>
                    ) : t.id === "wishlist" ? (
                      <div>
                        {wishlistLoading && <div className="text-sm text-gray-600">Loading wishlist...</div>}
                        {wishlistError && <div className="text-sm text-red-600">Error: {wishlistError}</div>}

                        {wishlistData && wishlistData.length > 0 && (
                          <>
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-lg border bg-gradient-to-r from-white via-blue-300 to-blue-500 p-3">
                                <div className="text-sm font-medium mb-2">Top Wishlisted Products</div>
                                <div>
                                  {(() => {
                                    const top = wishlistData
                                      .slice()
                                      .sort((a, b) => (b.total_in_wishlist ?? 0) - (a.total_in_wishlist ?? 0))
                                      .slice(0, 12);
                                    const categories = top.map((s) => s.product_name);
                                    const values = top.map((s) => s.total_in_wishlist ?? 0);
                                    const options: any = {
                                      chart: {
                                        toolbar: { show: false },
                                        animations: { enabled: true, easing: 'easeout', speed: 600 },
                                      },
                                      plotOptions: { bar: { borderRadius: 8, columnWidth: '45%' } },
                                      dataLabels: { enabled: false },
                                      xaxis: { categories, labels: { rotate: -45, style: { fontSize: '12px' } } },
                                      tooltip: { y: { formatter: (v: number) => `${v}` } },
                                      colors: ['#ebcc08'],
                                      fill: { type: 'gradient', gradient: { shade: 'light', gradientToColors: ['#e3b008'], opacityFrom: 0.95, opacityTo: 0.7 } },
                                      grid: { borderColor: '#f3f4f6' },
                                    };
                                    const series = [{ name: 'Wishlists', data: values }];
                                    return <Chart options={options} series={series} type="bar" height={260} />;
                                  })()}
                                </div>
                              </div>

                              <div className="rounded-sm border bg-white p-3 bg-gradient-to-r from-white via-blue-300 to-blue-500">
                                <div className="text-sm font-medium mb-2">Wishlist Trend (by date)</div>
                                <div>
                                  {(() => {
                                    const byDate: Record<string, number> = {};
                                    wishlistData.forEach((r) => {
                                      const d = r.created_date || r.date || '';
                                      if (!d) return;
                                      byDate[d] = (byDate[d] || 0) + (r.total_in_wishlist ?? 0);
                                    });
                                    const sortedDates = Object.keys(byDate).sort();
                                    const series = [{ name: 'Wishlists', data: sortedDates.map((dt) => byDate[dt]) }];
                                    const options: any = {
                                      chart: { toolbar: { show: false } },
                                      xaxis: { categories: sortedDates },
                                      stroke: { curve: 'smooth' },
                                      colors: ['#06066e'],
                                      tooltip: { y: { formatter: (v: number) => `${v}` } },
                                      grid: { borderColor: '#f3f4f6' },
                                    };
                                    return <Chart options={options} series={series} type="line" height={220} />;
                                  })()}
                                </div>
                              </div>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full table-auto text-xs sm:text-sm">
                                <thead>
                                  <tr className="text-left text-gray-600">
                                    <th className="px-3 py-2">Product</th>
                                    <th className="px-3 py-2">Created Date</th>
                                    <th className="px-3 py-2">Total In Wishlist</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {wishlistData.map((w, i) => (
                                    <tr className="border-t" key={i}>
                                      <td className="px-3 py-2">{w.product_name}</td>
                                      <td className="px-3 py-2">{w.created_date}</td>
                                      <td className="px-3 py-2">{String(w.total_in_wishlist ?? 0)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {!wishlistLoading && !wishlistData && !wishlistError && (
                          <div className="text-sm text-gray-600">No wishlist data available.</div>
                        )}

                      </div>
                    ) : t.id === "all" ? (
                      <div>
                        {/* Summary cards */}
                        {overallCounts && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 ">
                            <div className="rounded-sm border bg-white p-3 text-sm bg-gradient-to-r from-black to-white">
                              <div className="text-xs text-gray-100 ">Total Products</div>
                              <div className="text-lg font-semibold text-white">{overallCounts.total_products}</div>
                            </div>
                            <div className="rounded-sm border bg-white p-3 text-sm bg-gradient-to-r from-black to-white">
                              <div className="text-xs text-gray-100">Active</div>
                              <div className="text-lg font-semibold text-white">{overallCounts.active_products}</div>
                            </div>
                            <div className="rounded-sm border bg-white p-3 text-sm bg-gradient-to-r from-black to-white">
                              <div className="text-xs text-gray-100">Pending</div>
                              <div className="text-lg font-semibold text-white">{overallCounts.pending_products}</div>
                            </div>
                            <div className="rounded-sm border bg-white p-3 text-sm bg-gradient-to-r from-black to-white">
                              <div className="text-xs text-gray-100">Inactive</div>
                              <div className="text-lg font-semibold text-white">{overallCounts.inactive_products}</div>
                            </div>
                          </div>
                        )}

                        {/* Daily counts chart */}
                        {dailyCounts && dailyCounts.length > 0 && (
                          <div className="mb-4 rounded-sm border border-gray-200 bg-blue-100   p-3 ">
                            <div className="text-sm font-medium mb-2">Products Added (by date)</div>
                            <Chart
                              options={{
                                chart: { toolbar: { show: false } },
                                xaxis: { categories: dailyCounts.map((d: any) => d.date) },
                                stroke: { curve: "smooth" },
                                legend: { show: true },
                                responsive: [{ breakpoint: 640, options: { chart: { height: 200 } } }],
                              }}
                              series={[
                                { name: "Total", data: dailyCounts.map((d: any) => d.total_products) },
                                { name: "Active", data: dailyCounts.map((d: any) => d.active) },
                              ]}
                              type="line"
                              height={260}
                            />
                          </div>
                        )}

                        {/* Product sales table */}
                        {productSales && productSales.length > 0 && (
                          <div className="overflow-x-auto ">
                            <table className="w-full table-auto text-xs sm:text-sm ">
                              <thead className="bg-yellow-100">
                                <tr className="text-left text-gray-600">
                                  <th className="px-3 py-2">Product</th>
                                  <th className="px-3 py-2">Unit Price</th>
                                  <th className="px-3 py-2">Discount</th>
                                  <th className="px-3 py-2">Qty Sold</th>
                                  <th className="px-3 py-2">Amount Sold</th>
                                  <th className="px-3 py-2">Stock</th>
                                </tr>
                              </thead>
                              <tbody className="bg-blue-100">
                                {productSales.map((p: any, i: number) => (
                                  <tr className="border-t" key={i}>
                                    <td className="px-3 py-2">{p.product_name}</td>
                                    <td className="px-3 py-2">{p.unit_price}</td>
                                    <td className="px-3 py-2">{p.discount}</td>
                                    <td className="px-3 py-2">{p.total_quantity_sold}</td>
                                    <td className="px-3 py-2">{p.total_amount_sold}</td>
                                    <td className="px-3 py-2">{p.current_stock_quantity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">No data for this tab.</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
