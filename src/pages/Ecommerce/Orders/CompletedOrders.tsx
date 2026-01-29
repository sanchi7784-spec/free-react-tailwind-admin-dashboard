import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

export default function CompletedOrders() {
  return (
    <>
      <PageMeta title="Completed Orders - Ecommerce" description="View completed orders" />
      <PageBreadCrumb pageTitle="Completed Orders" />
      
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold text-blue dark:text-white mb-4">Completed Orders</h2>
        <p className="text-body">List of completed orders will appear here.</p>
      </div>
    </>
  );
}
