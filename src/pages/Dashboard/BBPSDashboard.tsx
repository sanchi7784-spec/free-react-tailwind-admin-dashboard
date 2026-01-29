import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import DatePicker from "../../components/form/date-picker";
import Chart from "react-apexcharts";
import { canAccessGold, isEcommerceAuthenticated } from "../../utils/ecommerceAuth";

// SVG Icon Components
const Users = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UserCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

const UserX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 21a8 8 0 0 1 11.873-7" />
    <circle cx="10" cy="8" r="5" />
    <path d="m17 17 5 5" />
    <path d="m22 17-5 5" />
  </svg>
);

const Settings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="15" r="3" />
    <circle cx="9" cy="7" r="4" />
    <path d="M10 15H6a4 4 0 0 0-4 4v2" />
    <path d="m21.7 16.4-.9-.3" />
    <path d="m15.2 13.9-.9-.3" />
    <path d="m16.6 18.7.3-.9" />
    <path d="m19.1 12.2.3-.9" />
    <path d="m19.6 18.7-.4-1" />
    <path d="m16.8 12.3-.4-1" />
    <path d="m14.3 16.6 1-.4" />
    <path d="m20.7 13.8 1-.4" />
  </svg>
);

const Wallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

const Landmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" x2="21" y1="22" y2="22" />
    <line x1="6" x2="6" y1="18" y2="11" />
    <line x1="10" x2="10" y1="18" y2="11" />
    <line x1="14" x2="14" y1="18" y2="11" />
    <line x1="18" x2="18" y1="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const Send = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const Archive = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
);

const Book = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const AlertTriangle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const CreditCard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const Gift = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

const PackagePlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16h6" />
    <path d="M19 13v6" />
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
    <path d="m7.5 4.27 9 5.15" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" x2="12" y1="22" y2="12" />
  </svg>
);

const Webhook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
    <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
    <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
  </svg>
);

const HelpCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const Loader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="6" />
    <line x1="12" x2="12" y1="18" y2="22" />
    <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
    <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
    <line x1="2" x2="6" y1="12" y2="12" />
    <line x1="18" x2="22" y1="12" y2="12" />
    <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
    <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
  </svg>
);

const Zap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

const ExternalLink = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

interface DataCardProps {
  icon: React.ReactNode;
  count: string | number;
  label: string;
  link?: string;
  gradient: string;
}

interface AnnouncementButtonProps {
  href: string;
  label: string;
  count?: number;
  className: string;
}

const DataCard: React.FC<DataCardProps> = ({ icon, count, label, link, gradient }) => {
  return (
    <div className={`relative rounded-lg p-6 text-white shadow-lg ${gradient}`}>
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <div className="text-white">{icon}</div>
        </div>
        {link && (
          <Link
            to={link}
            className="text-white/80 hover:text-white"
          >
            <ExternalLink size={20} />
          </Link>
        )}
      </div>
      <div className="mt-4">
        <h4 className="text-3xl font-bold">
          {count}
        </h4>
        <p className="mt-2 text-sm font-medium text-white/90">{label}</p>
      </div>
    </div>
  );
};

const AnnouncementButton: React.FC<AnnouncementButtonProps> = ({
  href,
  label,
  count,
  className,
}) => {
  return (
    <Link
      to={href}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 shadow-sm ${className}`}
    >
      <span className="animate-spin">
        <Loader />
      </span>
      {label}
      {count !== undefined && <span>({count})</span>}
    </Link>
  );
};

export default function BBPSDashboard() {
  const navigate = useNavigate();
  const [siteStatsDateRange, setSiteStatsDateRange] = useState('10/31/2025 - 11/07/2025');

  // Check domain access before loading
  useEffect(() => {
    if (isEcommerceAuthenticated() && !canAccessGold()) {
      // Redirect Ecommerce-only users to their dashboard
      navigate('/ecom', { replace: true });
    }
  }, [navigate]);

  // Log date range changes for debugging
  console.log('Site Stats Date Range:', siteStatsDateRange);

  return (
    <>
      <PageMeta
        title="BBPS Dashboard | MastroPay BBPS Dashboard"
        description="BBPS Dashboard for MastroPay BBPS - Manage all BBPS operations"
      />

      <PageBreadCrumb pageTitle="MastroPay BBPS Dashboard" />

      <div className="space-y-6">
        {/* Important Announcements */}
        <div className="rounded-2xl border border-warning bg-warning/10 p-4 dark:border-warning/50 dark:bg-warning/5">
          <div className="mb-4 flex items-center gap-2 text-warning dark:text-white">
            <Zap />
            <span className="font-medium">
              Explore the important Requests to review first
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <AnnouncementButton
              href="/fund-transfer/Pending"
              label="Fund Transfer"
              count={49}
              className="bg-blue-500 dark:bg-blue-600"
            />
            <AnnouncementButton
              href="/withdraw/pending-withdraws"
              label="Withdraw"
              count={9}
              className="bg-red-500 dark:bg-red-600"
            />
            <AnnouncementButton
              href="/kyc/pending"
              label="KYC"
              count={21}
              className="bg-green-500 dark:bg-green-600"
            />
            <AnnouncementButton
              href="/deposits/pendin-manual-deposits"
              label="Deposit"
              count={104}
              className="bg-purple-800 dark:bg-purple-700"
            />
            <AnnouncementButton
              href="#"
              label="Ticket"
              count={8}
              className="bg-green-500 dark:bg-green-600"
            />
            <AnnouncementButton
              href="/loan/requestloan"
              label="Loan"
              count={12}
              className="bg-red-500 dark:bg-red-600"
            />
          </div>
        </div>

        {/* Data Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DataCard
            icon={<Users />}
            count="1653"
            label="Total Users"
            link="/customers/allcustomers"
            gradient="bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800"
          />
          <DataCard
            icon={<UserCheck />}
            count="1036"
            label="Active Users"
            link="/customers/activecustomers"
            gradient="bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800"
          />
          <DataCard
            icon={<UserX />}
            count="605"
            label="Disabled Users"
            link="/customers/disabledcustomers"
            gradient="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900"
          />
          <DataCard
            icon={<Settings />}
            count="1"
            label="Total Staff"
            link="/staff/all"
            gradient="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-blue"
          />
          <DataCard
            icon={<Wallet />}
            count="₹0"
            label="Total Deposits"
            link="/deposits/deposit-history"
            gradient="bg-gradient-to-br from-green-700 to-green-900 dark:from-green-800 dark:to-green-950"
          />
          <DataCard
            icon={<Landmark />}
            count="₹600"
            label="Total Withdraw"
            link="/withdraw/withdraw-history"
            gradient="bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-800"
          />
          <DataCard
            icon={<LinkIcon />}
            count="20"
            label="Total Referral"
            gradient="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900"
          />
          <DataCard
            icon={<Send />}
            count="₹8866"
            label="Total Fund Transfer"
            gradient="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-blue"
          />
          <DataCard
            icon={<Archive />}
            count="₹11328000"
            label="Total DPS"
            gradient="bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-700 dark:to-teal-900"
          />
          <DataCard 
            icon={<Book />} 
            count="₹5471.89" 
            label="Total FDR"
            gradient="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900"
          />
          <DataCard
            icon={<AlertTriangle />}
            count="₹5405.00"
            label="Total Loan"
            gradient="bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950"
          />
          <DataCard
            icon={<CreditCard />}
            count="₹0"
            label="Total Pay Bill"
            gradient="bg-gradient-to-br from-pink-500 to-pink-700 dark:from-pink-600 dark:to-pink-800"
          />
          <DataCard
            icon={<Gift />}
            count="1668"
            label="Total Reward Points"
            gradient="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900"
          />
          <DataCard
            icon={<PackagePlus />}
            count="₹0"
            label="Deposit Bonus"
            gradient="bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800"
          />
          <DataCard
            icon={<Webhook />}
            count="25"
            label="Total Automatic Gateways"
            link="/gateways"
            gradient="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900"
          />
          <DataCard
            icon={<HelpCircle />}
            count="19"
            label="Total Ticket"
            gradient="bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Site Statistics Chart - Larger */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  Site Statistics
                </h3>
                <div className="w-64">
                  <DatePicker
                    id="site-stats-date-range"
                    mode="range"
                    defaultDate="2025-10-31 to 2025-11-07"
                    placeholder="Select date range"
                    onChange={(selectedDates) => {
                      if (selectedDates.length === 2) {
                        const start = selectedDates[0].toLocaleDateString('en-US');
                        const end = selectedDates[1].toLocaleDateString('en-US');
                        setSiteStatsDateRange(`${start} - ${end}`);
                      }
                    }}
                  />
                </div>
              </div>
              <Chart
                options={{
                  chart: {
                    fontFamily: "Outfit, sans-serif",
                    type: "area",
                    toolbar: { show: false },
                  },
                  colors: ["#EF4444", "#1F2937", "#10B981", "#8B5CF6", "#3B82F6", "#F59E0B"],
                  legend: {
                    show: true,
                    position: "top",
                    horizontalAlign: "left",
                    fontSize: "12px",
                  },
                  stroke: {
                    curve: "smooth",
                    width: 2,
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      opacityFrom: 0.4,
                      opacityTo: 0.1,
                    },
                  },
                  dataLabels: { enabled: false },
                  grid: {
                    borderColor: "#e5e7eb",
                    strokeDashArray: 5,
                  },
                  xaxis: {
                    categories: ["31 Oct", "01 Nov", "02 Nov", "03 Nov", "04 Nov", "05 Nov", "06 Nov", "07 Nov"],
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                  },
                  yaxis: {
                    labels: {
                      formatter: (value) => `${(value / 1000).toFixed(0)}k`,
                    },
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `₹${value}`,
                    },
                  },
                }}
                series={[
                  { name: "Total Deposit ₹0", data: [0, 0, 0, 0, 0, 0, 0, 0] },
                  { name: "Total DPS ₹96400", data: [10000, 20000, 40000, 60000, 75000, 85000, 92000, 96400] },
                  { name: "Total FDR ₹0", data: [0, 0, 0, 0, 0, 0, 0, 0] },
                  { name: "Total Loan ₹0", data: [0, 0, 0, 0, 0, 0, 0, 0] },
                  { name: "Total Bill ₹0", data: [0, 0, 0, 0, 0, 0, 0, 0] },
                  { name: "Total Withdraw ₹0", data: [0, 0, 0, 0, 0, 0, 0, 0] },
                ]}
                type="area"
                height={300}
              />
            </div>
          </div>

          {/* Fund Transfer Statistics */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                Fund Transfer Statistics
              </h3>
              <Chart
                options={{
                  chart: {
                    type: "donut",
                    fontFamily: "Outfit, sans-serif",
                  },
                  colors: ["#8B5CF6", "#10B981"],
                  labels: ["Fund Transfer", "Fund Wire Transfer"],
                  legend: {
                    show: true,
                    position: "top",
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: "65%",
                        labels: {
                          show: false,
                        },
                      },
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                }}
                series={[60, 40]}
                type="donut"
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
              Top Country Statistics
            </h3>
            <Chart
              options={{
                chart: {
                  type: "donut",
                  fontFamily: "Outfit, sans-serif",
                },
                colors: ["#8B5CF6", "#10B981", "#EF4444", "#6B7280", "#F97316"],
                labels: ["Nigeria", "United States", "Bangladesh", "India", "Cameroon"],
                legend: {
                  show: true,
                  position: "top",
                  fontSize: "11px",
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "65%",
                    },
                  },
                },
                dataLabels: {
                  enabled: false,
                },
              }}
              series={[40, 20, 18, 15, 7]}
              type="donut"
              height={250}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
              Top Browser Statistics
            </h3>
            <Chart
              options={{
                chart: {
                  type: "polarArea",
                  fontFamily: "Outfit, sans-serif",
                },
                colors: ["#8B5CF6", "#10B981", "#EF4444", "#6B7280", "#F97316", "#7C3AED", "#3B82F6", "#EC4899"],
                labels: ["Chrome", "Firefox", "Safari", "Edge", "Opera", "UCBrowser", "IE", "Mozilla"],
                legend: {
                  show: true,
                  position: "top",
                  fontSize: "10px",
                },
                stroke: {
                  colors: ["#fff"],
                },
                fill: {
                  opacity: 0.8,
                },
                plotOptions: {
                  polarArea: {
                    rings: {
                      strokeWidth: 1,
                      strokeColor: "#e5e7eb",
                    },
                  },
                },
                dataLabels: {
                  enabled: false,
                },
              }}
              series={[12000, 6000, 4500, 3000, 2000, 1500, 1000, 500]}
              type="polarArea"
              height={250}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
              Top OS Statistics
            </h3>
            <Chart
              options={{
                chart: {
                  type: "donut",
                  fontFamily: "Outfit, sans-serif",
                },
                colors: ["#8B5CF6", "#D1D5DB", "#F97316", "#EF4444", "#3B82F6", "#10B981", "#F59E0B"],
                labels: ["Windows", "OS X", "AndroidOS", "iOS", "Linux", "ChromeOS", "Ubuntu"],
                legend: {
                  show: true,
                  position: "top",
                  fontSize: "10px",
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "65%",
                    },
                  },
                },
                dataLabels: {
                  enabled: false,
                },
              }}
              series={[45, 20, 15, 10, 5, 3, 2]}
              type="donut"
              height={250}
            />
          </div>
        </div>

        {/* Latest Users Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Latest Users
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 text-left dark:bg-white/5">
                  <th className="px-4 py-4 font-semibold text-gray-800 dark:text-white/90 uppercase text-xs">
                    Avatar
                  </th>
                  <th className="px-4 py-4 font-semibold text-gray-800 dark:text-white/90 uppercase text-xs">
                    User
                  </th>
                  <th className="px-4 py-4 font-semibold text-gray-800 dark:text-white/90 uppercase text-xs">
                    Email
                  </th>
                  <th className="px-4 py-4 font-semibold text-gray-800 dark:text-white/90 uppercase text-xs">
                    Balance
                  </th>
                  <th className="px-4 py-4 font-semibold text-gray-800 dark:text-white/90 uppercase text-xs">
                    KYC
                  </th>
                  <th className="px-4 py-4 font-semibold text-gray-800 dark:text-white/90 uppercase text-xs">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 1662,
                    name: "KALIDOUsavadogo...",
                    email: "ajecbgroup@gmail.com",
                    balance: "₹8",
                    avatar: "KS",
                    bgColor: "bg-pink-500",
                  },
                  {
                    id: 1661,
                    name: "AsadbekNorturae...",
                    email: "khorunaweel@gmail.co...",
                    balance: "₹8",
                    avatar: "AN",
                    bgColor: "bg-teal-600",
                  },
                  {
                    id: 1660,
                    name: "MaherAl-Yamany5...",
                    email: "handalex79@gmail.com",
                    balance: "₹8",
                    avatar: "MA",
                    bgColor: "bg-slate-700",
                  },
                  {
                    id: 1659,
                    name: "KerryAbia2329",
                    email: "kattywhite918@gmail....",
                    balance: "₹8",
                    avatar: "KA",
                    bgColor: "bg-green-700",
                  },
                  {
                    id: 1658,
                    name: "MohannadMahmoud...",
                    email: "loaniigroup@gmail.co...",
                    balance: "₹8",
                    avatar: "MM",
                    bgColor: "bg-orange-500",
                  },
                ].map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
                  >
                    <td className="px-4 py-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${user.bgColor} text-sm font-semibold text-white`}>
                        {user.avatar}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/customers/${user.id}/edit`}
                        className="font-medium text-purple-600 hover:text-purple-800 hover:underline dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800 dark:text-white/90">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-800 dark:text-white/90">
                      {user.balance}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                        Unverified
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
