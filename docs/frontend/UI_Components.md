# UI Components Documentation

## Core Components

### 1. Map Components
- **CommunityBoundaryMap**
  - Purpose: Draw and edit community boundaries
  - Features:
    - Polygon drawing tools
    - Boundary validation
    - Distance calculation
    - Member location visualization
  - Dependencies:
    - Leaflet/MapboxGL
    - PostGIS integration

- **MemberLocationMap**
  - Purpose: Display and select member locations
  - Features:
    - Point selection
    - Distance visualization
    - Boundary validation
    - Clustering for multiple members

### 2. Community Management

- **CommunityForm**
  - Purpose: Create/Edit energy communities
  - Fields:
    - Name
    - Legal type
    - Primary substation
    - Total capacity
    - Boundary coordinates (map integration)
  - Validation:
    - Capacity limits
    - Required fields
    - Coordinate validation

- **CommunityList**
  - Purpose: Display and manage communities
  - Features:
    - Filtering
    - Sorting
    - Status indicators
    - Quick actions
  - Views:
    - Grid view
    - List view
    - Map view

### 3. Member Management

- **MemberForm**
  - Purpose: Add/Edit community members
  - Fields:
    - Member type (Producer/Consumer/Prosumer)
    - POD ID
    - Smart meter ID
    - Location (map integration)
    - Sharing preferences
  - Validation:
    - Location within boundary
    - Required fields
    - POD format

- **MemberList**
  - Purpose: Display and manage members
  - Features:
    - Type filtering
    - Status filtering
    - Location visualization
    - Activity indicators

### 4. Asset Management

- **AssetForm**
  - Purpose: Register/Edit energy assets
  - Fields:
    - Asset type
    - Capacity
    - Installation date
    - GSE registration
    - Technical details
  - Validation:
    - Capacity limits
    - Date validation
    - Required certifications

- **AssetList**
  - Purpose: Display and manage assets
  - Features:
    - Type filtering
    - Status tracking
    - Performance metrics
    - Maintenance status

### 5. Transaction Management

- **TransactionForm**
  - Purpose: Record energy transactions
  - Fields:
    - Producer selection
    - Consumer selection
    - Asset selection
    - Amount
    - Timestamp
  - Features:
    - Real-time validation
    - Rate calculation
    - Distance check

- **TransactionHistory**
  - Purpose: View and analyze transactions
  - Features:
    - Date range filtering
    - Member filtering
    - Export functionality
    - Analytics visualization

### 6. Compliance Management

- **ComplianceStatus**
  - Purpose: Track GSE compliance
  - Features:
    - Status dashboard
    - Document upload
    - Deadline tracking
    - Notification system

- **ComplianceHistory**
  - Purpose: View compliance records
  - Features:
    - Timeline view
    - Document archive
    - Status history
    - Action tracking

## Layout Components

### 1. Navigation

- **MainNavigation**
  - Primary navigation menu
  - Role-based access
  - Responsive design
  - Breadcrumb integration

- **DashboardLayout**
  - Sidebar
  - Header
  - Content area
  - Quick actions

### 2. Common Components

- **StatusBadge**
  - Color-coded status indicators
  - Tooltip information
  - Status transitions

- **DataTable**
  - Sorting
  - Filtering
  - Pagination
  - Export options

- **Charts**
  - Energy flow visualization
  - Transaction analytics
  - Member distribution
  - Performance metrics

## Implementation Priority

1. High Priority
   - CommunityBoundaryMap
   - CommunityForm
   - MemberForm
   - TransactionForm

2. Medium Priority
   - ComplianceStatus
   - AssetManagement
   - TransactionHistory
   - Analytics

3. Lower Priority
   - Advanced visualizations
   - Report generation
   - Integration features

## Technology Stack

- React 18+
- TypeScript
- Material-UI v5
- Leaflet/MapboxGL for maps
- React Query for API integration
- Redux Toolkit for state management
- Recharts for data visualization 