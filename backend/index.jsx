const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Configuración de Neo4j
const driver = neo4j.driver('neo4j+s://1806c2a0.databases.neo4j.io', neo4j.auth.basic('neo4j', '_9zPYEKfoLM_Cv5qD6RrU9dDt4H6wHnMSYo3ZCPLwJ8'));
let session;

try {
    session = driver.session();
    console.log('Conexión con Neo4j establecida');
} catch (error) {
    console.error('Error al conectar con Neo4j:', error);
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));  // Permitir solicitudes desde el frontend

// Caso de Uso 1: Buscar Recetas por Ingredientes Disponibles
const THRESHOLD_IMPORTANTES = 1;

app.post('/buscar-recetas', async (req, res) => {
    const ingredientes = req.body.ingredientes;
    console.log('Ingredientes recibidos:', ingredientes);

    try {
        console.log('Iniciando sesión en Neo4j');
        const result = await session.run(
            `
      MATCH (r:Receta)-[c:CONTIENE]->(i:Ingrediente)
      WHERE i.nombre IN $ingredientes
      WITH r, collect(i.nombre) AS ingredientesReceta, count(i) AS numIngredientes, 
           sum(case when i.importancia = true then 1 else 0 end) AS numImportantes
      WHERE numImportantes >= $thresholdImportantes
      RETURN r.nombre AS nombre, ingredientesReceta, r.pasos AS pasos, r.categoria AS categoria
      ORDER BY numImportantes DESC, numIngredientes DESC
      `,
            { ingredientes, thresholdImportantes: THRESHOLD_IMPORTANTES }
        );
        console.log('Consulta ejecutada');

        const recetas = result.records.map(record => ({
            nombre: record.get('nombre'),
            ingredientes: record.get('ingredientesReceta'),
            pasos: record.get('pasos'),
            categoria: record.get('categoria')
        }));

        res.json(recetas);
    } catch (error) {
        console.error('Error al consultar recetas:', error);
        res.status(500).send('Error al consultar recetas');
    }
});
// Caso de Uso 2: Agregar Nueva Receta
app.post('/agregar-receta', async (req, res) => {
    const { nombre, ingredientes, pasos, categoria } = req.body;
    console.log('Nueva receta recibida:', { nombre, ingredientes, pasos, categoria });

    try {
        console.log('Iniciando sesión en Neo4j');
        await session.run(
            `
      MERGE (r:Receta {nombre: $nombre})
      ON CREATE SET r.pasos = $pasos, r.categoria = $categoria
      ON MATCH SET r.pasos = $pasos, r.categoria = $categoria
      WITH r
      UNWIND $ingredientes AS nombreIngrediente
      MERGE (i:Ingrediente {nombre: nombreIngrediente})
      MERGE (r)-[:CONTIENE]->(i)
      `,
            { nombre, ingredientes, pasos, categoria }
        );
        console.log('Receta agregada');

        res.status(201).send('Receta agregada correctamente');
    } catch (error) {
        console.error('Error al agregar receta:', error);
        res.status(500).send('Error al agregar receta');
    }
});

// Caso de Uso 3: Actualizar Receta Existente
app.put('/actualizar-receta/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    const { nuevosIngredientes, nuevosPasos, nuevaCategoria } = req.body;
    console.log('Actualización de receta recibida:', { nombre, nuevosIngredientes, nuevosPasos, nuevaCategoria });

    try {
        console.log('Iniciando sesión en Neo4j');
        await session.run(
            `
      MATCH (r:Receta {nombre: $nombre})
      SET r.pasos = $nuevosPasos, r.categoria = $nuevaCategoria
      WITH r
      OPTIONAL MATCH (r)-[rel:CONTIENE]->(i:Ingrediente)
      DELETE rel
      WITH r
      UNWIND $nuevosIngredientes AS nombreIngrediente
      MERGE (i:Ingrediente {nombre: nombreIngrediente})
      MERGE (r)-[:CONTIENE]->(i)
      `,
            { nombre, nuevosIngredientes, nuevosPasos, nuevaCategoria }
        );
        console.log('Receta actualizada');

        res.send('Receta actualizada correctamente');
    } catch (error) {
        console.error('Error al actualizar receta:', error);
        res.status(500).send('Error al actualizar receta');
    }
});

// Caso de Uso 4: Eliminar Receta
app.delete('/eliminar-receta/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    console.log('Eliminación de receta recibida:', nombre);

    try {
        console.log('Iniciando sesión en Neo4j');
        await session.run(
            `
      MATCH (r:Receta {nombre: $nombre})
      DETACH DELETE r
      `,
            { nombre }
        );
        console.log('Receta eliminada');

        res.send('Receta eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar receta:', error);
        res.status(500).send('Error al eliminar receta');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

process.on('exit', () => {
    if (session) {
        session.close();
    }
    driver.close();
});
