import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

export default function VendorVatReport() {
  return (
    <>
      <PageMeta title="Vendor VAT Report - Dashboard" description="Vendor VAT report" />
      <PageBreadCrumb pageTitle="Vendor VAT Reports" />

      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default">
        <h3 className="text-lg font-semibold mb-4">Vendor VAT Reports</h3>
        <p className="text-sm text-gray-500 mb-4">VAT summaries for vendor transactions.</p>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-3 py-2">Vendor</th>
                <th className="px-3 py-2">Sales</th>
                <th className="px-3 py-2">VAT Collected</th>
                <th className="px-3 py-2">Period</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-3 py-2">Vendor A</td>
                <td className="px-3 py-2">$4,500.00</td>
                <td className="px-3 py-2">$405.00</td>
                <td className="px-3 py-2">Jan 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
