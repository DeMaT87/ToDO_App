import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { commonStyles, colors } from "../styles/commonStyles";


export default function SignUpScreen({ navigation }) {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); 

  
  const handleCreateAccount = () => {
    setError(""); 

    
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      
      setError("Por favor, introduce un email válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Simulación de creación de cuenta (aquí iría la lógica de Firebase)
    console.log("Intentando crear cuenta con:");
    console.log("Email:", email);
    console.log("Password:", password);

    // Muestra una alerta de éxito (temporal)
    Alert.alert(
      "Cuenta Creada (Simulación)",
      `Email: ${email}\nLa conexión con Firebase se implementará más adelante.`,
      [{ text: "OK", onPress: () => navigation.goBack() }] // Vuelve al login después de "crear"
    );

    // Limpiar campos después del intento (opcional)
    // setEmail('');
    // setPassword('');
    // setConfirmPassword('');
  };

  return (
    <SafeAreaView style={commonStyles.centeredContainer}>
      <View style={styles.content}>
        <Text style={commonStyles.title}>Crear Nueva Cuenta</Text>

        {/* Input para el Email */}
        <TextInput
          placeholder="Correo Electrónico"
          style={[commonStyles.input, styles.inputField]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Input para la Contraseña */}
        <TextInput
          placeholder="Contraseña (mín. 6 caracteres)"
          style={[commonStyles.input, styles.inputField]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        {/* Input para Confirmar Contraseña */}
        <TextInput
          placeholder="Confirmar Contraseña"
          style={[commonStyles.input, styles.inputField]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        {/* Muestra el mensaje de error si existe */}
        {error ? (
          <Text style={[commonStyles.errorText, styles.errorTextCustom]}>
            {error}
          </Text>
        ) : null}

        {/* Botón para Crear Cuenta */}
        <View style={styles.buttonContainer}>
          <Button
            title="Crear Cuenta"
            onPress={handleCreateAccount}
            color={colors.primary}
          />
        </View>

        {/* Botón para volver al Login */}
        <Button
          title="Ya tengo cuenta (Ir a Login)"
          onPress={() => navigation.navigate("Login")} // Navega a la pantalla de Login
          color={colors.secondary}
        />
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
    marginTop: 10, 
    marginBottom: 20, 
  },
  errorTextCustom: {
    
    textAlign: "center",
    marginBottom: 10,
  },
});
