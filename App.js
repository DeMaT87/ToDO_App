import React from 'react';
import { Provider } from 'react-redux'; // Importa Provider
import { store } from './src/store/index'; // Importa el store configurado
import AppNavigator from './src/navigation/AppNavigator';

// El componente principal App ahora envuelve el navegador con el Provider
export default function App() {
  return (
    // El Provider recibe el store como prop
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}



