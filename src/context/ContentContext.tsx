import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, push, set, update, remove, query, limitToLast, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: number;
  likes: number;
  likedBy?: Record<string, boolean>;
  views: number;
  comments?: Record<string, Comment>;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
}

interface ContentContextType {
  currentUser: User | null;
  registerUser: (name: string, phone: string) => void;
  updateUser: (name: string, phone: string) => void;
  currentPost: Post | null;
  setCurrentPost: (post: Post | null) => void;
  posts: Post[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  likePost: (id: string) => void;
  incrementViews: (id: string) => void;
  addPost: (title: string, content: string, category: string) => Promise<void>;
  updatePost: (id: string, title: string, content: string, category: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  editComment: (postId: string, commentId: string, text: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  categories: Category[];
  addCategory: (name: string, icon: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('app_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('is_admin') === 'true';
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorites_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
    }
    return [];
  });

  const [viewedPosts, setViewedPosts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('viewed_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Error loading viewed_posts from localStorage', e);
    }
    return [];
  });

  useEffect(() => {
    // Safety timeout to prevent infinite loading if Firebase fails silently
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 seconds max loading

    const postsRef = ref(db, 'posts');
    const unsubscribePosts = onValue(postsRef, (snapshot) => {
      try {
        clearTimeout(safetyTimer);
        const data = snapshot.val();
        if (data) {
          const postsList = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          })).sort((a, b) => b.timestamp - a.timestamp);
          setPosts(postsList);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Error parsing posts:", err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Firebase posts error:", error);
      clearTimeout(safetyTimer);
      setLoading(false);
    });

    const categoriesRef = ref(db, 'categories');
    const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const cats = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            name: value.name || value,
            icon: value.icon || 'BookOpen'
          }));
          setCategories(cats);
        } else {
          // Initialize defaults only if truly empty and not just loading
          const defaultCats = [
            { name: 'عمومي', icon: 'BookOpen' },
            { name: 'حدیث', icon: 'Book' },
            { name: 'قرآن', icon: 'BookOpen' },
            { name: 'اخلاق', icon: 'Heart' },
            { name: 'روژه', icon: 'Moon' }
          ];
          setCategories(defaultCats.map((c, i) => ({ id: `def-${i}`, ...c })));
        }
      } catch (err) {
        console.error("Error parsing categories:", err);
      }
    }, (error) => {
      console.error("Firebase categories error:", error);
    });

    return () => {
      unsubscribePosts();
      unsubscribeCategories();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites_posts', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('viewed_posts', JSON.stringify(viewedPosts));
  }, [viewedPosts]);

  const registerUser = (name: string, phone: string) => {
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      phone
    };
    setCurrentUser(newUser);
    localStorage.setItem('app_user', JSON.stringify(newUser));
  };

  const updateUser = (name: string, phone: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, name, phone };
      setCurrentUser(updatedUser);
      localStorage.setItem('app_user', JSON.stringify(updatedUser));
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const current = Array.isArray(prev) ? prev : [];
      return current.includes(id) ? current.filter(fid => fid !== id) : [...current, id];
    });
  };

  const likePost = async (id: string) => {
    if (!currentUser) return;
    const post = posts.find(p => p.id === id);
    if (post) {
      const likedBy = post.likedBy || {};
      if (likedBy[currentUser.id]) return; // Already liked

      const postRef = ref(db, `posts/${id}`);
      await update(postRef, {
        likes: (post.likes || 0) + 1,
        [`likedBy/${currentUser.id}`]: true
      });
    }
  };

  const incrementViews = async (id: string) => {
    if ((viewedPosts || []).includes(id)) return;

    const post = posts.find(p => p.id === id);
    if (post) {
      const postRef = ref(db, `posts/${id}`);
      await update(postRef, {
        views: (post.views || 0) + 1
      });
      setViewedPosts(prev => [...(Array.isArray(prev) ? prev : []), id]);
    }
  };

  const addPost = async (title: string, content: string, category: string) => {
    const postsRef = ref(db, 'posts');
    const newPostRef = push(postsRef);
    await set(newPostRef, {
      title,
      content,
      category,
      timestamp: Date.now(),
      likes: 0,
      views: 0
    });
  };

  const updatePost = async (id: string, title: string, content: string, category: string) => {
    const postRef = ref(db, `posts/${id}`);
    await update(postRef, {
      title,
      content,
      category
    });
  };

  const deletePost = async (id: string) => {
    const postRef = ref(db, `posts/${id}`);
    await set(postRef, null);
  };

  const addCategory = async (name: string, icon: string) => {
    if (!categories.find(c => c.name === name)) {
      const catRef = ref(db, 'categories');
      await push(catRef, { name, icon });
    }
  };

  const deleteCategory = async (id: string) => {
    const catRef = ref(db, `categories/${id}`);
    await remove(catRef);
  };

  const addComment = async (postId: string, text: string) => {
    if (!currentUser) return;
    const commentsRef = ref(db, `posts/${postId}/comments`);
    const newCommentRef = push(commentsRef);
    await set(newCommentRef, {
      userId: currentUser.id,
      userName: currentUser.name,
      text,
      timestamp: Date.now()
    });
  };

  const editComment = async (postId: string, commentId: string, text: string) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    await update(commentRef, { text });
  };

  const deleteComment = async (postId: string, commentId: string) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    await remove(commentRef);
  };

  const login = (user: string, pass: string) => {
    if (user === 'Elyas412' && pass === 'Omar412') {
      setIsAdmin(true);
      localStorage.setItem('is_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('is_admin');
  };

  const value = React.useMemo(() => ({ 
    currentUser,
    registerUser,
    updateUser,
    currentPost, 
    setCurrentPost, 
    posts, 
    favorites, 
    toggleFavorite,
    likePost,
    incrementViews,
    addPost,
    updatePost,
    deletePost,
    addComment,
    editComment,
    deleteComment,
    categories,
    addCategory,
    deleteCategory,
    loading,
    isAdmin,
    login,
    logout
  }), [
    currentUser, currentPost, posts, favorites, categories, loading, isAdmin
  ]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};

