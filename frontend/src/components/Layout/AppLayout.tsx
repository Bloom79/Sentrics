import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "@/components/Layout/Breadcrumb";
import { UserProfile } from "@/components/Layout/UserProfile";
import { Toaster } from "@/components/ui/toaster";
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
import Simulation from "@/pages/Simulation";
import AssetDetail from "@/pages/AssetDetail";
import { CryptoMiningSimulation } from "@/pages/CryptoMiningSimulation";
import CommunityList from "@/pages/cer/communities/list";
import NewCommunity from "@/pages/cer/communities/new";
import EditCommunity from '@/pages/cer/communities/edit';
import CommunityDetails from '@/pages/cer/communities/[id]';
import EnergySharing from "@/pages/cer/communities/[id]/share";
import TransactionsPage from "@/pages/cer/transactions";
import CommunityBilling from "@/pages/cer/billing";
import MembersPage from "@/pages/cer/members";
import ConfigurationManagement from "@/pages/cer/configurations";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <div className="flex justify-between items-center mb-6">
            <Breadcrumb />
            <UserProfile />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}