import { useState, useEffect } from "react";
import { fetchChargeRules, ChargeRule, createChargeRule, CreateChargeRulePayload, updateChargeRule } from "../../api/chargeRules";

interface LivePrice {
  live_price: number;
  platform_price: number;
  sell_price?: number;
  change_in_price: number;
  change_in_percentage: number;
  change: string;
}

const GoldChargeLimit = () => {
  const [livePrice, setLivePrice] = useState<LivePrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chargeRules, setChargeRules] = useState<ChargeRule[] | null>(null);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [rulesError, setRulesError] = useState<string | null>(null);

  // New States for PATCH Modal
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [platformPriceInput, setPlatformPriceInput] = useState("");
  const [sellPriceInput, setSellPriceInput] = useState("");
  const [percentageInput, setPercentageInput] = useState("");
  const [priceMode, setPriceMode] = useState<"direct" | "percentage">("percentage");
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [creatingRule, setCreatingRule] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit rule state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [editSlug, setEditSlug] = useState<string>("");
  const [editMinAmount, setEditMinAmount] = useState<string>("");
  const [editMaxAmount, setEditMaxAmount] = useState<string>("");
  const [editFixedCharge, setEditFixedCharge] = useState<string>("");
  const [editPercentCharge, setEditPercentCharge] = useState<string>("");
  const [editVatPercent, setEditVatPercent] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("1");

  // New form state for creating a rule
  const [formSlug, setFormSlug] = useState<string>("");
  const [formMinAmount, setFormMinAmount] = useState<string>("");
  const [formMaxAmount, setFormMaxAmount] = useState<string>("");
  const [formFixedCharge, setFormFixedCharge] = useState<string>("");
  const [formPercentCharge, setFormPercentCharge] = useState<string>("");
  const [formVatPercent, setFormVatPercent] = useState<string>("");

  const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? "https://api.mastropaytech.com";

  useEffect(() => {
    fetchLivePrice();
    fetchRules();
  }, []);

  async function fetchRules() {
    setRulesLoading(true);
    setRulesError(null);
    try {
      const res = await fetchChargeRules();
      setChargeRules(res.charge_rules || []);
    } catch (err: any) {
      setRulesError(err?.detail || err?.message || "Failed to load charge rules");
    } finally {
      setRulesLoading(false);
    }
  }
  const fetchLivePrice = () => {
    setLoading(true);
    setError(null);

    const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
    const url = userId ? `${API_BASE.replace(/\/$/, "")}/dashboard/live-price/${userId}` : `${API_BASE.replace(/\/$/, "")}/dashboard/live-price`;

    fetch(url, { headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          let errorData: any = null;
          try {
            errorData = text ? JSON.parse(text) : null;
          } catch {
            // Not JSON
          }
          const message = errorData?.detail || text || `Failed to fetch live price: ${res.status}`;
          const err = new Error(message);
          (err as any).detail = errorData?.detail || text;
          throw err;
        }

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text();
          throw new Error(`Expected JSON but received: ${txt.slice(0, 200)}`);
        }

        return res.json();
      })
      .then((data) => {
        setLivePrice(data);
        setPlatformPriceInput(data.platform_price.toString());
        setSellPriceInput(data.sell_price?.toString() ?? "");
        setPercentageInput("");
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err?.detail || err?.message || "Error fetching data");
        setLoading(false);
      });
  };

  // PATCH API (Update Sell Price)
  const updateSellPrice = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellPriceInput) {
      alert("Please enter a sell price");
      return;
    }

    const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
    const url = userId ? `${API_BASE.replace(/\/$/, "")}/dashboard/platform-price/${userId}` : `${API_BASE.replace(/\/$/, "")}/dashboard/platform-price`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        platform_price: livePrice?.platform_price ?? 0,
        sell_price: parseFloat(sellPriceInput),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          let errorData: any = null;
          try {
            errorData = text ? JSON.parse(text) : null;
          } catch {
            // Not JSON
          }
          const message = errorData?.detail || text || `Failed to update sell price: ${res.status}`;
          const err = new Error(message);
          (err as any).detail = errorData?.detail || text;
          throw err;
        }

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text();
          throw new Error(`Expected JSON but received: ${txt.slice(0, 200)}`);
        }

        return res.json();
      })
      .then((data) => {
        // Update UI with new response
        setLivePrice({
          live_price: data.live_price,
          platform_price: data.platform_price,
          sell_price: data.sell_price ?? livePrice?.sell_price,
          change_in_price: (data.change_in_price ?? livePrice?.change_in_price) || 0,
          change_in_percentage: (data.change_in_percentage ?? livePrice?.change_in_percentage) || 0,
          change: data.change ?? livePrice?.change ?? "",
        });

        alert("Sell price updated successfully!");
      })
      .catch((err: any) => {
        alert(err?.detail || err?.message || "Update failed");
      });
  };

  // PATCH API (Update Platform Price)
  const updatePlatformPrice = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate the final platform price based on mode
    let finalPlatformPrice = parseFloat(platformPriceInput);
    
    if (priceMode === "percentage" && percentageInput && livePrice) {
      const percentage = parseFloat(percentageInput);
      // Formula: new_price = current_price * (1 + percentage/100)
      finalPlatformPrice = livePrice.platform_price * (1 + percentage / 100);
    }

    const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
    const url = userId ? `${API_BASE.replace(/\/$/, "")}/dashboard/platform-price/${userId}` : `${API_BASE.replace(/\/$/, "")}/dashboard/platform-price`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        platform_price: finalPlatformPrice,
        sell_price: sellPriceInput ? parseFloat(sellPriceInput) : undefined,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          let errorData: any = null;
          try {
            errorData = text ? JSON.parse(text) : null;
          } catch {
            // Not JSON
          }
          const message = errorData?.detail || text || `Failed to update platform price: ${res.status}`;
          const err = new Error(message);
          (err as any).detail = errorData?.detail || text;
          throw err;
        }

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text();
          throw new Error(`Expected JSON but received: ${txt.slice(0, 200)}`);
        }

        return res.json();
      })
      .then((data) => {
        // Update UI with new response
        setLivePrice({
          live_price: data.live_price,
          platform_price: data.platform_price,
          sell_price: data.sell_price ?? livePrice?.sell_price,
          change_in_price: (data.change_in_price ?? livePrice?.change_in_price) || 0,
          change_in_percentage: (data.change_in_percentage ?? livePrice?.change_in_percentage) || 0,
          change: data.change ?? livePrice?.change ?? "",
        });

        setIsPlatformModalOpen(false);
        setPercentageInput("");
        setPriceMode("direct");
        alert("Platform price updated successfully!");
      })
      .catch((err: any) => {
        alert(err?.detail || err?.message || "Update failed");
      });
  };

  // Prepare formatted change display values so sign follows `change` flag
  let priceSign = "";
  let percSign = "";
  let absPriceDisplay = "";
  let absPercDisplay = "";
  if (livePrice) {
    const isNegPrice = livePrice.change === "Negative Change" || livePrice.change_in_price < 0;
    const isPosPrice = livePrice.change === "Positive Change" || livePrice.change_in_price > 0;
    priceSign = isNegPrice ? "-" : isPosPrice ? "+" : "";
    absPriceDisplay = Math.abs(livePrice.change_in_price).toLocaleString(undefined, { maximumFractionDigits: 4 });

    const isNegPerc = livePrice.change === "Negative Change" || livePrice.change_in_percentage < 0;
    const isPosPerc = livePrice.change === "Positive Change" || livePrice.change_in_percentage > 0;
    percSign = isNegPerc ? "-" : isPosPerc ? "+" : "";
    absPercDisplay = (Math.abs(livePrice.change_in_percentage * 100)).toFixed(2);
  }

  function mapSlug(slug: number | string) {
    // slug may be numeric or string; coerce to number
    const s = Number(slug);
    switch (s) {
      case 0:
        return "Buy";
      case 1:
        return "Sell";
      case 2:
        return "Gift";
      case 3:
        return "Redeem";
      default:
        return String(slug);
    }
  }

  function formatRs(value: number | string) {
    const n = Number(value) || 0;
    return `₹${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR`;
  }

  async function handleCreateRule(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreatingRule(true);
    // basic required-field validation
    if (formSlug === "" || formMinAmount === "" || formMaxAmount === "" || formFixedCharge === "" || formPercentCharge === "" || formVatPercent === "") {
      setCreateError("Please fill all fields before submitting.");
      setCreatingRule(false);
      return;
    }

    const payload: CreateChargeRulePayload = {
      slug: Number(formSlug),
      min_amount: parseFloat(formMinAmount),
      max_amount: parseFloat(formMaxAmount),
      fixed_charge: parseFloat(formFixedCharge),
      percent_charge: parseFloat(formPercentCharge),
      vat_percent: parseFloat(formVatPercent),
    };

    try {
      await createChargeRule(payload);
      // success — refresh list and close modal
      await fetchRules();
      setIsAddRuleOpen(false);
    } catch (err: any) {
      setCreateError(err?.detail ?? "Failed to create rule");
    } finally {
      setCreatingRule(false);
    }
  }

  async function handleEditRule(e: React.FormEvent) {
    e.preventDefault();
    setEditError(null);
    if (!editingRuleId) {
      setEditError("No rule selected to edit.");
      return;
    }
    setEditing(true);

    // basic validation
    if (editSlug === "" || editMinAmount === "" || editMaxAmount === "" || editFixedCharge === "" || editPercentCharge === "" || editVatPercent === "") {
      setEditError("Please fill all fields before submitting.");
      setEditing(false);
      return;
    }

    try {
      const payload = {
        slug: Number(editSlug),
        min_amount: parseFloat(editMinAmount),
        max_amount: parseFloat(editMaxAmount),
        fixed_charge: parseFloat(editFixedCharge),
        percent_charge: parseFloat(editPercentCharge),
        vat_percent: parseFloat(editVatPercent),
        status: Number(editStatus),
      };

      await updateChargeRule(editingRuleId, payload);
      await fetchRules();
      setIsEditOpen(false);
    } catch (err: any) {
      setEditError(err?.detail ?? "Failed to update rule");
    } finally {
      setEditing(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Manage Charge Limit
          </h1>
        </div>

        {/* Live Price Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            {loading ? (
              <div className="text-gray-500 dark:text-gray-400">Loading live price...</div>
            ) : error ? (
              <div className="text-red-500 font-medium">{error}</div>
            ) : livePrice ? (
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                {/* EXISTING UI — NOT MODIFIED */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Live Price</span>
                  <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                    ₹{livePrice.live_price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    <span className="text-xs text-gray-500 dark:text-gray-400"> INR</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Platform Price</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{livePrice.platform_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    <span className="text-xs text-gray-500 dark:text-gray-400"> INR</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Sell Price</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{(livePrice.sell_price ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    <span className="text-xs text-gray-500 dark:text-gray-400"> INR</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Change in Price</span>
                  <span
                    className={`text-lg font-bold ${
                      livePrice.change === "Positive Change"
                        ? "text-green-600 dark:text-green-400"
                        : livePrice.change === "Negative Change"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {priceSign}
                    {absPriceDisplay}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Change %</span>
                  <span
                    className={`text-lg font-bold ${
                      livePrice.change === "Positive Change"
                        ? "text-green-600 dark:text-green-400"
                        : livePrice.change === "Negative Change"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {percSign}
                    {absPercDisplay}%
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Change</span>
                  <span
                    className={`text-base font-semibold ${
                      livePrice.change === "Positive Change"
                        ? "text-green-600 dark:text-green-400"
                        : livePrice.change === "Negative Change"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {livePrice.change}
                  </span>
                </div>
              </div>

              {/* Sell Price Input */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Sell Price</h3>
                <form onSubmit={updateSellPrice} className="space-y-4">
                  <div className="max-w-md">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sell Price (INR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={sellPriceInput}
                      onChange={(e) => setSellPriceInput(e.target.value)}
                      placeholder="Enter sell price"
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                  >
                    Update Sell Price
                  </button>
                </form>
              </div>

              {/* Inline Platform Price Update Form */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Platform Price</h3>
                
                <form onSubmit={updatePlatformPrice} className="space-y-4">
                  {/* Toggle Mode */}
                  <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg max-w-md">
                    <button
                      type="button"
                      onClick={() => {
                        setPriceMode("percentage");
                        setPlatformPriceInput(livePrice?.platform_price.toString() ?? "");
                      }}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                        priceMode === "percentage"
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Change By Percentage
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceMode("direct");
                        setPercentageInput("");
                      }}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                        priceMode === "direct"
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Change By Price
                    </button>
                  </div>

                  {/* Current Price Display */}
                  {priceMode === "percentage" && livePrice && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Platform Price:</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{livePrice.platform_price.toLocaleString(undefined, { maximumFractionDigits: 2 })} INR
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Direct Price Input */}
                    {priceMode === "direct" && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Platform Price (INR)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={platformPriceInput}
                          onChange={(e) => setPlatformPriceInput(e.target.value)}
                          className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    )}

                    {/* Percentage Input */}
                    {priceMode === "percentage" && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Percentage Change (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={percentageInput}
                          onChange={(e) => {
                            const percentage = e.target.value;
                            setPercentageInput(percentage);
                            
                            // Calculate and update platform price based on percentage
                            if (percentage && livePrice) {
                              const newPrice = livePrice.platform_price * (1 + parseFloat(percentage) / 100);
                              setPlatformPriceInput(newPrice.toFixed(2));
                            } else {
                              setPlatformPriceInput(livePrice?.platform_price.toString() ?? "");
                            }
                          }}
                          placeholder="Enter the value"
                          className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                          required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enter positive value for increase, negative for decrease
                        </p>
                        
                        {/* Preview Calculation */}
                        {percentageInput && livePrice && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Platform Price:</p>
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">
                              ₹{(livePrice.platform_price * (1 + parseFloat(percentageInput) / 100)).toLocaleString(undefined, { 
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2 
                              })} INR
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Changing platform price will change the live price accordingly.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                  >
                    Update Price
                  </button>
                </form>
              </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No live price data.</div>
            )}
          </div>
        </div>

        {/* REMOVE TABLE COMPLETELY */}
        {/* (DELETED AS YOU REQUESTED) */}

        {/* Charge Rules Section (NEW: displays rules from API) */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Charge Rules</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddRuleOpen(true)}
                  className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                >
                  Add Rule
                </button>
                <button
                  onClick={fetchRules}
                  className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Refresh
                </button>
              </div>
            </div>

            {rulesLoading ? (
              <div className="text-gray-500 dark:text-gray-400">Loading charge rules...</div>
            ) : rulesError ? (
              <div className="text-red-500">Error: {rulesError}</div>
            ) : !chargeRules || chargeRules.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">No charge rules available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Min Amount (Rs)</th>
                      <th className="px-3 py-2">Max Amount (Rs)</th>
                      <th className="px-3 py-2">Fixed Charge (Rs)</th>
                      <th className="px-3 py-2">% Charge</th>
                      <th className="px-3 py-2">VAT %</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chargeRules.map((r) => (
                      <tr key={r.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-200">{r.id}</td>
                        <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-200">{mapSlug(r.slug)}</td>
                        <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-200">{formatRs(r.min_amount)}</td>
                        <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-200">{formatRs(r.max_amount)}</td>
                        <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-200">{formatRs(r.fixed_charge)}</td>
                        <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-200">{Number(r.percent_charge).toFixed(4)}</td>
                        <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-200">{Number(r.vat_percent).toFixed(4)}</td>
                        <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-200">
                          {r.status === 1 ? (
                            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                          ) : (
                            <span className="inline-block bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs">Inactive</span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <button
                            onClick={() => {
                              // open edit modal for this rule
                              setEditingRuleId(r.id);
                              setEditSlug(String(r.slug));
                              setEditMinAmount(String(r.min_amount));
                              setEditMaxAmount(String(r.max_amount));
                              setEditFixedCharge(String(r.fixed_charge));
                              setEditPercentCharge(String(r.percent_charge));
                              setEditVatPercent(String(r.vat_percent));
                              setEditStatus(String(r.status ?? 1));
                              setEditError(null);
                              setIsEditOpen(true);
                            }}
                            className="text-sm px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ADD RULE MODAL */}
        {isAddRuleOpen && (
          <div className="fixed inset-0 bg-blue bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-lg w-full shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create Charge Rule</h2>

              <form onSubmit={handleCreateRule} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <select
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="0">Buy</option>
                    <option value="1">Sell</option>
                    <option value="2">Gift</option>
                    <option value="3">Redeem</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Format: choose the rule type — 0: Buy, 1: Sell, 2: Gift, 3: Redeem</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Min Amount(Rs)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 10.00"
                      inputMode="decimal"
                      value={formMinAmount}
                      onChange={(e) => setFormMinAmount(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter minimum amount in Rs as a number (decimal allowed), e.g. 10.00</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Amount (Rs)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 5000.00"
                      inputMode="decimal"
                      value={formMaxAmount}
                      onChange={(e) => setFormMaxAmount(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter maximum amount in Rs as a number (decimal allowed), e.g. 5000.00</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fixed Charge (Rs)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 1.00"
                      inputMode="decimal"
                      value={formFixedCharge}
                      onChange={(e) => setFormFixedCharge(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Fixed charge amount in Rs (decimal), e.g. 1.00</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">% Charge</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="e.g. 1.5"
                      inputMode="decimal"
                      value={formPercentCharge}
                      onChange={(e) => setFormPercentCharge(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Percentage charge (without % sign), e.g. 1.5</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">VAT %</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="e.g. 2.5"
                      inputMode="decimal"
                      value={formVatPercent}
                      onChange={(e) => setFormVatPercent(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">VAT percentage (without % sign), e.g. 2.5</p>
                  </div>
                </div>

                {createError && <div className="text-red-500">{createError}</div>}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={creatingRule}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-60 dark:bg-green-500 dark:hover:bg-green-600"
                  >
                    {creatingRule ? "Creating..." : "Create Rule"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddRuleOpen(false)}
                    className="flex-1 py-3 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT RULE MODAL */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-blue bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-lg w-full shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Charge Rule</h2>

              <form onSubmit={handleEditRule} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <select
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="0">Buy</option>
                    <option value="1">Sell</option>
                    <option value="2">Gift</option>
                    <option value="3">Redeem</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Format: choose the rule type — 0: Buy, 1: Sell, 2: Gift, 3: Redeem</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Min Amount (Rs)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 10.00"
                      inputMode="decimal"
                      value={editMinAmount}
                      onChange={(e) => setEditMinAmount(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter minimum amount in Rs as a number (decimal allowed), e.g. 10.00</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Amount (Rs)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 5000.00"
                      inputMode="decimal"
                      value={editMaxAmount}
                      onChange={(e) => setEditMaxAmount(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter maximum amount in Rs as a number (decimal allowed), e.g. 5000.00</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fixed Charge (Rs)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 1.00"
                      inputMode="decimal"
                      value={editFixedCharge}
                      onChange={(e) => setEditFixedCharge(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Fixed charge amount in Rs (decimal), e.g. 1.00</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">% Charge</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="e.g. 1.5"
                      inputMode="decimal"
                      value={editPercentCharge}
                      onChange={(e) => setEditPercentCharge(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Percentage charge (without % sign), e.g. 1.5</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">VAT %</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="e.g. 2.5"
                      inputMode="decimal"
                      value={editVatPercent}
                      onChange={(e) => setEditVatPercent(e.target.value)}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">VAT percentage (without % sign), e.g. 2.5</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                {editError && <div className="text-red-500">{editError}</div>}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={editing}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    {editing ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 py-3 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>
    </>
  );
};

export default GoldChargeLimit;
