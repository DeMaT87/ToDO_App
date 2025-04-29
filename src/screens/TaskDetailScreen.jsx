import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  TextInput,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useSelector, useDispatch } from "react-redux";

import { updateTask } from "../store/tasksSlice";

import { commonStyles, colors } from "../styles/commonStyles";

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;

  const dispatch = useDispatch();

  const task = useSelector((state) =>
    state.tasks.tasks.find((t) => t.id === taskId)
  );

  const [editedText, setEditedText] = useState(task ? task.text : "");
  const [editedDate, setEditedDate] = useState(
    task && task.dueDate ? new Date(task.dueDate) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");

  useEffect(() => {
    if (task) {
      setEditedText(task.text);
      setEditedDate(task.dueDate ? new Date(task.dueDate) : new Date());
    }
  }, [task]);

  useEffect(() => {
    navigation.setOptions({
      title:
        editedText.substring(0, 20) + (editedText.length > 20 ? "..." : ""),
    });
  }, [editedText, navigation]);

  if (!task) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Text style={commonStyles.errorText}>Tarea no encontrada.</Text>
      </SafeAreaView>
    );
  }

  const onChangeDateTime = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setEditedDate(selectedDate);
      if (Platform.OS === "ios" && pickerMode === "date") {
        setPickerMode("time");
        setShowPicker(true);
      }
    } else if (Platform.OS === "ios") {
      setShowPicker(false);
    }
  };
  const showDatepicker = () => {
    setPickerMode("date");
    setShowPicker(true);
  };
  const showTimepicker = () => {
    setPickerMode("time");
    setShowPicker(true);
  };

  const handleSaveChanges = () => {
    dispatch(
      updateTask({
        id: taskId,
        text: editedText,
        dueDate: editedDate.toISOString(),
      })
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <TextInput
        style={commonStyles.input}
        value={editedText}
        onChangeText={setEditedText}
        placeholder="Descripción de la tarea"
      />

      <Text style={commonStyles.label}>Fecha y Hora de Vencimiento:</Text>
      <Text style={styles.dateDisplay}>
        {editedDate.toLocaleDateString()} -{" "}
        {editedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      <View style={commonStyles.buttonContainer}>
        <Button
          onPress={showDatepicker}
          title="Seleccionar Fecha"
          color={colors.secondary}
        />
        {Platform.OS === "android" && (
          <Button
            onPress={showTimepicker}
            title="Seleccionar Hora"
            color={colors.secondary}
          />
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={editedDate}
          mode={pickerMode}
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDateTime}
          minimumDate={new Date()}
        />
      )}

      <View style={styles.saveButtonContainer}>
        <Button
          title="Guardar Cambios"
          onPress={handleSaveChanges}
          color={colors.primary}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dateDisplay: {
    fontSize: 18,
    marginBottom: 20,
    padding: 10,
    backgroundColor: colors.light,
    borderRadius: 5,
    textAlign: "center",
    color: colors.dark,
  },
  saveButtonContainer: {
    marginTop: "auto",
    marginBottom: 20,
  },
});
