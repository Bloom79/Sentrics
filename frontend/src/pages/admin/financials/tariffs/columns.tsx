import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export type Tariff = {
  id: number;
  region: string;
  base_rate: number;
  regional_bonus: number;
  capacity_bonus_small: number;
  capacity_bonus_medium: number;
  capacity_bonus_large: number;
  social_bonus: number;
  valid_from: string;
  valid_to: string | null;
};

export const columns: ColumnDef<Tariff>[] = [
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "base_rate",
    header: "Base Rate",
    cell: ({ row }) => {
      return <div>€{(row.getValue("base_rate") as number).toFixed(2)}/kWh</div>;
    },
  },
  {
    accessorKey: "regional_bonus",
    header: "Regional Bonus",
    cell: ({ row }) => {
      return <div>€{(row.getValue("regional_bonus") as number).toFixed(2)}/kWh</div>;
    },
  },
  {
    accessorKey: "capacity_bonus_small",
    header: "Small Capacity Bonus",
    cell: ({ row }) => {
      return <div>€{(row.getValue("capacity_bonus_small") as number).toFixed(2)}/kWh</div>;
    },
  },
  {
    accessorKey: "social_bonus",
    header: "Social Bonus",
    cell: ({ row }) => {
      return <div>€{(row.getValue("social_bonus") as number).toFixed(2)}/kWh</div>;
    },
  },
  {
    accessorKey: "valid_from",
    header: "Valid From",
    cell: ({ row }) => {
      const date = row.getValue("valid_from") as string;
      return format(new Date(date), "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "valid_to",
    header: "Valid To",
    cell: ({ row }) => {
      const validTo = row.getValue("valid_to") as string | null;
      return validTo ? format(new Date(validTo), "dd/MM/yyyy") : "Current";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button variant="outline" size="sm">
          Edit
        </Button>
      );
    },
  },
]; 