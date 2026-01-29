import { useMemo, useState } from "react";
import { Link } from "react-router";

type Product = {
  id: number;
  name: string;
  type: string;
  unitPrice: number;
  featured: boolean;
  active: boolean;
  vendor: string;
};

const sampleData: Product[] = [
  { id: 1, name: "Classic Watch", type: "Physical", unitPrice: 129.99, featured: true, active: true, vendor: "Vendor A" },
  { id: 2, name: "Running Shoes", type: "Physical", unitPrice: 79.5, featured: false, active: true, vendor: "Vendor B" },
  { id: 3, name: "Ebook: JS Guide", type: "Digital", unitPrice: 9.99, featured: false, active: false, vendor: "Vendor A" },
];

function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const header = Object.keys(rows[0]);
  const csv = [header.join(",")].concat(
    rows.map((r) => header.map((h) => {
      const v = r[h] ?? "";
      const cell = typeof v === 'string' ? v.replace(/"/g, '""') : String(v);
      return `"${cell}"`;
    }).join(","))
  ).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function VendorProducts() {
  const [products] = useState<Product[]>(sampleData);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim().toLowerCase();
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (brand && p.vendor !== brand) return false;
      if (category && p.type !== category) return false;
      return true;
    });
  }, [products, query, brand, category]);

  const onExport = () => {
    const rows = filtered.map((p, i) => ({
      SL: i + 1,
      "Product Name": p.name,
      "Product Type": p.type,
      "Unit Price": p.unitPrice,
      "Show As Featured": p.featured ? "Yes" : "No",
      "Active Status": p.active ? "Active" : "Inactive",
      Vendor: p.vendor,
    }));
    downloadCSV("vendor-products.csv", rows);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-lg">Filter Products</h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Brand</label>
            <select className="w-full border rounded px-3 py-2" value={brand} onChange={(e)=>setBrand(e.target.value)}>
              <option value="">Select from dropdown</option>
              <option>Vendor A</option>
              <option>Vendor B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Category</label>
            <select className="w-full border rounded px-3 py-2" value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="">Select from dropdown</option>
              <option value="Physical">Physical</option>
              <option value="Digital">Digital</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Sub Category</label>
            <select className="w-full border rounded px-3 py-2">
              <option>Select Sub Category</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Sub Sub Category</label>
            <select className="w-full border rounded px-3 py-2">
              <option>Select from dropdown</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-3 justify-end">
          <button className="px-4 py-2 rounded bg-gray-200">Reset</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white">Show data</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              placeholder="Search by Product Name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border px-3 py-2 rounded w-80"
            />
            <button className="px-3 py-2 rounded bg-gray-100">🔍</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onExport} className="px-4 py-2 rounded border border-blue-500 text-blue-600 flex items-center gap-2">
              ⤓ Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3">SL</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Product Type</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Show As Featured</th>
                <th className="p-3">Active Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3 align-top">{idx + 1}</td>
                    <td className="p-3 align-top">{p.name}</td>
                    <td className="p-3 align-top">{p.type}</td>
                    <td className="p-3 align-top">${p.unitPrice.toFixed(2)}</td>
                    <td className="p-3 align-top">{p.featured ? "Yes" : "No"}</td>
                    <td className="p-3 align-top">{p.active ? "Active" : "Inactive"}</td>
                    <td className="p-3 align-top">
                      <div className="flex gap-2">
                        <Link to="#" className="text-blue-600">View</Link>
                        <Link to="#" className="text-green-600">Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
