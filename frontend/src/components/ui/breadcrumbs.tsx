import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" aria-hidden="true" />
            )}
            <Link
              to={item.href}
              className={cn(
                "flex items-center text-sm font-medium",
                item.current
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.icon && (
                <item.icon className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
} 