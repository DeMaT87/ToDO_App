import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector, useDispatch } from "react-redux";
import { updateTaskInFirebase } from "../store/tasksSlice";
import {
  commonStyles,
  colors,
  spacing,
  borderRadius,
} from "../styles/commonStyles";
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
        title: editedText
          ? editedText.substring(0, 25) + (editedText.length > 25 ? "..." : "")
          : "Detalle de Tarea",
      });
    } else {
      navigation.setOptions({ title: "Tarea no encontrada" });
    }
  }, [editedText, task, navigation]);

  if (taskStatus === "loading" && !task) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.centeredMessage}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={commonStyles.textSecondary}>Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!task && taskStatus !== "loading") {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.centeredMessage}>
          <Ionicons
            name="sad-outline"
            size={60}
            color={colors.placeholder}
            style={{ marginBottom: spacing.md }}
          />
          <Text style={commonStyles.errorText}>
            Tarea no encontrada o ha sido eliminada.
          </Text>
          <TouchableOpacity
            style={[
              commonStyles.button,
              commonStyles.buttonSecondary,
              { marginTop: spacing.md },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={[
                commonStyles.buttonText,
                commonStyles.buttonTextSecondary,
              ]}
            >
              Volver
            </Text>
          </TouchableOpacity>
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
        "Se necesita permiso para acceder a la ubicación."
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
          firstAddress.postalCode,
          firstAddress.country,
        ]
          .filter(Boolean)
          .join(", ");
        setLocationAddress(formattedAddress);
        Alert.alert("Ubicación Añadida", `Ubicación: ${formattedAddress}`);
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formSection}>
          <Text style={commonStyles.label}>Descripción de la Tarea:</Text>
          <TextInput
            style={commonStyles.input}
            value={editedText}
            onChangeText={setEditedText}
            placeholder="Escribe la descripción..."
            placeholderTextColor={colors.placeholder}
            editable={taskStatus !== "loading"}
            multiline
          />
        </View>

        <View style={styles.formSection}>
          <Text style={commonStyles.label}>Fecha y Hora de Vencimiento:</Text>
          <TouchableOpacity
            onPress={showDatepicker}
            style={styles.dateDisplayTouchable}
          >
            <Text style={styles.dateDisplayText}>
              {editedDate.toLocaleDateString()} -{" "}
              {editedDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={[
                commonStyles.button,
                commonStyles.buttonSecondary,
                styles.timeButtonAndroid,
              ]}
              onPress={showTimepicker}
              disabled={taskStatus === "loading"}
            >
              <Text
                style={[
                  commonStyles.buttonText,
                  commonStyles.buttonTextSecondary,
                ]}
              >
                Seleccionar Hora (Android)
              </Text>
            </TouchableOpacity>
          )}
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
        </View>

        <View style={styles.formSection}>
          <Text style={commonStyles.label}>Ubicación:</Text>
          {locationCoords && (
            <View style={styles.locationInfoCard}>
              <View style={styles.locationRow}>
                <Ionicons
                  name="navigate-circle-outline"
                  size={20}
                  color={colors.primary}
                  style={styles.locationIcon}
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
                    style={styles.locationIcon}
                  />
                  <Text
                    style={[commonStyles.textSecondary, styles.addressText]}
                  >
                    {locationAddress}
                  </Text>
                </View>
              )}
            </View>
          )}
          {!locationCoords && !locationAddress && (
            <Text style={[commonStyles.textSecondary, styles.noLocationText]}>
              No hay ubicación asignada.
            </Text>
          )}

          {isFetchingLocation ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.locationLoader}
            />
          ) : (
            <TouchableOpacity
              style={[
                commonStyles.button,
                commonStyles.buttonSecondary,
                styles.locationButton,
              ]}
              onPress={handleFetchLocation}
              disabled={taskStatus === "loading"}
            >
              <Ionicons
                name="location-sharp"
                size={18}
                color={colors.primary}
                style={{ marginRight: spacing.sm }}
              />
              <Text
                style={[
                  commonStyles.buttonText,
                  commonStyles.buttonTextSecondary,
                ]}
              >
                {locationCoords
                  ? "Actualizar Ubicación"
                  : "Añadir Ubicación Actual"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            styles.saveButton,
            taskStatus === "loading" && commonStyles.buttonDisabled,
          ]}
          onPress={handleSaveChanges}
          disabled={taskStatus === "loading"}
        >
          <Text
            style={[
              commonStyles.buttonText,
              taskStatus === "loading" && commonStyles.buttonTextDisabled,
            ]}
          >
            Guardar Cambios
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  dateDisplayTouchable: {
    ...commonStyles.input,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  dateDisplayText: {
    fontSize: 16,
    color: colors.text,
  },
  timeButtonAndroid: {
    marginTop: spacing.sm,
  },
  locationInfoCard: {
    ...commonStyles.card,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  locationIcon: { marginRight: spacing.sm },
  addressText: { flexShrink: 1, fontSize: 14 },
  noLocationText: { fontStyle: "italic", marginBottom: spacing.sm },
  locationButton: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  locationLoader: { marginVertical: spacing.md },
  saveButton: { marginTop: spacing.lg },
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
});
