import React, { useState } from 'react';
import { Moon, Sun, Monitor, Palette, ChevronRight, Check, Sparkles, ShieldCheck, BellRing, Lock, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { mode, setMode, accentColor, setAccentColor } = useTheme();
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

  const SettingSection = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: any }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 space-x-reverse px-2">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)]">
          <Icon size={18} />
        </div>
        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{title}</h2>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-12">
      <header className="relative py-10 px-6 overflow-hidden rounded-[40px] bg-[var(--accent-color)] text-white shadow-2xl shadow-[var(--accent-color)]/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="10" cy="10" r="40" fill="white" />
            <circle cx="90" cy="90" r="30" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-black tracking-tight">تنظیمات</h1>
          <p className="text-white/80 text-sm font-medium">اپلیکیشن په خپله خوښه عیار کړئ</p>
        </div>
      </header>

      {/* Profile Section */}
      <SettingSection title="پروفایل" icon={User}>
        <div className="p-5">
          <button 
            onClick={() => navigate('/profile-edit')}
            className="w-full flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors rounded-xl p-2"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center font-black text-xl">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-right">
                <p className="text-base font-black">{currentUser?.name || 'کارونکی'}</p>
                <p className="text-xs text-zinc-400">{currentUser?.phone || 'شمېره نشته'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-[10px] font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2 py-1 rounded-lg">ایډیټ</span>
              <ChevronRight size={18} className="text-zinc-300" />
            </div>
          </button>
        </div>
      </SettingSection>

      {/* Appearance Section */}
      <SettingSection title="بڼه (Appearance)" icon={Monitor}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'روښانه', icon: Sun },
              { id: 'dark', label: 'تیاره', icon: Moon },
              { id: 'system', label: 'سیسټم', icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id as any)}
                className={`group relative flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-300 ${
                  mode === id 
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--accent-color)] shadow-lg shadow-[var(--accent-color)]/10' 
                    : 'border-zinc-50 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-zinc-400 hover:border-zinc-200 dark:hover:border-zinc-700'
                }`}
              >
                <Icon size={24} className={`mb-2 transition-transform duration-300 ${mode === id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-xs font-bold">{label}</span>
                {mode === id && (
                  <motion.div 
                    layoutId="active-mode"
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent-color)] rounded-full flex items-center justify-center text-white shadow-md"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>
      </SettingSection>

      {/* Accent Color Section */}
      <SettingSection title="اصلي رنګ (Accent Color)" icon={Palette}>
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-5 gap-4">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className="relative group aspect-square rounded-2xl transition-all duration-300 active:scale-90 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: color }}
              >
                {accentColor === color && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white"
                  >
                    <Check size={16} strokeWidth={3} />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            ))}
          </div>
          
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">خپل رنګ غوره کړئ</label>
              <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">{accentColor.toUpperCase()}</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="absolute inset-[-100%] w-[300%] h-[300%] cursor-pointer"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">ګرافیکي انتخاب</p>
                <p className="text-[10px] text-zinc-400">د خپلې خوښې رنګ په دقیق ډول وټاکئ</p>
              </div>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Notifications & Security (Placeholders for UI) */}
      <div className="grid grid-cols-1 gap-6">
        <SettingSection title="اډمین مدیریت" icon={Lock}>
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
            {!isAdmin ? (
              <div className="p-5 space-y-4">
                <button 
                  onClick={() => setShowLogin(!showLogin)}
                  className="w-full flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors rounded-xl"
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                      <Lock size={20} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">اډمین ننوتل</p>
                      <p className="text-[10px] text-zinc-400">د مطالبو د مدیریت لپاره ننوځئ</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`text-zinc-300 transition-transform ${showLogin ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {showLogin && (
                    <motion.form 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleLogin}
                      className="space-y-3 pt-2 overflow-hidden"
                    >
                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="کارن نوم"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <input
                          type="password"
                          placeholder="پټ نوم"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20"
                        />
                      </div>
                      {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
                      <button
                        type="submit"
                        className="w-full bg-[var(--accent-color)] text-white font-bold py-3 rounded-xl shadow-lg shadow-[var(--accent-color)]/10 active:scale-95 transition-transform text-sm"
                      >
                        ننوتل
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">تاسو ننوتی یاست</p>
                    <p className="text-[10px] text-zinc-400">اډمین پینل اوس په مینو کې خلاص دی</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="p-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl active:scale-90 transition-transform"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </SettingSection>

        <SettingSection title="نور تنظیمات" icon={Sparkles}>
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
            <button className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                  <BellRing size={20} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">خبرتیاوې (Notifications)</p>
                  <p className="text-[10px] text-zinc-400">د نویو پوښتنو په اړه خبر شئ</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-300" />
            </button>
            
            <button className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">امنیت او محرمیت</p>
                  <p className="text-[10px] text-zinc-400">ستاسو معلومات خوندي دي</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-300" />
            </button>
          </div>
        </SettingSection>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.3em]">Version 2.1.0 • Ramadan Edition</p>
      </div>
    </div>
  );
};

export default Settings;
