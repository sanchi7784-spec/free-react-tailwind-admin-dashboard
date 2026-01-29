import { useDashboard } from "../../context/DashboardContext";
import PageMeta from "../../components/common/PageMeta";

// Import dashboard components
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";

// Import BBPS and Gold Dashboard components
import BBPSDashboard from "./BBPSDashboard";
import GoldDashboard from "./GoldDashboard";

export default function DynamicDashboard() {
  const { dashboardType } = useDashboard();

  // Render Ecommerce Dashboard
  if (dashboardType === 'ecommerce') {
    return (
      <>
        <PageMeta
          title="Ecommerce Dashboard - Mpay"
          description="Ecommerce dashboard managed by Mastropay Technologies"
        />
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <EcommerceMetrics />
            <MonthlySalesChart />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <MonthlyTarget />
          </div>
          <div className="col-span-12">
            <StatisticsChart />
          </div>
          {/* <div className="col-span-12 xl:col-span-5">
            <DemographicCard />
          </div> */}
          {/* <div className="col-span-12 xl:col-span-7">
            <RecentOrders />
          </div> */}
        </div>
      </>
    );
  }

  // Render BBPS Dashboard
  if (dashboardType === 'bbps') {
    return (
      <>
        <PageMeta
          title="BBPS Dashboard - Mpay"
          description="BBPS dashboard managed by Mastropay Technologies"
        />
        <BBPSDashboard />
      </>
    );
  }

  // Render Gold Dashboard (default)
  return (
    <>
      <PageMeta
        title="Gold Dashboard - Mpay"
        description="Gold dashboard managed by Mastropay Technologies"
      />
      <GoldDashboard />
    </>
  );
}
