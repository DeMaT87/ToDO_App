import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { commonStyles, colors } from '../components/commonStyles';

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {
    navigation.navigate('Home');
  };

  return (
    // Usa SafeAreaView para compatibilidad con notches/islas
    <SafeAreaView style={commonStyles.centeredContainer}>
      {/* View adicional si necesitas agrupar contenido */}
      <View style={styles.content}>
        <Text style={commonStyles.title}>Inicio de Sesión</Text>
        {/* Aquí irían los TextInput que usarían commonStyles.input */}
        {/* <TextInput placeholder="Usuario" style={commonStyles.input} /> */}
        {/* <TextInput placeholder="Contraseña" style={commonStyles.input} secureTextEntry /> */}
        <Button
            title="Ingresar (Ir a Home)"
            onPress={handleLogin}
            color={colors.primary} // Usa un color común
         />
      </View>
    </SafeAreaView>
  );
}

// Estilos específicos de LoginScreen (si los hubiera)
// Si no hay, puedes eliminar este StyleSheet o dejarlo vacío.
const styles = StyleSheet.create({
  content: {
    width: '80%', // Ancho del contenido en la pantalla centrada
    alignItems: 'center',
  },
  // Ejemplo de estilo específico que podrías añadir:
  // forgotPasswordText: {
  //   color: colors.secondary,
  //   marginTop: 15,
  // }
});

