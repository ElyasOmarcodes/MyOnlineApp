import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, User, Phone, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const SplashAndRegister: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, registerUser } = useContent();
  const [showSplash, setShowSplash] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (currentUser) {
        onComplete();
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
    <div className="fixed inset-0 z-[200] bg-[var(--accent-color)] flex flex-col items-center justify-center overflow-hidden pt-safe pb-safe" dir="rtl">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center space-y-6"
          >
            <motion.div 
              animate={{ 
                rotateY: [0, 360],
                y: [0, -10, 0]
              }}
              transition={{ 
                rotateY: { duration: 2, ease: "easeInOut", repeat: Infinity },
                y: { duration: 2, ease: "easeInOut", repeat: Infinity }
              }}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-[32px] sm:rounded-[40px] flex items-center justify-center shadow-2xl shadow-black/20"
            >
              <BookOpen size={48} className="sm:w-16 sm:h-16 text-[var(--accent-color)]" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-1 sm:space-y-2 text-white"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">اسلامي مطالب</h1>
              <p className="text-white/80 text-sm sm:text-base font-medium">د روژې مبارکه ډالۍ</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-6"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl">
              <div className="text-center space-y-2 mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User size={28} className="sm:w-8 sm:h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-800 dark:text-zinc-100">ښه راغلاست!</h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">د کمنټونو لیکلو لپاره خپل معلومات ثبت کړئ</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-4">ستاسو نوم</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-3.5 sm:py-4 pr-12 pl-4 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold text-zinc-800 dark:text-zinc-100 text-sm sm:text-base"
                      placeholder="احمد..."
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-4">د موبایل شمېره</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-3.5 sm:py-4 pr-12 pl-4 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold text-zinc-800 dark:text-zinc-100 text-left text-sm sm:text-base"
                      placeholder="07..."
                      dir="ltr"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold text-center pt-2">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[var(--accent-color)] text-white font-black py-4 sm:py-5 rounded-2xl shadow-xl shadow-[var(--accent-color)]/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center space-x-2 space-x-reverse mt-4 text-sm sm:text-base"
                >
                  <span>ننوتل</span>
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
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
