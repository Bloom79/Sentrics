import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BillingStatement } from "@/pages/cer/billing/columns";

interface PaymentDialogProps {
  statement: BillingStatement;
  children: ReactNode;
}

export function PaymentDialog({ statement, children }: PaymentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Review and confirm your payment for the billing period {statement.period}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">Total Amount:</div>
            <div>€{statement.total_amount.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">Incentives:</div>
            <div>€{statement.incentives.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">Grid Fees:</div>
            <div>€{statement.grid_fees.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">Community Fund:</div>
            <div>€{statement.community_fund.toFixed(2)}</div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Confirm Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 