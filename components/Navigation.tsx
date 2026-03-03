import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Heart, Settings, Info, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../src/context/ContentContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useContent();

  // Hide navigation on player, category, and profile-edit pages
  if (location.pathname === '/player' || location.pathname.startsWith('/category/') || location.pathname === '/profile-edit') return null;

  const navItems = [
    { to: '/', icon: Home, label: 'کور پاڼه' },
    { to: '/favorites', icon: Heart, label: 'خوښ شوي' },
    ...(isAdmin ? [{ to: '/admin', icon: LayoutDashboard, label: 'اډمین' }] : []),
    { to: '/settings', icon: Settings, label: 'تنظیمات' },
    { to: '/about', icon: Info, label: 'زموږ په اړه' },
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 mb-safe">
      <div className="max-w-md mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/20 dark:border-zinc-800/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20_50px_rgba(0,0,0,0.3)] px-2 py-2">
        <div className="flex justify-around items-center h-14 relative">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            
            return (
              <NavLink
                key={to}
                to={to}
                className="relative flex flex-col items-center justify-center w-full h-full z-10"
              >
                {({ isActive: linkActive }) => (
                  <>
                    {linkActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-[var(--accent-color)]/10 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                    
                    <motion.div
                      animate={{ 
                        scale: linkActive ? 1.1 : 1,
                        y: linkActive ? -2 : 0
                      }}
                      className={`flex flex-col items-center space-y-1 ${
                        linkActive ? 'text-[var(--accent-color)]' : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      <Icon size={20} strokeWidth={linkActive ? 2.5 : 2} />
                      <span className={`text-[9px] font-bold tracking-wide transition-opacity ${linkActive ? 'opacity-100' : 'opacity-70'}`}>
                        {label}
                      </span>
                    </motion.div>

                    {linkActive && (
                      <motion.div
                        layoutId="nav-dot"
                        className="absolute -bottom-1 w-1 h-1 bg-[var(--accent-color)] rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
