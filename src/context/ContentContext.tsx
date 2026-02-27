import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, push, set, update, remove, query, limitToLast, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';

import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userColor?: string;
  text: string;
  timestamp: number;
  likes?: number;
  likedBy?: Record<string, boolean>;
  parentId?: string;
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
  color: string;
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
  addComment: (postId: string, text: string, parentId?: string) => Promise<void>;
  editComment: (postId: string, commentId: string, text: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
  categories: Category[];
  addCategory: (name: string, icon: string) => Promise<void>;
  updateCategory: (id: string, name: string, icon: string) => Promise<void>;
  reorderCategories: (newOrder: Category[]) => Promise<void>;
  deleteCategory: (id: string, migrateToId?: string) => Promise<void>;
  topPosts: Post[];
  addTopPost: (title: string, content: string) => Promise<void>;
  deleteTopPost: (id: string) => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  checkNetwork: () => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const USER_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f97316', '#06b6d4', '#6366f1', '#14b8a6',
  '#f43f5e', '#84cc16', '#0ea5e9', '#d946ef', '#0891b2'
];

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('cached_posts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [topPosts, setTopPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('cached_top_posts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('cached_categories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  
  const [loading, setLoading] = useState(() => {
    // If we have cached posts, don't show the initial loading spinner
    return localStorage.getItem('cached_posts') === null;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('app_user');
      if (saved) {
        const user = JSON.parse(saved);
        // Ensure existing users get a color if they don't have one
        if (user && !user.color) {
          user.color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
          localStorage.setItem('app_user', JSON.stringify(user));
        }
        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('is_admin') === 'true';
  });

  const checkNetwork = async () => {
    if (Capacitor.isNativePlatform()) {
      const status = await Network.getStatus();
      return status.connected;
    }
    return navigator.onLine;
  };

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
          localStorage.setItem('cached_posts', JSON.stringify(postsList));
        } else {
          setPosts([]);
          localStorage.setItem('cached_posts', JSON.stringify([]));
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

    const topPostsRef = ref(db, 'topPosts');
    const unsubscribeTopPosts = onValue(topPostsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          })).sort((a, b) => b.timestamp - a.timestamp);
          setTopPosts(list);
          localStorage.setItem('cached_top_posts', JSON.stringify(list));
        } else {
          setTopPosts([]);
          localStorage.setItem('cached_top_posts', JSON.stringify([]));
        }
      } catch (err) {
        console.error("Error parsing top posts:", err);
      }
    });

    const categoriesRef = ref(db, 'categories');
    const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const cats = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            name: value.name || value,
            icon: value.icon || 'BookOpen',
            order: value.order || 0
          })).sort((a, b) => a.order - b.order);
          setCategories(cats);
          localStorage.setItem('cached_categories', JSON.stringify(cats));
        } else {
          // Initialize defaults only if truly empty and not just loading
          const defaultCats = [
            { name: 'عمومي', icon: 'BookOpen' },
            { name: 'حدیث', icon: 'Book' },
            { name: 'قرآن', icon: 'BookOpen' },
            { name: 'اخلاق', icon: 'Heart' },
            { name: 'روژه', icon: 'Moon' }
          ];
          const cats = defaultCats.map((c, i) => ({ id: `def-${i}`, ...c }));
          setCategories(cats);
          localStorage.setItem('cached_categories', JSON.stringify(cats));
        }
      } catch (err) {
        console.error("Error parsing categories:", err);
      }
    }, (error) => {
      console.error("Firebase categories error:", error);
    });

    return () => {
      unsubscribePosts();
      unsubscribeTopPosts();
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
    const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      phone,
      color: randomColor
    };
    setCurrentUser(newUser);
    localStorage.setItem('app_user', JSON.stringify(newUser));
  };

  const updateUser = (name: string, phone: string) => {
    if (currentUser) {
      const color = currentUser.color || USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
      const updatedUser = { ...currentUser, name, phone, color };
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
      await push(catRef, { name, icon, order: categories.length });
    }
  };

  const updateCategory = async (id: string, name: string, icon: string) => {
    const catRef = ref(db, `categories/${id}`);
    await update(catRef, { name, icon });
  };

  const reorderCategories = async (newOrder: Category[]) => {
    setCategories(newOrder);
    const updates: Record<string, any> = {};
    newOrder.forEach((cat, index) => {
      updates[`categories/${cat.id}/order`] = index;
    });
    await update(ref(db), updates);
  };

  const deleteCategory = async (id: string, migrateToId?: string) => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return;

    if (migrateToId) {
      const targetCat = categories.find(c => c.id === migrateToId);
      if (targetCat) {
        const updates: Record<string, any> = {};
        posts.forEach(post => {
          if (post.category === catToDelete.name) {
            updates[`posts/${post.id}/category`] = targetCat.name;
          }
        });
        if (Object.keys(updates).length > 0) {
          await update(ref(db), updates);
        }
      }
    } else {
      // Delete posts in this category
      const updates: Record<string, any> = {};
      posts.forEach(post => {
        if (post.category === catToDelete.name) {
          updates[`posts/${post.id}`] = null;
        }
      });
      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
    }

    const catRef = ref(db, `categories/${id}`);
    await remove(catRef);
  };

  const addComment = async (postId: string, text: string, parentId?: string) => {
    if (!currentUser) return;
    const commentsRef = ref(db, `posts/${postId}/comments`);
    const newCommentRef = push(commentsRef);
    const commentData: any = {
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.color || USER_COLORS[0],
      text,
      timestamp: Date.now(),
      likes: 0
    };
    if (parentId) {
      commentData.parentId = parentId;
    }
    await set(newCommentRef, commentData);
  };

  const likeComment = async (postId: string, commentId: string) => {
    if (!currentUser) return;
    const post = posts.find(p => p.id === postId);
    if (post && post.comments && post.comments[commentId]) {
      const comment = post.comments[commentId];
      const likedBy = comment.likedBy || {};
      if (likedBy[currentUser.id]) return; // Already liked

      const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
      await update(commentRef, {
        likes: (comment.likes || 0) + 1,
        [`likedBy/${currentUser.id}`]: true
      });
    }
  };

  const editComment = async (postId: string, commentId: string, text: string) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    await update(commentRef, { text });
  };

  const deleteComment = async (postId: string, commentId: string) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    await remove(commentRef);
  };

  const addTopPost = async (title: string, content: string) => {
    const topRef = ref(db, 'topPosts');
    const newTopRef = push(topRef);
    
    // Maintain only 10 latest
    if (topPosts.length >= 10) {
      const oldest = topPosts[topPosts.length - 1];
      await remove(ref(db, `topPosts/${oldest.id}`));
    }

    await set(newTopRef, {
      title,
      content,
      timestamp: Date.now()
    });
  };

  const deleteTopPost = async (id: string) => {
    await remove(ref(db, `topPosts/${id}`));
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
    likeComment,
    categories,
    addCategory,
    updateCategory,
    reorderCategories,
    deleteCategory,
    topPosts,
    addTopPost,
    deleteTopPost,
    loading,
    isAdmin,
    login,
    logout,
    checkNetwork
  }), [
    currentUser, currentPost, posts, favorites, categories, topPosts, loading, isAdmin
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

