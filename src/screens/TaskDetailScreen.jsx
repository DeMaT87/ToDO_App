import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector, useDispatch } from "react-redux";

import { updateTaskInFirebase } from "../store/tasksSlice";
import { commonStyles, colors } from "../styles/commonStyles";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const dispatch = useDispatch();

  const task = useSelector((state) =>
    state.tasks.tasks.find((t) => t.id === taskId)
  );

  const taskStatus = useSelector((state) => state.tasks.status);

  const [editedText, setEditedText] = useState("");
  const [editedDate, setEditedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [locationCoords, setLocationCoords] = useState(null);
  const [locationAddress, setLocationAddress] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedText(task.text);
      setEditedDate(task.dueDate ? new Date(task.dueDate) : new Date());
      setLocationCoords(task.locationCoords || null);
      setLocationAddress(task.locationAddress || null);
    } else {
      setEditedText("");
      setEditedDate(new Date());
      setLocationCoords(null);
      setLocationAddress(null);
    }
  }, [task]);

  useEffect(() => {
    if (task) {
      navigation.setOptions({
        title:
          editedText.substring(0, 20) + (editedText.length > 20 ? "..." : ""),
      });
    } else {
      navigation.setOptions({ title: "Tarea no encontrada" });
    }
  }, [editedText, task, navigation]);

  if (!task && taskStatus !== "loading") {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.centeredMessage}>
          <Text style={commonStyles.errorText}>
            Tarea no encontrada o ha sido eliminada.
          </Text>
          <Button title="Volver" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }
  if (taskStatus === "loading" && !task) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.centeredMessage}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text>Cargando detalles de la tarea...</Text>
        </View>
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

  const handleFetchLocation = async () => {
    setIsFetchingLocation(true);
    setLocationAddress(null);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso Denegado",
        "Se necesita permiso para acceder a la ubicación para esta función."
      );
      setIsFetchingLocation(false);
      return;
    }
    try {
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocationCoords(coords);
      let addressResponse = await Location.reverseGeocodeAsync(coords);
      if (addressResponse && addressResponse.length > 0) {
        const firstAddress = addressResponse[0];
        const formattedAddress = [
          firstAddress.street,
          firstAddress.streetNumber,
          firstAddress.city,
          firstAddress.region,
          firstAddress.postalCode,
          firstAddress.country,
        ]
          .filter(Boolean)
          .join(", ");
        setLocationAddress(formattedAddress);
        Alert.alert(
          "Ubicación Añadida",
          `Ubicación actual: ${formattedAddress}`
        );
      } else {
        Alert.alert(
          "Ubicación Añadida",
          "Coordenadas obtenidas, pero no se pudo encontrar una dirección detallada."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error de Ubicación",
        "No se pudo obtener la ubicación o la dirección."
      );
      setLocationCoords(null);
      setLocationAddress(null);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSaveChanges = () => {
    if (!task) {
      Alert.alert("Error", "La tarea ya no existe.");
      navigation.goBack();
      return;
    }

    dispatch(
      updateTaskInFirebase({
        id: taskId,
        text: editedText,
        dueDate: editedDate.toISOString(),
        locationCoords: locationCoords,
        locationAddress: locationAddress,
        completed: task.completed,
      })
    )
      .unwrap()
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Error", "No se pudo actualizar la tarea.");
      });
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput
          style={commonStyles.input}
          value={editedText}
          onChangeText={setEditedText}
          placeholder="Descripción de la tarea"
          editable={taskStatus !== "loading"}
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
            disabled={taskStatus === "loading"}
          />
          {Platform.OS === "android" && (
            <Button
              onPress={showTimepicker}
              title="Seleccionar Hora"
              color={colors.secondary}
              disabled={taskStatus === "loading"}
            />
          )}
        </View>
        {showPicker && (
          <DateTimePicker
            value={editedDate}
            mode={pickerMode}
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDateTime}
            minimumDate={new Date()}
          />
        )}

        <Text style={commonStyles.label}>Ubicación:</Text>
        {locationCoords && (
          <View style={styles.locationInfoContainer}>
            <View style={styles.locationRow}>
              <Ionicons
                name="navigate-circle-outline"
                size={20}
                color={colors.primary}
                style={{ marginRight: 5 }}
              />
              <Text style={commonStyles.text}>
                Lat: {locationCoords.latitude.toFixed(4)}, Lon:{" "}
                {locationCoords.longitude.toFixed(4)}
              </Text>
            </View>
            {locationAddress && (
              <View style={styles.locationRow}>
                <Ionicons
                  name="map-outline"
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 5 }}
                />
                <Text style={[commonStyles.text, styles.addressText]}>
                  {locationAddress}
                </Text>
              </View>
            )}
          </View>
        )}
        {!locationCoords && !locationAddress && (
          <Text
            style={[
              commonStyles.text,
              { fontStyle: "italic", color: colors.darkGrey, marginBottom: 10 },
            ]}
          >
            No hay ubicación asignada.
          </Text>
        )}

        {isFetchingLocation ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ marginVertical: 10 }}
          />
        ) : (
          <View style={styles.locationButtonContainer}>
            <Button
              title={
                locationCoords
                  ? "Actualizar Ubicación"
                  : "Añadir Ubicación Actual"
              }
              onPress={handleFetchLocation}
              color={colors.secondary}
              disabled={taskStatus === "loading"}
            />
          </View>
        )}

        <View style={styles.saveButtonContainer}>
          <Button
            title="Guardar Cambios"
            onPress={handleSaveChanges}
            color={colors.primary}
            disabled={taskStatus === "loading"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dateDisplay: {
    fontSize: 18,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.light,
    borderRadius: 5,
    textAlign: "center",
    color: colors.dark,
  },
  saveButtonContainer: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  locationInfoContainer: {
    padding: 10,
    backgroundColor: colors.light,
    borderRadius: 5,
    marginBottom: 10,
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  addressText: { flexShrink: 1 },
  locationButtonContainer: { marginVertical: 10 },
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
