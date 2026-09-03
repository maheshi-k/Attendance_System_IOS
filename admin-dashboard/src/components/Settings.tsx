import { useRef, useState } from "react";
import { Download, QrCode, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import { generateQRCode } from "../services/qr.service";

interface QRData {
  qr_id: number;
  qr_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function Settings() {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const response = await generateQRCode();

      if (response.success && response.data) {
        setQrData(response.data);

        // Generate QR code image from token
        const qrToken = response.data.qr_token;
        const imageUrl = await QRCode.toDataURL(qrToken, {
          width: 300,
          margin: 10,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrImageUrl(imageUrl);
        toast.success("QR code generated successfully!");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!qrImageUrl || !qrData) {
      toast.error("No QR code to download");
      return;
    }

    try {
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = qrImageUrl;
      link.download = `qr-code-${qrData.qr_id}-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR code downloaded successfully!");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="bg-[var(--secondary)] p-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Settings
        </h1>
      </div>

      <div className="space-y-6 p-6">
        {/* QR Code Generation Section */}
        <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <QrCode className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                QR Code Management
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Generate and manage QR codes for attendance system
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Generate Button */}
            <div>
              <button
                onClick={handleGenerateQR}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="h-5 w-5" />
                    Generate New QR Code
                  </>
                )}
              </button>
            </div>

            {/* QR Code Display */}
            {qrImageUrl && qrData && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-[var(--border)] bg-gray-50 p-6">
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={qrImageUrl}
                      alt="Generated QR Code"
                      className="rounded-lg border-2 border-gray-300"
                    />
                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    {/* QR Details */}
                    <div className="w-full space-y-2 text-left">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[var(--text-secondary)]">
                          QR ID
                        </p>
                        <p className="font-mono text-sm text-[var(--text-primary)]">
                          {qrData.qr_id}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[var(--text-secondary)]">
                          Token
                        </p>
                        <p className="break-all font-mono text-xs text-[var(--text-primary)]">
                          {qrData.qr_token}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[var(--text-secondary)]">
                          Status
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              qrData.is_active ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <p className="text-sm text-[var(--text-primary)]">
                            {qrData.is_active ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[var(--text-secondary)]">
                          Created
                        </p>
                        <p className="text-sm text-[var(--text-primary)]">
                          {new Date(qrData.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={handleDownloadQR}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
                    >
                      <Download className="h-5 w-5" />
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!qrImageUrl && !loading && (
              <div className="rounded-lg border-2 border-dashed border-[var(--border)] p-8 text-center">
                <QrCode className="mx-auto mb-3 h-12 w-12 text-[var(--text-secondary)]" />
                <p className="text-[var(--text-secondary)]">
                  No QR code generated yet. Click the button above to create
                  one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
