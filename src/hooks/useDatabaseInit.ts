
import { useEffect } from 'react';
import { initializeDatabase } from '../services/databaseService';

export const useDatabaseInit = () => {
  useEffect(() => {
    const initDB = async () => {
      try {
        await initializeDatabase();
        console.log('Base de datos MySQL inicializada correctamente');
      } catch (error) {
        console.error('Error inicializando base de datos MySQL:', error);
      }
    };

    initDB();
  }, []);
};
