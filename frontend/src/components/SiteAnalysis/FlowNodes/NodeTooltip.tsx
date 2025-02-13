import React, { forwardRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NodeTooltipProps {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
}

const NodeTooltip = forwardRef<HTMLDivElement, NodeTooltipProps>(
  ({ children, tooltipContent }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div ref={ref}>{children}</div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] space-y-2 p-4">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

NodeTooltip.displayName = "NodeTooltip";

export default NodeTooltip;