import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Sparkles, BookOpen, Clock, Heart, MessageSquare, Eye, Filter } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useContent, Post } from '../context/ContentContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Home: React.FC = () => {
  const { posts, setCurrentPost, favorites, loading, incrementViews, categories, topPosts } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'content' | 'both'>('both');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Auto-scroll top posts
  useEffect(() => {
    if (topPosts && topPosts.length > 1) {
      const timer = setInterval(() => {
        setCurrentTopIndex(prev => (prev + 1) % topPosts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [topPosts]);

  const handleView = (post: Post) => {
    incrementViews(post.id);
    setCurrentPost(post);
    navigate('/player');
  };

  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (searchType === 'title') return (p.title || '').toLowerCase().includes(q);
    if (searchType === 'content') return (p.content || '').toLowerCase().includes(q);
    return (p.title || '').toLowerCase().includes(q) || (p.content || '').toLowerCase().includes(q);
  });

  // Filter categories based on search results
  const relevantCategories = categories.filter(cat => 
    filteredPosts.some(p => p.category === cat.name)
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categoryCards = [
    { label: 'ټول مطالب', icon: BookOpen, count: filteredPosts.length, id: 'all' },
    ...(relevantCategories || []).map(cat => ({
      label: cat.name,
      icon: (Icons as any)[cat.icon] || BookOpen,
      count: filteredPosts.filter(p => p.category === cat.name).length,
      id: cat.name
    }))
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section / Top Posts Carousel */}
      <div className="relative h-[220px] sm:h-[260px]">
        <AnimatePresence mode="wait">
          {topPosts && topPosts.length > 0 ? (
            <motion.div
              key={topPosts[currentTopIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={() => handleView(topPosts[currentTopIndex])}
              className="absolute inset-0 cursor-pointer overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[var(--accent-color)] p-6 sm:p-8 text-white shadow-xl shadow-[var(--accent-color)]/20 flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                </svg>
              </div>
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                      <Sparkles size={16} className="text-amber-300" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-90">غوره مطلب</span>
                  </div>
                  <div className="flex space-x-1 space-x-reverse">
                    {topPosts.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentTopIndex ? 'bg-white w-4' : 'bg-white/30'}`}
                      />
                    ))}
                  </div>
                </div>
                <h1 className="text-xl sm:text-2xl font-black leading-tight line-clamp-2">{topPosts[currentTopIndex].title}</h1>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-auto">
                <p className="text-white/80 text-xs font-medium line-clamp-2 max-w-[70%]">
                  {topPosts[currentTopIndex].content}
                </p>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ChevronLeft size={20} />
                </div>
              </div>
            </motion.div>
          ) : (
            <header className="absolute inset-0 overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[var(--accent-color)] p-6 sm:p-8 text-white shadow-xl shadow-[var(--accent-color)]/20">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                </svg>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-xs font-medium opacity-90">اسلامي مطالب</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">اسلامي مطالب او ښکلې ویناوې</h1>
                <p className="text-white/80 text-xs sm:text-sm max-w-[240px]">
                  دلته تاسو کولی شئ د روژې او اسلام په اړه غوره لیکنې او مطالب ولولئ.
                </p>
              </div>
            </header>
          )}
        </AnimatePresence>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto w-full z-20">
        <div className="relative group">
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[var(--accent-color)] transition-all duration-300 group-focus-within:scale-110">
            <Search size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="ټول مطالب ولټوئ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-50 dark:border-zinc-800 rounded-[24px] sm:rounded-[28px] py-4 sm:py-5 pr-12 sm:pr-14 pl-14 sm:pl-16 text-sm sm:text-base font-bold placeholder:text-zinc-400 placeholder:font-medium focus:outline-none focus:ring-8 focus:ring-[var(--accent-color)]/5 focus:border-[var(--accent-color)] transition-all shadow-xl shadow-zinc-200/20 dark:shadow-none"
          />
          <div className="absolute inset-y-0 left-2 flex items-center space-x-1 space-x-reverse">
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <span className="text-xs font-black">✕</span>
                </div>
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`p-2 rounded-xl transition-colors ${showFilterMenu || searchType !== 'both' ? 'text-[var(--accent-color)] bg-[var(--accent-color)]/10' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                <Filter size={20} />
              </button>
              
              <AnimatePresence>
                {showFilterMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden z-50"
                    >
                      <div className="p-2 space-y-1">
                        <div className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">پلټنه په:</div>
                        {[
                          { id: 'both', label: 'ټول (عنوان او متن)' },
                          { id: 'title', label: 'یوازې عنوان کې' },
                          { id: 'content', label: 'یوازې متن کې' }
                        ].map(option => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSearchType(option.id as any);
                              setShowFilterMenu(false);
                            }}
                            className={`w-full text-right px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                              searchType === option.id 
                                ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' 
                                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
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
