import React from 'react';
import { useContent, Post } from '../context/ContentContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, HeartOff, ChevronLeft, MessageSquare, Trash2 } from 'lucide-react';

const Favorites: React.FC = () => {
  const { posts, favorites, toggleFavorite, setCurrentPost, incrementViews } = useContent();
  const navigate = useNavigate();

  const favoritePosts = posts.filter(p => (favorites || []).includes(p.id));

  const handleView = (post: Post) => {
    incrementViews(post.id);
    setCurrentPost(post);
    navigate('/player');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-red-500 p-6 sm:p-8 text-white shadow-xl shadow-red-500/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute -bottom-4 -left-4 opacity-20 rotate-12">
          <Heart size={120} fill="currentColor" strokeWidth={0} />
        </div>
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
              <Heart size={16} fill="currentColor" />
            </div>
            <span className="text-xs font-medium opacity-90">ستاسو خوښ شوي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">خوښ شوي مطالب</h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-[240px]">
            دلته ستاسو د خوښې وړ لیکنو او مطالبو ټولګه ده.
          </p>
        </div>
      </header>

      {favoritePosts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-24 text-center space-y-6"
        >
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-[var(--accent-color)]/5 rounded-full animate-pulse" />
            <div className="relative w-full h-full rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-300 shadow-inner">
              <HeartOff size={48} strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">لیست خالي دی</h3>
            <p className="text-zinc-500 text-sm max-w-[240px] mx-auto">تاسو تر اوسه هیڅ مطلب نه دی خوښ کړی.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-[var(--accent-color)] text-white rounded-2xl font-bold shadow-lg shadow-[var(--accent-color)]/20 active:scale-95 transition-transform"
          >
            مطالب وګورئ
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{favoritePosts.length} مطالب</span>
          </div>

          {favoritePosts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className="group relative bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 p-4 flex items-center shadow-sm hover:shadow-xl hover:border-[var(--accent-color)]/20 transition-all duration-300"
            >
              <button
                onClick={() => handleView(post)}
                className="relative w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[var(--accent-color)] group-hover:text-white transition-all duration-300 shadow-inner"
              >
                <MessageSquare size={24} className="opacity-40 group-hover:opacity-100" />
              </button>

              <div className="mr-4 flex-1 text-right">
                <h3 className="font-black text-lg text-zinc-800 dark:text-zinc-100 group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">{post.title}</h3>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">{post.content}</p>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => toggleFavorite(post.id)}
                  className="p-3 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                  title="لیرې کول"
                >
                  <Trash2 size={18} />
                </button>
                <div className="text-zinc-300 dark:text-zinc-700 group-hover:translate-x-[-4px] transition-transform">
                  <ChevronLeft size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;
