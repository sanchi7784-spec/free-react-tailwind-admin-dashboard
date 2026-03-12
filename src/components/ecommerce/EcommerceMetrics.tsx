import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  BoxCubeIcon,
  ListIcon,
  GroupIcon,
  CalenderIcon,
  ShootingStarIcon,
  FolderIcon,
} from "../../icons";

const RupeeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12M6 8h12M6 13l6 8M6 13h3a4 4 0 0 0 0-8" />
  </svg>
);
import { fetchEcommerceDashboardOverview, type EcommerceDashboardOverview } from "../../api/dashboard";
import { getEcommerceDomain, DOMAIN_TYPES, isVendor } from "../../utils/ecommerceAuth";

export default function EcommerceMetrics() {
  const [overview, setOverview] = useState<EcommerceDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchEcommerceDashboardOverview();
      setOverview(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load overview');
      // console.error('Error fetching dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="mt-5">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
              <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-24 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 md:p-6">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  // ── Monthly Sales chart config ─────────────────────────────────────────────
  const monthLabels = (overview.monthly_sales ?? []).map((m) => {
    const [year, month] = m.month.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
  });
  const salesData = (overview.monthly_sales ?? []).map((m) => m.total_sales);

  const monthlySalesOptions: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#465fff"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: monthLabels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontFamily: "Outfit, sans-serif" } },
    },
    yaxis: {
      labels: {
        formatter: (v) => `₹${v.toLocaleString()}`,
        style: { fontFamily: "Outfit, sans-serif" },
      },
    },
    grid: { yaxis: { lines: { show: true } }, borderColor: "#e5e7eb" },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.4,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    tooltip: {
      y: { formatter: (v) => `₹${v.toLocaleString()}` },
    },
    theme: { mode: "light" },
  };

  // ── Order Status chart config ──────────────────────────────────────────────
  const statusCounts = overview.order_status_counts ?? {
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    returned: 0,
  };
  const orderStatusOptions: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      background: "transparent",
    },
    labels: ["Confirmed", "Cancelled", "Completed", "Returned"],
    colors: ["#465fff", "#ef4444", "#22c55e", "#f59e0b"],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "13px",
              fontFamily: "Outfit, sans-serif",
              color: "#6b7280",
              offsetY: -6,
            },
            value: {
              show: true,
              fontSize: "22px",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              color: "#111827",
              offsetY: 6,
              formatter: (v: string) => v,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "13px",
              fontFamily: "Outfit, sans-serif",
              color: "#6b7280",
              formatter: () => String(overview.total_orders),
            },
          },
        },
      },
    },
    stroke: { width: 2 },
    tooltip: {
      theme: "light",
      style: { fontSize: "13px", fontFamily: "Outfit, sans-serif" },
      y: { formatter: (v) => `${v} orders` },
    },
  };

  const isVendorUser = isVendor() || getEcommerceDomain() === DOMAIN_TYPES.VENDOR;

  const statCards = [
    ...(!isVendorUser ? [
      {
        label: "Total Users",
        value: overview.total_users.toLocaleString(),
        icon: <GroupIcon className="text-brand-500 size-6 dark:text-white/90" />,
        bg: "bg-brand-50 dark:bg-brand-600",
      },
      {
        label: "Total Vendors",
        value: overview.total_vendors.toLocaleString(),
        icon: <GroupIcon className="text-brand-500 size-6 dark:text-white/90" />,
        bg: "bg-brand-50 dark:bg-brand-600",
      },
    ] : []),
    {
      label: "Total Products",
      value: overview.total_products.toLocaleString(),
      icon: <BoxCubeIcon className="text-brand-500 size-6 dark:text-white/90" />,
      bg: "bg-brand-50 dark:bg-brand-600",
    },
    {
      label: "Total Orders",
      value: overview.total_orders.toLocaleString(),
      icon: <ListIcon className="text-indigo-500 size-6 dark:text-white/90" />,
      bg: "bg-indigo-50 dark:bg-indigo-600",
    },
    {
      label: "Orders Today",
      value: overview.orders_today?.toLocaleString() ?? "0",
      icon: <CalenderIcon className="text-emerald-500 size-6 dark:text-white/90" />,
      bg: "bg-emerald-50 dark:bg-emerald-600",
    },
    {
      label: "Total Sell",
      value: overview.total_sell.toLocaleString(),
      icon: <ShootingStarIcon className="text-pink-500 size-6 dark:text-white/90" />,
      bg: "bg-pink-50 dark:bg-pink-600",
    },
    {
      label: "Total Revenue",
      value: `₹${overview.total_revenue.toLocaleString()}`,
      icon: <RupeeIcon className="text-violet-500 size-6 dark:text-white/90" />,
      bg: "bg-violet-50 dark:bg-violet-600",
    },
    {
      label: "Inventory Value",
      value: `₹${(overview.total_inventory_value ?? 0).toLocaleString()}`,
      icon: <FolderIcon className="text-amber-500 size-6 dark:text-white/90" />,
      bg: "bg-amber-50 dark:bg-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bg}`}>
              {card.icon}
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {card.label}
              </span>
              <h4 className="mt-1 font-bold text-gray-800 text-xl leading-tight truncate dark:text-white/90">
                {card.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-5">
        {/* Monthly Sales Bar Chart */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-5 pb-2 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-3">
            Monthly Sales
          </h3>
          {salesData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              No sales data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Chart
                options={monthlySalesOptions}
                series={[{ name: "Sales (₹)", data: salesData }]}
                type="bar"
                height={220}
              />
            </div>
          )}
        </div>

        {/* Order Status Donut Chart */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-5 pb-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-2">
            Order Status
          </h3>
          <Chart
            options={orderStatusOptions}
            series={[
              statusCounts.confirmed,
              statusCounts.cancelled,
              statusCounts.completed,
              statusCounts.returned,
            ]}
            type="donut"
            height={200}
          />
          {/* Status legend counts */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { label: "Confirmed", count: statusCounts.confirmed, hex: "#465fff" },
              { label: "Cancelled", count: statusCounts.cancelled, hex: "#ef4444" },
              { label: "Completed", count: statusCounts.completed, hex: "#22c55e" },
              { label: "Returned",  count: statusCounts.returned,  hex: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-white/[0.05]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.hex }} />
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate">{s.label}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white ml-1 flex-shrink-0">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
