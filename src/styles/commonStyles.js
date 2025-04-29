import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,    
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#ffffff",
  },

  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    paddingVertical: 8,
    marginBottom: 15,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333333",
  },

  text: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 22,
  },

  errorText: {
    fontSize: 14,
    color: "red",
    marginTop: 5,
    marginBottom: 10,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333333",
  },
});

export const colors = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  light: "#f8f9fa",
  dark: "#343a40",
  white: "#ffffff",
  grey: "#cccccc",
  darkGrey: "#888888",
};
