import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContent, User } from '../context/ContentContext';
import { ArrowRight, ShieldCheck, Star, BadgeCheck, PenTool, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BADGES = [
  { id: 'owner', label: 'د مالکیت ټیک', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'super_admin', label: 'سوپر اډمین', icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  { id: 'admin', label: 'اډمین', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'publisher', label: 'ناشر', icon: PenTool, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'best_user', label: 'غوره کارونکی', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'verified', label: 'تایید شوی', icon: BadgeCheck, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20' },
  { id: '', label: 'عادي کارونکی (پرته له نښان)', icon: UserIcon, color: 'text-zinc-500', bg: 'bg-zinc-50 dark:bg-zinc-900/20' }
];

const AdminUserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { users, isAdmin, updateUserBadge } = useContent();
  const [user, setUser] = useState<User | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const foundUser = users.find(u => u.id === id);
      if (foundUser) {
        setUser(foundUser);
        setSelectedBadge(foundUser.badge || '');
      }
    }
  }, [id, users]);

  if (!isAdmin) return null;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateUserBadge(user.id, selectedBadge);
      setSuccess('د کارونکي نښان په بریالیتوب سره بدل شو');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('تېروتنه رامنځته شوه');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center space-x-4 space-x-reverse">
        <button onClick={() => navigate('/admin/users')} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl active:scale-90 transition-all">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-black">د کارونکي پروفایل</h1>
      </header>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center space-y-4">
        <div 
          className="w-24 h-24 rounded-[32px] flex items-center justify-center text-white font-black text-4xl shadow-inner"
          style={{ backgroundColor: user.color || '#3b82f6' }}
        >
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{user.name}</h2>
          <p className="text-zinc-400 font-medium mt-1" dir="ltr">{user.phone}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest px-2">د نښان (Badge) انتخاب</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            const isSelected = selectedBadge === badge.id;
            
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge.id)}
                className={`flex items-center space-x-4 space-x-reverse p-4 rounded-2xl border-2 transition-all ${
                  isSelected 
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5' 
                    : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.bg} ${badge.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 text-right">
                  <span className={`font-bold ${isSelected ? 'text-[var(--accent-color)]' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {badge.label}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle2 size={20} className="text-[var(--accent-color)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-[var(--accent-color)] text-white py-4 rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-[var(--accent-color)]/20"
      >
        بدلونونه خوندي کړئ
      </button>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-6 right-6 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 space-x-reverse z-50 ${error ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-bold text-sm">{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUserProfile;
