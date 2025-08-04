import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store';
import { addTodo, editTodo } from './redux/todosSlice';
import { addCategory, removeCategory } from './redux/categoriesSlice';
import { setTheme } from './redux/backgroundSlice';
import { removeTodosByCategory, removeAllTodos } from './redux/todosSlice';
import type { Todo } from './redux/todosSlice';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import TodoList from './components/TodoList';
import TodoModal from './components/TodoModal';
import AddTodoModal from './components/AddTodoModal';
import CategoryChips from './components/CategoryChips';
import AddCategoryModal from './components/AddCategoryModal';

const THEMES = {
  dark: { backgroundColor: '#222', color: '#fff' },
  white: { backgroundColor: '#81C784', color: '#222' },
  blue: { backgroundColor: '#1D3D47', color: '#A1CEDC' },
};
const APP_TITLE = "ToDo'Réac'tion";
const COLOR_PALETTE = [
  '#A1CEDC', '#FFB6B9', '#F7D6E0', '#B5EAD7', '#FFDAC1',
  '#C7CEEA', '#FF9AA2', '#E2F0CB', '#FFB347', '#B39CD0'
];

export default function HomeScreen() {
  // States principaux
  const [modalVisible, setModalVisible] = useState(false);
  const [detailTodo, setDetailTodo] = useState<any>(null);
  const [addModal, setAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Redux
  const todos = useSelector((state: RootState) => state.todos.todos);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const theme = useSelector((state: RootState) => state.background.theme);
  const dispatch = useDispatch();

  // Handlers
  const handleAddTodo = () => {
    if (!text.trim()) return; // Empêche la validation si la description est vide
    const todoTitle = title.trim()
      ? title
      : text.trim().length > 30
        ? text.trim().slice(0, 30) + '...'
        : text.trim();
    dispatch(addTodo({ title: todoTitle, text, dueDate: dueDate ? dueDate.toISOString() : undefined, category, color }));
    setTitle('');
    setText('');
    setDueDate(null);
    setCategory('');
    setColor(COLOR_PALETTE[0]);
    setAddModal(false);
  };

  const handleAddCategory = () => {
    if (!newCategory) return;
    dispatch(addCategory({ name: newCategory, color }));
    setNewCategory('');
    setAddCategoryModal(false);
  };

  const handleExport = async () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const fileUri = FileSystem.cacheDirectory + 'todolist.json';
    await FileSystem.writeAsStringAsync(fileUri, dataStr, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(fileUri);
  };


  const handleImport = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.[0]?.uri) return;

    try {
      const fileUri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
      const importedTodos = JSON.parse(content);

      Alert.alert(
        'Importer la liste',
        'Que souhaitez-vous faire avec les tâches importées ?',
        [
          {
            text: 'Ajouter aux tâches existantes',
            onPress: () => {
              // Ajoute les todos importées à la liste existante
              importedTodos.forEach((todo: Todo) => {
                // Vérifie si l'id existe déjà pour éviter les doublons
                if (!todos.some(t => t.id === todo.id)) {
                  dispatch(addTodo({
                    title: todo.title,
                    text: todo.text,
                    dueDate: todo.dueDate,
                    category: todo.category,
                    color: todo.color,
                  }));
                }
              });
            },
          },
          {
            text: 'Écraser la liste',
            style: 'destructive',
            onPress: () => {
              // Remplace toute la liste (reset)
              dispatch(removeAllTodos());
              importedTodos.forEach((todo: Todo) => {
                dispatch(addTodo({
                  title: todo.title,
                  text: todo.text,
                  dueDate: todo.dueDate,
                  category: todo.category,
                  color: todo.color,
                }));
              });
            },
          },
          { text: 'Annuler', style: 'cancel' },
        ]
      );
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'importer ce fichier.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEMES[theme].backgroundColor }]}>
      {/* Sélecteur de thème */}
      <View style={styles.themeSelector}>
        <TouchableOpacity onPress={() => dispatch(setTheme('dark'))} style={[styles.themeBtn, { backgroundColor: '#222' }]} />
        <TouchableOpacity onPress={() => dispatch(setTheme('white'))} style={[styles.themeBtn, { backgroundColor: '#81C784' }]} />
        <TouchableOpacity onPress={() => dispatch(setTheme('blue'))} style={[styles.themeBtn, { backgroundColor: '#1D3D47' }]} />
      </View>

      {/* Header avec le titre et le bouton d'importation */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {/* Bouton Import */}
        <TouchableOpacity
          style={{
            marginRight: 12,
            backgroundColor: '#1976D2',
            borderRadius: 12,
            paddingHorizontal: 20,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 90,
          }}
          onPress={handleImport}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Import</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: THEMES[theme].color }]}>{APP_TITLE}</Text>
      </View>

      {/* Chips catégories */}
      <CategoryChips
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        theme={theme}
        onAddCategory={() => setAddCategoryModal(true)}
        onDeleteCategory={(id, name) => {
          dispatch(removeCategory(id));
          dispatch(removeTodosByCategory(name));
        }}
        onDeleteAllTodos={() => {
          if (categoryFilter) {
            dispatch(removeTodosByCategory(categoryFilter));
          } else {
            dispatch(removeAllTodos());
          }
        }}
        THEMES={THEMES}
      />

      {/* Liste des todos */}
      <TodoList
        todos={categoryFilter ? todos.filter(todo => todo.category === categoryFilter) : todos}
        onPress={(todo: Todo) => { setDetailTodo(todo); setModalVisible(true); }}
      />

      {/* Bouton + */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setCategory(categoryFilter); // <-- ici, on pré-sélectionne la catégorie filtrée
          setAddModal(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Bouton Export */}
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            left: 35,
            backgroundColor: '#1976D2',
            width: 90, // plus large
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }
        ]}
        onPress={handleExport}
      >
        <Text style={[styles.addButtonText, { fontSize: 20, textAlign: 'center' }]}>Export</Text>
      </TouchableOpacity>

      {/* Modal détail todo */}
      <TodoModal
        visible={modalVisible}
        todo={detailTodo}
        categories={categories}
        onClose={() => setModalVisible(false)}
        onEdit={updated => {
          if (!detailTodo?.id) return;
          dispatch(editTodo({ ...updated, id: detailTodo.id }));
          setDetailTodo({ ...detailTodo, ...updated, id: detailTodo.id });
        }}
      />

      {/* Modal ajout todo */}
      <AddTodoModal
        visible={addModal}
        title={title}
        setTitle={setTitle}
        text={text}
        setText={setText}
        category={category}
        setCategory={setCategory}
        categories={categories}
        dueDate={dueDate}
        setDueDate={setDueDate}
        showDate={showDate}
        setShowDate={setShowDate}
        showTime={showTime}
        setShowTime={setShowTime}
        color={color}
        setColor={setColor}
        COLOR_PALETTE={COLOR_PALETTE}
        onAdd={handleAddTodo}
        onClose={() => setAddModal(false)}
      />

      {/* Modal ajout catégorie */}
      <AddCategoryModal
        visible={addCategoryModal}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        onAddCategory={handleAddCategory}
        onClose={() => setAddCategoryModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  themeSelector: { flexDirection: 'row', justifyContent: 'center', margin: 16, gap: 16, top: 20 },
  themeBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#ccc' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, marginTop: 8 },
  todoItem: { borderRadius: 12, margin: 8, padding: 16 },
  todoCreatedAt: { fontSize: 12, color: '#555' },
  todoTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 4 },
  todoDueDate: { fontSize: 14, color: '#333' },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 60,
    backgroundColor: '#1D3D47',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40, // Ajoute cette ligne pour mieux centrer verticalement
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  modalDate: { fontSize: 14, color: '#555', marginBottom: 4 },
  modalText: { fontSize: 16, marginVertical: 8 },
  modalCategory: { fontSize: 14, color: '#1D3D47', marginBottom: 8 },
  closeBtn: { marginTop: 12, padding: 8 },
  closeBtnText: { color: '#1D3D47', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#1D3D47', padding: 12, borderRadius: 8, marginTop: 8, width: '100%', alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
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
  addCategoryButton: {
    position: 'absolute', left: 24, bottom: 24, backgroundColor: '#FFB6B9',
    padding: 12, borderRadius: 8, width: '40%', alignItems: 'center', elevation: 4,
  },
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