import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CompletedTasksScreen from "../screens/CompletedTasksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../styles/commonStyles";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Tareas") {
            iconName = focused ? "list-circle" : "list-circle-outline";
          } else if (route.name === "Completadas") {
            iconName = focused
              ? "checkmark-done-circle"
              : "checkmark-done-circle-outline";
          } else if (route.name === "Ajustes") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.darkGrey,

        headerShown: false,
      })}
    >
      <Tab.Screen name="Tareas" component={HomeScreen} />
      <Tab.Screen name="Completadas" component={CompletedTasksScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
