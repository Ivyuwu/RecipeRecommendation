import React, { useState } from 'react';
import axios from 'axios';

const DeleteRecipeComponent = () => {
    const [nombre, setNombre] = useState('');

    const handleDeleteRecipe = async () => {
        try {
            await axios.delete(`http://localhost:3001/eliminar-receta/${nombre}`);
            alert('Receta eliminada correctamente');
            setNombre('');
        } catch (error) {
            console.error('Error al eliminar receta:', error);
            alert('Error al eliminar receta');
        }
    };

    return (
        <div className="delete-recipe">
            <h2>Eliminar Receta</h2>
            <label htmlFor="nombre">Nombre de la Receta a Eliminar:</label>
            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} /><br />
            <button onClick={handleDeleteRecipe}>Eliminar Receta</button>
        </div>
    );
};

export default DeleteRecipeComponent;
