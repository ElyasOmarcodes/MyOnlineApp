import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useContent, Post } from '../context/ContentContext';
import { ChevronRight, Search, Heart, MessageSquare, Eye, ChevronLeft, Filter, X } from 'lucide-react';

type ParamList = {
  Category: { id: string; search?: string };
};

const CategoryPage: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'Category'>>();
  const navigation = useNavigation<any>();
  const id = route.params?.id || 'all';
  const initialSearch = route.params?.search || '';
  
  const { posts, setCurrentPost, favorites, incrementViews } = useContent();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchType, setSearchType] = useState<'title' | 'content' | 'both'>('both');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const categoryName = id === 'all' ? 'ټول مطالب' : id;
  
  const categoryPosts = id === 'all' 
    ? posts 
    : posts.filter(p => p.category === id);

  const filteredPosts = categoryPosts.filter(p => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (searchType === 'title') return (p.title || '').toLowerCase().includes(q);
    if (searchType === 'content') return (p.content || '').toLowerCase().includes(q);
    return (p.title || '').toLowerCase().includes(q) || (p.content || '').toLowerCase().includes(q);
  });

  const handleView = (post: Post) => {
    incrementViews(post.id);
    setCurrentPost(post);
    navigation.navigate('Player');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronRight size={24} color="#717a8b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <View style={styles.searchIconRight}>
            <Search size={20} color="#9ca3af" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="په دې کټګورۍ کې ولټوئ..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.searchActionsLeft}>
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <View style={styles.clearIconBg}>
                  <X size={12} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            )}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                onPress={() => setShowFilterMenu(!showFilterMenu)}
                style={[
                  styles.filterButton,
                  (showFilterMenu || searchType !== 'both') && styles.filterButtonActive
                ]}
              >
                <Filter size={20} color={(showFilterMenu || searchType !== 'both') ? 'var(--accent-color)' : '#9ca3af'} />
              </TouchableOpacity>
              
              {showFilterMenu && (
                <View style={styles.filterMenu}>
                  <Text style={styles.filterMenuTitle}>پلټنه په:</Text>
                  {[
                    { id: 'both', label: 'ټول (عنوان او متن)' },
                    { id: 'title', label: 'یوازې عنوان کې' },
                    { id: 'content', label: 'یوازې متن کې' }
                  ].map(option => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => {
                        setSearchType(option.id as any);
                        setShowFilterMenu(false);
                      }}
                      style={[
                        styles.filterOption,
                        searchType === option.id && styles.filterOptionActive
                      ]}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        searchType === option.id && styles.filterOptionTextActive
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Posts List */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        <View style={styles.listHeader}>
          <Text style={styles.listCountText}>{filteredPosts.length} مطالب موندل شوي</Text>
        </View>

        {filteredPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>هیڅ مطلب ونه موندل شو</Text>
          </View>
        ) : (
          <View style={styles.postsList}>
            {filteredPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => handleView(post)}
                style={styles.postCard}
              >
                <View style={styles.postIconContainer}>
                  <View style={styles.postIconBg}>
                    <MessageSquare size={24} color="#9ca3af" />
                  </View>
                  {(favorites || []).includes(post.id) && (
                    <View style={styles.favoriteBadge}>
                      <Heart size={10} color="white" fill="white" />
                    </View>
                  )}
                </View>
                
                <View style={styles.postTextContainer}>
                  <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                  <Text style={styles.postPreview} numberOfLines={1}>{post.content}</Text>
                </View>

                <View style={styles.postMetaContainer}>
                  <View style={styles.viewsContainer}>
                    <Eye size={12} color="#9ca3af" />
                    <Text style={styles.viewsText}>{post.views || 0}</Text>
                  </View>
                  <ChevronLeft size={20} color="#d1d5db" />
                  <Text style={styles.dateText}>
                    {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  searchContainer: {
    paddingHorizontal: 16,
    zIndex: 20,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#f9fafb',
    borderRadius: 28,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIconRight: {
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    paddingVertical: 12,
  },
  searchActionsLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  clearButton: {
    padding: 8,
  },
  clearIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    position: 'relative',
  },
  filterButton: {
    padding: 8,
    borderRadius: 12,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Fallback accent
  },
  filterMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 8,
    width: 192,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    zIndex: 50,
  },
  filterMenuTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'right',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterOptionActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4b5563',
    textAlign: 'right',
  },
  filterOptionTextActive: {
    color: 'var(--accent-color)', // Fallback needed
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  listHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  listCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  postsList: {
    gap: 12,
  },
  postCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  postIconContainer: {
    position: 'relative',
  },
  postIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
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
  postTextContainer: {
    flex: 1,
    marginRight: 16,
    alignItems: 'flex-end',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  postPreview: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  postMetaContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  viewsContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  dateText: {
    fontSize: 10,
    color: '#9ca3af',
    fontFamily: 'monospace',
  },
});

export default CategoryPage;
