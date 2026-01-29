import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

export default function RevenueReport() {
  return (
    <>
      <PageMeta title="Revenue Report - Ecommerce" description="View revenue reports" />
      <PageBreadCrumb pageTitle="Revenue Report" />
      
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold text-blue dark:text-white mb-4">Revenue Report</h2>
        <p className="text-body">Revenue analytics and reports will appear here.</p>
      </div>
    </>
  );
}
