import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../components/ConfirmDialog';
import NetworkDialog from '../components/NetworkDialog';
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
  Send,
  Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Player: React.FC = () => {
  const { currentPost: contextPost, favorites, toggleFavorite, likePost, isAdmin, deletePost, currentUser, addComment, editComment, deleteComment, checkNetwork } = useContent();
  const { fontSize } = useTheme();
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(contextPost);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Real-time listener for the specific post to ensure comments and likes are always up to date
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && currentUser && currentPost) {
      if (!(await checkNetwork())) {
        setShowNetworkDialog(true);
        return;
      }
      await addComment(currentPost.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleEditCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCommentText.trim() && editingCommentId && currentPost) {
      if (!(await checkNetwork())) {
        setShowNetworkDialog(true);
        return;
      }
      await editComment(currentPost.id, editingCommentId, editCommentText.trim());
      setEditingCommentId(null);
      setEditCommentText('');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (currentPost) {
      if (!(await checkNetwork())) {
        setShowNetworkDialog(true);
        return;
      }
      await deleteComment(currentPost.id, commentId);
    }
  };

  const commentsList = currentPost?.comments ? Object.entries(currentPost.comments).map(([id, data]) => ({ id, ...data })).sort((a, b) => b.timestamp - a.timestamp) : [];

  const MAX_LENGTH = 500;
  const shouldTruncate = currentPost?.content && currentPost.content.length > MAX_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? currentPost.content.substring(0, MAX_LENGTH) + '...' 
    : currentPost?.content;

  return (
    <div className="space-y-8 pb-24 pt-20">
      {/* Top Navigation - Pinned */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-safe bg-zinc-50/90 dark:bg-black/90 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-md mx-auto px-4 pb-3 pt-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-500 active:scale-90 transition-transform relative z-[60]"
          >
            <ChevronRight size={24} />
          </button>
          <div className="text-center absolute left-0 right-0 pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">د مطلب تفصیل</span>
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
        className="space-y-4"
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
        className="bg-white dark:bg-zinc-900 rounded-[40px] p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm"
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

      {/* Comments Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6"
      >
        <div className="flex items-center space-x-2 space-x-reverse">
          <MessageSquare size={24} className="text-[var(--accent-color)]" />
          <h2 className="text-xl font-black">نظریات ({commentsList.length})</h2>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="خپل نظر ولیکئ..."
            className="flex-1 bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] transition-all font-bold text-sm"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="bg-[var(--accent-color)] text-white px-4 rounded-xl flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
          >
            <Send size={18} />
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4 mt-6">
          {commentsList.map(comment => (
            <div key={comment.id} className="bg-zinc-50 dark:bg-black rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center font-black text-lg">
                    {comment.userName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{comment.userName}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{new Date(comment.timestamp).toLocaleString('fa-AF')}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  {(currentUser?.id === comment.userId) && (
                    <button 
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditCommentText(comment.text);
                      }}
                      className="text-zinc-400 hover:text-[var(--accent-color)] p-2"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                  {(isAdmin || currentUser?.id === comment.userId) && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-zinc-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {editingCommentId === comment.id ? (
                <form onSubmit={handleEditCommentSubmit} className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-4 focus:outline-none focus:border-[var(--accent-color)] text-sm"
                  />
                  <button type="submit" className="bg-[var(--accent-color)] text-white px-4 rounded-xl text-sm font-bold">ساتل</button>
                  <button type="button" onClick={() => setEditingCommentId(null)} className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-4 rounded-xl text-sm font-bold">لغوه</button>
                </form>
              ) : (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{comment.text}</p>
              )}
            </div>
          ))}
          {commentsList.length === 0 && (
            <div className="text-center py-8 text-zinc-400 font-bold text-sm">
              تر اوسه کوم نظر نه دی ورکړل شوی. لومړنی کس اوسئ!
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Bar */}
      <div className="fixed bottom-24 left-4 right-4 z-40 mb-safe">
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
    </div>
  );
};

export default Player;
