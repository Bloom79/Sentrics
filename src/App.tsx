import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import PlantDetail from "./pages/PlantDetail";
import PlantFinancials from "./pages/PlantFinancials";
import SiteDetail from "./pages/SiteDetail";
import GridAnalysis from "./pages/GridAnalysis";
import StorageUnitDetail from "./pages/StorageUnitDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen flex">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/plants/:plantId" element={<PlantDetail />} />
                <Route path="/plants/:plantId/financials" element={<PlantFinancials />} />
                <Route path="/sites/:siteId" element={<SiteDetail />} />
                <Route path="/grid-analysis" element={<GridAnalysis />} />
                <Route path="/storage/:unitId" element={<StorageUnitDetail />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;