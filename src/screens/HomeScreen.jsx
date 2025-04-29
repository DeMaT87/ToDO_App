import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, deleteTask, toggleComplete } from '../store/tasksSlice';
import { commonStyles, colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const dispatch = useDispatch();

  const pendingTasks = useSelector((state) =>
    state.tasks.tasks.filter(task => !task.completed)
  );

  const handleAddTask = () => {
    if (inputText.trim().length > 0) {
      dispatch(addTask({ text: inputText.trim() }));
      setInputText('');
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const goToDetail = (taskId) => {
    navigation.navigate('TaskDetail', { taskId: taskId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToDetail(item.id)}>
        <View style={styles.taskItem}>
            <View style={styles.taskTextContainer}>
                <Text style={commonStyles.text}>
                {item.text}
                </Text>
                {item.dueDate && (
                <Text style={styles.dueDateText}>
                    Vence: {new Date(item.dueDate).toLocaleDateString()} {new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                )}
            </View>
            <TouchableOpacity onPress={(e) => {e.stopPropagation(); handleToggleComplete(item.id)}} style={styles.actionButton}>
                 <Ionicons name="ellipse-outline" size={22} color={colors.warning} />
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => {e.stopPropagation(); handleDeleteTask(item.id)}} style={styles.actionButton}>
                 <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );

  return (
    // Usamos el contenedor común que ya incluye SafeAreaView y padding básico
    <SafeAreaView style={commonStyles.container}>
        {/* Contenedor para el input y el botón de añadir */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[commonStyles.input, styles.inputFlex]}
          placeholder="Nueva tarea pendiente..."
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Añadir" onPress={handleAddTask} color={colors.primary}/>
      </View>

       {/* Muestra mensaje o la lista */}
       {pendingTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
              <Text style={commonStyles.text}>No hay tareas pendientes.</Text>
          </View>
      ) : (
          <FlatList
            data={pendingTasks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.list}
          />
      )}
    </SafeAreaView>
  );
}

// Estilos específicos de HomeScreen
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20, // Aumentamos un poco el margen inferior también
    alignItems: 'center',
    marginTop: 10, // <-- AÑADIDO: Margen superior para bajar el input
    paddingHorizontal: 5, // Añadimos un ligero padding horizontal si es necesario
  },
  inputFlex: {
      flex: 1,
      marginRight: 10,
      marginBottom: 0,
  },
  list: {
    flex: 1,
    marginTop: 10, // Añadimos un margen superior a la lista también
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    paddingHorizontal: 5, // Padding horizontal para los items
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  dueDateText: {
    fontSize: 12,
    color: colors.darkGrey,
    marginTop: 4,
  },
  actionButton: {
      padding: 10,
      marginLeft: 5,
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  }
});
