import React from "react";
import { Handle, Position } from "@xyflow/react";

interface StyledFlowNodeProps {
  children: React.ReactNode;
  type?: "source" | "target" | "both";
  className?: string;
}

const StyledFlowNode: React.FC<StyledFlowNodeProps> = ({ children, type = "both", className = "" }) => {
  return (
    <div className={`p-4 rounded-lg border bg-white shadow-lg transition-shadow ${className}`}>
      {(type === "target" || type === "both") && (
        <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-full border-2" />
      )}
      {children}
      {(type === "source" || type === "both") && (
        <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-full border-2" />
      )}
    </div>
  );
};

export default StyledFlowNode;