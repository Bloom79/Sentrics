import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddAssetDialog } from "@/components/cer/members/AddAssetDialog";

export const memberColumns = [
  {
    accessorKey: "pod_id",
    header: "POD ID",
  },
  {
    accessorKey: "smart_meter_id",
    header: "Smart Meter ID",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "success" : "warning"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "assets",
    header: "Assets",
    cell: ({ row }) => (
      <div className="space-y-2">
        {row.original.assets.map((asset) => (
          <Badge key={asset.id} variant="outline" className="mr-2">
            {asset.asset_type} ({asset.capacity}kW)
          </Badge>
        ))}
        {row.original.member_type !== "CONSUMER" && (
          <AddAssetDialog member={row.original}>
            <Button size="sm" variant="outline">Add Asset</Button>
          </AddAssetDialog>
        )}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
]; 