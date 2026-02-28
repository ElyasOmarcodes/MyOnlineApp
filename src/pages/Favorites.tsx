import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useContent, Post } from '../context/ContentContext';
import { useNavigation } from '@react-navigation/native';
import { Heart, HeartOff, ChevronLeft, MessageSquare, Trash2 } from 'lucide-react';

const Favorites: React.FC = () => {
  const { posts, favorites, toggleFavorite, setCurrentPost, incrementViews } = useContent();
  const navigation = useNavigation<any>();

  const favoritePosts = posts.filter(p => (favorites || []).includes(p.id));

  const handleView = (post: Post) => {
    incrementViews(post.id);
    setCurrentPost(post);
    navigation.navigate('Player');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <Heart size={120} color="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.2)" style={styles.headerBgIcon} />
        </View>
        
        <View style={styles.headerContent}>
          <View style={styles.headerBadge}>
            <Heart size={16} color="white" fill="white" />
            <Text style={styles.headerBadgeText}>ستاسو خوښ شوي</Text>
          </View>
          <Text style={styles.headerTitle}>خوښ شوي مطالب</Text>
          <Text style={styles.headerSubtitle}>
            دلته ستاسو د خوښې وړ لیکنو او مطالبو ټولګه ده.
          </Text>
        </View>
      </View>

      {favoritePosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <View style={styles.emptyIconPulse} />
            <View style={styles.emptyIconInner}>
              <HeartOff size={48} color="#d1d5db" />
            </View>
          </View>
          <View style={styles.emptyTextContainer}>
            <Text style={styles.emptyTitle}>لیست خالي دی</Text>
            <Text style={styles.emptySubtitle}>تاسو تر اوسه هیڅ مطلب نه دی خوښ کړی.</Text>
          </View>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>مطالب وګورئ</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listCountText}>{favoritePosts.length} مطالب</Text>
          </View>

          {favoritePosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => handleView(post)}
            >
              <View style={styles.postIconContainer}>
                <MessageSquare size={24} color="#9ca3af" />
              </View>

              <View style={styles.postContent}>
                <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                <Text style={styles.postExcerpt} numberOfLines={1}>{post.content}</Text>
              </View>

              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => toggleFavorite(post.id)}
                >
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
                <ChevronLeft size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 48,
  },
  header: {
    backgroundColor: '#ef4444',
    borderRadius: 32,
    padding: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  headerBackground: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    transform: [{ rotate: '12deg' }],
  },
  headerBgIcon: {
    opacity: 0.5,
  },
  headerContent: {
    zIndex: 10,
  },
  headerBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'right',
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyIconWrapper: {
    width: 128,
    height: 128,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 64,
  },
  emptyIconInner: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 64,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    gap: 16,
  },
  listHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  listCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  postCard: {
    flexDirection: 'row-reverse',
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
  },
  postIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  postContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  postExcerpt: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  postActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginRight: 16,
  },
  deleteButton: {
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    marginLeft: 8,
  },
});

export default Favorites;
