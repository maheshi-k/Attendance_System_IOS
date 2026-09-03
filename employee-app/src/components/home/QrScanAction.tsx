import scanQR from "../../assets/scanQR.svg";

type QrScanActionProps = {
  onScan: () => void;
};

function QrScanAction({ onScan }: QrScanActionProps) {
  return (
    <section className="flex flex-col items-center py-2 text-center">
      <button
        type="button"
        aria-label="Scan QR Code"
        onClick={onScan}
        className="relative flex h-24 w-24 items-center justify-center rounded-lg bg-[var(--button-muted)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
      >
        <span className="absolute inset-0 rounded-full border-2 border-[var(--border-soft)]" />

        <img src={scanQR} alt="" className="h-[34px] w-[34px] object-contain" />
      </button>

      <h2 className="mt-4 text-2xl font-semibold leading-8 text-[#3c6a00]">
        Scan QR Code
      </h2>

      <p className="mt-1 text-sm leading-5 text-[#625e58]">
        Scan the office entry point to check-in
      </p>
    </section>
  );
}

export default QrScanAction;
