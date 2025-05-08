import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView, 
  Alert,
  Platform, 
} from "react-native";
import { commonStyles, colors } from "../styles/commonStyles";
import { Ionicons } from "@expo/vector-icons"; 
import * as ImagePicker from "expo-image-picker"; 

export default function SettingsScreen({ navigation }) {
  
  const [profileImage, setProfileImage] = useState(null); // URI de la imagen de perfil

  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // --- Lógica para Foto de Perfil ---
  useEffect(() => {
    // Solicitar permisos al cargar la pantalla (o al intentar usar la cámara/galería)
    (async () => {
      if (Platform.OS !== "web") {
        
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        const mediaLibraryStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus.status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Se necesita permiso para acceder a la cámara."
          );
        }
        if (mediaLibraryStatus.status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Se necesita permiso para acceder a la galería."
          );
        }
      }
    })();
  }, []);

  // Función para seleccionar imagen de la galería
  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Lo sentimos, necesitamos permiso para acceder a tu galería para que esto funcione."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 0.5, 
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Actualiza el estado con la URI de la imagen seleccionada
      console.log("Imagen seleccionada de galería:", result.assets[0].uri);
    }
  };

  // Función para tomar una foto con la cámara
  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Lo sentimos, necesitamos permiso para acceder a tu cámara para que esto funcione."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Actualiza el estado con la URI de la foto tomada
      console.log("Foto tomada con cámara:", result.assets[0].uri);
    }
  };

  // --- Lógica para Cambiar Contraseña ---
  const handleChangePassword = () => {
    setPasswordError(""); // Limpia errores previos
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Todos los campos de contraseña son obligatorios.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }

    // Aquí iría la lógica para verificar la contraseña actual y cambiarla en Firebase Auth
    console.log("Intentando cambiar contraseña...");
    console.log("Actual:", currentPassword, "Nueva:", newPassword);
    Alert.alert(
      "Contraseña (Simulación)",
      "La funcionalidad de cambio de contraseña se conectará con Firebase más adelante.",
      [{ text: "OK" }]
    );
    // Limpiar campos
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // --- Lógica para Cerrar Sesión ---
  const handleLogout = () => {
    // Aquí iría la lógica para limpiar el estado de autenticación (ej. en Redux si se usa para auth)
    // y navegar de vuelta a la pantalla de Login
    console.log("Cerrar sesión presionado");
    navigation.navigate("Login"); 
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[commonStyles.title, styles.screenTitle]}>
          Ajustes de Perfil
        </Text>

        {/* Sección Foto de Perfil */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Foto de Perfil</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Seleccionar Imagen",
                "Elige una opción para tu foto de perfil:",
                [
                  { text: "Galería", onPress: pickImageFromGallery },
                  { text: "Cámara", onPress: takePhotoWithCamera },
                  { text: "Cancelar", style: "cancel" },
                ]
              )
            }
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons
                  name="person-circle-outline"
                  size={80}
                  color={colors.darkGrey}
                />
                <Text style={styles.placeholderText}>Tocar para cambiar</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Sección Cambiar Contraseña */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
          <TextInput
            placeholder="Contraseña Actual"
            style={[commonStyles.input, styles.inputField]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Nueva Contraseña"
            style={[commonStyles.input, styles.inputField]}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirmar Nueva Contraseña"
            style={[commonStyles.input, styles.inputField]}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
          />
          {passwordError ? (
            <Text style={[commonStyles.errorText, styles.errorTextCustom]}>
              {passwordError}
            </Text>
          ) : null}
          <Button
            title="Actualizar Contraseña"
            onPress={handleChangePassword}
            color={colors.primary}
          />
        </View>

        {/* Sección Cerrar Sesión */}
        <View style={[styles.sectionContainer, styles.logoutSection]}>
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            color={colors.danger}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    marginTop: 10, 
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 30, 
    paddingHorizontal: 5, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, 
    alignSelf: "center", 
    marginBottom: 10,
    backgroundColor: colors.light, 
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  placeholderText: {
    fontSize: 12,
    color: colors.darkGrey,
    marginTop: 5,
  },
  inputField: {
    width: "100%",
    marginBottom: 15,
  },
  errorTextCustom: {
    textAlign: "center",
    marginBottom: 10,
  },
  logoutSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    paddingTop: 20,
  },
});
