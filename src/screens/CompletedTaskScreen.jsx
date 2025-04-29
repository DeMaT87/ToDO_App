import React from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, toggleComplete } from "../store/tasksSlice";
import { commonStyles, colors } from "../styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";

export default function CompletedTasksScreen({ navigation }) {
  const dispatch = useDispatch();

  const allTasks = useSelector((state) => state.tasks.tasks);

  const completedTasks = allTasks.filter((task) => task.completed);

  const goToDetail = (taskId) => {
    navigation.navigate("TaskDetail", { taskId: taskId });
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };
  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
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
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleToggleComplete(item.id);
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
      {completedTasks.length === 0 ? (
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
  list: {
    flex: 1,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    backgroundColor: colors.light,
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
    justifyContent: "center",
    alignItems: "center",
  },
});
