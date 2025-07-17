// import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Overlay from '@/components/common/Overlay';
import BackgroundSlider from '@/components/layout/BackgroundSlider';
import { ROUTE_TITLES } from '@/constants/route-titles/route-titles';

import Header from './Header';
import Sidebar from './Sidebar';
import SidebarMobile from './SidebarMobile';

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const handleOpenMenu = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const currentTitle = ROUTE_TITLES[location.pathname] || 'dashboard';

  return (
    <div className="bg-background-first relative min-h-screen">
      <BackgroundSlider />
      <Overlay className="opacity-60" />
      <div className="absolute inset-0 z-20 mx-6 my-4 flex">
        <div className={`desktop:block mr-6 hidden w-1/4`}>
          <Sidebar />
        </div>
        <div
          className={`desktop:hidden fixed top-4 bottom-4 left-6 z-30 w-[274px] transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarMobile
            onMobileSidebarOpen={isMobileSidebarOpen}
            onOpenMenu={handleOpenMenu}
          />
        </div>
        {/* Backdrop overlay khi sidebar mở */}
        {isMobileSidebarOpen && (
          <div
            className="desktop:hidden bg-backdrop/40 fixed inset-0 transition-opacity duration-300"
            onClick={handleOpenMenu}
          />
        )}
        <div className="flex w-full flex-col">
          <Header
            onOpenMenuClick={handleOpenMenu}
            onMobileSidebarOpen={isMobileSidebarOpen}
            title={currentTitle}
          />
          <div className="bg-background-second h-full w-full rounded-2xl p-6 shadow-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
