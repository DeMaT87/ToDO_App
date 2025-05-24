import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
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
const selectCompletedTasks = createSelector([selectTasks], (tasks) =>
  tasks.filter((task) => task.completed)
);

export default function CompletedTasksScreen({ navigation }) {
  const dispatch = useDispatch();

  const completedTasks = useSelector(selectCompletedTasks);
  const taskStatus = useSelector((state) => state.tasks.status);

  const goToDetail = (taskId) => {
    navigation.navigate("TaskDetail", { taskId: taskId });
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTaskFromFirebase(id))
      .unwrap()
      .catch((error) => {
        Alert.alert("Error", "No se pudo eliminar la tarea completada.");
      });
  };

  const handleToggleToPending = (task) => {
    dispatch(updateTaskInFirebase({ id: task.id, completed: false }))
      .unwrap()
      .catch((error) => {
        Alert.alert("Error", "No se pudo actualizar el estado de la tarea.");
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => goToDetail(item.id)}
      style={styles.taskItemCard}
    >
      <View style={styles.taskItemContent}>
        <Text
          style={[
            commonStyles.text,
            styles.taskItemText,
            styles.completedTaskText,
          ]}
        >
          {item.text}
        </Text>
        {item.dueDate && (
          <Text style={[commonStyles.textSecondary, styles.taskMetaText]}>
            Venció: {new Date(item.dueDate).toLocaleDateString()}{" "}
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
              {item.locationAddress.substring(0, 40)}
              {item.locationAddress.length > 40 ? "..." : ""}
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
            handleToggleToPending(item);
          }}
          style={styles.actionButton}
        >
          <Ionicons
            name="refresh-circle-outline"
            size={24}
            color={colors.accent}
          />
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

  const renderMainContent = () => {
    if (taskStatus === "loading" && completedTasks.length === 0) {
      return (
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (completedTasks.length === 0 && taskStatus !== "loading") {
      return (
        <View style={styles.centeredMessageContainer}>
          <Ionicons
            name="checkmark-done-circle-outline"
            size={60}
            color={colors.placeholder}
            style={{ marginBottom: spacing.md }}
          />
          <Text style={[commonStyles.textSecondary, { textAlign: "center" }]}>
            No hay tareas completadas.
          </Text>
          <Text
            style={[
              commonStyles.textSecondary,
              { textAlign: "center", fontSize: 12, marginTop: spacing.sm },
            ]}
          >
            ¡Buen trabajo!
          </Text>
        </View>
      );
    }
    if (taskStatus !== "loading" && completedTasks.length > 0) {
      return (
        <FlatList
          data={completedTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: spacing.md }}
        />
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {renderMainContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: Platform.OS === "android" ? spacing.xl : spacing.md,
  },
  taskItemCard: {
    ...commonStyles.card,
    backgroundColor: colors.surface,
    flexDirection: "row",

    alignItems: "center",
    opacity: 0.8,
  },
  taskItemContent: {
    flex: 1,
    marginRight: spacing.xs,
  },
  taskItemText: {
    fontSize: 17,
    marginBottom: spacing.xs,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
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
    marginTop: Platform.OS === "android" ? spacing.xl : spacing.md,
  },
});
