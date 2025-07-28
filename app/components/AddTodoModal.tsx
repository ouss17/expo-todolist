import React, { useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { Category } from '../redux/categoriesSlice';

interface AddTodoModalProps {
  visible: boolean;
  title: string;
  setTitle: (v: string) => void;
  text: string;
  setText: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: Category[];
  dueDate: Date | null;
  setDueDate: (d: Date | null) => void;
  showDate: boolean;
  setShowDate: (v: boolean) => void;
  showTime: boolean;
  setShowTime: (v: boolean) => void;
  color: string;
  setColor: (v: string) => void;
  COLOR_PALETTE: string[];
  onAdd: () => void;
  onClose: () => void;
}

export default function AddTodoModal({
  visible, title, setTitle, text, setText, category, setCategory,
  categories, dueDate, setDueDate, showDate, setShowDate, showTime, setShowTime,
  color, setColor, COLOR_PALETTE, onAdd, onClose
}: AddTodoModalProps) {
  const textRef = useRef<TextInput>(null);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nouvelle tâche</Text>
          <TextInput
            placeholder="Titre"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => textRef.current?.focus()}
          />
          <TextInput
            ref={textRef}
            placeholder="Description"
            value={text}
            onChangeText={setText}
            style={styles.input}
          />
          <View style={{ width: '100%', marginVertical: 8 }}>
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              style={{ backgroundColor: '#f0f0f0', borderRadius: 8 }}
            >
              <Picker.Item label="Choisir une catégorie" value="" />
              {categories.map(cat => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.name} color={cat.color} />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowDate(true)}
            >
              <Text style={styles.dateBtnText}>
                {dueDate ? dueDate.toLocaleDateString() : 'Date butoir'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowTime(true)}
            >
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
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginVertical: 8,
              gap: 8,
            }}
          >
            {COLOR_PALETTE.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c, borderWidth: color === c ? 3 : 1, borderColor: '#000' }
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
          <TouchableOpacity onPress={onAdd} style={styles.saveBtn}>
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
  dateBtn: {
    flex: 1, backgroundColor: '#f0f0f0', borderRadius: 8, padding: 12, marginHorizontal: 4,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc',
  },
  dateBtnText: { fontSize: 16, color: '#333' },
  colorCircle: {
    width: 36, height: 36, borderRadius: 18, marginHorizontal: 4,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff',
  },
});