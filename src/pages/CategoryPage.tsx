import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useContent, Post } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Search, Heart, MessageSquare, Eye, ChevronLeft, Filter } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { posts, setCurrentPost, favorites, incrementViews } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'content' | 'both'>('both');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  const categoryName = id === 'all' ? 'ټول مطالب' : id;
  
  const categoryPosts = id === 'all' 
    ? posts 
    : posts.filter(p => p.category === id);

  const filteredPosts = categoryPosts.filter(p => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (searchType === 'title') return (p.title || '').toLowerCase().includes(q);
    if (searchType === 'content') return (p.content || '').toLowerCase().includes(q);
    return (p.title || '').toLowerCase().includes(q) || (p.content || '').toLowerCase().includes(q);
  });

  const handleView = (post: Post) => {
    incrementViews(post.id);
    setCurrentPost(post);
    navigate('/player');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center space-x-4 space-x-reverse py-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-500 active:scale-90 transition-transform"
        >
          <ChevronRight size={24} />
        </button>
        <h1 className="text-2xl font-black">{categoryName}</h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full z-20">
        <div className="relative group">
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[var(--accent-color)] transition-all duration-300 group-focus-within:scale-110">
            <Search size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="په دې کټګورۍ کې ولټوئ..."
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

      {/* Posts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-zinc-400 font-bold">{filteredPosts.length} مطالب موندل شوي</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-bold">
            هیڅ مطلب ونه موندل شو
          </div>
        ) : (
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
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
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
                  <h3 className="font-bold text-lg group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">{post.title}</h3>
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
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
