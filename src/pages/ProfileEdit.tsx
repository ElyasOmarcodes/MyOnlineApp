import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
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
    <div className="flex-1 bg-zinc-50 dark:bg-black min-h-screen pb-24" dir="rtl">
      <div className="p-4">
        <div className="flex items-center flex-row-reverse mb-8 mt-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 ml-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight size={24} className="text-zinc-500" />
          </button>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">پروفایل ایډیټ</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 mr-4 text-right">
              ستاسو نوم
            </label>
            <div className="flex items-center flex-row-reverse bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus-within:border-[var(--accent-color)] focus-within:ring-1 focus-within:ring-[var(--accent-color)] transition-all">
              <div className="px-4">
                <User size={18} className="text-zinc-400" />
              </div>
              <input
                type="text"
                className="flex-1 py-4 px-4 text-base font-bold text-zinc-800 dark:text-zinc-100 text-right bg-transparent focus:outline-none placeholder-zinc-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نوم"
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 mr-4 text-right">
              د موبایل شمېره
            </label>
            <div className="flex items-center flex-row-reverse bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus-within:border-[var(--accent-color)] focus-within:ring-1 focus-within:ring-[var(--accent-color)] transition-all">
              <div className="px-4">
                <Phone size={18} className="text-zinc-400" />
              </div>
              <input
                type="tel"
                className="flex-1 py-4 px-4 text-base font-bold text-zinc-800 dark:text-zinc-100 text-left bg-transparent focus:outline-none placeholder-zinc-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="شمېره"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--accent-color)] hover:opacity-90 text-white rounded-2xl py-5 flex items-center justify-center transition-all shadow-lg shadow-[var(--accent-color)]/20 active:scale-[0.98]"
          >
            {success ? (
              <div className="flex items-center flex-row-reverse gap-2">
                <Check size={20} className="text-white" />
                <span className="text-base font-bold">خوندي شو!</span>
              </div>
            ) : (
              <span className="text-base font-bold">تغیرات خوندي کړئ</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
