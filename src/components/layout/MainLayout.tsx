import { Outlet } from 'react-router-dom';

import BackgroundSlider from '@/components/layout/BackgroundSlider';
import Overlay from '@/components/layout/Overlay';

import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="relative min-h-screen bg-background-first">
      <BackgroundSlider />
      <Overlay />
      <div className="absolute inset-0 z-20 flex">
        <div className="w-1/5 ml-6 my-4">
          <Sidebar />
        </div>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
