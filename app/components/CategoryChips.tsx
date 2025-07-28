import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Category } from '../redux/categoriesSlice';

interface CategoryChipsProps {
  categories: Category[];
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  theme: 'white' | 'dark' | 'blue';
  onAddCategory: () => void;
  onDeleteCategory?: (id: string, name: string) => void;
  onDeleteAllTodos?: () => void;
  THEMES: Record<string, { backgroundColor: string; color: string }>;
}

export default function CategoryChips({
  categories,
  categoryFilter,
  setCategoryFilter,
  theme,
  onAddCategory,
  onDeleteCategory,
  onDeleteAllTodos,
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
          Toutes les catégories
        </Text>
      </TouchableOpacity>
      {categories.map(cat => (
        <View key={cat.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
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
          {onDeleteCategory && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Supprimer la catégorie',
                  `Supprimer "${cat.name}" et toutes ses tâches ?`,
                  [
                    { text: 'Annuler', style: 'cancel' },
                    {
                      text: 'Supprimer',
                      style: 'destructive',
                      onPress: () => onDeleteCategory && onDeleteCategory(cat.id, cat.name),
                    },
                  ]
                );
              }}
            >
              <MaterialIcons name="delete" size={20} color="#c00" style={{ marginLeft: -8, marginRight: 4 }} />
            </TouchableOpacity>
          )}
        </View>
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
      {onDeleteAllTodos && (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              categoryFilter ? 'Supprimer toutes les tâches de cette catégorie' : 'Supprimer toutes les tâches',
              categoryFilter
                ? `Supprimer toutes les tâches de "${categoryFilter}" ?`
                : 'Supprimer toutes les tâches de toutes les catégories ?',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Supprimer',
                  style: 'destructive',
                  onPress: onDeleteAllTodos,
                },
              ]
            );
          }}
          style={{ marginRight: 8 }}
        >
          <MaterialIcons name="delete-forever" size={22} color="#c00" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryChip: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, margin: 4,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc',
  },
  categoryChipSelected: {
    backgroundColor: '#7C3AED', // Violet foncé, bien visible
    borderColor: '#7C3AED',
  },
  categoryChipText: {
    fontSize: 14, color: '#333',
  },
  categoryChipTextSelected: {
    color: '#fff', fontWeight: 'bold',
  },
});