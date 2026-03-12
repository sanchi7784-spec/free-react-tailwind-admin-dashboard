import { useDashboard } from "../../context/DashboardContext";
import PageMeta from "../../components/common/PageMeta";

// Import dashboard components
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import RecentOrders from "../../components/ecommerce/RecentOrders";

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
        <div className="space-y-6">
          <EcommerceMetrics />
          <RecentOrders />
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
