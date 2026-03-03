import React, { useState } from 'react';
import { Moon, Sun, Monitor, Palette, ChevronRight, Check, Sparkles, ShieldCheck, BellRing, Lock, LogOut, User, Type } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import { useNavigate } from 'react-router-dom';

const SettingSection = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: any }) => (
  <div className="mb-6">
    <div className="flex items-center flex-row-reverse mb-4 px-2">
      <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex justify-center items-center ml-2">
        <Icon size={18} className="text-[var(--accent-color)]" />
      </div>
      <h3 className="text-sm font-bold text-zinc-400 uppercase">{title}</h3>
    </div>
    <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {children}
    </div>
  </div>
);

const Settings: React.FC = () => {
  const { mode, setMode, accentColor, setAccentColor, fontSize, setFontSize } = useTheme();
  const { isAdmin, login, logout, currentUser } = useContent();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('غلط کارن نوم یا پټ نوم');
    }
  };

  const presetColors = [
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#6366f1', // Indigo
    '#14b8a6', // Teal
  ];

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-black min-h-screen pb-24" dir="rtl">
      <div className="p-4">
        <div 
          className="rounded-[40px] py-10 px-6 mb-10 relative overflow-hidden"
          style={{ backgroundColor: accentColor }}
        >
          <div className="absolute inset-0 opacity-20 bg-black" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">تنظیمات</h1>
            <p className="text-sm font-medium text-white/80">اپلیکیشن په خپله خوښه عیار کړئ</p>
          </div>
        </div>

        {/* Profile Section */}
        <SettingSection title="پروفایل" icon={User}>
          <div className="p-5">
            <button 
              className="w-full flex flex-row-reverse items-center justify-between"
              onClick={() => navigate('/profile-edit')}
            >
              <div className="flex flex-row-reverse items-center">
                <div 
                  className="w-12 h-12 rounded-full flex justify-center items-center ml-4"
                  style={{ backgroundColor: currentUser?.color || accentColor }}
                >
                  <span className="text-white text-xl font-bold">{currentUser?.name?.charAt(0) || 'U'}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base font-bold text-zinc-800 dark:text-zinc-100">{currentUser?.name || 'کارونکی'}</span>
                  <span className="text-xs text-zinc-400">{currentUser?.phone || 'شمېره نشته'}</span>
                </div>
              </div>
              <div className="flex flex-row-reverse items-center">
                <div className="bg-[var(--accent-color)]/10 px-2 py-1 rounded-lg ml-2">
                  <span className="text-[10px] font-bold text-[var(--accent-color)]">ایډیټ</span>
                </div>
                <ChevronRight size={18} className="text-zinc-300" />
              </div>
            </button>
          </div>
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection title="بڼه (Appearance)" icon={Monitor}>
          <div className="p-5">
            <div className="flex flex-row-reverse justify-between">
              {[
                { id: 'light', label: 'روښانه', icon: Sun },
                { id: 'dark', label: 'تیاره', icon: Moon },
                { id: 'system', label: 'سیسټم', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMode(id as any)}
                  className={`flex-1 flex flex-col items-center justify-center p-5 rounded-[24px] border-2 mx-1 relative transition-all ${
                    mode === id 
                      ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5' 
                      : 'border-zinc-50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50'
                  }`}
                >
                  <Icon size={24} className={`mb-2 ${mode === id ? 'text-[var(--accent-color)]' : 'text-zinc-400'}`} />
                  <span className={`text-xs font-bold ${mode === id ? 'text-[var(--accent-color)]' : 'text-zinc-400'}`}>{label}</span>
                  {mode === id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex justify-center items-center bg-[var(--accent-color)]">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </SettingSection>

        {/* Font Size Section */}
        <SettingSection title="د خط اندازه (Font Size)" icon={Type}>
          <div className="p-5">
            <div className="flex flex-row-reverse justify-between mb-4">
              <span className="text-xs font-bold text-zinc-500">کوچنی</span>
              <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">غټ</span>
            </div>
            <div className="flex flex-row-reverse items-center justify-center mb-4">
               <button 
                 onClick={() => setFontSize(Math.max(14, fontSize - 1))} 
                 className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex justify-center items-center mx-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
               >
                 <span className="text-xl font-bold text-zinc-700 dark:text-zinc-300">-</span>
               </button>
               <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 w-8 text-center">{fontSize}</span>
               <button 
                 onClick={() => setFontSize(Math.min(24, fontSize + 1))} 
                 className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex justify-center items-center mx-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
               >
                 <span className="text-xl font-bold text-zinc-700 dark:text-zinc-300">+</span>
               </button>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-center items-center">
              <span className="text-zinc-700 dark:text-zinc-300 text-center" style={{ fontSize: `${fontSize}px` }}>
                دا د خط نمونه ده.
              </span>
            </div>
          </div>
        </SettingSection>

        {/* Accent Color Section */}
        <SettingSection title="اصلي رنګ (Accent Color)" icon={Palette}>
          <div className="p-5">
            <div className="flex flex-row-reverse flex-wrap justify-center gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className="w-[18%] aspect-square rounded-2xl flex justify-center items-center transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: color }}
                >
                  {accentColor === color && (
                    <div className="w-8 h-8 rounded-full bg-white/30 flex justify-center items-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </SettingSection>

        {/* Admin Section */}
        <SettingSection title="اډمین مدیریت" icon={Lock}>
          <div>
            {!isAdmin ? (
              <div className="p-5">
                <button 
                  className="w-full flex flex-row-reverse items-center justify-between"
                  onClick={() => setShowLogin(!showLogin)}
                >
                  <div className="flex flex-row-reverse items-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex justify-center items-center ml-4">
                      <Lock size={20} className="text-amber-500" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">اډمین ننوتل</span>
                      <span className="text-[10px] text-zinc-400">د مطالبو د مدیریت لپاره ننوځئ</span>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${showLogin ? 'rotate-90' : 'rotate-0'}`}>
                    <ChevronRight size={18} className="text-zinc-300" />
                  </div>
                </button>

                {showLogin && (
                  <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-3">
                    <input
                      type="text"
                      className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl p-3 text-right text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
                      placeholder="کارن نوم"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      type="password"
                      className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl p-3 text-right text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
                      placeholder="پټ نوم"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <span className="text-red-500 text-[10px] text-center">{error}</span>}
                    <button 
                      type="submit"
                      className="p-3 rounded-xl text-white font-bold transition-opacity hover:opacity-90 active:scale-[0.98]"
                      style={{ backgroundColor: accentColor }}
                    >
                      ننوتل
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="flex flex-row-reverse items-center justify-between p-5">
                <div className="flex flex-row-reverse items-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex justify-center items-center ml-4">
                    <User size={20} className="text-emerald-500" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">تاسو ننوتی یاست</span>
                    <span className="text-[10px] text-zinc-400">اډمین پینل اوس په مینو کې خلاص دی</span>
                  </div>
                </div>
                <button 
                  className="p-3 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors"
                  onClick={logout}
                >
                  <LogOut size={18} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        </SettingSection>

        <div className="flex justify-center py-4">
          <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">Version 2.1.0 • Ramadan Edition</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
