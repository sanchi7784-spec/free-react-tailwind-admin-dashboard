import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

export default function CancelledOrders() {
  return (
    <>
      <PageMeta title="Cancelled Orders - Ecommerce" description="View cancelled orders" />
      <PageBreadCrumb pageTitle="Cancelled Orders" />
      
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold text-blue dark:text-white mb-4">Cancelled Orders</h2>
        <p className="text-body">List of cancelled orders will appear here.</p>
      </div>
    </>
  );
}
