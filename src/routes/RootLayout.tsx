// src/routes/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import { ConsoleLayout } from '@/app/layouts/ConsoleLayout';

export const RootLayout = () => {
  return (
    <ConsoleLayout>
      <Outlet />
    </ConsoleLayout>
  );
};

export default RootLayout;