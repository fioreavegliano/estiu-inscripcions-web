
import CryptoJS from 'crypto-js';

// Configuración de Redsys actualizada con la clave correcta
const REDSYS_CONFIG = {
  merchantCode: '992082974',
  terminal: '1',
  secretKey: 'sq7HjrUOBfKmC576ILgskD5srU870gJ7', // Clave correcta proporcionada por Redsys
  url: 'https://sis.redsys.es/sis/realizarPago/utf-8', // URL de producción
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

// Función para codificar string a Base64 (siguiendo el ejemplo de Redsys)
const stringBase64Encode = (input: string): string => {
  const utf8Input = CryptoJS.enc.Utf8.parse(input);
  return CryptoJS.enc.Base64.stringify(utf8Input);
};

// Función para decodificar Base64 (siguiendo el ejemplo de Redsys)
const base64Decode = (input: string): CryptoJS.lib.WordArray => {
  return CryptoJS.enc.Base64.parse(input);
};

// Función para cifrar con TripleDES (exactamente como en el ejemplo de Redsys)
const des_encrypt = (message: string, key: CryptoJS.lib.WordArray): string => {
  const ivArray = [0, 0, 0, 0, 0, 0, 0, 0];
  const IV = ivArray.map(item => String.fromCharCode(item)).join("");
  
  console.log('IV para TripleDES:', IV);
  
  const encode_str = CryptoJS.TripleDES.encrypt(message, key, {
    iv: CryptoJS.enc.Utf8.parse(IV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  
  return encode_str.toString();
};

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

    // Codificar parámetros en Base64 usando la función del ejemplo de Redsys
    const merchantParametersJson = JSON.stringify(merchantParameters);
    console.log('JSON de parámetros antes de codificar:', merchantParametersJson);
    
    const encodedParameters = stringBase64Encode(merchantParametersJson);
    console.log('Parámetros codificados en Base64:', encodedParameters);
    
    // Crear firma siguiendo exactamente el algoritmo del ejemplo de Redsys
    const signature = calcularFirmaRedsys(encodedParameters, formattedOrderId);
    console.log('Firma generada:', signature);

    return {
      Ds_SignatureVersion: 'HMAC_SHA256_V1',
      Ds_MerchantParameters: encodedParameters,
      Ds_Signature: signature
    };
  } catch (error) {
    console.error('Error creando el pago de Redsys:', error);
    throw error;
  }
};

// Función para calcular la firma siguiendo exactamente el ejemplo de Redsys
const calcularFirmaRedsys = (encodedParameters: string, merchantOrder: string): string => {
  try {
    console.log('=== INICIANDO CÁLCULO DE FIRMA ===');
    console.log('Merchant Order:', merchantOrder);
    console.log('Encoded Parameters:', encodedParameters);
    
    // La clave ya está en Base64, como en el ejemplo
    const encodedSignature = REDSYS_CONFIG.secretKey;
    console.log('Clave Base64:', encodedSignature);
    
    // Se cifra el número de pedido con la clave para obtener la clave de operación
    const encodedSignatureDES = des_encrypt(merchantOrder, base64Decode(encodedSignature));
    console.log('Clave de la operación (TripleDES):', encodedSignatureDES);
    
    // Se calcula el HMAC de los parámetros en Base64 con la clave de operación
    const encodedDsSignature = CryptoJS.HmacSHA256(encodedParameters, base64Decode(encodedSignatureDES));
    console.log('HMAC calculado:', encodedDsSignature.toString());
    
    // Se pasa a Base64
    const dsSignature = CryptoJS.enc.Base64.stringify(encodedDsSignature);
    console.log('HMAC en Base64:', dsSignature);
    
    console.log('=== FIN CÁLCULO DE FIRMA ===');
    
    return dsSignature;
  } catch (error) {
    console.error('Error calculando la firma:', error);
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
