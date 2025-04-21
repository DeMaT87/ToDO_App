import React, { useState } from 'react'; // Importa useState
import { View, Text, Button, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native'; // Importa TextInput y Alert
// Importa los estilos comunes
import { commonStyles, colors } from '../components/commonStyles';

export default function LoginScreen({ navigation }) {
  // Estados para guardar el usuario, contraseña y mensajes de error
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para mensaje de error

  // Función que se ejecuta al presionar el botón de login
  const handleLogin = () => {
    setError(''); // Limpia errores previos

    // Verifica las credenciales hardcodeadas
    if (username.toLowerCase() === 'admin' && password === '12345') {
      // Credenciales correctas: navega a Home
      console.log('Login successful');
      navigation.navigate('Home');
      // Limpia los campos después de un login exitoso (opcional)
      setUsername('');
      setPassword('');
    } else {
      // Credenciales incorrectas: muestra un mensaje de error
      console.log('Login failed');
      setError('Usuario o contraseña incorrectos.');
      // Alert.alert('Error', 'Usuario o contraseña incorrectos'); // Alternativa con Alert nativo
    }
  };

  return (
    <SafeAreaView style={commonStyles.centeredContainer}>
      <View style={styles.content}>
        <Text style={commonStyles.title}>Inicio de Sesión</Text>

        {/* Input para el nombre de usuario */}
        <TextInput
            placeholder="Usuario (admin)"
            style={[commonStyles.input, styles.inputField]} // Combina estilos
            value={username}
            onChangeText={setUsername} // Actualiza el estado username
            autoCapitalize="none" // Evita la capitalización automática
        />

        {/* Input para la contraseña */}
        <TextInput
            placeholder="Contraseña (12345)"
            style={[commonStyles.input, styles.inputField]} // Combina estilos
            value={password}
            onChangeText={setPassword} // Actualiza el estado password
            secureTextEntry={true} // Oculta la contraseña
        />

        {/* Muestra el mensaje de error si existe */}
        {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}

        {/* Botón de Login */}
        <Button
            title="Ingresar" // Texto actualizado del botón
            onPress={handleLogin}
            color={colors.primary}
         />
      </View>
    </SafeAreaView>
  );
}

// Estilos específicos de LoginScreen
const styles = StyleSheet.create({
  content: {
    width: '85%', // Ajusta el ancho si es necesario
    alignItems: 'center',
  },
  inputField: {
      width: '100%', // Hace que los inputs ocupen todo el ancho del contenedor 'content'
      marginBottom: 15, // Espacio entre inputs
  }
});


