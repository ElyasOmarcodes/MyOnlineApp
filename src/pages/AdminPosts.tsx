import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  FileText, 
  ArrowRight, 
  Send, 
  Edit3, 
  XCircle, 
  AlertCircle, 
  CheckCircle2, 
  Tag, 
  ChevronDown,
  Trash2,
  Calendar
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminPosts: React.FC = () => {
  const navigate = useNavigate();
  const { addPost, updatePost, deletePost, posts, isAdmin, categories } = useContent();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'عمومي');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (!isAdmin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('مهرباني وکړئ ټول ځایونه ډک کړئ');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (editingId) {
        await updatePost(editingId, title, content, category);
        setSuccess('مطلب په بریالیتوب سره ایډیټ شو');
      } else {
        await addPost(title, content, category);
        setSuccess('مطلب په بریالیتوب سره خپور شو');
      }
      setTitle('');
      setContent('');
      setCategory(categories[0]?.name || 'عمومي');
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('د مطلب په خپرولو کې ستونزه راغله');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setEditingId(post.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setSuccess('مطلب حذف شو');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('د حذف کولو پر مهال تېروتنه وشوه');
      }
      setPostToDelete(null);
    }
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setCategory(categories[0]?.name || 'عمومي');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl active:scale-90 transition-all">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-2xl font-black">مطالب مدیریت</h1>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`p-3 rounded-2xl flex items-center space-x-2 space-x-reverse transition-all active:scale-95 ${showForm ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500' : 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/20'}`}
        >
          {showForm ? <XCircle size={20} /> : <PlusCircle size={20} />}
          <span className="text-sm font-bold">{showForm ? 'بندول' : 'نوی مطلب'}</span>
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-4">د مطلب سرلیک</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold"
                      placeholder="دلته سرلیک ولیکئ..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-4">کټګوري</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold appearance-none cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-400">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-4">د مطلب متن</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-[24px] py-4 px-6 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all leading-relaxed font-medium"
                      placeholder="خپل مطلب په تفصیل سره دلته ولیکئ..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[var(--accent-color)] text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 space-x-reverse active:scale-[0.98] transition-all"
                  >
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editingId ? <Edit3 size={18} /> : <Send size={18} />}
                    <span>{editingId ? 'تغیرات خوندي کړئ' : 'خپور کړئ'}</span>
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold px-6 rounded-2xl active:scale-[0.98] transition-all"
                    >
                      لغوه
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">خپاره شوي مطالب ({posts.length})</h2>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <motion.div
              layout
              key={post.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0 ml-4">
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 truncate">{post.title}</h3>
                <div className="flex items-center space-x-3 space-x-reverse mt-1">
                  <span className="text-[10px] font-black text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2 py-0.5 rounded-full">{post.category}</span>
                  <div className="flex items-center text-[10px] text-zinc-400 font-medium">
                    <Calendar size={10} className="ml-1" />
                    {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => setPostToDelete(post.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] border border-dashed border-zinc-200 dark:border-zinc-800">
              <FileText size={40} className="mx-auto text-zinc-300 mb-3" />
              <p className="text-zinc-400 font-medium">تر اوسه کوم مطلب نشته</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!postToDelete}
        title="مطلب حذف کول"
        message="ایا تاسو ډاډه یاست چې دا مطلب حذف کوئ؟ دا عمل بیرته نشي ګرځېدلی."
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

export default AdminPosts;
