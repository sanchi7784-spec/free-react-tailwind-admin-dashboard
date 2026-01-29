import { useEffect } from "react";
import { useNavigate } from "react-router";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { canAccessEcommerce, isEcommerceAuthenticated } from "../../utils/ecommerceAuth";

export default function Home() {
  const navigate = useNavigate();

  // Check domain access before loading
  useEffect(() => {
    if (isEcommerceAuthenticated() && !canAccessEcommerce()) {
      // Redirect Gold/BBPS-only users to their dashboard
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <PageMeta
        title="Mpay Dashboard"
        description="This is a dashboard that is managed by Mastropay Technologies"
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
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
