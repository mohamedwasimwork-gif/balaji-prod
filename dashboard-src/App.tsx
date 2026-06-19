import { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@dashboard/components/layout';
import { ProtectedRoute, useAuth } from '@dashboard/features/auth';
import { ROUTES } from '@dashboard/constants';
import { LoginPage } from '@dashboard/pages/auth/LoginPage';
import { DashboardPage } from '@dashboard/pages/dashboard/DashboardPage';
import { LeadsPage } from '@dashboard/pages/leads/LeadsPage';
import { ProjectsListPage } from '@dashboard/pages/projects/ProjectsListPage';
import { ProjectFormPage } from '@dashboard/pages/projects/ProjectFormPage';
import { ProjectDetailPage } from '@dashboard/pages/projects/ProjectDetailPage';
import { WebsitesPage } from '@dashboard/pages/websites/WebsitesPage';
import { ExpensesPage } from '@dashboard/pages/expenses/ExpensesPage';
import { InvoicesPage } from '@dashboard/pages/invoices/InvoicesPage';
import { DownloadPage } from '@dashboard/pages/download/DownloadPage';
import { PageSpinner } from '@dashboard/components/ui';

function RoleGuard({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || !roles.includes(user.role)) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return <>{children}</>;
}

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageSpinner />;

  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={!isAuthenticated ? <LoginPage /> : <Navigate to={ROUTES.DASHBOARD} replace />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="leads" element={<RoleGuard roles={['admin', 'superadmin']}><LeadsPage /></RoleGuard>} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="projects/new" element={<ProjectFormPage />} />
        <Route path="projects/:id/edit" element={<RoleGuard roles={['admin', 'superadmin']}><ProjectFormPage /></RoleGuard>} />
        <Route path="websites" element={<RoleGuard roles={['superadmin']}><WebsitesPage /></RoleGuard>} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="download" element={<RoleGuard roles={['admin', 'superadmin']}><DownloadPage /></RoleGuard>} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}

export default App;
