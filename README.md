# Proyecto ToDo App MVP (React Native - Expo)

Este repositorio contiene el código fuente para un MVP (Minimum Viable Product) de una aplicación móvil de lista de tareas (ToDo) desarrollada con React Native y Expo.

## Tecnologías Utilizadas

* **Framework:** React Native (gestionado con Expo)
* **Lenguaje:** JavaScript
* **Navegación:** React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`)
* **Componentes Nativos:** `@react-native-community/datetimepicker` (para selección de fecha/hora)
* **Estilos:** React Native `StyleSheet`, con estilos comunes centralizados.

## Estructura del Proyecto

La estructura principal del código fuente se organiza dentro de la carpeta `src`:

/tu-proyecto-expo|-- /assets             # Recursos estáticos (imágenes, fuentes, etc.)|-- /node_modules       # Dependencias del proyecto|-- /src                # Código fuente de la aplicación|   |-- /components     # (Opcional) Componentes reutilizables|   |-- /navigation     # Configuración de la navegación|   |   |-- AppNavigator.js|   |-- /screens        # Componentes de cada pantalla principal|   |   |-- HomeScreen.js|   |   |-- LoginScreen.js|   |   |-- TaskDetailScreen.js|   |-- /styles         # Archivos de estilos|   |   |-- commonStyles.js # Estilos y colores compartidos|-- App.js              # Punto de entrada principal de la app|-- app.json            # Configuración de Expo|-- babel.config.js     # Configuración de Babel|-- package.json        # Dependencias y scripts del proyecto|-- README.md           # Este archivo
## Funcionalidades Actuales (MVP)

* **Autenticación Básica:** Pantalla de Login con credenciales fijas (`admin` / `12345`).
* **Navegación:** Flujo de navegación entre las pantallas de Login, Home (lista de tareas) y Detalle de Tarea usando Stack Navigator.
* **Gestión de Tareas (Pantalla Home):**
    * Añadir nuevas tareas.
    * Visualizar la lista de tareas.
    * Marcar/desmarcar tareas como completadas.
    * Eliminar tareas.
    * Visualizar fecha de vencimiento (si asignada).
* **Detalle de Tarea (Pantalla Detalle):**
    * Ver/Editar el texto de la tarea.
    * Asignar/Modificar fecha y hora de vencimiento usando selectores nativos.
* **Estilos Centralizados:** Uso de un archivo `commonStyles.js` para mantener la consistencia visual básica.

## Instalación y Ejecución

1.  **Clonar el Repositorio (si aplica):**
    ```bash
    git clone <url-del-repositorio>
    cd <nombre-del-directorio>
    ```

2.  **Instalar Dependencias:**
    Asegúrate de tener Node.js y npm/yarn instalados.
    ```bash
    npm install
    # o
    yarn install
    ```
    Instala las dependencias específicas de Expo y React Navigation si no se instalaron correctamente:
    ```bash
    npx expo install react-native-screens react-native-safe-area-context @react-native-community/datetimepicker
    npm install @react-navigation/native @react-navigation/native-stack
    # o
    yarn add @react-navigation/native @react-navigation/native-stack
    ```

3.  **Ejecutar la Aplicación:**
    Inicia el servidor de desarrollo de Expo:
    ```bash
    npx expo start
    ```
    Sigue las instrucciones en la terminal para abrir la aplicación en un emulador/simulador o escaneando el código QR con la aplicación Expo Go en tu dispositivo físico.

## Próximos Pasos (Sugerencias)

* Implementar estilos visuales más detallados.
* Conectar la aplicación a una base de datos (ej. Firebase Firestore) para persistencia de datos.
* Implementar autenticación real (ej. Firebase Authentication).
* Mejorar la gestión de estado (ej. usando Context API o Zustand).
* Añadir funcionalidades extra (prioridades, categorías, recordatorios, etc.).
* Escribir pruebas unitarias e de integración.


