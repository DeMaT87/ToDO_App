import { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import {
  addTaskToFirebase,
  deleteTaskFromFirebase,
  updateTaskInFirebase,
} from "../store/tasksSlice";
import {
  commonStyles,
  colors,
  spacing,
  borderRadius,
} from "../styles/commonStyles";
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
      .catch((error) => {
        Alert.alert("Error", "No se pudo eliminar la tarea.");
      });
  };

  const handleToggleComplete = (task) => {
    dispatch(updateTaskInFirebase({ id: task.id, completed: !task.completed }))
      .unwrap()
      .catch((error) => {
        Alert.alert("Error", "No se pudo actualizar el estado de la tarea.");
      });
  };

  const goToDetail = (taskId) => {
    navigation.navigate("TaskDetail", { taskId: taskId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => goToDetail(item.id)}
      style={styles.taskItemCard}
    >
      <View style={styles.taskItemContent}>
        <Text style={[commonStyles.text, styles.taskItemText]}>
          {item.text}
        </Text>
        {item.dueDate && (
          <Text style={[commonStyles.textSecondary, styles.taskMetaText]}>
            Vence: {new Date(item.dueDate).toLocaleDateString()}{" "}
            {new Date(item.dueDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
        {item.locationAddress && (
          <View style={styles.locationContainer}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
              style={styles.locationIcon}
            />
            <Text
              style={[
                commonStyles.textSecondary,
                styles.taskMetaText,
                styles.locationText,
              ]}
            >
              {`${item.locationAddress.substring(0, 40)}${
                item.locationAddress.length > 40 ? "..." : ""
              }`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.detailsIndicatorContainer}>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={colors.placeholder}
        />
      </View>
      <View style={styles.taskItemActions}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleToggleComplete(item);
          }}
          style={styles.actionButton}
        >
          <Ionicons name="ellipse-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteTask(item.id);
          }}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.inputSection}>
        <TextInput
          style={[commonStyles.input, styles.inputField]}
          placeholder="Nueva tarea pendiente..."
          placeholderTextColor={colors.placeholder}
          value={inputText}
          onChangeText={setInputText}
          editable={taskStatus !== "loading"}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity
          style={[
            commonStyles.button,
            styles.addButton,
            taskStatus === "loading" && commonStyles.buttonDisabled,
          ]}
          onPress={handleAddTask}
          disabled={taskStatus === "loading"}
        >
          <Text
            style={[
              commonStyles.buttonText,
              taskStatus === "loading" && commonStyles.buttonTextDisabled,
            ]}
          >
            Añadir
          </Text>
        </TouchableOpacity>
      </View>

      {taskStatus === "loading" && pendingTasks.length === 0 && (
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {taskError && (
        <View style={styles.centeredMessageContainer}>
          <Text style={commonStyles.errorText}>
            Error al cargar tareas: {taskError}
          </Text>
        </View>
      )}

      {pendingTasks.length === 0 && taskStatus !== "loading" && !taskError ? (
        <View style={styles.centeredMessageContainer}>
          <Ionicons
            name="file-tray-outline"
            size={60}
            color={colors.placeholder}
            style={{ marginBottom: spacing.md }}
          />
          <Text style={[commonStyles.textSecondary, { textAlign: "center" }]}>
            No hay tareas pendientes.
          </Text>
          <Text
            style={[
              commonStyles.textSecondary,
              { textAlign: "center", fontSize: 12, marginTop: spacing.sm },
            ]}
          >
            ¡Añade una nueva para empezar!
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendingTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: spacing.md }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    marginTop: Platform.OS === "android" ? spacing.xl : spacing.md,
  },
  inputField: {
    flex: 1,
    marginRight: spacing.sm,
    marginBottom: 0,
  },
  addButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === "ios" ? spacing.md : spacing.sm + 2,
    marginBottom: 0,
  },
  list: {
    flex: 1,
  },
  taskItemCard: {
    ...commonStyles.card,
    flexDirection: "row",

    alignItems: "center",
  },
  taskItemContent: {
    flex: 1,
    marginRight: spacing.xs,
  },
  taskItemText: {
    fontSize: 17,
    marginBottom: spacing.xs,
  },
  taskMetaText: {
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: spacing.xs,
  },
  locationText: {
    flexShrink: 1,
  },
  detailsIndicatorContainer: {
    paddingHorizontal: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  taskItemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
});
