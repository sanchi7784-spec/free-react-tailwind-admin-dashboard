import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
export default function AdminTaxReport() {
  return (
    <>
      <PageMeta title="Admin Tax Report - Dashboard" description="Admin tax report" />
      <PageBreadCrumb pageTitle="Admin Tax Reports" />

      <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default">
        <h3 className="text-lg font-semibold mb-4">Admin Tax Reports</h3>
        <p className="text-sm text-gray-500 mb-4">Tax summaries and adjustments managed by admins.</p>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-3 py-2">Period</th>
                <th className="px-3 py-2">Tax Collected</th>
                <th className="px-3 py-2">Adjustments</th>
                <th className="px-3 py-2">Net</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-3 py-2">Jan 2026</td>
                <td className="px-3 py-2">$1,200.00</td>
                <td className="px-3 py-2">-$50.00</td>
                <td className="px-3 py-2">$1,150.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
