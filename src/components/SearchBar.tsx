import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, SPACING } from '../constants';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = "Rechercher un manga...",
  loading = false,
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  const handleSubmit = () => {
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          editable={!loading}
        />
        
        <View style={styles.buttonContainer}>
          {query.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={handleClear}
              disabled={loading}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.searchButton, loading && styles.searchButtonDisabled]} 
            onPress={handleSearch}
            disabled={loading || !query.trim()}
          >
            <Text style={[styles.searchButtonText, loading && styles.searchButtonTextDisabled]}>
              {loading ? '...' : '🔍'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: SPACING.sm,
    marginRight: SPACING.xs,
  },
  clearButtonText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  searchButtonText: {
    fontSize: 16,
    color: COLORS.surface,
  },
  searchButtonTextDisabled: {
    color: COLORS.background,
  },
});
