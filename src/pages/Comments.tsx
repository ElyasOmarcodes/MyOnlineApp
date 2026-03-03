import React, { useState, useEffect, useRef } from 'react';
import { useContent, Comment } from '../context/ContentContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Send, User, MessageSquare, Heart, Edit3, Trash2, XCircle, CornerDownLeft, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';

const Comments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, currentUser, addComment, editComment, deleteComment, likeComment, isAdmin } = useContent();
  
  const post = posts.find(p => p.id === id);
  const comments = post?.comments ? Object.entries(post.comments).map(([key, value]) => ({ id: key, ...value })).sort((a, b) => a.timestamp - b.timestamp) : [];
  
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [activeMenuCommentId, setActiveMenuCommentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [comments.length]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <MessageSquare size={48} className="text-zinc-300" />
        <p className="text-zinc-500 font-bold">مطلب ونه موندل شو</p>
        <button onClick={() => navigate(-1)} className="text-[var(--accent-color)] font-bold">بېرته تګ</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      if (editingCommentId) {
        await editComment(post.id, editingCommentId, newComment);
        setEditingCommentId(null);
      } else {
        await addComment(post.id, newComment, replyingToId || undefined);
        setReplyingToId(null);
      }
      setNewComment('');
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setNewComment(comment.text);
    setEditingCommentId(comment.id);
    setReplyingToId(null);
    setActiveMenuCommentId(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleReply = (comment: Comment) => {
    setReplyingToId(comment.id);
    setEditingCommentId(null);
    setNewComment('');
    setActiveMenuCommentId(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCopy = (comment: Comment) => {
    navigator.clipboard.writeText(comment.text);
    setCopiedId(comment.id);
    setActiveMenuCommentId(null);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (commentToDelete) {
      await deleteComment(post.id, commentToDelete);
      setCommentToDelete(null);
    }
  };

  const cancelAction = () => {
    setNewComment('');
    setEditingCommentId(null);
    setReplyingToId(null);
  };

  const renderComment = (comment: Comment) => {
    const isOwner = currentUser?.id === comment.userId;
    const canEdit = isOwner || isAdmin;
    const hasLiked = currentUser && comment.likedBy && comment.likedBy[currentUser.id];
    const parentComment = comment.parentId ? comments.find(c => c.id === comment.parentId) : null;

    return (
      <motion.div 
        key={comment.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        {/* Drag to reply indicator */}
        <div className="absolute inset-y-0 -left-12 flex items-center text-[var(--accent-color)] opacity-0 group-active:opacity-100 transition-opacity">
          <CornerDownLeft size={24} />
        </div>

        <motion.div 
          drag="x"
          dragConstraints={{ left: 0, right: 80 }}
          dragElastic={0.1}
          dragSnapToOrigin={true}
          onDragEnd={(_, info) => {
            if (info.offset.x > 50) {
              handleReply(comment);
            }
          }}
          onClick={() => setActiveMenuCommentId(activeMenuCommentId === comment.id ? null : comment.id)}
          className={`relative bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all active:scale-[0.98] ${activeMenuCommentId === comment.id ? 'ring-2 ring-[var(--accent-color)]/30' : ''}`}
        >
          {/* Parent Reply Preview */}
          {parentComment && (
            <div 
              className="mb-2 p-2 bg-zinc-50 dark:bg-black/40 rounded-xl border-r-4 text-xs"
              style={{ borderRightColor: parentComment.userColor || 'var(--accent-color)' }}
            >
              <span className="font-bold block mb-0.5" style={{ color: parentComment.userColor }}>{parentComment.userName}</span>
              <p className="text-zinc-500 truncate">{parentComment.text}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white shadow-sm"
                style={{ backgroundColor: comment.userColor || 'var(--accent-color)' }}
              >
                {comment.userName.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-sm block" style={{ color: comment.userColor }}>{comment.userName}</span>
                <span className="text-[10px] text-zinc-400 block">{new Date(comment.timestamp).toLocaleTimeString('fa-AF', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 space-x-reverse">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  likeComment(post.id, comment.id);
                }}
                className={`flex items-center space-x-1 space-x-reverse px-2 py-1 rounded-lg transition-colors ${hasLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
              >
                <Heart size={14} fill={hasLiked ? "currentColor" : "none"} />
                <span className="text-xs font-bold">{comment.likes || 0}</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
          
          {copiedId === comment.id && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 animate-bounce">
              <Check size={10} /> کاپي شو
            </div>
          )}
        </motion.div>

        {/* Telegram-style Context Menu */}
        <AnimatePresence>
          {activeMenuCommentId === comment.id && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setActiveMenuCommentId(null)} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute left-4 top-4 z-[70] bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-700 p-1 min-w-[140px] overflow-hidden"
              >
                <button 
                  onClick={() => handleReply(comment)}
                  className="w-full text-right px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl flex items-center justify-between text-sm font-bold transition-colors"
                >
                  <span>ځواب</span>
                  <CornerDownLeft size={16} className="text-zinc-400" />
                </button>
                <button 
                  onClick={() => handleCopy(comment)}
                  className="w-full text-right px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl flex items-center justify-between text-sm font-bold transition-colors"
                >
                  <span>کاپي</span>
                  <Copy size={16} className="text-zinc-400" />
                </button>
                {canEdit && (
                  <>
                    <div className="h-[1px] bg-zinc-100 dark:bg-zinc-700 my-1 mx-2" />
                    <button 
                      onClick={() => handleEdit(comment)}
                      className="w-full text-right px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl flex items-center justify-between text-sm font-bold text-blue-500 transition-colors"
                    >
                      <span>ایډیټ</span>
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => { setCommentToDelete(comment.id); setActiveMenuCommentId(null); }}
                      className="w-full text-right px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl flex items-center justify-between text-sm font-bold text-red-500 transition-colors"
                    >
                      <span>حذف</span>
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-black overflow-hidden">
      {/* Top Navigation - Pinned */}
      <div className="pt-safe bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 z-50">
        <div className="max-w-md mx-auto px-4 pb-3 pt-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-500 active:scale-90 transition-transform"
          >
            <ChevronRight size={24} />
          </button>
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">کمنټونه</span>
            <div className="text-sm font-bold mt-1">{comments.length} کمنټونه</div>
          </div>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Comments List - Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
        {comments.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
              <MessageSquare size={24} />
            </div>
            <p className="text-zinc-500 font-bold text-sm">تر اوسه کوم کمنټ نه دی شوی</p>
            <p className="text-xs text-zinc-400">لومړی کس شئ چې کمنټ لیکي!</p>
          </div>
        ) : (
          <>
            {comments.map(comment => renderComment(comment))}
            <div ref={scrollRef} className="h-4" />
          </>
        )}
      </div>

      {/* Comment Input Fixed at Bottom */}
      <div className="pb-safe bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto">
          <AnimatePresence>
            {(editingCommentId || replyingToId) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-between bg-zinc-50 dark:bg-black p-3 rounded-2xl mb-3 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex items-center space-x-2 space-x-reverse text-sm overflow-hidden">
                  <div className="w-1 h-8 bg-[var(--accent-color)] rounded-full shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[var(--accent-color)] block text-xs">
                      {editingCommentId ? 'کمنټ ایډیټ کول' : `ځواب: ${comments.find(c => c.id === replyingToId)?.userName}`}
                    </span>
                    <p className="text-zinc-500 text-xs truncate">
                      {editingCommentId ? comments.find(c => c.id === editingCommentId)?.text : comments.find(c => c.id === replyingToId)?.text}
                    </p>
                  </div>
                </div>
                <button onClick={cancelAction} className="text-zinc-400 hover:text-red-500 p-1 shrink-0">
                  <XCircle size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex items-center space-x-2 space-x-reverse">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="خپل نظر ولیکئ..."
              className="flex-1 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] transition-all text-sm font-medium"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-[var(--accent-color)] text-white p-3 rounded-2xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-[var(--accent-color)]/20"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={20} className="rotate-180" />
              )}
            </button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!commentToDelete}
        title="کمنټ حذف کول"
        message="ایا تاسو ډاډه یاست چې دا کمنټ حذف کوئ؟"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCommentToDelete(null)}
      />
    </div>
  );
};

export default Comments;
