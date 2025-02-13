import React, { forwardRef } from "react";
import { Handle, Position } from "@xyflow/react";

interface StyledFlowNodeProps {
  children: React.ReactNode;
  type?: "source" | "target" | "both";
  className?: string;
  onClick?: () => void;
}

const StyledFlowNode = forwardRef<HTMLDivElement, StyledFlowNodeProps>(({ 
  children, 
  type = "both", 
  className = "", 
  onClick 
}, ref) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      ref={ref}
      className={`p-4 rounded-lg border bg-white shadow-lg ${className}`}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(type === "target" || type === "both") && (
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 rounded-full border-2"
          title="Input Connection"
        />
      )}
      {children}
      {(type === "source" || type === "both") && (
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 rounded-full border-2"
          title="Output Connection"
        />
      )}
    </div>
  );
});

StyledFlowNode.displayName = "StyledFlowNode";

export default StyledFlowNode;