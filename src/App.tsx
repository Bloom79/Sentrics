import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { AppBreadcrumb } from "@/components/Layout/Breadcrumb";
import { UserProfile } from "@/components/Layout/UserProfile";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import GridAnalysis from "./pages/GridAnalysis";
import SiteDetail from "./pages/SiteDetail";
import StorageUnitDetail from "./pages/StorageUnitDetail";
import PlantDetail from "./pages/PlantDetail";
import Financials from "./pages/Financials";
import Consumers from "./pages/Consumers";
import Auth from "./pages/Auth";
import UserManagement from "./pages/UserManagement";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return null; // Loading state
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={
                  <ProtectedRoute>
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
                              <Route path="/plants/:plantId" element={<PlantDetail />} />
                              <Route path="/plants/:plantId/financials" element={<Financials />} />
                              <Route path="/consumers" element={<Consumers />} />
                              <Route path="/consumers/:consumerId" element={<div>Consumer Detail</div>} />
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
                  </ProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
