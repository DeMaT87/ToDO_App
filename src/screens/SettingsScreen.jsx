import React from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import { commonStyles, colors } from "../styles/commonStyles";

export default function SettingsScreen({ navigation }) {
  const handleLogout = () => {
    navigation.navigate("Login");
    console.log("Cerrar sesión presionado");
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.content}>
        <Text style={commonStyles.title}>Ajustes</Text>
        <Text style={commonStyles.text}>
          Esta pantalla contendrá las opciones de configuración de la
          aplicación.
        </Text>
        {/* Botón placeholder para cerrar sesión */}
        <View style={styles.logoutButton}>
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            color={colors.danger}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoutButton: {
    marginTop: 30,
    width: "80%",
  },
});
