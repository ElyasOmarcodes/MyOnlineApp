import React, { useState, useEffect } from 'react';
import { useContent, Post } from '../context/ContentContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';
import NetworkDialog from '../../components/NetworkDialog';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { 
  Heart, 
  Share2, 
  Copy, 
  ChevronRight, 
  MessageSquare, 
  Clock, 
  ThumbsUp,
  Check,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  Hash,
  Search,
  LayoutGrid,
  Globe,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Player: React.FC = () => {
  const { currentPost: contextPost, favorites, toggleFavorite, likePost, isAdmin, deletePost, currentUser, checkNetwork } = useContent();
  const { fontSize } = useTheme();
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(contextPost);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (contextPost) {
      const postRef = ref(db, `posts/${contextPost.id}`);
      const unsubscribe = onValue(postRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCurrentPost({ id: contextPost.id, ...data });
        }
      });
      return () => unsubscribe();
    }
  }, [contextPost]);

  useEffect(() => {
    if (currentPost && currentUser) {
      setLiked(!!currentPost.likedBy?.[currentUser.id]);
    }
  }, [currentPost, currentUser]);

  if (!currentPost) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-300">
          <MessageSquare size={40} />
        </div>
        <p className="text-zinc-500 font-bold">هیڅ مطلب نه دی غوره شوی</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-[var(--accent-color)] text-white rounded-xl font-bold"
        >
          کور پاڼې ته لاړ شئ
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentPost.title}\n\n${currentPost.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!currentPost) return;
    const shareData = {
      title: currentPost.title,
      text: `${currentPost.title}\n\n${currentPost.content}\n\nد اسلامي مطالبو اپلیکیشن څخه`,
      url: window.location.href
    };

    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share(shareData);
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.log('Error sharing:', e);
    }
  };

  const handleLike = async () => {
    if (!liked && currentUser) {
      if (!(await checkNetwork())) {
        setShowNetworkDialog(true);
        return;
      }
      likePost(currentPost.id);
      setLiked(true);
    }
  };

  const handleAdminDelete = async () => {
    if (currentPost) {
      if (!(await checkNetwork())) {
        setShowNetworkDialog(true);
        return;
      }
      await deletePost(currentPost.id);
      navigate('/admin');
    }
  };

  const handleAdminEdit = () => {
    navigate('/admin');
  };

  const commentsList = currentPost?.comments ? Object.entries(currentPost.comments).map(([id, data]) => ({ id, ...data })) : [];

  const MAX_LENGTH = 500;
  const shouldTruncate = currentPost?.content && currentPost.content.length > MAX_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? currentPost.content.substring(0, MAX_LENGTH) + '...' 
    : currentPost?.content;

  // Extract hashtags
  const hashtags = currentPost.content.match(/#[^\s#]+/g) || [];

  const handleTagAction = (action: 'post' | 'category' | 'all') => {
    if (!selectedTag) return;
    const tag = selectedTag.replace('#', '');
    
    if (action === 'post') {
      // Just highlight or scroll to it if we had a search in post feature
      setSelectedTag(null);
    } else if (action === 'category') {
      navigate(`/category/${currentPost.category}?search=${tag}`);
    } else {
      navigate(`/?search=${tag}`);
    }
    setSelectedTag(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-8 pb-32 pt-20"
    >
      {/* Top Navigation - Pinned */}
      <div className={`fixed top-0 left-0 right-0 z-50 pt-safe transition-all duration-300 ${
        scrollY > 100 
          ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm' 
          : 'bg-zinc-50/0 dark:bg-black/0'
      }`}>
        <div className="max-w-md mx-auto px-4 pb-3 pt-4 flex items-center justify-between relative">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-500 active:scale-90 transition-transform relative z-[60]"
          >
            <ChevronRight size={24} />
          </button>
          
          <div className="flex-1 px-4 text-center overflow-hidden">
            <AnimatePresence mode="wait">
              {scrollY > 150 ? (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-widest truncate max-w-[150px]">
                    {currentPost.category}
                  </span>
                  <h2 className="text-sm font-black truncate max-w-[200px]">{currentPost.title}</h2>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">د مطلب تفصیل</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => toggleFavorite(currentPost.id)}
            className={`p-3 rounded-2xl shadow-sm border transition-all active:scale-90 relative z-[60] ${
              (favorites || []).includes(currentPost.id)
                ? 'bg-red-50 border-red-100 text-red-500'
                : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500'
            }`}
          >
            <Heart size={24} fill={(favorites || []).includes(currentPost.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Content Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 px-4"
      >
        <div className="flex items-center space-x-3 space-x-reverse">
          <span className="px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full text-[10px] font-black uppercase tracking-widest">
            {currentPost.category}
          </span>
          <div className="flex items-center text-zinc-400 text-[10px] font-bold">
            <Clock size={12} className="ml-1" />
            {new Date(currentPost.timestamp).toLocaleDateString('fa-AF')}
          </div>
          <div className="flex items-center text-zinc-400 text-[10px] font-bold">
            <Eye size={12} className="ml-1" />
            {currentPost.views || 0} لیدنې
          </div>
        </div>
        <h1 className="text-4xl font-black leading-tight text-zinc-800 dark:text-zinc-100">
          {currentPost.title}
        </h1>
        
        {isAdmin && (
          <div className="flex items-center space-x-3 space-x-reverse pt-2">
            <button 
              onClick={handleAdminEdit}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-50 dark:bg-blue-900/10 text-blue-500 rounded-xl text-xs font-bold active:scale-95 transition-transform"
            >
              <Edit3 size={14} />
              <span>ایډیټ</span>
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl text-xs font-bold active:scale-95 transition-transform"
            >
              <Trash2 size={14} />
              <span>حذف</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-zinc-900 rounded-[40px] p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm mx-4"
      >
        <div className="prose dark:prose-invert max-w-none">
          <p 
            className="leading-loose text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-medium transition-all duration-300"
            style={{ fontSize: `${fontSize}px` }}
          >
            {displayContent}
          </p>
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 text-[var(--accent-color)] font-bold text-sm flex items-center hover:underline"
            >
              {isExpanded ? 'لږ ښودل' : 'نور ولولئ...'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Hashtags Section */}
      {hashtags.length > 0 && (
        <div className="px-6 flex flex-wrap gap-2">
          {hashtags.map((tag, i) => (
            <button
              key={i}
              onClick={() => setSelectedTag(tag)}
              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl text-xs font-bold hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] transition-colors flex items-center gap-1"
            >
              <Hash size={12} />
              {tag.replace('#', '')}
            </button>
          ))}
        </div>
      )}

      {/* Comments Link Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors mx-4"
        onClick={() => navigate(`/comments/${currentPost.id}`)}
      >
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-zinc-800 dark:text-zinc-100">نظریات او کمنټونه</h2>
            <p className="text-xs font-bold text-zinc-400 mt-0.5">
              {commentsList.length > 0 ? `${commentsList.length} کمنټونه شوي دي` : 'تر اوسه کوم کمنټ نه دی شوی'}
            </p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
          <ChevronLeft size={20} />
        </div>
      </motion.div>

      {/* Action Bar - Absolute Bottom */}
      <div className="fixed bottom-6 left-4 right-4 z-40 mb-safe">
        <div className="max-w-md mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/20 dark:border-zinc-800/20 rounded-[32px] shadow-2xl p-2">
          <div className="flex items-center justify-around">
            <button 
              onClick={handleLike}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                liked ? 'text-[var(--accent-color)] scale-110' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <ThumbsUp size={20} fill={liked ? "currentColor" : "none"} />
              <span className="text-[9px] font-black mt-1">{currentPost.likes} لایک</span>
            </button>

            <button 
              onClick={handleCopy}
              className="flex flex-col items-center p-3 text-zinc-500 rounded-2xl transition-all"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={20} className="text-emerald-500" />
                  </motion.div>
                ) : (
                  <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="text-[9px] font-black mt-1">{copied ? 'کاپي شو' : 'کاپي'}</span>
            </button>

            <button 
              onClick={handleShare}
              className="flex flex-col items-center p-3 text-zinc-500 rounded-2xl transition-all"
            >
              <Share2 size={20} />
              <span className="text-[9px] font-black mt-1">شریکول</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tag Action Menu */}
      <AnimatePresence>
        {selectedTag && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={() => setSelectedTag(null)} />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 z-[110] bg-white dark:bg-zinc-900 rounded-t-[40px] p-6 pb-safe shadow-2xl border-t border-zinc-100 dark:border-zinc-800"
            >
              <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center">
                      <Hash size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{selectedTag}</h3>
                      <p className="text-xs font-bold text-zinc-400">د دې ټګ لپاره پلټنه وکړئ</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTag(null)} className="p-2 text-zinc-400">
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => handleTagAction('category')}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between hover:bg-[var(--accent-color)] hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutGrid size={20} className="text-zinc-400 group-hover:text-white" />
                      <span className="font-bold">په دې کټګورۍ کې</span>
                    </div>
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={() => handleTagAction('all')}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between hover:bg-[var(--accent-color)] hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe size={20} className="text-zinc-400 group-hover:text-white" />
                      <span className="font-bold">په ټول اپلیکیشن کې</span>
                    </div>
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="مطلب حذف کول"
        message="ایا تاسو ډاډه یاست چې دا مطلب حذف کوئ؟ دا عمل بیرته نشي ګرځېدلی."
        onConfirm={handleAdminDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <NetworkDialog 
        isOpen={showNetworkDialog} 
        onClose={() => setShowNetworkDialog(false)} 
      />
    </motion.div>
  );
};

export default Player;
