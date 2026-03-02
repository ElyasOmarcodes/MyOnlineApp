import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Share as RNShare } from 'react-native';
import { useContent, Post } from '../context/ContentContext';
import { useTheme } from '../context/ThemeContext';
import ConfirmDialog from '../components/ConfirmDialog';
import NetworkDialog from '../components/NetworkDialog';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
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
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Player: React.FC = () => {
  const { currentPost: contextPost, favorites, toggleFavorite, likePost, isAdmin, deletePost, currentUser, checkNetwork } = useContent();
  const { fontSize } = useTheme();
  const navigation = useNavigation<any>();
  const [currentPost, setCurrentPost] = useState(contextPost);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MessageSquare size={40} color="#d1d5db" />
        </View>
        <Text style={styles.emptyText}>هیڅ مطلب نه دی غوره شوی</Text>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>کور پاڼې ته لاړ شئ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCopy = () => {
    // Clipboard not fully supported in RN Web without extra libs, using basic alert for now
    alert('Copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!currentPost) return;
    try {
      await RNShare.share({
        message: `${currentPost.title}\n\n${currentPost.content}\n\nد اسلامي مطالبو اپلیکیشن څخه`,
      });
    } catch (error) {
      console.error('Error sharing', error);
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
      navigation.navigate('Admin');
    }
  };

  const handleAdminEdit = () => {
    navigation.navigate('Admin');
  };

  const commentsList = currentPost?.comments ? Object.entries(currentPost.comments).map(([id, data]) => ({ id, ...data })) : [];

  const MAX_LENGTH = 500;
  const shouldTruncate = currentPost?.content && currentPost.content.length > MAX_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? currentPost.content.substring(0, MAX_LENGTH) + '...' 
    : currentPost?.content;

  const hashtags = currentPost.content.match(/#[^\s#]+/g) || [];

  const handleTagAction = (action: 'post' | 'category' | 'all') => {
    if (!selectedTag) return;
    const tag = selectedTag.replace('#', '');
    
    if (action === 'category') {
      navigation.navigate('Category', { id: currentPost.category, search: tag });
    } else {
      navigation.navigate('Home', { search: tag });
    }
    setSelectedTag(null);
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronRight size={24} color="#6b7280" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerCategory}>{currentPost.category}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{currentPost.title}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.favoriteButton, (favorites || []).includes(currentPost.id) && styles.favoriteButtonActive]}
          onPress={() => toggleFavorite(currentPost.id)}
        >
          <Heart size={24} color={(favorites || []).includes(currentPost.id) ? "#ef4444" : "#6b7280"} fill={(favorites || []).includes(currentPost.id) ? "#ef4444" : "none"} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Content Header */}
        <View style={styles.contentHeader}>
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{currentPost.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={12} color="#9ca3af" style={styles.metaIcon} />
              <Text style={styles.metaText}>{new Date(currentPost.timestamp).toLocaleDateString('fa-AF')}</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={12} color="#9ca3af" style={styles.metaIcon} />
              <Text style={styles.metaText}>{currentPost.views || 0} لیدنې</Text>
            </View>
          </View>
          
          <Text style={styles.mainTitle}>{currentPost.title}</Text>
          
          {isAdmin && (
            <View style={styles.adminActions}>
              <TouchableOpacity style={styles.editButton} onPress={handleAdminEdit}>
                <Edit3 size={14} color="#3b82f6" />
                <Text style={styles.editButtonText}>ایډیټ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteConfirm(true)}>
                <Trash2 size={14} color="#ef4444" />
                <Text style={styles.deleteButtonText}>حذف</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContentCard}>
          <Text style={[styles.contentText, { fontSize }]}>
            {displayContent}
          </Text>
          {shouldTruncate && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.readMoreText}>
                {isExpanded ? 'لږ ښودل' : 'نور ولولئ...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hashtags Section */}
        {hashtags.length > 0 && (
          <View style={styles.hashtagsContainer}>
            {hashtags.map((tag, i) => (
              <TouchableOpacity
                key={i}
                style={styles.hashtagButton}
                onPress={() => setSelectedTag(tag)}
              >
                <Hash size={12} color="#6b7280" />
                <Text style={styles.hashtagText}>{tag.replace('#', '')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Comments Link Section */}
        <TouchableOpacity 
          style={styles.commentsCard}
          onPress={() => navigation.navigate('Comments', { id: currentPost.id })}
        >
          <View style={styles.commentsCardLeft}>
            <View style={styles.commentsIconContainer}>
              <MessageSquare size={24} color="#10b981" />
            </View>
            <View>
              <Text style={styles.commentsTitle}>نظریات او کمنټونه</Text>
              <Text style={styles.commentsSubtitle}>
                {commentsList.length > 0 ? `${commentsList.length} کمنټونه شوي دي` : 'تر اوسه کوم کمنټ نه دی شوی'}
              </Text>
            </View>
          </View>
          <View style={styles.commentsArrowContainer}>
            <ChevronLeft size={20} color="#9ca3af" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Action Bar - Absolute Bottom */}
      <View style={styles.actionBarContainer}>
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <ThumbsUp size={20} color={liked ? "#10b981" : "#6b7280"} fill={liked ? "#10b981" : "none"} />
            <Text style={[styles.actionButtonText, liked && styles.actionButtonTextActive]}>{currentPost.likes} لایک</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            {copied ? <Check size={20} color="#10b981" /> : <Copy size={20} color="#6b7280" />}
            <Text style={styles.actionButtonText}>{copied ? 'کاپي شو' : 'کاپي'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color="#6b7280" />
            <Text style={styles.actionButtonText}>شریکول</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tag Action Menu (Simplified for RN Web) */}
      {selectedTag && (
        <View style={styles.tagMenuOverlay}>
          <View style={styles.tagMenuContainer}>
            <View style={styles.tagMenuHeader}>
              <View style={styles.tagMenuTitleRow}>
                <View style={styles.tagMenuIconContainer}>
                  <Hash size={24} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.tagMenuTitle}>{selectedTag}</Text>
                  <Text style={styles.tagMenuSubtitle}>د دې ټګ لپاره پلټنه وکړئ</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedTag(null)}>
                <XCircle size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.tagMenuOption}
              onPress={() => handleTagAction('category')}
            >
              <View style={styles.tagMenuOptionLeft}>
                <LayoutGrid size={20} color="#9ca3af" />
                <Text style={styles.tagMenuOptionText}>په دې کټګورۍ کې</Text>
              </View>
              <ChevronLeft size={18} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tagMenuOption}
              onPress={() => handleTagAction('all')}
            >
              <View style={styles.tagMenuOptionLeft}>
                <Globe size={20} color="#9ca3af" />
                <Text style={styles.tagMenuOptionText}>په ټول اپلیکیشن کې</Text>
              </View>
              <ChevronLeft size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 24,
  },
  homeButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10b981',
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  favoriteButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  favoriteButtonActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  contentHeader: {
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  categoryBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginLeft: 12,
  },
  metaIcon: {
    marginLeft: 4,
  },
  metaText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  adminActions: {
    flexDirection: 'row-reverse',
    marginTop: 16,
  },
  editButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 12,
  },
  editButtonText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  deleteButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  mainContentCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 24,
  },
  contentText: {
    color: '#4b5563',
    lineHeight: 32,
    textAlign: 'right',
  },
  readMoreText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'right',
  },
  hashtagsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  hashtagButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
    marginBottom: 8,
  },
  hashtagText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  commentsCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  commentsCardLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  commentsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  commentsSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 2,
  },
  commentsArrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBarContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  actionBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 4,
  },
  actionButtonTextActive: {
    color: '#10b981',
  },
  tagMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  tagMenuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    paddingBottom: 48,
  },
  tagMenuHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tagMenuTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  tagMenuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  tagMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  tagMenuSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textAlign: 'right',
  },
  tagMenuOption: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  tagMenuOptionLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  tagMenuOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 12,
  },
});

export default Player;
