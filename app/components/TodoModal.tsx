import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Todo } from '../redux/todosSlice';

interface TodoModalProps {
  visible: boolean;
  todo: Todo | null;
  onClose: () => void;
}

export default function TodoModal({ visible, todo, onClose }: TodoModalProps) {
  if (!todo) return null;
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{todo.title}</Text>
          <Text style={styles.modalDate}>Créée le : {new Date(todo.createdAt).toLocaleString()}</Text>
          {todo.dueDate && (
            <Text style={styles.modalDate}>À faire avant : {new Date(todo.dueDate).toLocaleString()}</Text>
          )}
          <Text style={styles.modalText}>{todo.text}</Text>
          {todo.category && (
            <Text style={styles.modalCategory}>Catégorie : {todo.category}</Text>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  modalDate: { fontSize: 14, color: '#555', marginBottom: 4 },
  modalText: { fontSize: 16, marginVertical: 8 },
  modalCategory: { fontSize: 14, color: '#1D3D47', marginBottom: 8 },
  closeBtn: { marginTop: 12, padding: 8 },
  closeBtnText: { color: '#1D3D47', fontWeight: 'bold' },
});