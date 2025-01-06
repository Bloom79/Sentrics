import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { AppBreadcrumb } from "@/components/Layout/Breadcrumb";
import Index from "./pages/Index";
import GridAnalysis from "./pages/GridAnalysis";
import SiteDetail from "./pages/SiteDetail";
import StorageUnitDetail from "./pages/StorageUnitDetail";
import PlantDetail from "./pages/PlantDetail";
import Financials from "./pages/Financials";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-x-hidden bg-background">
                  <div className="container py-6">
                    <AppBreadcrumb />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/plants/:plantId" element={<PlantDetail />} />
                      <Route path="/plants/:plantId/financials" element={<Financials />} />
                      <Route path="/consumers" element={<div>Consumers Overview</div>} />
                      <Route path="/consumers/:consumerId" element={<div>Consumer Detail</div>} />
                      <Route path="/grid-analysis" element={<GridAnalysis />} />
                      <Route path="/analytics" element={<div>Analytics Dashboard</div>} />
                      <Route path="/maintenance" element={<div>Maintenance Overview</div>} />
                      <Route path="/settings" element={<div>Settings</div>} />
                      <Route path="/site/:siteId" element={<SiteDetail />} />
                      <Route path="/storage-unit/:unitId" element={<StorageUnitDetail />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;