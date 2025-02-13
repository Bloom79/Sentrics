import { api } from './api';
import { supabase } from './supabase';

export interface LoginCredentials {
  email: string;
  password: string;
  tenant_id?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  tenant_id?: number;
  organization_id?: number;
  organization_name?: string;
  role: string;
  permissions: Record<string, any>;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private tokenTypeKey = 'auth_token_type';
  private authStateKey = 'auth_state';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('Starting login process...', { email: credentials.email, tenant_id: credentials.tenant_id });
    try {
      // First, authenticate with our PostgreSQL backend
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      if (credentials.tenant_id) {
        formData.append('tenant_id', credentials.tenant_id.toString());
      }

      console.log('Sending login request to PostgreSQL backend...');
      const response = await api.post('/api/v1/login/access-token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      const data = response.data;
      console.log('Login successful, received token response', { token_type: data.token_type });

      // Store the PostgreSQL token and type
      this.setToken(data.access_token);
      this.setTokenType(data.token_type);
      this.setAuthState(true);

      // Fetch and store user data
      console.log('Fetching user data...');
      const user = await this.fetchAndStoreUser();
      console.log('User data fetched and stored', { user_id: user?.id, role: user?.role });

      // Now also authenticate with Supabase to keep legacy pages working
      console.log('Authenticating with Supabase...');
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email: 'am@sentrics.com',  // Use admin credentials for Supabase
        password: 'admin'         // Use admin credentials for Supabase
      });

      if (supabaseError) {
        console.error('Supabase auth error:', supabaseError);
      } else {
        console.log('Supabase authentication successful');
      }

      return data;
    } catch (error: any) {
      console.error('Login process failed:', {
        error: error.response?.data || error,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      // If PostgreSQL auth fails, also ensure Supabase is logged out
      await supabase.auth.signOut();
      
      // Clear any existing auth data
      this.clearAuth();
      
      throw new Error(error.response?.data?.detail || error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    console.log('Starting logout process...');
    try {
      // Clear PostgreSQL auth
      this.clearAuth();

      // Also logout from Supabase
      await supabase.auth.signOut();
      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if Supabase logout fails
      this.clearAuth();
    }
  }

  private clearAuth(): void {
    console.log('Clearing authentication data...');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenTypeKey);
    localStorage.removeItem(this.authStateKey);
  }

  async fetchAndStoreUser(): Promise<User | null> {
    console.log('Fetching user data from API...');
    try {
      const token = this.getToken();
      if (!token) {
        console.warn('No token available for user fetch');
        this.setAuthState(false);
        return null;
      }

      const tokenType = this.getTokenType();
      console.log('Making user fetch request...', { tokenType });

      const response = await api.get('/api/v1/app-users/me', {
        headers: {
          Authorization: `${tokenType} ${token}`
        }
      });
      
      const user = response.data;
      console.log('User data received', { 
        user_id: user.id, 
        role: user.role,
        has_permissions: !!user.permissions
      });
      
      this.setUser(user);
      this.setAuthState(true);
      return user;
    } catch (error) {
      console.error('Error fetching user:', {
        error,
        token_exists: !!this.getToken(),
        stored_user: this.getUser()
      });
      this.clearAuth();
      return null;
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Getting token from storage', { exists: !!token });
    return token;
  }

  setToken(token: string): void {
    console.log('Setting token in storage');
    localStorage.setItem(this.tokenKey, token);
  }

  getTokenType(): string {
    const type = localStorage.getItem(this.tokenTypeKey) || 'Bearer';
    console.log('Getting token type from storage', { type });
    return type;
  }

  setTokenType(type: string): void {
    console.log('Setting token type in storage', { type });
    localStorage.setItem(this.tokenTypeKey, type);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('Getting user from storage', { exists: !!user, role: user?.role });
    return user;
  }

  setUser(user: User): void {
    console.log('Setting user in storage', { user_id: user.id, role: user.role });
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private setAuthState(isAuthenticated: boolean): void {
    console.log('Setting auth state', { isAuthenticated });
    localStorage.setItem(this.authStateKey, String(isAuthenticated));
  }

  private getAuthState(): boolean {
    return localStorage.getItem(this.authStateKey) === 'true';
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    const authState = this.getAuthState();
    const isAuth = !!(token && user && authState);
    console.log('Checking authentication status', { 
      has_token: !!token, 
      has_user: !!user,
      auth_state: authState,
      is_authenticated: isAuth 
    });
    return isAuth;
  }

  hasPermission(permission: string): boolean {
    const user = this.getUser();
    if (!user) {
      console.log('Permission check failed - no user', { permission });
      return false;
    }
    if (user.role === 'superuser') {
      console.log('Permission granted - superuser', { permission });
      return true;
    }
    const hasPermission = user.permissions?.permissions?.includes(permission) || false;
    console.log('Checking permission', { permission, has_permission: hasPermission });
    return hasPermission;
  }

  async checkAuthSync(): Promise<boolean> {
    console.log('Checking auth sync...');
    const pgToken = this.getToken();
    const { data: { session } } = await supabase.auth.getSession();
    const isSync = !!(pgToken && session);
    console.log('Auth sync status', { 
      has_pg_token: !!pgToken, 
      has_supabase_session: !!session,
      is_synced: isSync 
    });
    return isSync;
  }

  async syncAuth(): Promise<void> {
    console.log('Starting auth sync...');
    try {
      const user = this.getUser();
      const { data: { session } } = await supabase.auth.getSession();

      console.log('Current auth state', {
        has_user: !!user,
        has_supabase_session: !!session
      });

      // Only attempt Supabase sync if we have PostgreSQL auth but no Supabase session
      if (user && !session) {
        console.log('Attempting to sync Supabase auth...');
        const { error } = await supabase.auth.signInWithPassword({
          email: 'admin@sentrics.com',  // Use admin credentials for Supabase
          password: 'Admin123!'         // Use admin credentials for Supabase
        });

        if (error) {
          // Don't throw error, just log it - we'll continue with PostgreSQL auth
          console.error('Failed to sync Supabase auth:', error);
          return;
        }

        console.log('Supabase auth sync successful');
      }
    } catch (error) {
      // Don't throw error, just log it - we'll continue with PostgreSQL auth
      console.error('Error during auth sync:', error);
    }
  }
}

export const authService = new AuthService(); 