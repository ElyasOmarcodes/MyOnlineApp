import React, { useState } from 'react';
import { ChevronLeft, Search, Sparkles, BookOpen, Clock, Heart, MessageSquare, Eye } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useContent, Post } from '../context/ContentContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  const { posts, setCurrentPost, favorites, loading, incrementViews, categories } = useContent();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleView = (post: Post) => {
    incrementViews(post.id);
    setCurrentPost(post);
    navigate('/player');
  };

  const filteredPosts = posts.filter(p => 
    (p.title || '').includes(searchQuery) || (p.content || '').includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categoryCards = [
    { label: 'ټول مطالب', icon: BookOpen, count: posts.length, id: 'all' },
    ...(categories || []).map(cat => ({
      label: cat.name,
      icon: (Icons as any)[cat.icon] || BookOpen,
      count: posts.filter(p => p.category === cat.name).length,
      id: cat.name
    }))
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <header className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[var(--accent-color)] p-6 sm:p-8 text-white shadow-xl shadow-[var(--accent-color)]/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Sparkles size={16} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium opacity-90">د روژې مبارکه ډالۍ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">اسلامي مطالب او ښکلې ویناوې</h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-[240px]">
            دلته تاسو کولی شئ د روژې او اسلام په اړه غوره لیکنې او مطالب ولولئ.
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative group max-w-2xl mx-auto w-full">
        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[var(--accent-color)] transition-all duration-300 group-focus-within:scale-110">
          <Search size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="ټول مطالب ولټوئ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-50 dark:border-zinc-800 rounded-[24px] sm:rounded-[28px] py-4 sm:py-5 pr-12 sm:pr-14 pl-12 sm:pl-14 text-sm sm:text-base font-bold placeholder:text-zinc-400 placeholder:font-medium focus:outline-none focus:ring-8 focus:ring-[var(--accent-color)]/5 focus:border-[var(--accent-color)] transition-all shadow-xl shadow-zinc-200/20 dark:shadow-none"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 left-5 flex items-center text-zinc-300 hover:text-red-500 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <span className="text-xs font-black">✕</span>
            </div>
          </button>
        )}
        <div className="absolute inset-y-3 left-3 w-[1px] bg-zinc-100 dark:bg-zinc-800 hidden sm:block" />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {categoryCards.map((cat, i) => (
          <motion.button 
            key={i} 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="group relative bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-[24px] sm:rounded-[32px] border border-zinc-100 dark:border-zinc-800 text-right space-y-3 sm:space-y-4 shadow-sm hover:shadow-xl hover:shadow-[var(--accent-color)]/10 transition-all w-full overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 sm:w-24 sm:h-24 bg-[var(--accent-color)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent-color)]/10 transition-colors pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <cat.icon size={20} className="sm:w-6 sm:h-6" strokeWidth={2} />
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors">
                <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="space-y-1 relative z-10">
              <div className="text-xs sm:text-sm font-black text-zinc-800 dark:text-zinc-100">{cat.label}</div>
              <div className="text-[9px] sm:text-[10px] font-bold text-zinc-400">{cat.count} موضوعات</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">وروستي خپاره شوي</h2>
          <span className="text-xs text-zinc-400">{filteredPosts.length} مطالب</span>
        </div>

        <motion.div 
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {filteredPosts.map((post) => (
            <motion.button
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.98 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1]
              }}
              whileHover={{ scale: 1.01, x: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleView(post)}
              className="w-full flex items-center p-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-[var(--accent-color)]/30 transition-all group"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[var(--accent-color)]/10 group-hover:text-[var(--accent-color)] transition-colors">
                  <MessageSquare size={24} className="opacity-40 group-hover:opacity-100" />
                </div>
                {(favorites || []).includes(post.id) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white">
                    <Heart size={10} fill="currentColor" />
                  </div>
                )}
              </div>
              
              <div className="mr-4 flex-1 text-right">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-[10px] font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-lg group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">{post.title}</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">{post.content}</p>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-1 space-x-reverse text-zinc-400">
                  <Eye size={12} />
                  <span className="text-[10px] font-bold">{post.views || 0}</span>
                </div>
                <div className="text-zinc-300 dark:text-zinc-700">
                  <ChevronLeft size={20} />
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
