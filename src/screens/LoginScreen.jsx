import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";

import { commonStyles, colors } from "../styles/commonStyles";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    // Verifica las credenciales hardcodeadas
    if (username.toLowerCase() === "admin" && password === "12345") {
      console.log("Login successful");
      navigation.navigate("Home");

      setUsername("");
      setPassword("");
    } else {
      console.log("Login failed");
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <SafeAreaView style={commonStyles.centeredContainer}>
      <View style={styles.content}>
        <Text style={commonStyles.title}>Inicio de Sesión</Text>

        <TextInput
          placeholder="Usuario (admin)"
          style={[commonStyles.input, styles.inputField]}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Contraseña (12345)"
          style={[commonStyles.input, styles.inputField]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}

        {/* Botón de Login */}
        <Button title="Ingresar" onPress={handleLogin} color={colors.primary} />
      </View>
    </SafeAreaView>
  );
}

// Estilos específicos de LoginScreen
const styles = StyleSheet.create({
  content: {
    width: "85%",
    alignItems: "center",
  },
  inputField: {
    width: "100%",
    marginBottom: 15,
  },
});
