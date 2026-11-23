import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />
        
        {/* Scrollable page view container optimized for 1280x720 */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
