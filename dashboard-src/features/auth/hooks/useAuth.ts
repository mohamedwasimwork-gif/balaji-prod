import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '@dashboard/services';
import { User } from '@dashboard/types';
import { ROUTES } from '@dashboard/constants';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setState({ user: parsedUser, loading: false });
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setState({ user: null, loading: false });
      }
    } else {
      setState({ user: null, loading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const { user: authUser, token } = response;

    if (!authUser.isActive || !['admin', 'superadmin', 'employee'].includes(authUser.role)) {
      throw new Error('Account is not authorized for access.');
    }

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(authUser));
    setState({ user: authUser, loading: false });

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.DASHBOARD;
    // Force reload so all hook consumers re-hydrate from localStorage consistently.
    window.location.href = `/admin-login#${from}`;

    return response;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setState({ user: null, loading: false });
    window.location.href = `/admin-login#${ROUTES.LOGIN}`;
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await authService.updateProfile(data);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setState((prev) => ({ ...prev, user: updatedUser }));
    return updatedUser;
  };

  return {
    user: state.user,
    loading: state.loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin',
    isSuperAdmin: state.user?.role === 'superadmin',
    isEmployee: state.user?.role === 'employee',
  };
}
