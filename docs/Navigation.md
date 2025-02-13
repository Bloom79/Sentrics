# Navigation Management Guide

## Overview

The navigation system in SentriCS is built with a hierarchical structure that supports nested items and dynamic routing. This document outlines how to manage and extend the navigation system.

## File Structure

The navigation system consists of these key files:

```
frontend/src/
├── types/
│   └── navigation.ts       # Type definitions for navigation
├── config/
│   └── navigation.tsx      # Navigation configuration
├── components/
│   └── Layout/
│       ├── AppLayout.tsx   # Main layout with routing
│       └── Sidebar.tsx     # Sidebar component
└── pages/                  # Page components
```

## Navigation Types

The navigation system uses TypeScript interfaces defined in `types/navigation.ts`:

```typescript
interface NavItem {
  title: string;          // Display name
  path?: string;          // URL path (optional if item has children)
  icon?: LucideIcon;      // Icon from lucide-react
  items?: NavItem[];      // Nested items (for dropdowns)
}

interface NavSection {
  title: string;          // Section title
  items: NavItem[];       // Section items
}

type Navigation = NavSection[];
```

## Navigation Structure

The navigation is organized in sections in `config/navigation.tsx`:

1. **Overview**
   - Dashboard
   - Users

2. **Asset Management**
   - Sites
   - Grid Analysis

3. **Energy Communities**
   - Communities
   - Energy Sharing
   - Community Billing

4. **Operations**
   - Grid Analysis
   - Financials

5. **Administration**
   - Billing & Payments
     - Overview
     - Tariffs
   - Settings

## Adding New Navigation Items

### 1. Update Navigation Configuration

In `src/config/navigation.tsx`:

```typescript
export const navigation: Navigation = [
  {
    title: "Your Section",
    items: [
      {
        title: "Your Item",
        path: "/your/path",
        icon: YourIcon,
      }
    ]
  }
];
```

### 2. Add Route Definition

In `src/components/Layout/AppLayout.tsx`:

```typescript
<Routes>
  {/* Your section */}
  <Route path="/your/path" element={<YourComponent />} />
</Routes>
```

### 3. Create Page Component

Create your page component in the appropriate directory under `src/pages/`.

## Navigation Rules

1. **Path Structure**
   - Use kebab-case for paths: `/your-section/your-page`
   - Group related features under common prefixes: `/cer/communities`
   - Use dynamic segments with descriptive names: `/cer/communities/:id/edit`

2. **Component Organization**
   - Place components in appropriate directories under `src/pages/`
   - Follow the path structure in component organization
   - Example: `/cer/billing` → `src/pages/cer/billing/index.tsx`

3. **Icon Usage**
   - Use icons from `lucide-react`
   - Maintain consistent icon style within sections
   - Choose icons that clearly represent the functionality

4. **Nested Navigation**
   - Use nested items for related functionality
   - Parent items with children should not have paths
   - Limit nesting to 2 levels for clarity

## Best Practices

1. **Section Organization**
   - Group related items under appropriate sections
   - Keep section titles clear and concise
   - Maintain logical grouping of functionality

2. **Route Management**
   - Define routes in `AppLayout.tsx`
   - Use route grouping for related features
   - Include proper route parameters where needed

3. **Component Naming**
   - Use PascalCase for component names
   - Add descriptive suffixes: `List`, `Detail`, `Edit`
   - Example: `CommunityBillingPage`

4. **Code Organization**
   - Keep navigation configuration separate from components
   - Use TypeScript types for type safety
   - Maintain consistent import ordering

## Common Patterns

1. **List/Detail Pattern**
```typescript
{
  title: "Communities",
  items: [
    { path: "/communities", title: "List" },
    { path: "/communities/new", title: "Create" }
  ]
}
```

2. **Feature Module Pattern**
```typescript
{
  title: "Energy Communities",
  items: [
    { path: "/cer/communities", title: "Communities" },
    { path: "/cer/transactions", title: "Energy Sharing" },
    { path: "/cer/billing", title: "Billing" }
  ]
}
```

3. **Administrative Pattern**
```typescript
{
  title: "Administration",
  items: [
    {
      title: "Billing & Payments",
      items: [
        { path: "/admin/billing", title: "Overview" },
        { path: "/admin/tariffs", title: "Tariffs" }
      ]
    }
  ]
}
```

## Troubleshooting

1. **Navigation Item Not Showing**
   - Verify the path in navigation configuration
   - Check route definition in AppLayout
   - Ensure component exists and is exported correctly

2. **Active State Not Working**
   - Check path matches exactly
   - Verify nested item configuration
   - Check parent/child path relationships

3. **Route Not Found**
   - Verify route is defined in AppLayout
   - Check path matches navigation configuration
   - Ensure component is properly imported

## Maintenance

1. **Regular Reviews**
   - Review navigation structure periodically
   - Remove unused routes and components
   - Update paths to reflect current functionality

2. **Documentation**
   - Keep this documentation updated
   - Document new patterns and conventions
   - Include examples for complex configurations 