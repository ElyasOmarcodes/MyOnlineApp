import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useContent, Comment } from '../context/ContentContext';
import { ChevronRight, Send, User, MessageSquare, Heart, Edit3, Trash2, XCircle, CornerDownLeft, Copy, Check } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

type ParamList = {
  Comments: { id: string };
};

const Comments: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'Comments'>>();
  const navigation = useNavigation<any>();
  const id = route.params?.id;
  
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
  
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [comments.length]);

  if (!post) {
    return (
      <View style={styles.emptyContainer}>
        <MessageSquare size={48} color="#d1d5db" />
        <Text style={styles.emptyText}>مطلب ونه موندل شو</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>بېرته تګ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSubmit = async () => {
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
    // navigator.clipboard.writeText(comment.text);
    alert('Copied to clipboard!');
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
      <View key={comment.id} style={styles.commentWrapper}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => setActiveMenuCommentId(activeMenuCommentId === comment.id ? null : comment.id)}
          style={[
            styles.commentCard,
            activeMenuCommentId === comment.id && styles.commentCardActive
          ]}
        >
          {/* Parent Reply Preview */}
          {parentComment && (
            <View style={[styles.parentPreview, { borderRightColor: parentComment.userColor || 'var(--accent-color)' }]}>
              <Text style={[styles.parentPreviewName, { color: parentComment.userColor }]}>{parentComment.userName}</Text>
              <Text style={styles.parentPreviewText} numberOfLines={1}>{parentComment.text}</Text>
            </View>
          )}

          <View style={styles.commentHeader}>
            <View style={styles.commentHeaderLeft}>
              <View style={[styles.commentAvatar, { backgroundColor: comment.userColor || 'var(--accent-color)' }]}>
                <Text style={styles.commentAvatarText}>{comment.userName.charAt(0)}</Text>
              </View>
              <View>
                <Text style={[styles.commentName, { color: comment.userColor }]}>{comment.userName}</Text>
                <Text style={styles.commentTime}>
                  {new Date(comment.timestamp).toLocaleTimeString('fa-AF', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                likeComment(post.id, comment.id);
              }}
              style={[styles.likeButton, hasLiked && styles.likeButtonActive]}
            >
              <Heart size={14} color={hasLiked ? "#ef4444" : "#9ca3af"} fill={hasLiked ? "#ef4444" : "none"} />
              <Text style={styles.likeCount}>{comment.likes || 0}</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.commentText}>{comment.text}</Text>
          
          {copiedId === comment.id && (
            <View style={styles.copiedBadge}>
              <Check size={10} color="white" />
              <Text style={styles.copiedBadgeText}>کاپي شو</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Context Menu */}
        {activeMenuCommentId === comment.id && (
          <View style={styles.contextMenuOverlay}>
            <TouchableOpacity style={styles.contextMenuOverlayBg} onPress={() => setActiveMenuCommentId(null)} />
            <View style={styles.contextMenu}>
              <TouchableOpacity style={styles.contextMenuItem} onPress={() => handleReply(comment)}>
                <Text style={styles.contextMenuItemText}>ځواب</Text>
                <CornerDownLeft size={16} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contextMenuItem} onPress={() => handleCopy(comment)}>
                <Text style={styles.contextMenuItemText}>کاپي</Text>
                <Copy size={16} color="#9ca3af" />
              </TouchableOpacity>
              {canEdit && (
                <>
                  <View style={styles.contextMenuDivider} />
                  <TouchableOpacity style={styles.contextMenuItem} onPress={() => handleEdit(comment)}>
                    <Text style={[styles.contextMenuItemText, { color: '#3b82f6' }]}>ایډیټ</Text>
                    <Edit3 size={16} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contextMenuItem} onPress={() => { setCommentToDelete(comment.id); setActiveMenuCommentId(null); }}>
                    <Text style={[styles.contextMenuItemText, { color: '#ef4444' }]}>حذف</Text>
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronRight size={24} color="#717a8b" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>کمنټونه</Text>
          <Text style={styles.headerTitle}>{comments.length} کمنټونه</Text>
        </View>
        <View style={{ width: 48 }} />
      </View>

      {/* Comments List */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.listContainer} 
        contentContainerStyle={styles.listContent}
      >
        {comments.length === 0 ? (
          <View style={styles.emptyListContainer}>
            <View style={styles.emptyListIcon}>
              <MessageSquare size={24} color="#9ca3af" />
            </View>
            <Text style={styles.emptyListTitle}>تر اوسه کوم کمنټ نه دی شوی</Text>
            <Text style={styles.emptyListSubtitle}>لومړی کس شئ چې کمنټ لیکي!</Text>
          </View>
        ) : (
          <>
            {comments.map(comment => renderComment(comment))}
          </>
        )}
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.inputContainer}>
        {(editingCommentId || replyingToId) && (
          <View style={styles.actionPreview}>
            <View style={styles.actionPreviewLeft}>
              <View style={styles.actionPreviewIndicator} />
              <View style={styles.actionPreviewTextContainer}>
                <Text style={styles.actionPreviewTitle}>
                  {editingCommentId ? 'کمنټ ایډیټ کول' : `ځواب: ${comments.find(c => c.id === replyingToId)?.userName}`}
                </Text>
                <Text style={styles.actionPreviewSubtitle} numberOfLines={1}>
                  {editingCommentId ? comments.find(c => c.id === editingCommentId)?.text : comments.find(c => c.id === replyingToId)?.text}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={cancelAction} style={styles.cancelButton}>
              <XCircle size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="خپل نظر ولیکئ..."
            placeholderTextColor="#9ca3af"
            multiline
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!newComment.trim() || isSubmitting}
            style={[
              styles.sendButton,
              (!newComment.trim() || isSubmitting) && styles.sendButtonDisabled
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <View style={{ transform: [{ rotate: '180deg' }] }}>
                <Send size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmDialog
        isOpen={!!commentToDelete}
        title="کمنټ حذف کول"
        message="ایا تاسو ډاډه یاست چې دا کمنټ حذف کوئ؟"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCommentToDelete(null)}
      />
    </KeyboardAvoidingView>
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
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  backLink: {
    color: '#10b981', // Fallback accent
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    zIndex: 10,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyListContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyListIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyListTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  emptyListSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  commentWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  commentCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  commentCardActive: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 2,
  },
  parentPreview: {
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 12,
    borderRightWidth: 4,
    marginBottom: 8,
  },
  parentPreviewName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'right',
  },
  parentPreviewText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  commentHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentHeaderLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  commentAvatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  commentTime: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'right',
  },
  likeButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  likeButtonActive: {
    backgroundColor: '#fef2f2',
  },
  likeCount: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
    color: '#6b7280',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'right',
  },
  copiedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#10b981',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  copiedBadgeText: {
    color: 'white',
    fontSize: 10,
    marginRight: 4,
  },
  contextMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  contextMenuOverlayBg: {
    flex: 1,
  },
  contextMenu: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  contextMenuItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contextMenuItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  contextMenuDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 4,
    marginHorizontal: 8,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 16,
    paddingBottom: 32, // safe area
  },
  actionPreview: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionPreviewLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  actionPreviewIndicator: {
    width: 4,
    height: 32,
    backgroundColor: '#10b981',
    borderRadius: 2,
    marginLeft: 8,
  },
  actionPreviewTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionPreviewTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'right',
  },
  actionPreviewSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  cancelButton: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    textAlign: 'right',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 16,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default Comments;
