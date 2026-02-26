import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pb-20 pt-safe overflow-x-hidden" dir="rtl">
      <main className="max-w-md mx-auto min-h-screen relative">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-4"
        >
          <Outlet />
        </motion.div>
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;
