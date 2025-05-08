import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';

export default function LoginScreen({ navigation }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    
    if (email.toLowerCase() === 'fake@fake.com' && password === '12345') {
      console.log('Login successful');
      navigation.navigate('MainApp'); 
      setEmail(''); 
      setPassword('');
    } else {
      console.log('Login failed');
      setError('Correo electrónico o contraseña incorrectos.');
    }
  };

  const handleGoToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={commonStyles.centeredContainer}>
      <View style={styles.content}>
        <Text style={commonStyles.title}>Inicio de Sesión</Text>

        {/* Input para el Correo Electrónico */}
        <TextInput
            placeholder="Correo Electrónico (fake@fake.com)" 
            style={[commonStyles.input, styles.inputField]}
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address" 
            autoCapitalize="none"
        />

        {/* Input para la Contraseña */}
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

        <TouchableOpacity onPress={handleGoToSignUp} style={styles.signUpLink}>
            <Text style={styles.signUpText}>¿No tienes cuenta? Crear una</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  content: {
    width: '85%',
    alignItems: 'center',
  },
  inputField: {
      width: '100%',
      marginBottom: 15,
  },
  buttonContainer: {
      width: '100%',
      marginBottom: 20,
  },
  signUpLink: {
      marginTop: 15,
  },
  signUpText: {
      color: colors.primary,
      textDecorationLine: 'underline',
  }
});
