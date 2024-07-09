import React, { useState } from 'react';
import axios from 'axios';

const AddRecipeComponent = () => {
    const [nombre, setNombre] = useState('');
    const [ingredientes, setIngredientes] = useState('');
    const [pasos, setPasos] = useState('');
    const [categoria, setCategoria] = useState('');

    const handleAddRecipe = async () => {
        try {
            await axios.post('http://localhost:3001/agregar-receta', { nombre, ingredientes: ingredientes.split(','), pasos, categoria });
            alert('Receta agregada correctamente');
            setNombre('');
            setIngredientes('');
            setPasos('');
            setCategoria('');
        } catch (error) {
            console.error('Error al agregar receta:', error);
            alert('Error al agregar receta');
        }
    };

    return (
        <div className="add-recipe">
            <h2>Agregar Nueva Receta</h2>
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} /><br />
            <label htmlFor="ingredientes">Ingredientes (separados por coma):</label>
            <input type="text" id="ingredientes" value={ingredientes} onChange={(e) => setIngredientes(e.target.value)} /><br />
            <label htmlFor="pasos">Pasos:</label>
            <textarea id="pasos" value={pasos} onChange={(e) => setPasos(e.target.value)} /><br />
            <label htmlFor="categoria">Categoría:</label>
            <input type="text" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} /><br />
            <button onClick={handleAddRecipe}>Agregar Receta</button>
        </div>
    );
};

export default AddRecipeComponent;
