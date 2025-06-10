
import { supabase } from '../integrations/supabase/client';

export interface CasalInscription {
  id?: number;
  childname: string;
  birthdate: string;
  address: string;
  population: string;
  parish: string;
  parentsnames: string;
  phone: string;
  email: string;
  allergies?: string;
  largefamily: boolean;
  setmanes: string; // JSON string
  totalprice: number;
  payment_status?: 'pending' | 'completed' | 'failed';
  payment_order_id?: string;
  created_at?: string;
}

// Insert new inscription
export const insertInscription = async (data: Omit<CasalInscription, 'id' | 'created_at'>): Promise<number> => {
  try {
    const { data: result, error } = await supabase
      .from('inscripcions')
      .insert([{
        childname: data.childname,
        birthdate: data.birthdate,
        address: data.address,
        population: data.population,
        parish: data.parish,
        parentsnames: data.parentsnames,
        phone: data.phone,
        email: data.email,
        allergies: data.allergies || null,
        largefamily: data.largefamily,
        setmanes: data.setmanes,
        totalprice: data.totalprice,
        payment_status: data.payment_status || 'pending',
        payment_order_id: data.payment_order_id || null
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting inscription:', error);
      throw error;
    }

    console.log('Inscripción insertada con ID:', result.id);
    return result.id;
  } catch (error) {
    console.error('Error insertando inscripción:', error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (orderId: string, status: 'completed' | 'failed'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inscripcions')
      .update({ 
        payment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('payment_order_id', orderId);

    if (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }

    console.log(`Estado de pago actualizado para OrderID ${orderId}: ${status}`);
    return true;
  } catch (error) {
    console.error('Error actualizando estado de pago:', error);
    throw error;
  }
};

// Get inscription by OrderID
export const getInscriptionByOrderId = async (orderId: string): Promise<CasalInscription | null> => {
  try {
    const { data, error } = await supabase
      .from('inscripcions')
      .select('*')
      .eq('payment_order_id', orderId)
      .maybeSingle();

    if (error) {
      console.error('Error getting inscription by OrderID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo inscripción por OrderID:', error);
    throw error;
  }
};

// Get all inscriptions (for administration)
export const getAllInscriptions = async (): Promise<CasalInscription[]> => {
  try {
    const { data, error } = await supabase
      .from('inscripcions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting all inscriptions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error obteniendo todas las inscripciones:', error);
    throw error;
  }
};
