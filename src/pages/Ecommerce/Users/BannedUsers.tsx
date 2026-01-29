import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

export default function BannedUsers() {
  return (
    <>
      <PageMeta title="Banned Users - Ecommerce" description="View banned ecommerce users" />
      <PageBreadCrumb pageTitle="Banned Users" />
      
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold text-blue dark:text-white mb-4">Banned Users</h2>
        <p className="text-body">List of banned ecommerce users will appear here.</p>
      </div>
    </>
  );
}
