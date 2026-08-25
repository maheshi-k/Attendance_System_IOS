import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export type ExportCellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export type ExportColumn<T> = {
  header: string;
  value: keyof T | ((item: T) => ExportCellValue);
  width?: number;
};

type ExportDataProps<T> = {
  data: T[] | (() => Promise<T[]>);
  columns: ExportColumn<T>[];
  fileName: string;
  sheetName?: string;
  label?: string;
};

function ExportData<T>({
  data,
  columns,
  fileName,
  sheetName = "Data",
  label = "Export",
}: ExportDataProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const exportData = typeof data === "function" ? await data() : data;
      const rows = exportData.map((item) =>
        Object.fromEntries(
          columns.map((column) => [
            column.header,
            typeof column.value === "function"
              ? column.value(item)
              : item[column.value],
          ]),
        ),
      );

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!cols"] = columns.map((column) => ({
        wch: column.width ?? 18,
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(
        workbook,
        `${fileName}-${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      toast.success(`${label} completed successfully`);
    } catch (error) {
      console.error(`Failed to ${label.toLowerCase()}:`, error);
      toast.error(`Failed to ${label.toLowerCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 rounded-xl border border-[rgba(194,201,181,0.3)] bg-[var(--text-primary-opc-10)] px-[21px] py-[11px] text-sm font-semibold text-[#424939] transition hover:bg-[#dcddde] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Download size={15} />
      {isExporting ? `${label}ing...` : label}
    </button>
  );
}

export default ExportData;
