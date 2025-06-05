
import emailjs from '@emailjs/browser';

// Configuración actualizada de EmailJS
const EMAILJS_SERVICE_ID = 'service_thrbafh';
const EMAILJS_TEMPLATE_ID = 'template_qfkllkr';
const EMAILJS_PUBLIC_KEY = 'RGw4LWaHl4tdZNWgN';

export interface EmailData {
  childName: string;
  birthDate: string;
  address: string;
  population: string;
  parish: string;
  parentsNames: string;
  phone: string;
  email: string;
  allergies: string;
  largeFamily: boolean;
  totalPrice: number;
}

export const sendSummerCampEmail = async (formData: EmailData): Promise<boolean> => {
  try {
    console.log('Enviando email con datos:', formData);
    
    const templateParams = {
      to_email: 'inscripcions@tramitsordino.ad',
      child_name: formData.childName,
      birth_date: formData.birthDate,
      address: formData.address,
      population: formData.population,
      parish: formData.parish,
      parents_names: formData.parentsNames,
      phone: formData.phone,
      email: formData.email,
      allergies: formData.allergies || 'Cap',
      large_family: formData.largeFamily ? 'Sí' : 'No',
      total_price: formData.totalPrice.toFixed(2),
      submission_date: new Date().toLocaleString('ca-ES')
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email enviat correctament:', result);
    return true;
  } catch (error) {
    console.error('Error enviant email:', error);
    return false;
  }
};
