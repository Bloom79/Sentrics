import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentDialog } from "@/components/billing/PaymentDialog";

export interface BillingStatement {
  id: string;
  member_id: string;
  period: string;
  total_amount: number;
  incentives: number;
  grid_fees: number;
  community_fund: number;
  status: string;
}

export interface MemberBalance {
  pod_id: string;
  member_type: string;
  total_energy_shared: number;
  balance: number;
  payment_status: string;
}

export const statementColumns = [
  {
    accessorKey: "member_id",
    header: "Member ID",
  },
  {
    accessorKey: "period",
    header: "Billing Period",
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => `€${row.original.total_amount.toFixed(2)}`,
  },
  {
    accessorKey: "incentives",
    header: "Incentives",
    cell: ({ row }) => `€${row.original.incentives.toFixed(2)}`,
  },
  {
    accessorKey: "grid_fees",
    header: "Grid Fees",
    cell: ({ row }) => `€${row.original.grid_fees.toFixed(2)}`,
  },
  {
    accessorKey: "community_fund",
    header: "Community Fund",
    cell: ({ row }) => `€${row.original.community_fund.toFixed(2)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "paid" ? "success" : "warning"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      row.original.status !== "paid" && (
        <PaymentDialog statement={row.original}>
          <Button size="sm">Pay Now</Button>
        </PaymentDialog>
      )
    ),
  },
];

export const memberBalanceColumns = [
  {
    accessorKey: "pod_id",
    header: "Member ID",
  },
  {
    accessorKey: "member_type",
    header: "Type",
  },
  {
    accessorKey: "total_energy_shared",
    header: "Total Energy Shared",
    cell: ({ row }) => `${row.original.total_energy_shared.toFixed(2)} kWh`,
  },
  {
    accessorKey: "balance",
    header: "Current Balance",
    cell: ({ row }) => `€${row.original.balance.toFixed(2)}`,
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => (
      <Badge variant={row.original.payment_status === "paid" ? "success" : "warning"}>
        {row.original.payment_status}
      </Badge>
    ),
  },
]; 