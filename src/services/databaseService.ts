
import { executeQuery } from '../config/database';

export interface CasalInscription {
  id?: number;
  child_name: string;
  birth_date: string;
  address: string;
  population: string;
  parish: string;
  parents_names: string;
  phone: string;
  email: string;
  allergies: string;
  large_family: boolean;
  selected_weeks: string; // JSON string
  week_services: string; // JSON string
  total_price: number;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_order_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Crear la tabla si no existe
export const createInscriptionsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS casal_inscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      child_name VARCHAR(255) NOT NULL,
      birth_date DATE NOT NULL,
      address TEXT NOT NULL,
      population VARCHAR(255) NOT NULL,
      parish VARCHAR(255) NOT NULL,
      parents_names VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      allergies TEXT,
      large_family BOOLEAN DEFAULT FALSE,
      selected_weeks JSON NOT NULL,
      week_services JSON NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
      payment_order_id VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_payment_order (payment_order_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await executeQuery(createTableQuery);
    console.log('Tabla casal_inscriptions creada/verificada exitosamente');
  } catch (error) {
    console.error('Error creando tabla casal_inscriptions:', error);
    throw error;
  }
};

// Insertar nueva inscripción
export const insertInscription = async (data: Omit<CasalInscription, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
  const query = `
    INSERT INTO casal_inscriptions (
      child_name, birth_date, address, population, parish, parents_names,
      phone, email, allergies, large_family, selected_weeks, week_services,
      total_price, payment_status, payment_order_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.child_name,
    data.birth_date,
    data.address,
    data.population,
    data.parish,
    data.parents_names,
    data.phone,
    data.email,
    data.allergies || null,
    data.large_family,
    data.selected_weeks,
    data.week_services,
    data.total_price,
    data.payment_status,
    data.payment_order_id || null
  ];

  try {
    const result: any = await executeQuery(query, params);
    console.log('Inscripción insertada con ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.error('Error insertando inscripción:', error);
    throw error;
  }
};

// Actualizar estado de pago
export const updatePaymentStatus = async (orderId: string, status: 'completed' | 'failed'): Promise<boolean> => {
  const query = `
    UPDATE casal_inscriptions 
    SET payment_status = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE payment_order_id = ?
  `;

  try {
    const result: any = await executeQuery(query, [status, orderId]);
    console.log(`Estado de pago actualizado para OrderID ${orderId}: ${status}`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error actualizando estado de pago:', error);
    throw error;
  }
};

// Obtener inscripción por OrderID
export const getInscriptionByOrderId = async (orderId: string): Promise<CasalInscription | null> => {
  const query = `SELECT * FROM casal_inscriptions WHERE payment_order_id = ?`;

  try {
    const results: any = await executeQuery(query, [orderId]);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error obteniendo inscripción por OrderID:', error);
    throw error;
  }
};

// Obtener todas las inscripciones (para administración)
export const getAllInscriptions = async (): Promise<CasalInscription[]> => {
  const query = `
    SELECT * FROM casal_inscriptions 
    ORDER BY created_at DESC
  `;

  try {
    const results: any = await executeQuery(query);
    return results;
  } catch (error) {
    console.error('Error obteniendo todas las inscripciones:', error);
    throw error;
  }
};

// Inicializar la base de datos
export const initializeDatabase = async () => {
  try {
    await createInscriptionsTable();
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    throw error;
  }
};
