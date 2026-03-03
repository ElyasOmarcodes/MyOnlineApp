import React from 'react';
import { useContent, Post } from '../context/ContentContext';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-black min-h-screen pb-24" dir="rtl">
      <div className="p-4">
        <div className="bg-red-500 rounded-[32px] p-6 mb-6 relative overflow-hidden">
          <div className="absolute -bottom-5 -left-5 opacity-50 transform rotate-12">
            <Heart size={120} className="text-white/20" fill="currentColor" />
          </div>
          
          <div className="relative z-10 flex flex-col items-end">
            <div className="flex items-center flex-row-reverse bg-white/20 px-2 py-1 rounded-lg mb-3">
              <Heart size={16} className="text-white" fill="white" />
              <span className="text-white text-xs font-bold mr-1">ستاسو خوښ شوي</span>
            </div>
            <h1 className="text-white text-2xl font-bold text-right mb-2">خوښ شوي مطالب</h1>
            <p className="text-white/80 text-xs text-right">
              دلته ستاسو د خوښې وړ لیکنو او مطالبو ټولګه ده.
            </p>
          </div>
        </div>

        {favoritePosts.length === 0 ? (
          <div className="py-16 flex flex-col items-center">
            <div className="w-32 h-32 mb-6 relative flex justify-center items-center">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full animate-pulse" />
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full border border-zinc-100 dark:border-zinc-800 flex justify-center items-center relative z-10">
                <HeartOff size={48} className="text-zinc-300" />
              </div>
            </div>
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">لیست خالي دی</h2>
              <p className="text-sm text-zinc-500 text-center">تاسو تر اوسه هیڅ مطلب نه دی خوښ کړی.</p>
            </div>
            <button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-8 py-3 rounded-2xl transition-colors"
              onClick={() => navigate('/')}
            >
              مطالب وګورئ
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row-reverse justify-between px-2 mb-2">
              <span className="text-xs font-bold text-zinc-400">{favoritePosts.length} مطالب</span>
            </div>

            {favoritePosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-row-reverse items-center bg-white dark:bg-zinc-900 rounded-[32px] p-4 border border-zinc-100 dark:border-zinc-800 cursor-pointer hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                onClick={() => handleView(post)}
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-black flex justify-center items-center ml-4 shrink-0">
                  <MessageSquare size={24} className="text-zinc-400" />
                </div>

                <div className="flex-1 flex flex-col items-end overflow-hidden">
                  <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-1 truncate w-full text-right">{post.title}</h3>
                  <p className="text-xs text-zinc-500 truncate w-full text-right">{post.content}</p>
                </div>

                <div className="flex flex-row-reverse items-center mr-4 shrink-0">
                  <button
                    className="p-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-2xl ml-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(post.id);
                    }}
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                  <ChevronLeft size={20} className="text-zinc-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
