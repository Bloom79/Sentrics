import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Starting auth check...', {
        pathname: location.pathname,
        current_auth: isAuthenticated
      });

      try {
        // Check PostgreSQL auth
        const token = authService.getToken();
        console.log('ProtectedRoute: Token check', { has_token: !!token });
        
        if (!token) {
          console.log('ProtectedRoute: No token found, redirecting to login');
          setIsAuthenticated(false);
          return;
        }

        // Verify token by fetching user data
        console.log('ProtectedRoute: Fetching user data to verify token');
        const user = await authService.fetchAndStoreUser();
        
        if (!user) {
          console.log('ProtectedRoute: User fetch failed, redirecting to login');
          setIsAuthenticated(false);
          return;
        }

        console.log('ProtectedRoute: User data verified', {
          user_id: user.id,
          role: user.role
        });

        // Check Supabase auth
        console.log('ProtectedRoute: Checking Supabase session');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('ProtectedRoute: Supabase session status', { has_session: !!session });
        
        // If we have PostgreSQL auth but no Supabase session, try to sync
        // but don't block access if it fails
        if (!session) {
          console.log('ProtectedRoute: No Supabase session, attempting sync');
          await authService.syncAuth();
        }

        // Set authenticated since we have PostgreSQL auth
        console.log('ProtectedRoute: Authentication successful');
        setIsAuthenticated(true);

        // Subscribe to Supabase auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('ProtectedRoute: Supabase auth state changed', { event, has_session: !!session });
          
          // Don't log out if Supabase session ends - only care about PostgreSQL auth
          if (!session && isAuthenticated) {
            console.log('ProtectedRoute: Supabase session ended, but keeping PostgreSQL auth');
          }
        });

        return () => {
          console.log('ProtectedRoute: Cleaning up Supabase subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('ProtectedRoute: Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, location.pathname]);

  // Loading state
  if (isAuthenticated === null) {
    console.log('ProtectedRoute: In loading state');
    return null;
  }

  // Not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login', {
      from: location.pathname
    });
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Authenticated
  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};