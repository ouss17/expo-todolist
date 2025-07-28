import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface AddCategoryModalProps {
  visible: boolean;
  newCategory: string;
  setNewCategory: (v: string) => void;
  onAddCategory: () => void;
  onClose: () => void;
}

export default function AddCategoryModal({
  visible, newCategory, setNewCategory, onAddCategory, onClose
}: AddCategoryModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nouvelle catégorie</Text>
          <TextInput
            placeholder="Nom de la catégorie"
            value={newCategory}
            onChangeText={setNewCategory}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={onAddCategory}
          />
          <TouchableOpacity onPress={onAddCategory} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Annuler</Text>
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
  saveBtn: { backgroundColor: '#1D3D47', padding: 12, borderRadius: 8, marginTop: 8, width: '100%', alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  closeBtn: { marginTop: 12, padding: 8 },
  closeBtnText: { color: '#1D3D47', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginVertical: 4, width: '100%' },
});