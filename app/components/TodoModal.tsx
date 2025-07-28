import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { Todo } from '../redux/todosSlice';
import type { Category } from '../redux/categoriesSlice';
import { Picker } from '@react-native-picker/picker';

interface TodoModalProps {
  visible: boolean;
  todo: Todo | null;
  categories: Category[];
  onClose: () => void;
  onEdit: (updated: Partial<Todo>) => void;
}

export default function TodoModal({ visible, todo, categories, onClose, onEdit }: TodoModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo?.title || '');
  const [text, setText] = useState(todo?.text || '');
  const [dueDate, setDueDate] = useState<Date | null>(todo?.dueDate ? new Date(todo.dueDate) : null);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [category, setCategory] = useState(todo?.category || '');

  // Remet à jour les champs si la todo change
  React.useEffect(() => {
    setTitle(todo?.title || '');
    setText(todo?.text || '');
    setDueDate(todo?.dueDate ? new Date(todo.dueDate) : null);
    setCategory(todo?.category || '');
  }, [todo]);

  if (!todo) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isEditing ? (
            <>
              <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Titre" />
              <TextInput value={text} onChangeText={setText} style={styles.input} placeholder="Description" multiline />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDate(true)}>
                  <Text style={styles.dateBtnText}>
                    {dueDate ? dueDate.toLocaleDateString() : 'Date butoir'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateBtn} onPress={() => setShowTime(true)}>
                  <Text style={styles.dateBtnText}>
                    {dueDate ? dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Heure'}
                  </Text>
                </TouchableOpacity>
              </View>
              {showDate && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDate(false);
                    if (selectedDate) {
                      const newDate = dueDate ? new Date(dueDate) : new Date();
                      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                      setDueDate(newDate);
                    }
                  }}
                />
              )}
              {showTime && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(_, selectedTime) => {
                    setShowTime(false);
                    if (selectedTime) {
                      const newDate = dueDate ? new Date(dueDate) : new Date();
                      newDate.setHours(selectedTime.getHours());
                      newDate.setMinutes(selectedTime.getMinutes());
                      setDueDate(newDate);
                    }
                  }}
                />
              )}
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: 8, marginVertical: 8 }}
              >
                <Picker.Item label="Choisir une catégorie" value="" />
                {categories.map(cat => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.name} color={cat.color} />
                ))}
              </Picker>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  onEdit({
                    id: todo.id,
                    title,
                    text,
                    dueDate: dueDate ? dueDate.toISOString() : undefined,
                    category,
                  });
                  setIsEditing(false);
                }}
              >
                <Text style={styles.saveBtnText}>Enregistrer</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>{todo.title}</Text>
              <Text style={styles.modalDate}>Créée le : {new Date(todo.createdAt).toLocaleString()}</Text>
              {todo.dueDate && (
                <Text style={styles.modalDate}>À faire avant : {new Date(todo.dueDate).toLocaleString()}</Text>
              )}
              <Text style={styles.modalText}>{todo.text}</Text>
              {todo.category && (
                <Text style={styles.modalCategory}>Catégorie : {todo.category}</Text>
              )}
              <TouchableOpacity style={styles.saveBtn} onPress={() => setIsEditing(true)}>
                <Text style={styles.saveBtnText}>Modifier</Text>
              </TouchableOpacity>
            </>
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginVertical: 4, width: '100%' },
  dateBtn: {
    backgroundColor: '#f0f0f0', borderRadius: 8, padding: 12, marginVertical: 4,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc',
  },
  dateBtnText: { fontSize: 16, color: '#333' },
  saveBtn: {
    backgroundColor: '#1D3D47', borderRadius: 8, padding: 12, marginTop: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
});