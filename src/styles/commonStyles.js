import { StyleSheet, Platform } from "react-native";

export const colors = {
  primary: "#007AFF",
  primaryDark: "#0056b3",
  secondary: "#6c757d",
  accent: "#17a2b8",
  background: "#F4F6F8",
  surface: "#FFFFFF",
  text: "#212529",
  textSecondary: "#6c757d",
  placeholder: "#adb5bd",
  border: "#CED4DA",
  error: "#dc3545",
  success: "#28a745",
  warning: "#ffc107",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  full: 999,
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "android" ? spacing.md : 0,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.md,
  },

  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === "ios" ? spacing.md : spacing.sm + 2,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonTextDisabled: {
    color: colors.textSecondary,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  icon: {
    color: colors.primary,
  },
});
