import React, { useState } from 'react';
import { ReactTags } from 'react-tag-autocomplete';
import axios from 'axios';

function BuscarRecetas() {
    const [tags, setTags] = useState([]);
    const [recetas, setRecetas] = useState([]);

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    };

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleBusqueda = async () => {
        const ingredientes = tags.map(tag => tag.name);
        try {
            const response = await axios.post('http://localhost:3001/buscar-recetas', { ingredientes });
            setRecetas(response.data);
        } catch (error) {
            console.error('Error al buscar recetas:', error);
        }
    };

    return (
        <div>
            <h1>Buscar Recetas</h1>
            <ReactTags
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                placeholder="Agrega un ingrediente y presiona Enter"
            />
            <button onClick={handleBusqueda}>Buscar</button>
            <h2>Resultados de la Búsqueda</h2>
            <ul>
                {recetas.map((receta, index) => (
                    <li key={index}>
                        <h3>{receta.nombre}</h3>
                        <p>Ingredientes: {receta.ingredientes.join(', ')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BuscarRecetas;
