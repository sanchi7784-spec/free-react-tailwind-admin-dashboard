import React, { useEffect, useState } from "react";
import { fetchChargeChangeHistory } from "../../api/chargeChangeHistory";
import { fetchPlatformPriceHistory } from "../../api/platformPriceHistory";

const ChargeChangeHistory: React.FC = () => {
  // Charge Change History State
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Platform Price History State
  const [platformHistory, setPlatformHistory] = useState<any[]>([]);
  const [platformLoading, setPlatformLoading] = useState(true);
  const [platformError, setPlatformError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchChargeChangeHistory()
      .then((data) => {
        setHistory(data.history || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch history");
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPlatformLoading(true);
    fetchPlatformPriceHistory()
      .then((data) => {
        setPlatformHistory(data.history || []);
        setPlatformError(null);
      })
      .catch((err) => {
        setPlatformError(err.message || "Failed to fetch platform price history");
        setPlatformHistory([]);
      })
      .finally(() => setPlatformLoading(false));
  }, []);

  return (
    <>
      <div className="p-6 bg-white rounded shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Charge Change History</h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : history.length === 0 ? (
          <div className="text-gray-500">No history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Charge Rule ID</th>
                  <th className="px-2 py-2">Charge Rule Slug</th>
                  <th className="px-2 py-2">Prev Min Amount</th>
                  <th className="px-2 py-2">Updated Min Amount</th>
                  <th className="px-2 py-2">Prev Max Amount</th>
                  <th className="px-2 py-2">Updated Max Amount</th>
                  <th className="px-2 py-2">Prev Fixed Charge</th>
                  <th className="px-2 py-2">Updated Fixed Charge</th>
                  <th className="px-2 py-2">Prev Percent Charge</th>
                  <th className="px-2 py-2">Updated Percent Charge</th>
                  <th className="px-2 py-2">Prev VAT %</th>
                  <th className="px-2 py-2">Updated VAT %</th>
                  <th className="px-2 py-2">Prev Status</th>
                  <th className="px-2 py-2">Updated Status</th>
                  <th className="px-2 py-2">Updated By</th>
                  <th className="px-2 py-2">Date/Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-2 py-2 whitespace-nowrap">{item.id}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.charge_rule_id}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.charge_rule_slug}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.previous_min_amount}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_min_amount}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.previous_max_amount}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_max_amount}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.previous_fixed_charge}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_fixed_charge}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.previous_percent_charge}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_percent_charge}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.previous_vat_percent}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_vat_percent}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.previous_status}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_status}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_by}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Platform Price & Sell Price History Section */}
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Platform Price & Sell Price Change History</h2>
        {platformLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : platformError ? (
          <div className="text-red-500">{platformError}</div>
        ) : platformHistory.length === 0 ? (
          <div className="text-gray-500">No history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Prev Platform Price</th>
                  <th className="px-2 py-2">Updated Platform Price</th>
                  <th className="px-2 py-2">Prev Sell Price</th>
                  <th className="px-2 py-2">Updated Sell Price</th>
                  <th className="px-2 py-2">Updated By</th>
                  <th className="px-2 py-2">Date/Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {platformHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-2 py-2 whitespace-nowrap">{item.id}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.previous_platform_price}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_platform_price !== null ? item.updated_platform_price : '-'}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.previous_sell_price}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_sell_price !== null ? item.updated_sell_price : '-'}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.updated_by}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ChargeChangeHistory;
