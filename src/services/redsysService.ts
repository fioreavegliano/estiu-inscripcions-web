
import CryptoJS from 'crypto-js';

// Configuración de Redsys actualizada con tus datos
const REDSYS_CONFIG = {
  merchantCode: '992082974', // Tu código de comercio real
  terminal: '1', // Terminal según tu configuración
  secretKey: 'qwertyasdf0123456789', // Tu clave secreta (Merchant_Key_Proves)
  url: 'https://sis.redsys.es/sis/realizarPago/utf-8', // URL de producción según tu imagen
  currency: '978', // EUR
  transactionType: '0' // Autorización
};

export interface PaymentData {
  amount: number; // En céntimos (ej: 10050 para 100.50€)
  orderId: string;
  productDescription: string;
  merchantUrl: string; // URL de tu web para recibir la respuesta
  urlOk: string; // URL de éxito
  urlKo: string; // URL de error
}

// Función para crear parámetros de pago
export const createRedsysPayment = (paymentData: PaymentData) => {
  const merchantParameters = {
    DS_MERCHANT_AMOUNT: paymentData.amount.toString(),
    DS_MERCHANT_ORDER: paymentData.orderId,
    DS_MERCHANT_MERCHANTCODE: REDSYS_CONFIG.merchantCode,
    DS_MERCHANT_CURRENCY: REDSYS_CONFIG.currency,
    DS_MERCHANT_TRANSACTIONTYPE: REDSYS_CONFIG.transactionType,
    DS_MERCHANT_TERMINAL: REDSYS_CONFIG.terminal,
    DS_MERCHANT_MERCHANTURL: paymentData.merchantUrl,
    DS_MERCHANT_URLOK: paymentData.urlOk,
    DS_MERCHANT_URLKO: paymentData.urlKo,
    DS_MERCHANT_PRODUCTDESCRIPTION: paymentData.productDescription
  };

  console.log('Parámetros del comercio:', merchantParameters);

  // Codificar parámetros en Base64
  const merchantParametersB64 = btoa(JSON.stringify(merchantParameters));
  console.log('Parámetros codificados en Base64:', merchantParametersB64);
  
  // Crear firma
  const signature = createSignature(merchantParametersB64, paymentData.orderId);
  console.log('Firma generada:', signature);

  return {
    Ds_SignatureVersion: 'HMAC_SHA256_V1',
    Ds_MerchantParameters: merchantParametersB64,
    Ds_Signature: signature
  };
};

// Función para crear la firma HMAC
const createSignature = (merchantParametersB64: string, orderId: string): string => {
  try {
    console.log('Creando firma para orderId:', orderId);
    console.log('Clave secreta utilizada:', REDSYS_CONFIG.secretKey);
    
    // Crear clave derivada
    const key = CryptoJS.enc.Base64.parse(REDSYS_CONFIG.secretKey);
    const derivedKey = CryptoJS.HmacSHA256(orderId, key);
    console.log('Clave derivada creada');
    
    // Crear firma
    const signature = CryptoJS.HmacSHA256(merchantParametersB64, derivedKey);
    const signatureB64 = CryptoJS.enc.Base64.stringify(signature);
    console.log('Firma final:', signatureB64);
    
    return signatureB64;
  } catch (error) {
    console.error('Error creando la firma:', error);
    throw error;
  }
};

// Función para redirigir al pago
export const redirectToRedsysPayment = (paymentData: PaymentData) => {
  try {
    console.log('Iniciando redirección a Redsys con datos:', paymentData);
    
    const formData = createRedsysPayment(paymentData);
    console.log('Datos del formulario para Redsys:', formData);
    
    // Crear formulario dinámico para envío
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = REDSYS_CONFIG.url;

    // Añadir campos del formulario
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
      console.log(`Campo añadido: ${key} = ${value}`);
    });

    // Añadir al DOM y enviar
    document.body.appendChild(form);
    console.log('Enviando formulario a Redsys...');
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error('Error en la redirección a Redsys:', error);
    throw error;
  }
};
