import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert, 
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import {
  addTaskToFirebase,
  deleteTaskFromFirebase,
  updateTaskInFirebase,
} from "../store/tasksSlice";
import { commonStyles, colors } from "../styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";

const selectTasks = (state) => state.tasks.tasks;
const selectPendingTasks = createSelector([selectTasks], (tasks) =>
  tasks.filter((task) => !task.completed)
);

export default function HomeScreen({ navigation }) {
  const [inputText, setInputText] = useState("");
  const dispatch = useDispatch();

  const pendingTasks = useSelector(selectPendingTasks);
  const taskStatus = useSelector((state) => state.tasks.status);
  const taskError = useSelector((state) => state.tasks.error);

  const handleAddTask = () => {
    if (inputText.trim().length > 0) {
      dispatch(addTaskToFirebase({ text: inputText.trim() }))
        .unwrap()
        .then(() => {
          setInputText("");
        })
        .catch((error) => {
          Alert.alert("Error", "No se pudo añadir la tarea.");
        });
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTaskFromFirebase(id))
      .unwrap()
      .then(() => {})
      .catch((error) => {
        Alert.alert("Error", "No se pudo eliminar la tarea.");
      });
  };

  const handleToggleComplete = (task) => {
    dispatch(updateTaskInFirebase({ id: task.id, completed: !task.completed }))
      .unwrap()
      .then(() => {})
      .catch((error) => {
        Alert.alert("Error", "No se pudo actualizar el estado de la tarea.");
      });
  };

  const goToDetail = (taskId) => {
    navigation.navigate("TaskDetail", { taskId: taskId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToDetail(item.id)}>
      <View style={styles.taskItem}>
        <View style={styles.taskTextContainer}>
          <Text style={commonStyles.text}>{item.text}</Text>
          {item.dueDate && (
            <Text style={styles.dueDateText}>
              Vence: {new Date(item.dueDate).toLocaleDateString()}{" "}
              {new Date(item.dueDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
          {item.locationAddress && (
            <Text style={styles.locationText}>
              <Ionicons
                name="location-outline"
                size={12}
                color={colors.darkGrey}
              />{" "}
              {item.locationAddress.substring(0, 35)}...
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleToggleComplete(item);
          }}
          style={styles.actionButton}
        >
          <Ionicons name="ellipse-outline" size={22} color={colors.warning} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteTask(item.id);
          }}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[commonStyles.input, styles.inputFlex]}
          placeholder="Nueva tarea pendiente..."
          value={inputText}
          onChangeText={setInputText}
          editable={taskStatus !== "loading"}
        />
        <Button
          title="Añadir"
          onPress={handleAddTask}
          color={colors.primary}
          disabled={taskStatus === "loading"}
        />
      </View>

      {taskStatus === "loading" && pendingTasks.length === 0 && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {taskError && (
        <Text style={commonStyles.errorText}>Error: {taskError}</Text>
      )}

      {pendingTasks.length === 0 && taskStatus !== "loading" ? (
        <View style={styles.emptyContainer}>
          <Text style={commonStyles.text}>No hay tareas pendientes.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  inputFlex: { flex: 1, marginRight: 10, marginBottom: 0 },
  list: { flex: 1, marginTop: 10 },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    paddingHorizontal: 5,
  },
  taskTextContainer: { flex: 1, marginRight: 10 },
  dueDateText: { fontSize: 12, color: colors.darkGrey, marginTop: 4 },
  locationText: { fontSize: 11, color: colors.darkGrey, marginTop: 2 },
  actionButton: { padding: 10, marginLeft: 5 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
