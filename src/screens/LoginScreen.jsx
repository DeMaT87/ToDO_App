import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native'; // Añadido TouchableOpacity
import { commonStyles, colors } from '../styles/commonStyles';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (username.toLowerCase() === 'admin' && password === '12345') {
      console.log('Login successful');
      // Navega a 'MainApp' (el contenedor de las pestañas)
      navigation.navigate('MainApp');
      setUsername('');
      setPassword('');
    } else {
      console.log('Login failed');
      setError('Usuario o contraseña incorrectos.');
    }
  };

  // Función para navegar a la pantalla de registro
  const handleGoToSignUp = () => {
    navigation.navigate('SignUp'); // Navega a la pantalla definida en AppNavigator
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

        <View style={styles.buttonContainer}>
            <Button
                title="Ingresar"
                onPress={handleLogin}
                color={colors.primary}
            />
        </View>

        {/* Enlace para Crear Cuenta */}
        <TouchableOpacity onPress={handleGoToSignUp} style={styles.signUpLink}>
            <Text style={styles.signUpText}>¿No tienes cuenta? Crear una</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// Estilos específicos de LoginScreen
const styles = StyleSheet.create({
  content: {
    width: '85%',
    alignItems: 'center',
  },
  inputField: {
      width: '100%',
      marginBottom: 15,
  },
  buttonContainer: { // Contenedor para el botón principal
      width: '100%', // Ocupa todo el ancho para centrar bien el botón si es necesario
      marginBottom: 20, // Espacio antes del enlace de crear cuenta
  },
  signUpLink: {
      marginTop: 15,
  },
  signUpText: {
      color: colors.primary, // Usa el color primario para el enlace
      textDecorationLine: 'underline', // Subraya para indicar que es un enlace
  }
});
