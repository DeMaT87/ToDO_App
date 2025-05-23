# Proyecto ToDo App (React Native - Expo)

Este repositorio contiene el código fuente para una aplicación móvil de lista de tareas (ToDo) desarrollada con React Native y Expo, con funcionalidades de autenticación y persistencia de datos utilizando Firebase y SQLite.

---

## Tecnologías Utilizadas

- **Framework:** React Native (gestionado con Expo)
- **Lenguaje:** JavaScript
- **Manejo de Estado:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Navegación:** React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- **Base de Datos en la Nube (Tareas):** Firebase Realtime Database
- **Autenticación:** Firebase Authentication (Email/Contraseña)
- **Base de Datos Local (Sesión):** `expo-sqlite`
- **Componentes Nativos:**
  - `@react-native-community/datetimepicker` (para selección de fecha/hora)
  - `expo-image-picker` (para selección/toma de fotos de perfil)
  - `expo-location` (para obtener ubicación actual y geocodificación inversa)
- **Iconos:** `@expo/vector-icons` (específicamente `Ionicons`)
- **Estilos:** React Native `StyleSheet`, con estilos comunes centralizados.

## Funcionalidades Implementadas

- **Autenticación con Firebase:**
  - Registro de nuevos usuarios con correo y contraseña (`SignUpScreen`).
  - Inicio de sesión de usuarios existentes (`LoginScreen`).
  - **Persistencia de Sesión Local:**
- **Persistencia de Sesión Local:**
  - Uso de `expo-sqlite` para recordar la sesión del usuario en el dispositivo.
  - Inicio de sesión automático si hay una sesión activa guardada.
- **Navegación Principal:**
  - Stack Navigator condicional que muestra pantallas de autenticación o la app principal según el estado de login.
  - Bottom Tab Navigator (`MainTabNavigator`) con tres pestañas para usuarios autenticados:
    - Tareas: Muestra `HomeScreen`.
    - Completadas: Muestra `CompletedTasksScreen`.
    - Ajustes: Muestra `SettingsScreen`.
- **Gestión de Tareas con Firebase Realtime Database y Redux:**
  - Las tareas se almacenan en Firebase RTDB bajo el nodo `/tasks/{userId}/`.
  - Listener en tiempo real en `App.js` que sincroniza las tareas de Firebase con el store de Redux.
  - **Pantalla Tareas (`HomeScreen`):**
    - Muestra solo tareas pendientes (no completadas).
    - Permite añadir nuevas tareas (se guardan en Firebase).
    - Navegación al detalle de la tarea.
    - Botones para marcar como completada y eliminar tarea (actualizan Firebase).
  - **Pantalla Completadas (`CompletedTasksScreen`):**
    - Muestra solo tareas marcadas como completadas.
    - Permite desmarcar una tarea (volverla pendiente) y eliminarla (actualizan Firebase).
  - **Pantalla Detalle de Tarea (`TaskDetailScreen`):**
    - Ver/Editar el texto de la tarea.
    - Asignar/Modificar fecha y hora de vencimiento.
    - Ubicación:
      - Permite añadir/actualizar la ubicación actual a la tarea.
      - Solicita permisos de ubicación.
      - Obtiene coordenadas y realiza geocodificación inversa para mostrar una dirección legible.
      - Todos los cambios se guardan en Firebase.
- **Ajustes (`SettingsScreen`):**
  - **Foto de Perfil:** Permite seleccionar una imagen de la galería o tomar una foto con la cámara (la subida a Firebase Storage y actualización del `photoURL` en Auth está pendiente).
  - **Mostrar Email:** Muestra el correo electrónico del usuario autenticado.
  - **Cierre de Sesión:** Cierra la sesión del usuario en Firebase y limpia la sesión local de SQLite.
- **Estilos Centralizados:** Uso de `commonStyles.js` para una apariencia básica consistente.

---

## Instalación y Ejecución

1.  **Configurar Firebase (Paso Previo Esencial):**

    - Crea un proyecto en la [Consola de Firebase](https://console.firebase.google.com/).
    - Habilita **Authentication** (Email/Contraseña).
    - Crea una **Realtime Database** (en modo de prueba para desarrollo inicial).
    - Habilita **Storage** (con reglas de seguridad básicas para desarrollo).
    - Registra tus apps (iOS y Android) en el proyecto de Firebase.
    - Descarga los archivos `google-services.json` (para Android) y `GoogleService-Info.plist` (para iOS) y colócalos en la **raíz** de tu proyecto Expo.
    - Copia las credenciales de configuración web de tu app Firebase en `src/firebase/firebaseConfig.js`.

2.  **Clonar el Repositorio (si aplica):**

    ```bash
    git clone <url-del-repositorio>
    cd <nombre-del-directorio>
    ```

3.  **Instalar Dependencias:**
    Asegúrate de tener Node.js y npm/yarn instalados.

    ```bash
    npm install
    ```

    o

    ```bash
    yarn install
    ```

    Verifica que las siguientes dependencias específicas estén instaladas (puedes usar `npx expo install nombre-del-paquete` para asegurar compatibilidad con Expo):

    - `firebase`
    - `@reduxjs/toolkit`
    - `react-redux`
    - `@react-navigation/native`
    - `@react-navigation/native-stack`
    - `@react-navigation/bottom-tabs`
    - `@expo/vector-icons`
    - `expo-sqlite`
    - `@react-native-community/datetimepicker`
    - `expo-image-picker`
    - `expo-location`
    - `@react-native-async-storage/async-storage` (para persistencia de Firebase Auth)

4.  **Configurar Permisos en `app.json`:**
    Asegúrate de tener las descripciones de uso y permisos necesarios para la cámara, galería y ubicación en tu `app.json`, especialmente para iOS (`infoPlist`) y Android (`permissions`), y los plugins correspondientes (`expo-image-picker`, `expo-location`).

5.  **Ejecutar la Aplicación:**
    Inicia el servidor de desarrollo de Expo:
    ```bash
    npx expo start --clear
    ```
    Sigue las instrucciones en la terminal para abrir la aplicación en un emulador/simulador o escaneando el código QR con la aplicación Expo Go en tu dispositivo físico.
