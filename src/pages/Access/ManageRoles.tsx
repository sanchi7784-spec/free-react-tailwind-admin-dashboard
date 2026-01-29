import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import {
  uploadStaffKyc,
  fetchStaffKyc,
  StaffKycData,
  getKycStatusText,
  getKycStatusColor,
} from "../../api/kyc";

export default function StaffKycUpload() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [kycData, setKycData] = useState<StaffKycData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    panNumber: "",
  });

  const [files, setFiles] = useState<{
    aadhaarFront: File | null;
    aadhaarBack: File | null;
    panImage: File | null;
  }>({
    aadhaarFront: null,
    aadhaarBack: null,
    panImage: null,
  });

  useEffect(() => {
    loadKycData();
  }, []);

  const loadKycData = async () => {
    try {
      setLoading(true);
      setError(null);

      const staffUserId = localStorage.getItem("mp_user_id");
      if (!staffUserId) {
        throw new Error("Staff user ID not found");
      }

      const data = await fetchStaffKyc(staffUserId);
      setKycData(data);

      // Pre-fill form with existing data
      setFormData({
        aadhaarNumber: data.aadhaar_number || "",
        panNumber: data.pan_number || "",
      });
    } catch (err) {
      console.error("Error fetching KYC data:", err);
      // If status is -1 (not uploaded), this is expected
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.aadhaarNumber || !formData.panNumber) {
      setError("Please enter Aadhaar and PAN numbers");
      return;
    }

    if (!files.aadhaarFront || !files.aadhaarBack || !files.panImage) {
      setError("Please upload all required documents");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccessMessage(null);

      const staffUserId = localStorage.getItem("mp_user_id");
      if (!staffUserId) {
        throw new Error("Staff user ID not found");
      }

      // Check if this is a re-upload (status is rejected)
      const isReupload = kycData?.status === 2;

      const result = await uploadStaffKyc(
        staffUserId,
        formData.aadhaarNumber,
        files.aadhaarFront,
        files.aadhaarBack,
        formData.panNumber,
        files.panImage,
        isReupload
      );

      setSuccessMessage(result.detail || "KYC documents uploaded successfully");

      // Reset file inputs
      setFiles({
        aadhaarFront: null,
        aadhaarBack: null,
        panImage: null,
      });

      // Reload KYC data
      setTimeout(() => {
        loadKycData();
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      console.error("Error uploading KYC:", err);
      setError(err?.detail || "Failed to upload KYC documents");
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadgeClass = (status: number) => {
    const color = getKycStatusColor(status as any);
    const baseClass = "inline-flex rounded-full px-3 py-1 text-sm font-medium";
    
    switch (color) {
      case "green":
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case "yellow":
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      case "red":
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
    }
  };

  const canUpload = !kycData || kycData.status === -1 || kycData.status === 2;

  return (
    <>
      <PageMeta title="Staff KYC Upload" description="Upload and manage your KYC documents" />
      <div className="mx-auto max-w-4xl">
        <PageBreadCrumb pageTitle="Staff KYC Upload" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:p-8">
          {/* KYC Status Display */}
          {kycData && kycData.status !== -1 && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">
                    Current KYC Status
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your KYC verification status
                  </p>
                </div>
                <span className={getStatusBadgeClass(kycData.status)}>
                  {getKycStatusText(kycData.status as any)}
                </span>
              </div>

              {kycData.status === 2 && kycData.rejection_reason && (
                <div className="mt-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                  <p className="text-sm font-medium text-red-800 dark:text-red-400">
                    Rejection Reason:
                  </p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {kycData.rejection_reason}
                  </p>
                  <p className="mt-2 text-sm font-medium text-red-800 dark:text-red-400">
                    Please upload corrected documents below.
                  </p>
                </div>
              )}

              {kycData.status === 1 && (
                <div className="mt-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your KYC has been approved. No further action required.
                  </p>
                </div>
              )}

              {kycData.status === 0 && (
                <div className="mt-3 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Your KYC is under review. Please wait for approval.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
              {canUpload ? "Upload KYC Documents" : "KYC Documents"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {canUpload
                ? "Please upload your Aadhaar and PAN documents for verification"
                : "Your documents are currently being processed"}
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {canUpload ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Aadhaar Section */}
                <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                    Aadhaar Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label>Aadhaar Number</Label>
                      <input
                        type="text"
                        value={formData.aadhaarNumber}
                        onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                        placeholder="Enter 12-digit Aadhaar number"
                        maxLength={12}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label>Aadhaar Front Image</Label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange("aadhaarFront", e.target.files?.[0] || null)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          required
                        />
                        {files.aadhaarFront && (
                          <p className="mt-1 text-xs text-gray-500">{files.aadhaarFront.name}</p>
                        )}
                      </div>

                      <div>
                        <Label>Aadhaar Back Image</Label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange("aadhaarBack", e.target.files?.[0] || null)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          required
                        />
                        {files.aadhaarBack && (
                          <p className="mt-1 text-xs text-gray-500">{files.aadhaarBack.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAN Section */}
                <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                    PAN Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label>PAN Number</Label>
                      <input
                        type="text"
                        value={formData.panNumber}
                        onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                        placeholder="Enter 10-character PAN number"
                        maxLength={10}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <Label>PAN Card Image</Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("panImage", e.target.files?.[0] || null)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        required
                      />
                      {files.panImage && (
                        <p className="mt-1 text-xs text-gray-500">{files.panImage.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="submit" disabled={uploading || loading}>
                    {uploading ? "Uploading..." : "Upload Documents"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <p className="text-gray-600 dark:text-gray-400">
                You cannot upload new documents while your KYC is {getKycStatusText(kycData?.status as any).toLowerCase()}.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
