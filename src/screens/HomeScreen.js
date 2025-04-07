import React, { useState, useCallback } from 'react';
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
import { commonStyles, colors } from '../components/commonStyles';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTask = () => {
    if (inputText.trim().length > 0) {
      const newTask = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        dueDate: null,
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      setInputText('');
    }
  };

  const toggleComplete = (id) => {
     setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const updateTask = useCallback((taskId, newText, newDueDate) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, text: newText ?? task.text, dueDate: newDueDate ?? task.dueDate }
          : task
      )
    );
  }, []);

  const goToDetail = (task) => {
    navigation.navigate('TaskDetail', {
        task: task,
        updateTaskFunction: updateTask
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToDetail(item)}>
        {/* Combina estilo común con específico */}
        <View style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>
            <View style={styles.taskTextContainer}>
                {/* Usa estilo de texto común y aplica decoración */}
                <Text style={[commonStyles.text, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
                {item.text}
                </Text>
                {item.dueDate && (
                <Text style={styles.dueDateText}>
                    Vence: {new Date(item.dueDate).toLocaleDateString()} {new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                )}
            </View>
            <TouchableOpacity onPress={(e) => {e.stopPropagation(); toggleComplete(item.id)}} style={styles.actionButton}>
                 <Text style={{ color: item.completed ? colors.success : colors.warning }}>{item.completed ? '✓' : '○'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => {e.stopPropagation(); deleteTask(item.id)}} style={styles.actionButton}>
                 <Text style={{ color: colors.danger }}>X</Text>
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );

  return (
    // Usa el contenedor común
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.inputContainer}>
        {/* Usa el input común */}
        <TextInput
          style={[commonStyles.input, styles.inputFlex]} // Combina estilos
          placeholder="Nueva tarea..."
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Añadir" onPress={addTask} color={colors.primary}/>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list} // Estilo específico para la lista
      />
    </SafeAreaView>
  );
}

// Estilos específicos de HomeScreen
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10, // Ajusta margen si es necesario
    alignItems: 'center', // Alinea input y botón
  },
  inputFlex: {
      flex: 1, // Hace que el input ocupe el espacio disponible
      marginRight: 10,
      marginBottom: 0, // Sobrescribe el margen inferior de commonStyles.input aquí
  },
  list: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12, // Ajusta padding
    borderBottomWidth: 1,
    borderBottomColor: colors.grey, // Usa color común
  },
  taskItemCompleted: {
      backgroundColor: colors.light, // Fondo ligero para tareas completadas
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  dueDateText: {
    fontSize: 12,
    color: colors.darkGrey, // Usa color común
    marginTop: 4,
  },
  actionButton: {
      padding: 10, // Área táctil más grande
      marginLeft: 5,
  }
});
