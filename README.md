# Proyecto ToDo App MVP (React Native - Expo)

Este repositorio contiene el código fuente para un MVP (Minimum Viable Product) de una aplicación móvil de lista de tareas (ToDo) desarrollada con React Native y Expo.

## Tecnologías Utilizadas

* **Framework:** React Native (gestionado con Expo)
* **Lenguaje:** JavaScript
* **Navegación:** React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`)
* **Componentes Nativos:** `@react-native-community/datetimepicker` (para selección de fecha/hora)
* **Estilos:** React Native `StyleSheet`, con estilos comunes centralizados.

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

## Próximos Pasos (Sugerencias)

* Implementar estilos visuales más detallados.
* Conectar la aplicación a una base de datos (ej. Firebase Firestore) para persistencia de datos.
* Implementar autenticación real (ej. Firebase Authentication).
* Mejorar la gestión de estado (ej. usando Context API o Zustand).
* Añadir funcionalidades extra (prioridades, categorías, recordatorios, etc.).
* Escribir pruebas unitarias e de integración.


