import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';

// Pantalla Placeholder para el Registro de Cuenta
export default function SignUpScreen({ navigation }) {
  return (
    <SafeAreaView style={commonStyles.centeredContainer}>
      <View style={styles.content}>
        <Text style={commonStyles.title}>Crear Cuenta</Text>
        <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 30 }]}>
          Aquí iría el formulario para crear una nueva cuenta de usuario.
        </Text>
        {/* Botón para volver al Login */}
        <Button
            title="Volver a Inicio de Sesión"
            onPress={() => navigation.goBack()} // Simplemente regresa a la pantalla anterior
            color={colors.secondary}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    content: {
        width: '85%',
        alignItems: 'center',
    }
});