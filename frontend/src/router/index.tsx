import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import Sites from '@/pages/Sites';
import SiteDetails from '@/pages/SiteDetails';
import Plants from '@/pages/Plants';
import PlantDetails from '@/pages/PlantDetails';
import Consumers from '@/pages/Consumers';
import ConsumerDetails from '@/pages/ConsumerDetails';
import { CryptoMiningSimulation } from '@/pages/CryptoMiningSimulation';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="sites">
          <Route index element={<Sites />} />
          <Route path=":siteId">
            <Route index element={<SiteDetails />} />
            <Route path="plants">
              <Route index element={<Plants />} />
              <Route path=":plantId" element={<PlantDetails />} />
            </Route>
            <Route path="consumers">
              <Route index element={<Consumers />} />
              <Route path=":consumerId" element={<ConsumerDetails />} />
            </Route>
          </Route>
        </Route>
        <Route path="simulation">
          <Route path="crypto-mining" element={<CryptoMiningSimulation />} />
        </Route>
      </Route>
    </Routes>
  );
} 