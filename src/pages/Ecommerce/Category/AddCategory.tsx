import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

export default function AddCategory() {
  return (
    <>
      <PageMeta title="Add Category - Ecommerce" description="Add a new category" />
      <PageBreadCrumb pageTitle="Add Category" />
      
      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold text-blue dark:text-white mb-4">Add New Category</h2>
        <p className="text-body">Category creation form will appear here.</p>
      </div>
    </>
  );
}
