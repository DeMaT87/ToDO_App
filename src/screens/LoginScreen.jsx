import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { commonStyles, colors } from "../styles/commonStyles";
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

      await saveActiveSession(user.uid);

      setEmail("");
      setPassword("");
    } catch (firebaseError) {
      firebaseError.code, firebaseError.message;

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
      <View style={styles.content}>
        <Text style={commonStyles.title}>Inicio de Sesión</Text>

        <TextInput
          placeholder="Correo Electrónico"
          style={[commonStyles.input, styles.inputField]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          placeholder="Contraseña"
          style={[commonStyles.input, styles.inputField]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          editable={!isLoading}
        />

        {error ? (
          <Text style={[commonStyles.errorText, styles.errorTextCustom]}>
            {error}
          </Text>
        ) : null}

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              title="Ingresar"
              onPress={handleLogin}
              color={colors.primary}
              disabled={isLoading}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={handleGoToSignUp}
          style={styles.signUpLink}
          disabled={isLoading}
        >
          <Text style={styles.signUpText}>¿No tienes cuenta? Crear una</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "85%",
    alignItems: "center",
  },
  inputField: {
    width: "100%",
    marginBottom: 15,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  signUpLink: {
    marginTop: 15,
  },
  signUpText: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  errorTextCustom: {
    textAlign: "center",
    marginBottom: 10,
  },
  loader: {
    marginTop: 10,
    marginBottom: 20,
  },
});
