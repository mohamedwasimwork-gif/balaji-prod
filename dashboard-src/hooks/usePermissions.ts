import { useAuth } from '@dashboard/features/auth';

export function usePermissions() {
  const { user, loading } = useAuth();
  const isAdminOrSuper = user?.role === 'admin' || user?.role === 'superadmin';

  return {
    loading,
    canEdit: isAdminOrSuper,
    canDelete: isAdminOrSuper,
    canViewProfit: isAdminOrSuper,
    canViewLeads: isAdminOrSuper,
    canViewContent: isAdminOrSuper,
    canViewDownload: isAdminOrSuper,
    canViewShowcase: isAdminOrSuper,
    canViewWebsites: user?.role === 'superadmin',
  };
}
