import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/components/Providers/AppProviders";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { AppLayout } from "@/components/Layout/AppLayout";
import Auth from "./pages/Auth";

const App = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;