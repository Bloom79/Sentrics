# Navigation and Routing Guide

## Overview

The application's navigation system is built using:
1. Route definitions (`src/routes.tsx`)
2. Layout components (`src/components/Layout/AppLayout.tsx`)
3. Error Boundary (`src/components/ErrorBoundary.tsx`)
4. Protected Routes (`src/components/Auth/ProtectedRoute.tsx`)
5. Internationalization files (`src/i18n/locales/*.json`)

## Application Structure

The application is organized into the following main sections:

```
├── Authentication
│   └── /auth
├── Dashboard
│   └── / (index)
├── Sites Management
│   ├── /sites
│   └── /sites/:siteId
├── Grid Management
│   ├── /grid-analysis
│   └── /plants/:plantId
├── User Management
│   └── /users
├── Financials
│   └── /financials
├── Energy Communities (CER)
│   ├── /cer
│   ├── Configurations
│   │   ├── /cer/configurations
│   │   ├── /cer/configurations/new
│   │   ├── /cer/configurations/:configurationId
│   │   └── /cer/configurations/:configurationId/details
│   ├── Users
│   │   ├── /cer/users
│   │   ├── /cer/users/new
│   │   └── /cer/users/:userId
│   └── Members
│       ├── /cer/members
│       ├── /cer/members/new
│       └── /cer/members/:memberId
└── Administration
    └── Financials
        ├── /admin/financials/billing
        └── /admin/financials/tariffs
```

## Route Configuration

The application uses React Router v6 with a centralized routing configuration in `src/routes.tsx`. The routing structure follows this pattern:

```typescript
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // Child routes here
    ]
  }
]);
```

### Route Types

1. **Public Routes**: 
   - Authentication (`/auth`)
   - No protection required

2. **Protected Routes**:
   - All routes under the root path (`/`)
   - Require authentication
   - Wrapped in `ProtectedRoute` component

3. **Layout Routes**:
   - Use `AppLayout` component
   - Include sidebar navigation
   - Show error boundary for errors

4. **Feature Routes**:
   - Specific feature areas (Sites, CER, etc.)
   - Can have nested routes
   - May include dynamic parameters

### Error Handling

The application uses a custom `ErrorBoundary` component that:
1. Captures route errors
2. Logs errors to console
3. Shows user-friendly error messages
4. Handles different error types

```typescript
export function ErrorBoundary() {
  const error = useRouteError();
  // Error handling logic
}
```

## Adding New Routes

1. **Create Component**:
```typescript
// src/pages/new-feature/index.tsx
export default function NewFeature() {
  return <div>New Feature Content</div>;
}
```

2. **Add Route Definition**:
```typescript
// src/routes.tsx
import NewFeature from '@/pages/new-feature';

export const router = createBrowserRouter([
  // ... existing routes
  {
    path: "new-feature",
    element: <NewFeature />,
  }
]);
```

3. **Add to Navigation**:
Update the sidebar navigation to include the new route.

## Protected Routes

Protected routes are implemented using the `ProtectedRoute` component:

```typescript
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Authentication logic
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};
```

## Best Practices

1. **Route Organization**:
   - Group related routes together
   - Use consistent naming patterns
   - Keep routes shallow when possible
   - Use dynamic parameters for variable content

2. **Authentication**:
   - Protect sensitive routes
   - Handle authentication state
   - Redirect unauthorized access
   - Preserve intended destination

3. **Error Handling**:
   - Use error boundaries
   - Show user-friendly messages
   - Log errors appropriately
   - Handle different error types

4. **Performance**:
   - Implement lazy loading
   - Split code by route
   - Cache route data
   - Monitor navigation performance

5. **Maintenance**:
   - Document route changes
   - Update navigation when adding routes
   - Test route protection
   - Keep error handling current

## Common Tasks

### Adding a Protected Route
```typescript
{
  path: "protected-feature",
  element: (
    <ProtectedRoute>
      <ProtectedFeature />
    </ProtectedRoute>
  )
}
```

### Adding Nested Routes
```typescript
{
  path: "parent",
  element: <ParentLayout />,
  children: [
    {
      path: "child",
      element: <ChildComponent />
    }
  ]
}
```

### Adding Dynamic Routes
```typescript
{
  path: "items/:itemId",
  element: <ItemDetail />
}
```

### Error Boundary Usage
```typescript
{
  path: "feature",
  element: <Feature />,
  errorElement: <ErrorBoundary />
}
```

## Troubleshooting

1. **Route Not Found**:
   - Check route definition in `routes.tsx`
   - Verify path in navigation item
   - Check for typos in URLs
   - Ensure component is exported correctly

2. **Menu Item Not Showing**:
   - Verify item is added to correct section
   - Check icon import
   - Ensure path matches route definition
   - Verify translations are present

3. **Nested Routes Not Working**:
   - Verify parent route has `children` array
   - Check `Outlet` component in parent layout
   - Ensure paths are properly nested

4. **Translation Issues**:
   - Check key exists in all locale files
   - Verify translation key format
   - Check for missing placeholders

## Testing Navigation Changes

1. **Unit Tests**:
   - Test route components
   - Verify navigation guards
   - Check permission logic

2. **Integration Tests**:
   - Test navigation flows
   - Verify breadcrumb updates
   - Check state persistence

3. **E2E Tests**:
   - Test complete user journeys
   - Verify deep linking
   - Check browser history

## Documentation

When adding or modifying navigation:

1. Update this guide if adding new patterns
2. Document any special cases or requirements
3. Include examples of common use cases
4. Keep the menu structure diagram updated
5. Document any required permissions 