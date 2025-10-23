import BaseDataTable from "@/components/custom/base-data-table";
import { LicenseColumn } from "@/components/session/license-column";

interface LicenseKeysTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export default function LicenseKeysTable({ data }: LicenseKeysTableProps) {
  return (
    <BaseDataTable
      data={data}
      columns={LicenseColumn}
    />
  );
}
