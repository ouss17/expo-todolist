import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo } from '../redux/todosSlice';
import type { Todo } from '../redux/todosSlice';

interface TodoListProps {
  todos: Todo[];
  onPress: (todo: Todo) => void;
}

export default function TodoList({ todos, onPress }: TodoListProps) {
  const dispatch = useDispatch();

  return (
    <FlatList
      data={todos}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {/* Bouton marquer comme fait */}
          <TouchableOpacity
            onPress={() => dispatch(toggleTodo(item.id))}
            style={{ marginRight: 8, marginLeft: 8 }}
          >
            <MaterialIcons
              name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={item.completed ? '#4CAF50' : '#aaa'}
            />
          </TouchableOpacity>
          {/* Todo principale */}
          <TouchableOpacity
            style={[
              styles.todoItem,
              {
                backgroundColor:
                  !item.completed && item.dueDate && new Date(item.dueDate) < new Date()
                    ? '#FFCDD2' // rouge clair si en retard
                    : item.color || '#A1CEDC',
                flex: 1,
                opacity: item.completed ? 0.5 : 1,
              },
            ]}
            onPress={() => onPress(item)}
          >
            <Text
              style={[
                styles.todoTitle,
                item.completed && styles.todoTitleDone
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.todoCreatedAt}>{new Date(item.createdAt).toLocaleString()}</Text>
            {item.dueDate ? (
              <Text style={styles.todoDueDate}>À faire avant : {new Date(item.dueDate).toLocaleString()}</Text>
            ) : null}
          </TouchableOpacity>
          {/* Bouton suppression */}
          <TouchableOpacity
            onPress={() => {
              // Confirmation avant suppression
              Alert.alert(
                'Supprimer la tâche',
                `Supprimer "${item.title}" ?`,
                [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => dispatch(removeTodo(item.id)),
                  },
                ]
              );
            }}
          >
            <MaterialIcons name="delete" size={22} color="#c00" style={{ marginLeft: 4, marginRight: 8 }} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  todoItem: { borderRadius: 12, margin: 8, padding: 16 },
  todoCreatedAt: { fontSize: 12, color: '#555' },
  todoTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 4 },
  todoTitleDone: { textDecorationLine: 'line-through', color: '#888' },
  todoDueDate: { fontSize: 14, color: '#333' },
});