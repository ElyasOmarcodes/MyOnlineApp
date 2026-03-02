import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  LogOut, 
  FileText, 
  Tag, 
  LayoutDashboard, 
  Sparkles,
  ChevronLeft,
  Users,
  Settings,
  ShieldCheck
} from 'lucide-react';

const AdminCard = ({ title, desc, icon: Icon, onClick, color }: { title: string, desc: string, icon: any, onClick: () => void, color: string }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 text-right flex items-center space-x-4 space-x-reverse shadow-sm hover:shadow-xl transition-all group"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors`} style={{ backgroundColor: `${color}10`, color: color }}>
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100">{title}</h3>
      <p className="text-xs text-zinc-400 font-medium">{desc}</p>
    </div>
    <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors">
      <ChevronLeft size={20} />
    </div>
  </motion.button>
);

const Admin: React.FC = () => {
  const { isAdmin, logout, posts, categories, topPosts } = useContent();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 space-y-6">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-3xl flex items-center justify-center">
          <Lock size={40} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black">لاسرسی نشته</h2>
          <p className="text-zinc-500 text-sm">تاسو باید لومړی په تنظیماتو کې ننوځئ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-12 h-12 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-2xl flex items-center justify-center">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">اډمین پینل</h1>
            <p className="text-zinc-400 text-xs font-bold">د اپلیکیشن مدیریت مرکز</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl active:scale-90 transition-all hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <AdminCard 
          title="کارونکي" 
          desc="د کارونکو مدیریت" 
          icon={Users} 
          color="#8b5cf6"
          onClick={() => navigate('/admin/users')} 
        />
        <AdminCard 
          title="کټګورۍ مدیریت" 
          desc={`${categories.length} فعالې کټګورۍ`} 
          icon={Tag} 
          color="#10b981"
          onClick={() => navigate('/admin/categories')} 
        />
        <AdminCard 
          title="بهترینې خبرې" 
          desc={`${topPosts?.length || 0} غوره خبرې`} 
          icon={Sparkles} 
          color="#f59e0b"
          onClick={() => navigate('/admin/top-posts')} 
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase">امنیت</span>
          <span className="text-lg font-black">خوندي</span>
        </div>
      </div>

      <div className="pt-4">
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-4 rounded-2xl flex items-start space-x-3 space-x-reverse">
          <Settings size={20} className="text-amber-500 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
            پاملرنه: دلته هر ډول بدلون به په مستقیم ډول ټولو کارونکو ته ښکاره شي. مهرباني وکړئ په دقت سره کار وکړئ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;

