import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  commonStyles,
  colors,
  spacing,
  borderRadius,
} from "../styles/commonStyles";
import { saveActiveSession } from "../database/db";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("El correo electrónico y la contraseña son obligatorios.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
    } catch (firebaseError) {
      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password" ||
        firebaseError.code === "auth/invalid-credential"
      ) {
        setError("Correo electrónico o contraseña incorrectos.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("El formato del correo electrónico no es válido.");
      } else {
        setError("Ocurrió un error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <SafeAreaView style={commonStyles.centeredContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.contentContainer}>
          <Text style={[commonStyles.title, styles.title]}>Bienvenido</Text>
          <Text style={[commonStyles.textSecondary, styles.subtitle]}>
            Inicia sesión para continuar
          </Text>

          <TextInput
            placeholder="Correo Electrónico"
            placeholderTextColor={colors.placeholder}
            style={[commonStyles.input, styles.inputField]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor={colors.placeholder}
            style={[commonStyles.input, styles.inputField]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            editable={!isLoading}
          />

          {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity
              style={[commonStyles.button, styles.loginButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={commonStyles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleGoToSignUp}
            style={styles.signUpButton}
            disabled={isLoading}
          >
            <Text style={[commonStyles.buttonTextSecondary, styles.signUpText]}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.signUpLinkText}>Crear una</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "90%",
    maxWidth: 400,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  subtitle: {
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  inputField: {
    width: "100%",
  },
  loginButton: {
    width: "100%",
  },
  signUpButton: {
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  signUpText: {
    textAlign: "center",
  },
  signUpLinkText: {
    fontWeight: "bold",
    color: colors.primary,
  },
  loader: {
    marginVertical: spacing.md,
  },
});
