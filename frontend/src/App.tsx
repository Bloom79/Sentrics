import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/components/Providers/AppProviders";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Sites from "@/pages/Sites";
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
import MembersList from "@/pages/cer/members/list";
import MemberForm from "@/pages/cer/members/form";

// Administration
import BillingOverview from "@/pages/admin/financials/billing";
import TariffManagement from "@/pages/admin/financials/tariffs";

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Overview */}
            <Route path="/" element={<Index />} />
            <Route path="/users" element={<UserManagement />} />

            {/* Asset Management */}
            <Route path="/sites" element={<Sites />} />
            <Route path="/plants/:plantId" element={<PlantDetail />} />

            {/* Energy Communities */}
            <Route path="/cer" element={<CERModule />}>
              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path="new" element={<UserForm />} />
                <Route path=":userId/edit" element={<UserForm />} />
              </Route>
              <Route path="configurations">
                <Route index element={<ConfigurationList />} />
                <Route path="new" element={<NewConfiguration />} />
                <Route path=":cerId" element={<CERConfigurationsPage />} />
                <Route path="members">
                  <Route index element={<MembersList />} />
                  <Route path="new" element={<MemberForm />} />
                  <Route path=":memberId/edit" element={<MemberForm />} />
                </Route>
              </Route>
            </Route>

            {/* CER Routes */}
            <Route path="/cer/configurations" element={<ConfigurationList />} />
            <Route path="/cer/configurations/new" element={<NewConfiguration />} />
            <Route path="/cer/configurations/:configurationId/edit" element={<NewConfiguration />} />
            <Route path="/cer/configurations/:cerId" element={<CERDetails />} />

            {/* Operations */}
            <Route path="/grid-analysis" element={<GridAnalysis />} />
            <Route path="/financials" element={<Financials />} />

            {/* Administration */}
            <Route path="/admin/financials/billing" element={<BillingOverview />} />
            <Route path="/admin/financials/tariffs" element={<TariffManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AppProviders>
  );
}