import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  const isCommentsPage = location.pathname.startsWith('/comments/');
  const isAdminSubPage = location.pathname.startsWith('/admin/') && location.pathname !== '/admin';

  return (
    <div className={`min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pt-safe overflow-x-hidden ${isCommentsPage || isAdminSubPage ? '' : 'pb-20'}`} dir="rtl">
      <main className="max-w-md mx-auto min-h-screen relative">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="p-4"
        >
          <Outlet />
        </motion.div>
      </main>
      {!isCommentsPage && !isAdminSubPage && <Navigation />}
    </div>
  );
};

export default Layout;
