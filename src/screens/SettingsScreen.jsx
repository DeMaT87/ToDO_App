import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { commonStyles, colors } from "../styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

export default function SettingsScreen({ navigation }) {
  const currentUser = auth.currentUser;

  const [profileImage, setProfileImage] = useState(
    currentUser?.photoURL || null
  );

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileImage(currentUser.photoURL);
    }

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
  }, [currentUser]);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);

      Alert.alert(
        "Foto Seleccionada",
        "La funcionalidad de guardar esta foto en tu perfil está pendiente."
      );
    }
  };
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
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      Alert.alert(
        "Foto Tomada",
        "La funcionalidad de guardar esta foto en tu perfil está pendiente."
      );
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out from Firebase:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión correctamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!currentUser && !isLoggingOut) {
    return (
      <SafeAreaView style={commonStyles.centeredContainer}>
        <Text>No hay usuario activo. Por favor, inicia sesión.</Text>
        <Button
          title="Ir a Login"
          onPress={() => navigation.navigate("Login")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[commonStyles.title, styles.screenTitle]}>Ajustes</Text>

        {/* Sección Foto de Perfil */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Foto de Perfil</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Seleccionar Imagen", "Elige una opción:", [
                { text: "Galería", onPress: pickImageFromGallery },
                { text: "Cámara", onPress: takePhotoWithCamera },
                { text: "Cancelar", style: "cancel" },
              ])
            }
            disabled={isLoggingOut}
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

        {/* Sección Email del Usuario */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Correo Electrónico</Text>
          <Text style={styles.emailText}>{currentUser?.email}</Text>
        </View>

        {/* Sección Cerrar Sesión */}
        <View style={[styles.sectionContainer, styles.logoutSection]}>
          {isLoggingOut ? (
            <ActivityIndicator
              size="small"
              color={colors.danger}
              style={styles.activityIndicator}
            />
          ) : (
            <Button
              title="Cerrar Sesión"
              onPress={handleLogout}
              color={colors.danger}
              disabled={!currentUser}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenTitle: { marginTop: 10, marginBottom: 30 },
  sectionContainer: { marginBottom: 40, paddingHorizontal: 10 },
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
  placeholderText: { fontSize: 12, color: colors.darkGrey, marginTop: 5 },
  emailText: {
    fontSize: 16,
    color: colors.dark,
    padding: 10,
    backgroundColor: colors.light,
    borderRadius: 5,
  },
  logoutSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    paddingTop: 30,
    alignItems: "center",
  },
  activityIndicator: { marginVertical: 10 },
});
