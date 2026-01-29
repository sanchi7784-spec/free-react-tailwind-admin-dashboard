import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

export default function PendingOrders() {
  return (
    <>
      <PageMeta title="Pending Orders - Ecommerce" description="View pending orders" />
      <PageBreadCrumb pageTitle="Pending Orders" />
      
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold text-blue dark:text-white mb-4">Pending Orders</h2>
        <p className="text-body">List of pending orders will appear here.</p>
      </div>
    </>
  );
}
