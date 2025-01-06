import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GridAnalysis from "./pages/GridAnalysis";
import SiteDetail from "./pages/SiteDetail";
import PlantDetail from "./pages/PlantDetail";
import StorageUnitDetail from "./pages/StorageUnitDetail";
import Financials from "./pages/Financials";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/grid-analysis" element={<GridAnalysis />} />
        <Route path="/sites/:siteId" element={<SiteDetail />} />
        <Route path="/plants/:plantId" element={<PlantDetail />} />
        <Route path="/storage/:unitId" element={<StorageUnitDetail />} />
        <Route path="/financials" element={<Financials />} />
      </Routes>
    </Router>
  );
}

export default App;
