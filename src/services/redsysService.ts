
import CryptoJS from 'crypto-js';

// Configuración de Redsys actualizada con los datos recibidos de la BBDD
const REDSYS_CONFIG = {
  merchantCode: '992082974',
  terminal: '1',
  secretKey: 'qwertyasdf0123456789', // Merchant_Key_Proves de tu BBDD
  // secretKeyProduction: 'iu5wkCidko+4fOXkIdCGejIpa9axJm/0', // Merchant_Key de producción
  url: 'https://sis.redsys.es/sis/realizarPago/utf-8', // URL de producción
  // urlTest: 'https://sis-t.redsys.es:25443/sis/realizarPago', // URL de pruebas
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

interface MerchantParameters {
  DS_MERCHANT_AMOUNT: string;
  DS_MERCHANT_ORDER: string;
  DS_MERCHANT_MERCHANTCODE: string;
  DS_MERCHANT_CURRENCY: string;
  DS_MERCHANT_TRANSACTIONTYPE: string;
  DS_MERCHANT_TERMINAL: string;
  DS_MERCHANT_MERCHANTURL: string;
  DS_MERCHANT_URLOK: string;
  DS_MERCHANT_URLKO: string;
  DS_MERCHANT_PRODUCTDESCRIPTION: string;
}

// Función para crear parámetros de pago
export const createRedsysPayment = (paymentData: PaymentData) => {
  try {
    // Formatea el importe para asegurar que no hay problemas
    // Redsys espera el importe en céntimos sin decimales
    const amount = Math.round(paymentData.amount).toString();
    
    console.log('Creando pago con importe:', amount);

    // El orderId debe seguir un formato específico para Redsys (12 caracteres alfanuméricos)
    // Asegurarse de que tiene exactamente 12 caracteres
    let formattedOrderId = paymentData.orderId;
    if (formattedOrderId.length > 12) {
      formattedOrderId = formattedOrderId.substring(0, 12);
    } else if (formattedOrderId.length < 12) {
      formattedOrderId = formattedOrderId.padStart(12, '0');
    }
    
    console.log('OrderId formateado:', formattedOrderId);

    const merchantParameters: MerchantParameters = {
      DS_MERCHANT_AMOUNT: amount,
      DS_MERCHANT_ORDER: formattedOrderId,
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
    const merchantParametersJson = JSON.stringify(merchantParameters);
    console.log('JSON de parámetros antes de codificar:', merchantParametersJson);
    
    const merchantParametersB64 = btoa(merchantParametersJson);
    console.log('Parámetros codificados en Base64:', merchantParametersB64);
    
    // Crear firma
    const signature = createSignature(merchantParametersB64, formattedOrderId);
    console.log('Firma generada:', signature);

    return {
      Ds_SignatureVersion: 'HMAC_SHA256_V1',
      Ds_MerchantParameters: merchantParametersB64,
      Ds_Signature: signature
    };
  } catch (error) {
    console.error('Error creando el pago de Redsys:', error);
    throw error;
  }
};

// Función para crear la firma HMAC siguiendo las especificaciones de Redsys
const createSignature = (merchantParametersB64: string, orderId: string): string => {
  try {
    console.log('Creando firma para orderId:', orderId);
    console.log('Clave secreta utilizada:', REDSYS_CONFIG.secretKey);
    
    // 1. Decodificar la clave Base64
    const keyB64 = REDSYS_CONFIG.secretKey;
    const keyDecoded = CryptoJS.enc.Base64.parse(keyB64);
    console.log('Clave decodificada (hex):', keyDecoded.toString());
    
    // 2. Generar clave derivada con el orderId
    const orderKeyBytes = CryptoJS.enc.Utf8.parse(orderId);
    console.log('OrderId en bytes (hex):', orderKeyBytes.toString());
    
    const derivedKey = CryptoJS.HmacSHA256(orderId, keyDecoded);
    console.log('Clave derivada (hex):', derivedKey.toString());
    
    // 3. Crear firma con los parámetros y la clave derivada
    const signature = CryptoJS.HmacSHA256(merchantParametersB64, derivedKey);
    console.log('Firma sin codificar (hex):', signature.toString());
    
    // 4. Codificar la firma en Base64
    const signatureB64 = CryptoJS.enc.Base64.stringify(signature);
    console.log('Firma final (Base64):', signatureB64);
    
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
