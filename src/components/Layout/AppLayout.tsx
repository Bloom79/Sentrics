import React from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { AppBreadcrumb } from "@/components/Layout/Breadcrumb";
import { UserProfile } from "@/components/Layout/UserProfile";
import Index from "@/pages/Index";
import Sites from "@/pages/Sites";
import GridAnalysis from "@/pages/GridAnalysis";
import SiteDetail from "@/pages/SiteDetail";
import StorageUnitDetail from "@/pages/StorageUnitDetail";
import PlantDetail from "@/pages/PlantDetail";
import Financials from "@/pages/Financials";
import Consumers from "@/pages/Consumers";
import UserManagement from "@/pages/UserManagement";
import ConsumerDetail from "@/components/Consumers/ConsumerDetail";

export const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden bg-background">
          <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
              <AppBreadcrumb />
              <UserProfile />
            </div>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sites" element={<Sites />} />
              <Route path="/plants/:plantId" element={<PlantDetail />} />
              <Route path="/plants/:plantId/financials" element={<Financials />} />
              <Route path="/consumers" element={<Consumers />} />
              <Route path="/consumers/:consumerId" element={<ConsumerDetail />} />
              <Route path="/grid-analysis" element={<GridAnalysis />} />
              <Route path="/analytics" element={<div>Analytics Dashboard</div>} />
              <Route path="/maintenance" element={<div>Maintenance Overview</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
              <Route path="/site/:siteId" element={<SiteDetail />} />
              <Route path="/storage-unit/:unitId" element={<StorageUnitDetail />} />
              <Route path="/users" element={<UserManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};