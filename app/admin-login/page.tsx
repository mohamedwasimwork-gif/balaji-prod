'use client';

import dynamic from 'next/dynamic';

const DashboardSPA = dynamic(() => import('../../dashboard-src/AppEntry'), {
  ssr: false,
});

export default function AdminLoginPage() {
  return <DashboardSPA />;
}
