import React, { useState } from "react";
import { Settings } from "lucide-react";

interface GatewayItem {
  logo: string;
  name: string;
  currency: number;
  withdraw: "Yes" | "No";
  status: "Activated" | "Disabled";
}

const gatewayData: GatewayItem[] = [
  {
    logo: "/paypal.png",
    name: "Paypal",
    currency: 30,
    withdraw: "Yes",
    status: "Activated",
  },
  {
    logo: "/stripe.png",
    name: "Stripe",
    currency: 18,
    withdraw: "No",
    status: "Activated",
  },
  {
    logo: "/mollie.png",
    name: "Mollie",
    currency: 17,
    withdraw: "No",
    status: "Activated",
  },
  {
    logo: "/perfect-money.png",
    name: "Perfect Money",
    currency: 4,
    withdraw: "Yes",
    status: "Activated",
  },
  {
    logo: "/coinbase.png",
    name: "Coinbase",
    currency: 12,
    withdraw: "Yes",
    status: "Activated",
  },
  {
    logo: "/paystack.png",
    name: "Paystack",
    currency: 10,
    withdraw: "No",
    status: "Activated",
  },
  {
    logo: "/voguepay.png",
    name: "Voguepay",
    currency: 10,
    withdraw: "No",
    status: "Activated",
  },
  {
    logo: "/flutterwave.png",
    name: "Flutterwave",
    currency: 25,
    withdraw: "Yes",
    status: "Activated",
  },
];

const AutomaticGateway: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    logo: "",
    name: "",
    codeName: "",
    clientId: "",
    clientSecret: "",
    appId: "",
    mode: "",
    status: "Activated",
  });

  const openModal = (item: GatewayItem) => {
    setForm({
      logo: item.logo,
      name: item.name,
      codeName: item.name.toLowerCase().replace(/\s+/g, ""),
      clientId: "",
      clientSecret: "",
      appId: "",
      mode: "sandbox",
      status: item.status,
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleChange = (key: string, value: string) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const handleSave = () => {
    // TODO: wire up save logic (API call)
    console.log("Save gateway credentials:", form);
    setIsOpen(false);
  };
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-semibold mb-6">Automatic Payment Gateway</h1>

      <div className="bg-white shadow-sm border rounded-lg p-6">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="SEARCH..."
            className="border px-3 py-2 rounded-md w-64"
          />
          <button className="bg-purple-600 text-white px-5 py-2 rounded-md flex items-center gap-2">
            <span>🔍</span> SEARCH
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-50 text-gray-700">
                <th className="py-3 px-4 text-left">LOGO</th>
                <th className="py-3 px-4 text-left">NAME</th>
                <th className="py-3 px-4 text-left">SUPPORTED CURRENCY</th>
                <th className="py-3 px-4 text-left">WITHDRAW AVAILABLE</th>
                <th className="py-3 px-4 text-left">STATUS</th>
                <th className="py-3 px-4 text-left">MANAGE</th>
              </tr>
            </thead>

            <tbody>
              {gatewayData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <img src={item.logo} alt={item.name} className="h-8" />
                  </td>
                  <td className="py-4 px-4">{item.name}</td>
                  <td className="py-4 px-4">{item.currency}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        item.withdraw === "Yes"
                          ? "bg-teal-500"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {item.withdraw}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-teal-500 text-white rounded-full text-sm">
                      Activated
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      className="bg-purple-600 p-2 rounded-full text-white hover:bg-purple-700"
                      onClick={() => openModal(item)}
                      aria-label={`Edit ${item.name} credentials`}
                    >
                      <Settings size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credentials Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          />

          <div className="relative w-[820px] max-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{form.name} Credential Edit</h3>
              <button className="text-gray-600 dark:text-gray-300" onClick={closeModal} aria-label="Close modal">×</button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-6">
              {/* Left: Logo upload preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Logo:</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md p-4 flex items-center justify-center h-40">
                  <img src={form.logo} alt="logo" className="max-h-28 object-contain" />
                </div>
                <button className="mt-3 bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-white px-4 py-2 rounded-md">Update Logo</button>
              </div>

              {/* Right: form fields */}
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300">Name:</label>
                    <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300">Code Name:</label>
                    <input value={form.codeName} readOnly className="mt-1 block w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Client Id :</label>
                  <input value={form.clientId} onChange={(e) => handleChange('clientId', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Client Secret :</label>
                  <input value={form.clientSecret} onChange={(e) => handleChange('clientSecret', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-700 dark:text-gray-300">App Id :</label>
                  <input value={form.appId} onChange={(e) => handleChange('appId', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Mode :</label>
                  <input value={form.mode} onChange={(e) => handleChange('mode', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Status:</label>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleChange('status', 'Activated')} className={`flex-1 px-3 py-2 rounded-md ${form.status === 'Activated' ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Active</button>
                    <button onClick={() => handleChange('status', 'Disabled')} className={`flex-1 px-3 py-2 rounded-md ${form.status === 'Disabled' ? 'bg-gray-300 dark:bg-gray-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Deactivate</button>
                  </div>
                </div>

                <div className="mt-6">
                  <button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomaticGateway;
