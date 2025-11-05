import { MeterEvent } from "@/app/session/subscriptions/[id]/[event_id]/type";
import { ColumnDef } from "@tanstack/react-table";

export const EventsColumn: ColumnDef<MeterEvent>[] = [
  {
    accessorKey: "event_name",
    header: "Event Name",
    cell: ({ row }) => {
      const eventName = row.original.event_name;
      return (
        <div className="text-left text-text-secondary">{eventName || "-"}</div>
      );
    },
  },
  {
    accessorKey: "event_id",
    header: "Event ID",
    cell: ({ row }) => {
      const eventId = row.original.event_id;
      return (
        <div className="text-left text-text-secondary">{eventId || "-"}</div>
      );
    },
  },
  {
    accessorKey: "consumed_units",
    header: "Consumed Units",
    cell: ({ row }) => {
      const consumedUnits = row.original.consumed_units;
      return (
        <div className="text-left text-text-secondary">
          {consumedUnits || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      return <div className="text-left text-text-secondary">{timestamp}</div>;
    },
  },
];
