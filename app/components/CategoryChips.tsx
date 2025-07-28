import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Category } from '../redux/categoriesSlice';

interface CategoryChipsProps {
  categories: Category[];
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  theme: 'white' | 'dark' | 'blue';
  onAddCategory: () => void;
  THEMES: Record<string, { backgroundColor: string; color: string }>;
}

export default function CategoryChips({
  categories,
  categoryFilter,
  setCategoryFilter,
  theme,
  onAddCategory,
  THEMES
}: CategoryChipsProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
      <TouchableOpacity
        style={[
          styles.categoryChip,
          { backgroundColor: THEMES[theme].backgroundColor },
          !categoryFilter && styles.categoryChipSelected,
        ]}
        onPress={() => setCategoryFilter('')}
      >
        <Text style={[
          styles.categoryChipText,
          { color: THEMES[theme].color },
          !categoryFilter && styles.categoryChipTextSelected
        ]}>
          Toutes
        </Text>
      </TouchableOpacity>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.categoryChip,
            { backgroundColor: cat.color },
            categoryFilter === cat.name && styles.categoryChipSelected,
          ]}
          onPress={() => setCategoryFilter(cat.name)}
        >
          <Text style={[
            styles.categoryChipText,
            categoryFilter === cat.name && styles.categoryChipTextSelected
          ]}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[
          styles.categoryChip,
          { backgroundColor: '#FF9800', marginLeft: 8, borderColor: '#FF9800' }
        ]}
        onPress={onAddCategory}
      >
        <Text style={[styles.categoryChipText, { color: '#fff', fontWeight: 'bold' }]}>
          Ajouter une catégorie
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryChip: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, margin: 4,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc',
  },
  categoryChipSelected: {
    backgroundColor: '#1D3D47', borderColor: '#1D3D47',
  },
  categoryChipText: {
    fontSize: 14, color: '#333',
  },
  categoryChipTextSelected: {
    color: '#fff', fontWeight: 'bold',
  },
});