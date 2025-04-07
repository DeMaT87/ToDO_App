import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles, colors } from '../components/commonStyles';

export default function TaskDetailScreen({ route, navigation }) {
  const { task, updateTaskFunction } = route.params;

  const [taskText, setTaskText] = useState(task.text);
  const [date, setDate] = useState(task.dueDate ? new Date(task.dueDate) : new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const onChangeDateTime = (event, selectedDate) => {
    if (Platform.OS === 'android') {
        setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === 'ios' && pickerMode === 'date') {
          setPickerMode('time');
          setShowPicker(true);
      }
    } else if (Platform.OS === 'ios') {
         setShowPicker(false);
    }
  };

  const showDatepicker = () => {
    setPickerMode('date');
    setShowPicker(true);
  };

  const showTimepicker = () => {
    setPickerMode('time');
    setShowPicker(true);
  };

  const handleSaveChanges = () => {
    updateTaskFunction(task.id, taskText, date.toISOString());
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({ title: taskText.substring(0, 20) + (taskText.length > 20 ? '...' : '') });
  }, [taskText, navigation]);

  return (
    // Usa SafeAreaView y el contenedor común
    <SafeAreaView style={commonStyles.container}>
       {/* Usa el input común */}
       <TextInput
            style={commonStyles.input} // Aplicar estilo común directamente
            value={taskText}
            onChangeText={setTaskText}
            placeholder="Descripción de la tarea"
        />

      {/* Usa la etiqueta común */}
      <Text style={commonStyles.label}>Fecha y Hora de Vencimiento:</Text>
      {/* Texto para mostrar la fecha */}
      <Text style={styles.dateDisplay}>
        {date.toLocaleDateString()} - {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>

      {/* Usa el contenedor de botones común */}
      <View style={commonStyles.buttonContainer}>
        <Button onPress={showDatepicker} title="Seleccionar Fecha" color={colors.secondary} />
        {Platform.OS === 'android' && (
             <Button onPress={showTimepicker} title="Seleccionar Hora" color={colors.secondary}/>
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={pickerMode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDateTime}
          minimumDate={new Date()}
        />
      )}

       {/* Botón de guardar */}
       <View style={styles.saveButtonContainer}>
            <Button title="Guardar Cambios" onPress={handleSaveChanges} color={colors.primary} />
       </View>
    </SafeAreaView>
  );
}

// Estilos específicos para TaskDetailScreen
const styles = StyleSheet.create({
  dateDisplay: {
    fontSize: 18,
    marginBottom: 20,
    padding: 10,
    backgroundColor: colors.light, // Usa color común
    borderRadius: 5,
    textAlign: 'center', // Centra el texto de la fecha
    color: colors.dark, // Usa color común
  },
  saveButtonContainer: {
      marginTop: 'auto', // Empuja el botón hacia abajo
      marginBottom: 20, // Margen inferior
  }
});
