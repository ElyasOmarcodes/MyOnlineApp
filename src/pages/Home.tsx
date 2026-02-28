import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeft, Search, Sparkles, BookOpen, Clock, Heart, MessageSquare, Eye, Filter } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useContent, Post } from '../context/ContentContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Home: React.FC = () => {
  const { posts, setCurrentPost, favorites, loading, incrementViews, categories, topPosts } = useContent();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'content' | 'both'>('both');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);

  useEffect(() => {
    if (route.params?.search) {
      setSearchQuery(route.params.search);
    }
  }, [route.params?.search]);

  // Auto-scroll top posts
  useEffect(() => {
    if (topPosts && topPosts.length > 1) {
      const timer = setInterval(() => {
        setCurrentTopIndex(prev => (prev + 1) % topPosts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [topPosts]);

  const handleView = (post: Post) => {
    incrementViews(post.id);
    setCurrentPost(post);
    navigation.navigate('Player');
  };

  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (searchType === 'title') return (p.title || '').toLowerCase().includes(q);
    if (searchType === 'content') return (p.content || '').toLowerCase().includes(q);
    return (p.title || '').toLowerCase().includes(q) || (p.content || '').toLowerCase().includes(q);
  });

  // Filter categories based on search results
  const relevantCategories = categories.filter(cat => 
    filteredPosts.some(p => p.category === cat.name)
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const categoryCards = [
    { label: 'ټول مطالب', icon: BookOpen, count: filteredPosts.length, id: 'all' },
    ...(relevantCategories || []).map(cat => ({
      label: cat.name,
      icon: (Icons as any)[cat.icon] || BookOpen,
      count: filteredPosts.filter(p => p.category === cat.name).length,
      id: cat.name
    }))
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Section / Top Posts Carousel */}
      <View style={styles.heroContainer}>
        {topPosts && topPosts.length > 0 ? (
          <TouchableOpacity 
            style={styles.heroCard}
            onPress={() => handleView(topPosts[currentTopIndex])}
          >
            <View style={styles.heroHeader}>
              <View style={styles.heroBadge}>
                <Sparkles size={16} color="#fbbf24" />
                <Text style={styles.heroBadgeText}>غوره مطلب</Text>
              </View>
              <View style={styles.dotsContainer}>
                {topPosts.map((_, idx) => (
                  <View 
                    key={idx} 
                    style={[styles.dot, idx === currentTopIndex && styles.activeDot]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.heroTitle} numberOfLines={2}>{topPosts[currentTopIndex].title}</Text>
            <View style={styles.heroFooter}>
              <Text style={styles.heroContent} numberOfLines={2}>
                {topPosts[currentTopIndex].content}
              </Text>
              <View style={styles.heroIconContainer}>
                <ChevronLeft size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <BookOpen size={20} color="white" />
              <Text style={styles.heroBadgeText}>اسلامي مطالب</Text>
            </View>
            <Text style={styles.heroTitle}>اسلامي مطالب او ښکلې ویناوې</Text>
            <Text style={styles.heroContent}>
              دلته تاسو کولی شئ د روژې او اسلام په اړه غوره لیکنې او مطالب ولولئ.
            </Text>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ټول مطالب ولټوئ..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesGrid}>
        {categoryCards.map((cat, i) => {
          const IconComp = cat.icon;
          return (
            <TouchableOpacity 
              key={i} 
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Category', { id: cat.id })}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIconContainer}>
                  <IconComp size={20} color="#10b981" />
                </View>
                <View style={styles.categoryArrowContainer}>
                  <ChevronLeft size={14} color="#9ca3af" />
                </View>
              </View>
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryCount}>{cat.count} موضوعات</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List Section */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>وروستي خپاره شوي</Text>
          <Text style={styles.listCount}>{filteredPosts.length} مطالب</Text>
        </View>

        <View style={styles.listContainer}>
          {filteredPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => handleView(post)}
            >
              <View style={styles.postIconContainer}>
                <MessageSquare size={24} color="#9ca3af" />
                {(favorites || []).includes(post.id) && (
                  <View style={styles.favoriteBadge}>
                    <Heart size={10} color="white" fill="white" />
                  </View>
                )}
              </View>
              
              <View style={styles.postContentContainer}>
                <View style={styles.postTitleRow}>
                  <View style={styles.postCategoryBadge}>
                    <Text style={styles.postCategoryText}>{post.category}</Text>
                  </View>
                  <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                </View>
                <Text style={styles.postExcerpt} numberOfLines={1}>{post.content}</Text>
              </View>

              <View style={styles.postMetaContainer}>
                <View style={styles.postViewsContainer}>
                  <Eye size={12} color="#9ca3af" />
                  <Text style={styles.postViewsText}>{post.views || 0}</Text>
                </View>
                <ChevronLeft size={20} color="#d1d5db" />
                <Text style={styles.postDateText}>
                  {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: 220,
    marginBottom: 24,
  },
  heroCard: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 32,
    padding: 24,
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  dotsContainer: {
    flexDirection: 'row-reverse',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginLeft: 4,
  },
  activeDot: {
    width: 16,
    backgroundColor: 'white',
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  heroFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroContent: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  heroIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  categoriesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  categoryHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryArrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTextContainer: {
    alignItems: 'flex-end',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  listSection: {
    marginBottom: 24,
  },
  listHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  listCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  listContainer: {
    gap: 12,
  },
  postCard: {
    flexDirection: 'row-reverse',
    backgroundColor: 'white',
    borderRadius: 24,
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
  favoriteBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContentContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  postTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 4,
  },
  postCategoryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  postCategoryText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  postExcerpt: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  postMetaContainer: {
    alignItems: 'flex-start',
    marginRight: 16,
  },
  postViewsContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 4,
  },
  postViewsText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginRight: 4,
  },
  postDateText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
});

export default Home;
