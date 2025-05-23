import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    setError('');
    setIsLoading(true);

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Todos los campos son obligatorios.');
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Por favor, introduce un email válido.');
        setIsLoading(false);
        return;
    }
    if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setIsLoading(false);
        return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      setIsLoading(false);

      Alert.alert(
        'Cuenta Creada Exitosamente',
        `Tu cuenta para ${userCredential.user.email} ha sido creada. Serás redirigido.`,
        
        [{ text: 'OK' }]
      );
      
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (firebaseError) {
      setIsLoading(false);
      
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está en uso.');
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil.');
      } else {
        setError('Ocurrió un error al crear la cuenta. Intenta de nuevo.');
      }
    }
  };

  return (
    <SafeAreaView style={commonStyles.centeredContainer}>
      <View style={styles.content}>
        <Text style={commonStyles.title}>Crear Nueva Cuenta</Text>

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
            placeholder="Contraseña (mín. 6 caracteres)"
            style={[commonStyles.input, styles.inputField]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            editable={!isLoading}
        />
        <TextInput
            placeholder="Confirmar Contraseña"
            style={[commonStyles.input, styles.inputField]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            editable={!isLoading}
        />

        {error ? <Text style={[commonStyles.errorText, styles.errorTextCustom]}>{error}</Text> : null}

        {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
            <View style={styles.buttonContainer}>
                <Button
                    title="Crear Cuenta"
                    onPress={handleCreateAccount}
                    color={colors.primary}
                    disabled={isLoading}
                />
            </View>
        )}

        <Button
            title="Ya tengo cuenta (Ir a Login)"
            onPress={() => navigation.navigate('Login')} 
            color={colors.secondary}
            disabled={isLoading}
        />
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
        marginTop: 10,
        marginBottom: 20,
    },
    errorTextCustom: {
        textAlign: 'center',
        marginBottom: 10,
    },
    loader: {
        marginTop: 10,
        marginBottom: 20,
    }
});