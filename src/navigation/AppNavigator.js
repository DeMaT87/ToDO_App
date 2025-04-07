import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Pantalla de Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Inicio de Sesión' }}
        />
        {/* Pantalla Home */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Mis Tareas' }}
        />
        {/* Pantalla de Detalle de Tarea */}
        <Stack.Screen
          name="TaskDetail" 
          component={TaskDetailScreen}
          options={{ title: 'Detalle de Tarea' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

