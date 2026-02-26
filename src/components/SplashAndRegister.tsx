import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, User, Phone, ArrowRight, Sparkles, Moon, Star } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const SplashAndRegister: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, registerUser } = useContent();
  const [showSplash, setShowSplash] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        onComplete();
      } else {
        setShowSplash(false);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [currentUser, onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('مهرباني وکړئ نوم او د موبایل شمېره ولیکئ');
      return;
    }
    registerUser(name, phone);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-50 dark:bg-black flex flex-col items-center justify-center overflow-hidden pt-safe pb-safe" dir="rtl">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[var(--accent-color)]/20 dark:bg-[var(--accent-color)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[var(--accent-color)] rounded-[40px] blur-2xl opacity-40 animate-pulse" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-2xl">
                <BookOpen size={56} className="text-[var(--accent-color)]" strokeWidth={1.5} />
                <Sparkles size={24} className="absolute -top-3 -right-3 text-amber-400 animate-bounce" fill="currentColor" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center mt-12 space-y-4"
            >
              <div className="inline-flex items-center space-x-2 space-x-reverse px-4 py-1.5 bg-[var(--accent-color)]/10 rounded-full border border-[var(--accent-color)]/20 mb-2">
                <Moon size={14} className="text-[var(--accent-color)]" />
                <span className="text-xs font-black uppercase tracking-widest text-[var(--accent-color)]">روژې مبارکې ډالۍ</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-800 dark:text-zinc-100">اسلامي مطالب</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium max-w-[250px] mx-auto leading-relaxed">
                د دیني معلوماتو او ښکلو ویناوو غوره ټولګه
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative z-10 w-full max-w-md px-6"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 sm:p-10 border border-zinc-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)]/10 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <div className="relative z-10 text-center space-y-3 mb-10">
                <div className="w-16 h-16 bg-[var(--accent-color)]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[var(--accent-color)]/20">
                  <User size={32} className="text-[var(--accent-color)]" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">ښه راغلاست!</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">د کمنټونو لیکلو لپاره خپل معلومات ثبت کړئ</p>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mr-2">ستاسو نوم</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[var(--accent-color)] transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-[24px] py-4 pr-14 pl-5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] transition-all font-bold text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 text-base"
                      placeholder="احمد..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mr-2">د موبایل شمېره</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[var(--accent-color)] transition-colors">
                      <Phone size={20} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-[24px] py-4 pr-14 pl-5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] transition-all font-bold text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 text-left text-base"
                      placeholder="07..."
                      dir="ltr"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-500/10 py-2 rounded-xl border border-red-100 dark:border-red-500/20"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full bg-[var(--accent-color)] text-white font-black py-5 rounded-[24px] shadow-xl shadow-[var(--accent-color)]/30 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center space-x-3 space-x-reverse mt-8 text-lg group"
                >
                  <span>ننوتل</span>
                  <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashAndRegister;
