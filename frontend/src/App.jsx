import React from 'react';
import BuscarRecetas from './components/BuscarRecetas';
import AgregarReceta from './components/AgregarReceta';
import ActualizarReceta from './components/ActualizarReceta';
import EliminarReceta from './components/EliminarReceta';

const App = () => {
  return (
    <div className="app">
      <h1>Recipe Recommendation App</h1>
      <BuscarRecetas />
      <AgregarReceta />
      <ActualizarReceta />
      <EliminarReceta />
    </div>
  );
};
export default App;