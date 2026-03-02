import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  ChevronLeft,
  Calendar,
  FileText
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminTopPosts: React.FC = () => {
  const navigate = useNavigate();
  const { topPosts, addTopPost, deleteTopPost, posts, isAdmin } = useContent();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  if (!isAdmin) return null;

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !topPosts.some(tp => tp.id === post.id)
  );

  const handleAdd = async (post: any) => {
    try {
      await addTopPost(post.title, post.content);
      setSuccess('مطلب په غوره لیست کې اضافه شو');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('تېروتنه رامنځته شوه');
    }
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        await deleteTopPost(postToDelete);
        setSuccess('مطلب له غوره لیست څخه حذف شو');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('تېروتنه رامنځته شوه');
      }
      setPostToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center space-x-4 space-x-reverse">
        <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl active:scale-90 transition-all">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-black">بهترینې خبرې مدیریت</h1>
      </header>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">غوره لیست ({topPosts.length}/10)</h2>
          <p className="text-[10px] text-zinc-400 font-medium">یوازې ۱۰ وروستي ساتل کیږي</p>
        </div>

        <div className="space-y-3">
          {topPosts.map((post) => (
            <motion.div
              layout
              key={post.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-[24px] border border-amber-100 dark:border-amber-900/20 shadow-sm flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0 ml-4">
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 truncate">{post.title}</h3>
                <div className="flex items-center space-x-3 space-x-reverse mt-1">
                  <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">غوره مطلب</span>
                  <div className="flex items-center text-[10px] text-zinc-400 font-medium">
                    <Calendar size={10} className="ml-1" />
                    {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPostToDelete(post.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
          {topPosts.length === 0 && (
            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] border border-dashed border-zinc-200 dark:border-zinc-800">
              <Sparkles size={32} className="mx-auto text-zinc-300 mb-2" />
              <p className="text-zinc-400 text-xs font-medium">تر اوسه کوم غوره مطلب نشته</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">د مطالبو انتخاب</h2>
        </div>

        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="د مطلب پلټنه..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pr-12 pl-6 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 font-bold shadow-sm"
          />
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {filteredPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => handleAdd(post)}
              className="w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between hover:border-[var(--accent-color)] transition-all group"
            >
              <div className="flex-1 min-w-0 text-right ml-4">
                <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-200 truncate">{post.title}</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">{post.category}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors">
                <PlusCircle size={16} />
              </div>
            </button>
          ))}
          {filteredPosts.length === 0 && searchQuery && (
            <p className="text-center py-6 text-zinc-400 text-xs">هیڅ مطلب ونه موندل شو</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!postToDelete}
        title="له غوره لیست څخه حذف"
        message="ایا غواړئ دا مطلب له غوره لیست څخه حذف کړئ؟ (اصلي مطلب به پاتې وي)"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPostToDelete(null)}
      />

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-6 right-6 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 space-x-reverse z-50 ${error ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-bold text-sm">{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTopPosts;
