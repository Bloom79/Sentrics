import React from "react";
import { Handle, Position } from "@xyflow/react";

interface StyledFlowNodeProps {
  children: React.ReactNode;
  type?: "source" | "target" | "both";
  className?: string;
  onClick?: () => void;
}

const StyledFlowNode: React.FC<StyledFlowNodeProps> = ({ children, type = "both", className = "", onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger onClick if the click wasn't on a Handle
    if (!(e.target as HTMLElement).closest('.react-flow__handle')) {
      onClick?.();
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border bg-white shadow-lg transition-shadow cursor-pointer ${className}`}
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
};

export default StyledFlowNode;