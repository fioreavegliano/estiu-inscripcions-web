
import mysql from 'mysql2/promise';

// Configuración de la base de datos MySQL
const dbConfig = {
  host: 'localhost', // o la IP de tu servidor
  user: 'tramitsord',
  password: '5SLde~?Vkqvfr5e7',
  database: 'inscripcions',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Crear pool de conexiones para mejor rendimiento
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función helper para ejecutar queries
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Función para cerrar el pool (útil para testing)
export const closePool = async () => {
  await pool.end();
};
