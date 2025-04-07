import { StyleSheet } from 'react-native';

// Define y exporta los estilos comunes
export const commonStyles = StyleSheet.create({
  // Estilo base para el contenedor principal de las pantallas
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15, // Un padding superior general
    backgroundColor: '#ffffff', // Fondo blanco por defecto
  },
  // Estilo para inputs de texto básicos
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    paddingVertical: 8,
    marginBottom: 15, // Margen inferior general para inputs
  },
  // Contenedor para botones (ej: fecha/hora, guardar)
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Espaciado entre botones
    marginTop: 20,
    marginBottom: 20,
  },
  // Estilo para etiquetas o títulos pequeños
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333333', // Color de texto oscuro
  },
  // Estilo para texto principal o descriptivo
  text: {
      fontSize: 16,
      color: '#333333',
      lineHeight: 22, // Espaciado de línea
  },
  // Estilo para errores o alertas
  errorText: {
      fontSize: 14,
      color: 'red',
      marginTop: 5,
      marginBottom: 10,
  },
  // Contenedor centrado (útil para Login o modales)
  centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#ffffff',
  },
  // Título principal de una pantalla
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333333',
  }
});

// También puedes exportar colores comunes si quieres
export const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  grey: '#cccccc',
  darkGrey: '#888888',
};

// Puedes exportar fuentes si las defines
// export const fonts = {
//   regular: 'NombreFuente-Regular',
//   bold: 'NombreFuente-Bold',
// };
