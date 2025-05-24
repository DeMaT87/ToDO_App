import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  commonStyles,
  colors,
  spacing,
  borderRadius,
} from "../styles/commonStyles";
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
        const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
        const mediaPerm =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraPerm.status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Se necesita permiso para acceder a la cámara."
          );
        }
        if (mediaPerm.status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Se necesita permiso para acceder a la galería."
          );
        }
      }
    })();
  }, [currentUser]);

  const handleImagePicked = async (pickerResult) => {
    if (!pickerResult || pickerResult.canceled) {
      return;
    }
    if (
      !pickerResult.assets ||
      pickerResult.assets.length === 0 ||
      !pickerResult.assets[0].uri
    ) {
      Alert.alert("Error", "No se pudo obtener la imagen seleccionada.");
      return;
    }

    const imageUri = pickerResult.assets[0].uri;
    setProfileImage(imageUri);
    Alert.alert(
      "Foto Actualizada Localmente",
      "La foto de perfil se ha actualizado en la pantalla."
    );
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para acceder a tu galería."
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    await handleImagePicked(result); // Llama a la función modificada
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para acceder a tu cámara."
      );
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    await handleImagePicked(result);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!currentUser && !isLoggingOut) {
    return (
      <SafeAreaView style={commonStyles.centeredContainer}>
        <Text style={commonStyles.text}>No hay usuario activo.</Text>
        <TouchableOpacity
          style={[commonStyles.button, { marginTop: spacing.md }]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={commonStyles.buttonText}>Ir a Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.screenPadding}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[commonStyles.title, styles.screenTitle]}>
            Ajustes de Perfil
          </Text>

          <View style={[commonStyles.card, styles.sectionContainer]}>
            <Text style={commonStyles.label}>Foto de Perfil (Local)</Text>
            <TouchableOpacity
              style={styles.profileImageTouchable}
              onPress={() =>
                Alert.alert("Actualizar Foto", "Elige una opción:", [
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
                    color={colors.placeholder}
                  />
                  <Text
                    style={[commonStyles.textSecondary, styles.placeholderText]}
                  >
                    Tocar para cambiar
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={[commonStyles.card, styles.sectionContainer]}>
            <Text style={commonStyles.label}>Correo Electrónico</Text>
            <View style={styles.emailDisplay}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textSecondary}
                style={{ marginRight: spacing.sm }}
              />
              <Text style={[commonStyles.text, styles.emailText]}>
                {currentUser?.email}
              </Text>
            </View>
          </View>

          <View style={styles.logoutButtonContainer}>
            {isLoggingOut ? (
              <ActivityIndicator size="large" color={colors.error} />
            ) : (
              <TouchableOpacity
                style={[commonStyles.button, styles.logoutButton]}
                onPress={handleLogout}
                disabled={!currentUser}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={colors.surface}
                  style={{ marginRight: spacing.sm }}
                />
                <Text style={commonStyles.buttonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenPadding: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? spacing.lg : spacing.sm,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  screenTitle: {
    marginBottom: spacing.lg,
  },
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  profileImageTouchable: {
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
    backgroundColor: colors.border,
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  placeholderText: {
    marginTop: spacing.sm,
  },
  emailDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  emailText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButtonContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: colors.error,
    flexDirection: "row",
    width: "100%",
    maxWidth: 300,
  },
  activityIndicator: {
    marginVertical: spacing.md,
  },
});
