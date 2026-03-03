import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useContent, Post } from '../context/ContentContext';
import { ChevronRight, Search, Heart, MessageSquare, Eye, ChevronLeft, Filter, X } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = new URLSearchParams(location.search).get('search') || '';
  
  const { posts, setCurrentPost, favorites, incrementViews } = useContent();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchType, setSearchType] = useState<'title' | 'content' | 'both'>('both');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

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
    <div className="flex-1 bg-zinc-50 dark:bg-black min-h-screen pb-24" dir="rtl">
      {/* Header */}
      <div className="flex items-center flex-row-reverse px-4 py-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 ml-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronRight size={24} className="text-zinc-500" />
        </button>
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{categoryName}</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 z-20 mb-4">
        <div className="flex items-center flex-row-reverse bg-white dark:bg-zinc-900 border-2 border-zinc-50 dark:border-zinc-800 rounded-full py-1 shadow-sm">
          <div className="px-4">
            <Search size={20} className="text-zinc-400" />
          </div>
          <input
            type="text"
            className="flex-1 text-right text-base font-bold text-zinc-800 dark:text-zinc-100 py-3 bg-transparent focus:outline-none placeholder-zinc-400"
            placeholder="په دې کټګورۍ کې ولټوئ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center flex-row-reverse px-2">
            {searchQuery.length > 0 && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-2"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex justify-center items-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  <X size={12} className="text-zinc-400" />
                </div>
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`p-2 rounded-xl transition-colors ${
                  (showFilterMenu || searchType !== 'both') ? 'bg-[var(--accent-color)]/10' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Filter size={20} className={(showFilterMenu || searchType !== 'both') ? 'text-[var(--accent-color)]' : 'text-zinc-400'} />
              </button>
              
              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl p-2 border border-zinc-100 dark:border-zinc-800 shadow-xl z-50">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase px-3 py-2 text-right">پلټنه په:</h3>
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
                      className={`w-full text-right px-3 py-2.5 rounded-xl transition-colors ${
                        searchType === option.id ? 'bg-[var(--accent-color)]/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span className={`text-sm font-bold ${
                        searchType === option.id ? 'text-[var(--accent-color)]' : 'text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="px-4 pb-12">
        <div className="flex flex-row-reverse justify-between items-center px-1 mb-4">
          <span className="text-xs font-bold text-zinc-400">{filteredPosts.length} مطالب موندل شوي</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-12 flex justify-center items-center">
            <span className="text-base font-bold text-zinc-500">هیڅ مطلب ونه موندل شو</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => handleView(post)}
                className="flex flex-row-reverse items-center bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors text-right w-full"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-black flex justify-center items-center">
                    <MessageSquare size={24} className="text-zinc-400" />
                  </div>
                  {(favorites || []).includes(post.id) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900 flex justify-center items-center">
                      <Heart size={10} className="text-white" fill="white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 mr-4 flex flex-col items-end overflow-hidden">
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1 truncate w-full text-right">{post.title}</h3>
                  <p className="text-xs text-zinc-500 truncate w-full text-right">{post.content}</p>
                </div>

                <div className="flex flex-col items-end gap-1 ml-2">
                  <div className="flex flex-row-reverse items-center gap-1">
                    <Eye size={12} className="text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400">{post.views || 0}</span>
                  </div>
                  <ChevronLeft size={20} className="text-zinc-300" />
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
