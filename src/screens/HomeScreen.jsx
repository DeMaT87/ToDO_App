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
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import { addTask, deleteTask, toggleComplete } from "../store/tasksSlice";

import { commonStyles, colors } from "../styles/commonStyles";

export default function HomeScreen({ navigation }) {
  const [inputText, setInputText] = useState("");

  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.tasks.tasks);
  const handleAddTask = () => {
    if (inputText.trim().length > 0) {
      dispatch(addTask({ text: inputText.trim() }));
      setInputText("");
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const goToDetail = (taskId) => {
    navigation.navigate("TaskDetail", { taskId: taskId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToDetail(item.id)}>
      <View
        style={[styles.taskItem, item.completed && styles.taskItemCompleted]}
      >
        <View style={styles.taskTextContainer}>
          <Text
            style={[
              commonStyles.text,
              { textDecorationLine: item.completed ? "line-through" : "none" },
            ]}
          >
            {item.text}
          </Text>
          {item.dueDate && (
            <Text style={styles.dueDateText}>
              Vence: {new Date(item.dueDate).toLocaleDateString()}{" "}
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
          <Text
            style={{ color: item.completed ? colors.success : colors.warning }}
          >
            {item.completed ? "✓" : "○"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteTask(item.id);
          }}
          style={styles.actionButton}
        >
          <Text style={{ color: colors.danger }}>X</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[commonStyles.input, styles.inputFlex]}
          placeholder="Nueva tarea..."
          value={inputText}
          onChangeText={setInputText}
        />

        <Button title="Añadir" onPress={handleAddTask} color={colors.primary} />
      </View>

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  inputFlex: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
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
  },
  taskItemCompleted: {
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
});
