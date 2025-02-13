import { cn } from "@/lib/utils";
import { navigation } from "@/config/navigation";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { NavItem } from "@/types/navigation";

interface NavItemProps {
  item: NavItem;
  className?: string;
}

function NavItemComponent({ item, className }: NavItemProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.items && item.items.length > 0;

  // Auto-expand if current path matches any subitems
  useEffect(() => {
    if (hasSubItems) {
      const shouldExpand = item.items?.some(subItem => 
        location.pathname.startsWith(subItem.path || '')
      );
      setIsOpen(shouldExpand || false);
    }
  }, [location.pathname, hasSubItems, item.items]);

  if (hasSubItems) {
    const isActive = item.items.some(subItem => 
      location.pathname.startsWith(subItem.path || '')
    );

    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center w-full gap-x-2 px-2 py-2 text-sm font-medium rounded-md",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            isActive && "bg-gray-100 dark:bg-gray-800",
            className
          )}
        >
          {item.icon && <item.icon className="h-4 w-4" />}
          <span>{item.title}</span>
          <ChevronDown
            className={cn(
              "ml-auto h-4 w-4 transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-4 space-y-1">
            {item.items.map((subItem) => (
              <NavLink
                key={subItem.path}
                to={subItem.path || ''}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-x-2 px-2 py-2 text-sm font-medium rounded-md",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive && "bg-gray-100 dark:bg-gray-800"
                  )
                }
              >
                {subItem.icon && <subItem.icon className="h-4 w-4" />}
                <span>{subItem.title}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return item.path ? (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-x-2 px-2 py-2 text-sm font-medium rounded-md",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive && "bg-gray-100 dark:bg-gray-800",
          className
        )
      }
    >
      {item.icon && <item.icon className="h-4 w-4" />}
      <span>{item.title}</span>
    </NavLink>
  ) : null;
}

export function Sidebar() {
  return (
    <div className="flex flex-col gap-y-4 py-4">
      <div className="px-3 py-2">
        <h1 className="text-xl font-bold px-2 mb-4">SentriCS</h1>
      </div>
      {navigation.map((section) => (
        <div key={section.title} className="px-3 py-2">
          <h2 className="mb-2 px-2 text-sm font-semibold text-muted-foreground tracking-tight uppercase">
            {section.title}
          </h2>
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavItemComponent key={item.title} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 