import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { ArrowRight, Search, Users, ShieldCheck, Star, BadgeCheck, PenTool } from 'lucide-react';
import { motion } from 'motion/react';

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { users, isAdmin } = useContent();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAdmin) return null;

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'owner': return <ShieldCheck size={16} className="text-purple-500" />;
      case 'super_admin': return <ShieldCheck size={16} className="text-red-500" />;
      case 'admin': return <ShieldCheck size={16} className="text-blue-500" />;
      case 'publisher': return <PenTool size={16} className="text-emerald-500" />;
      case 'best_user': return <Star size={16} className="text-amber-500" />;
      case 'verified': return <BadgeCheck size={16} className="text-sky-500" />;
      default: return null;
    }
  };

  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case 'owner': return 'مالک';
      case 'super_admin': return 'سوپر اډمین';
      case 'admin': return 'اډمین';
      case 'publisher': return 'ناشر';
      case 'best_user': return 'غوره کارونکی';
      case 'verified': return 'تایید شوی';
      default: return 'عادي کارونکی';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center space-x-4 space-x-reverse">
        <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl active:scale-90 transition-all">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-black">کارونکي</h1>
      </header>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="د کارونکي پلټنه (نوم یا شمېره)..."
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pr-12 pl-6 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 font-bold shadow-sm"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">ټول کارونکي ({filteredUsers.length})</h2>
        </div>

        <div className="grid gap-3">
          {filteredUsers.map((user) => (
            <motion.button
              key={user.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/admin/users/${user.id}`)}
              className="w-full bg-white dark:bg-zinc-900 p-4 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group text-right"
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-inner"
                  style={{ backgroundColor: user.color || '#3b82f6' }}
                >
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{user.name}</h3>
                    {user.badge && (
                      <div className="flex items-center space-x-1 space-x-reverse bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        {getBadgeIcon(user.badge)}
                        <span className="text-[10px] font-bold text-zinc-500">{getBadgeLabel(user.badge)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5" dir="ltr">{user.phone}</p>
                </div>
              </div>
            </motion.button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] border border-dashed border-zinc-200 dark:border-zinc-800">
              <Users size={32} className="mx-auto text-zinc-300 mb-2" />
              <p className="text-zinc-400 text-xs font-medium">هیڅ کارونکی ونه موندل شو</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
