import { useState } from "react";
import { X } from "lucide-react";

interface FieldOption {
  id: number;
  label: string;
  type: string;
  required: boolean;
}

const WithdrawalMethodForm = () => {
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>([
    { id: 1, label: "Acc name", type: "Input Text", required: true },
    { id: 2, label: "Upload Photo", type: "File upload", required: true },
    { id: 3, label: "Write Something", type: "Textarea", required: true },
  ]);

  const addField = () => {
    setFieldOptions([
      ...fieldOptions,
      {
        id: Date.now(),
        label: "",
        type: "Input Text",
        required: false,
      },
    ]);
  };

  const removeField = (id: number) => {
    setFieldOptions(fieldOptions.filter((f) => f.id !== id));
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      {/* Upload Icon */}
      <div className="mb-6">
        <label className="font-medium text-sm">Upload Icon:</label>
        <div className="border border-dashed rounded-lg h-36 mt-2 flex items-center justify-center">
          <button className="bg-purple-400 text-white px-6 py-2 rounded-md">
            Update Icon
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className="text-sm font-medium">Name:</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="Mbank-wid"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="text-sm font-medium">Currency:</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="$"
          />
        </div>

        {/* Conversion Rate */}
        <div>
          <label className="text-sm font-medium">Convention Rate:</label>
          <div className="flex gap-2 mt-1">
            <input className="w-full border rounded-md px-3 py-2" placeholder="1 USD =" />
            <div className="flex items-center border rounded-md px-3">1</div>
          </div>
        </div>

        {/* Charges */}
        <div>
          <label className="text-sm font-medium">Charges:</label>
          <div className="flex gap-2 mt-1">
            <input className="w-full border rounded-md px-3 py-2" placeholder="1" />
            <select className="border rounded-md px-3">
              <option>%</option>
              <option>$</option>
            </select>
          </div>
        </div>

        {/* Minimum Withdraw */}
        <div>
          <label className="text-sm font-medium">Minimum Withdraw:</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="50"
          />
        </div>

        {/* Maximum Withdraw */}
        <div>
          <label className="text-sm font-medium">Maximum Withdraw:</label>
          <div className="flex gap-2 mt-1">
            <input className="w-full border rounded-md px-3 py-2" placeholder="10000" />
            <div className="flex items-center border rounded-md px-3">$</div>
          </div>
        </div>

        {/* Processing Time */}
        <div>
          <label className="text-sm font-medium">Processing Time:</label>
          <div className="flex gap-2 mt-1">
            <input className="w-full border rounded-md px-3 py-2" placeholder="5" />
            <select className="border rounded-md px-3">
              <option>Minutes</option>
              <option>Hours</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium">Status:</label>
          <div className="flex mt-2 border rounded-lg overflow-hidden">
            <button
              className={`w-1/2 py-2 ${
                status === "active" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setStatus("active")}
            >
              Active
            </button>
            <button
              className={`w-1/2 py-2 ${
                status === "inactive" ? "bg-purple-200" : "bg-gray-200"
              }`}
              onClick={() => setStatus("inactive")}
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>

      {/* Add Field Button */}
      <button
        onClick={addField}
        className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-md"
      >
        Add Field Option
      </button>

      {/* Dynamic Fields */}
      <div className="mt-4 space-y-4">
        {fieldOptions.map((field) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input
              className="border rounded-md px-3 py-2"
              defaultValue={field.label}
            />

            <select className="border rounded-md px-3 py-2" defaultValue={field.type}>
              <option>Input Text</option>
              <option>File upload</option>
              <option>Textarea</option>
            </select>

            <select
              className="border rounded-md px-3 py-2"
              defaultValue={field.required ? "Required" : "Optional"}
            >
              <option>Required</option>
              <option>Optional</option>
            </select>

            <button
              onClick={() => removeField(field.id)}
              className="bg-red-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-10">
        <button className="w-full bg-purple-700 text-white py-3 rounded-md">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default WithdrawalMethodForm;
