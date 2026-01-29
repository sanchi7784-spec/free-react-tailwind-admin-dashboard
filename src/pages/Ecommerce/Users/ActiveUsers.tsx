import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

export default function ActiveUsers() {
  return (
    <>
      <PageMeta title="Active Users - Ecommerce" description="View active ecommerce users" />
      <PageBreadCrumb pageTitle="Active Users" />
      
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold text-blue dark:text-white mb-4">Active Users</h2>
        <p className="text-body">List of active ecommerce users will appear here.</p>
      </div>
    </>
  );
}
