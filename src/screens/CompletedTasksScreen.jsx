import React from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import {
  deleteTaskFromFirebase,
  updateTaskInFirebase,
} from "../store/tasksSlice";
import { commonStyles, colors } from "../styles/commonStyles";
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
    dispatch(deleteTaskFromFirebase(id)).unwrap();
  };

  const handleToggleToPending = (task) => {
    dispatch(updateTaskInFirebase({ id: task.id, completed: false })).unwrap();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToDetail(item.id)}>
      <View style={styles.taskItem}>
        <View style={styles.taskTextContainer}>
          <Text
            style={[commonStyles.text, { textDecorationLine: "line-through" }]}
          >
            {item.text}
          </Text>
          {item.dueDate && (
            <Text style={styles.dueDateText}>
              Venció: {new Date(item.dueDate).toLocaleDateString()}{" "}
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
            handleToggleToPending(item);
          }}
          style={styles.actionButton}
        >
          <Ionicons
            name="refresh-circle-outline"
            size={24}
            color={colors.warning}
          />
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
      {taskStatus === "loading" && completedTasks.length === 0 && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      )}
      {completedTasks.length === 0 && taskStatus !== "loading" ? (
        <View style={styles.emptyContainer}>
          <Text style={commonStyles.text}>No hay tareas completadas.</Text>
        </View>
      ) : (
        <FlatList
          data={completedTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    backgroundColor: colors.light,
    paddingHorizontal: 5,
  },
  taskTextContainer: { flex: 1, marginRight: 10 },
  dueDateText: { fontSize: 12, color: colors.darkGrey, marginTop: 4 },
  locationText: { fontSize: 11, color: colors.darkGrey, marginTop: 2 },
  actionButton: { padding: 10, marginLeft: 5 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
