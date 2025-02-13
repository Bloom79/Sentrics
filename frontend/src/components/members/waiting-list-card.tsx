import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface WaitingListCardProps {
  request: {
    id: number;
    user_name: string;
    user_email: string;
    configuration_name: string;
    request_date: string;
    notes?: string;
  };
}

export function WaitingListCard({ request }: WaitingListCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateRequestStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      await api.put(`/api/v1/participation-requests/${id}`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiting-list"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleApprove = async () => {
    try {
      await updateRequestStatus.mutateAsync({
        id: request.id,
        status: "approved",
        notes: "Request approved by administrator",
      });
      toast({
        title: "Success",
        description: "Request approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    try {
      await updateRequestStatus.mutateAsync({
        id: request.id,
        status: "rejected",
        notes: "Request rejected by administrator",
      });
      toast({
        title: "Success",
        description: "Request rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{request.user_name}</h3>
          <p className="text-sm text-muted-foreground">{request.user_email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={handleReject}
            disabled={updateRequestStatus.isPending}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600"
            onClick={handleApprove}
            disabled={updateRequestStatus.isPending}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm">
          Requested to join <span className="font-medium">{request.configuration_name}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(request.request_date), { addSuffix: true })}
        </p>
      </div>
      {request.notes && (
        <p className="mt-2 text-sm text-muted-foreground">{request.notes}</p>
      )}
    </Card>
  );
} 