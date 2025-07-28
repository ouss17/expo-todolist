import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Todo } from '../redux/todosSlice';

interface TodoListProps {
  todos: Todo[];
  onPress: (todo: Todo) => void;
}

export default function TodoList({ todos, onPress }: TodoListProps) {
  return (
    <FlatList
      data={todos}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.todoItem, { backgroundColor: item.color || '#A1CEDC' }]}
          onPress={() => onPress(item)}
        >
          <Text style={styles.todoCreatedAt}>{new Date(item.createdAt).toLocaleString()}</Text>
          <Text style={styles.todoTitle}>{item.title}</Text>
          {item.dueDate ? (
            <Text style={styles.todoDueDate}>À faire avant : {new Date(item.dueDate).toLocaleString()}</Text>
          ) : null}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  todoItem: { borderRadius: 12, margin: 8, padding: 16 },
  todoCreatedAt: { fontSize: 12, color: '#555' },
  todoTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 4 },
  todoDueDate: { fontSize: 14, color: '#333' },
});