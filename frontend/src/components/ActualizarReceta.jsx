import React, { useState } from 'react';
import axios from 'axios';

const UpdateRecipeComponent = () => {
    const [nombre, setNombre] = useState('');
    const [nuevosIngredientes, setNuevosIngredientes] = useState('');
    const [nuevosPasos, setNuevosPasos] = useState('');
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    const handleUpdateRecipe = async () => {
        try {
            await axios.put(`http://localhost:3001/actualizar-receta/${nombre}`, { nuevosIngredientes: nuevosIngredientes.split(','), nuevosPasos, nuevaCategoria });
            alert('Receta actualizada correctamente');
            setNombre('');
            setNuevosIngredientes('');
            setNuevosPasos('');
            setNuevaCategoria('');
        } catch (error) {
            console.error('Error al actualizar receta:', error);
            alert('Error al actualizar receta');
        }
    };

    return (
        <div className="update-recipe">
            <h2>Actualizar Receta Existente</h2>
            <label htmlFor="nombre">Nombre de la Receta a Actualizar:</label>
            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} /><br />
            <label htmlFor="nuevosIngredientes">Nuevos Ingredientes (separados por coma):</label>
            <input type="text" id="nuevosIngredientes" value={nuevosIngredientes} onChange={(e) => setNuevosIngredientes(e.target.value)} /><br />
            <label htmlFor="nuevosPasos">Nuevos Pasos:</label>
            <textarea id="nuevosPasos" value={nuevosPasos} onChange={(e) => setNuevosPasos(e.target.value)} /><br />
            <label htmlFor="nuevaCategoria">Nueva Categoría:</label>
            <input type="text" id="nuevaCategoria" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} /><br />
            <button onClick={handleUpdateRecipe}>Actualizar Receta</button>
        </div>
    );
};

export default UpdateRecipeComponent;
