import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import MainTabNavigator from "./MainTabNavigator";
import TaskDetailScreen from "../screens/TaskDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator({ isAuthenticated }) {
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="MainApp"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{ title: "Detalle de Tarea" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Crear Cuenta" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
