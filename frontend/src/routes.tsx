import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from "@/components/Layout/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

// Pages
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Sites from "@/pages/Sites";
import SiteDetail from "@/pages/SiteDetail";
import UserManagement from "@/pages/UserManagement";
import GridAnalysis from "@/pages/GridAnalysis";
import PlantDetail from "@/pages/PlantDetail";
import Financials from "@/pages/Financials";

// Energy Communities
import CERModule from "@/pages/cer";
import ConfigurationList from "@/pages/cer/configurations/list";
import NewConfiguration from "@/pages/cer/configurations/new";
import CERConfigurationsPage from "@/pages/cer/configurations/[cerId]";
import CERDetails from "@/pages/cer/configurations/[cerId]";
import UsersList from "@/pages/cer/users/list";
import UserForm from "@/pages/cer/users/form";
import MembersList from "@/pages/cer/members";
import MemberForm from "@/pages/cer/members/form";
import CERUserWorkspace from "@/pages/cer/user/workspace";
import CERUserDashboard from "@/pages/cer/user/dashboard";

// Administration
import BillingOverview from "@/pages/admin/financials/billing";
import TariffManagement from "@/pages/admin/financials/tariffs";

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
      {
        path: "grid-analysis",
        element: <GridAnalysis />,
      },
      {
        path: "plants/:plantId",
        element: <PlantDetail />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "financials",
        element: <Financials />,
      },
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
          {
            path: "configurations",
            children: [
              {
                index: true,
                element: <ConfigurationList />,
              },
              {
                path: "new",
                element: <NewConfiguration />,
              },
              {
                path: ":configurationId/edit",
                element: <NewConfiguration />,
              },
              {
                path: ":configurationId",
                element: <CERConfigurationsPage />,
              },
              {
                path: ":configurationId/details",
                element: <CERDetails />,
              },
            ],
          },
          {
            path: "users",
            children: [
              {
                index: true,
                element: <UsersList />,
              },
              {
                path: "new",
                element: <UserForm />,
              },
              {
                path: ":userId/edit",
                element: <UserForm />,
              },
            ],
          },
          {
            path: "members",
            children: [
              {
                index: true,
                element: <MembersList />,
              },
              {
                path: "new",
                element: <MemberForm />,
              },
              {
                path: ":memberId",
                element: <MemberForm />,
              },
            ],
          },
        ],
      },
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