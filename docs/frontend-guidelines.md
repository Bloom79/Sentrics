# Frontend Guidelines

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/              # Authentication components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ...
│   │   ├── Layout/           # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   └── ...
│   │   ├── dashboard/        # Dashboard components
│   │   │   ├── Overview.tsx
│   │   │   ├── RecentTransactions.tsx
│   │   │   └── ...
│   │   └── ui/              # Shadcn UI components
│   ├── lib/                 # Utilities and services
│   │   ├── api.ts          # API client
│   │   ├── auth.ts         # Authentication service
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Auth.tsx        # Login page
│   │   ├── cer/            # Energy community pages
│   │   │   ├── user/       # CER user pages
│   │   │   ├── configurations/ # CER configurations
│   │   │   └── ...
│   │   └── ...
│   ├── types/              # TypeScript types
│   └── config/             # Configuration files
│       └── navigation.tsx  # Navigation configuration
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## Component Guidelines

### Authentication
- Use `ProtectedRoute` component for protected pages
- Handle authentication state with `authService`
- Implement proper error handling for auth failures
- Use token-based authentication with refresh mechanism

### Layout
- Use `AppLayout` as the main layout wrapper
- Implement responsive design patterns
- Handle navigation state and sidebar
- Manage user context and permissions

### Forms
- Use `react-hook-form` for form management
- Implement Zod schemas for validation
- Handle loading and error states
- Use proper form feedback components

### Data Fetching
- Use proper error handling and loading states
- Implement data caching where appropriate
- Handle real-time updates when needed
- Use TypeScript types for API responses

## UI Components (Shadcn)

### Core Components
- Button
- Input
- Form
- Card
- Alert
- Toast

### Usage Example
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

// Component implementation
const MyForm = () => {
  return (
    <Form>
      <Input />
      <Button>Submit</Button>
    </Form>
  );
};
```

## Authentication Flow

### Login Process
1. User enters credentials
2. Validate input using Zod schema
3. Call authentication service
4. Handle success/error states
5. Redirect to protected route

### Protected Routes
- Wrap protected content with `ProtectedRoute`
- Check authentication state
- Handle loading states
- Redirect unauthorized users

## State Management

### Authentication State
- Use `authService` for auth state
- Store tokens securely
- Handle token refresh
- Manage user session

### Form State
- Use `react-hook-form` for forms
- Implement proper validation
- Handle form submission
- Manage form errors

## Navigation

### Structure
- Define routes in `routes.tsx`
- Configure navigation in `navigation.tsx`
- Handle route permissions
- Implement breadcrumbs

### Example
```tsx
// navigation.tsx
export const navigation = [
  {
    title: "Energy Communities",
    key: "energy-communities",
    items: [
      {
        title: "Dashboard",
        path: "/cer/user/dashboard",
        icon: LayoutDashboard,
      },
      // ...
    ],
  },
];
```

## Error Handling

### Form Errors
- Display validation errors
- Show API error messages
- Handle network errors
- Provide user feedback

### API Errors
- Handle HTTP errors
- Show toast notifications
- Implement retry logic
- Log errors appropriately

## Styling Guidelines

### Tailwind CSS
- Use utility classes
- Follow responsive design patterns
- Implement dark mode support
- Use consistent spacing

### Theme
- Use design tokens
- Maintain color consistency
- Follow accessibility guidelines
- Support dark/light modes

## Development Workflow

### Setup
1. Install dependencies
   ```bash
   npm install
   ```

2. Start development server
   ```bash
   npm run dev
   ```

### Environment Variables
```env
VITE_API_URL=http://localhost:8000
VITE_AUTH_TOKEN_KEY=auth_token
```

### Build
```bash
npm run build
```

## Testing

### Unit Tests
- Test components in isolation
- Test utility functions
- Test form validation
- Test error handling

### Integration Tests
- Test component interaction
- Test authentication flow
- Test navigation
- Test API integration

## Performance

### Optimization
- Implement code splitting
- Use lazy loading
- Optimize images
- Minimize bundle size

### Monitoring
- Track page load times
- Monitor API response times
- Track error rates
- Monitor user interactions

## Security

### Authentication
- Secure token storage
- Implement CSRF protection
- Handle session expiry
- Secure API calls

### Data Protection
- Sanitize user input
- Encrypt sensitive data
- Implement rate limiting
- Handle data validation

## Deployment

### Build Process
1. Run tests
2. Build application
3. Generate assets
4. Deploy to server

### Environment
- Configure environment variables
- Set up SSL certificates
- Configure CORS
- Set up monitoring 

## Navigation Structure

### Menu Organization
The application's navigation is organized into main sections with nested items:

1. Asset Management
   - Workspace
     - Dashboard
     - Sites
     - Grid Analysis
     - Financials
   - Admin
     - Users

2. Energy Communities
   - CER User
     - Dashboard
     - Workspace
   - CER Admin
     - CER Users
     - Members
     - Energy Configurations
     - Energy Sharing
     - GSE Compliance
     - Billing

3. Administration
   - Users
   - Billing & Payments
     - Overview
     - Tariffs
   - Settings

### Navigation Configuration
Navigation is defined in `src/config/navigation.tsx` using a typed structure:

```tsx
import { Navigation } from "@/types/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Building2,
  // ... other icons
} from "lucide-react";

export const navigation: Navigation = [
  {
    title: "Asset Management",
    key: "asset-management",
    items: [
      {
        title: "Workspace",
        key: "workspace",
        items: [
          {
            title: "Dashboard",
            path: "/",
            icon: Home,
            key: "dashboard",
          },
          // ... other workspace items
        ]
      },
      // ... other sections
    ],
  },
  // ... other main sections
];
```

### Route Configuration
Routes are defined in `src/routes.tsx` using React Router:

```tsx
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
    children: [
      // Asset Management routes
      {
        index: true,
        element: <Index />,
      },
      {
        path: "sites",
        children: [
          {
            index: true,
            element: <Sites />,
          },
          {
            path: ":siteId",
            element: <SiteDetail />,
          },
        ],
      },
      // Energy Communities routes
      {
        path: "cer",
        element: <CERModule />,
        children: [
          {
            path: "user",
            children: [
              {
                path: "dashboard",
                element: <CERUserDashboard />,
              },
              {
                path: "workspace",
                element: <CERUserWorkspace />,
              },
            ],
          },
          // ... other CER routes
        ],
      },
      // Administration routes
      {
        path: "admin/financials",
        children: [
          {
            path: "billing",
            element: <BillingOverview />,
          },
          {
            path: "tariffs",
            element: <TariffManagement />,
          },
        ],
      },
    ],
  },
]);
```

### Access Control
- Use `ProtectedRoute` component to secure routes
- Check user permissions for specific features
- Handle role-based access control
- Implement proper redirects for unauthorized access

### Navigation Components
1. `AppLayout`
   - Main layout wrapper
   - Handles sidebar navigation
   - Manages responsive behavior
   - Implements user context

2. `Sidebar`
   - Renders navigation menu
   - Handles collapsible sections
   - Shows active states
   - Manages mobile responsiveness

3. `Breadcrumbs`
   - Shows current location
   - Provides navigation history
   - Enables quick navigation
   - Updates dynamically

### Best Practices
1. Route Organization
   - Group related routes together
   - Use nested routes for related content
   - Implement lazy loading for route components
   - Handle route transitions smoothly

2. Permission Management
   - Check permissions before rendering navigation items
   - Hide unauthorized routes
   - Show appropriate feedback for unauthorized access
   - Handle permission changes dynamically

3. State Management
   - Track active route
   - Manage navigation history
   - Handle route parameters
   - Preserve navigation state

4. Mobile Responsiveness
   - Implement collapsible navigation
   - Show/hide based on screen size
   - Handle touch interactions
   - Optimize for mobile devices 