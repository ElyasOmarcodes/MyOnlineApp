import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { User, Phone, Check, ChevronRight } from 'lucide-react';

const ProfileEdit: React.FC = () => {
  const { currentUser, updateUser } = useContent();
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      updateUser(name.trim(), phone.trim());
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate(-1);
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 pb-24" dir="rtl">
      <div className="flex items-center space-x-4 space-x-reverse py-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-500"
        >
          <ChevronRight size={24} />
        </button>
        <h1 className="text-2xl font-black">پروفایل ایډیټ</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-4">ستاسو نوم</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400">
                <User size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-4">د موبایل شمېره</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold text-left"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--accent-color)] text-white font-black py-5 rounded-2xl shadow-xl shadow-[var(--accent-color)]/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 space-x-reverse"
          >
            {success ? (
              <>
                <Check size={20} />
                <span>خوندي شو!</span>
              </>
            ) : (
              <span>تغیرات خوندي کړئ</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileEdit;
