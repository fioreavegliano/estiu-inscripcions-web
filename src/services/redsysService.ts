
import CryptoJS from 'crypto-js';

// Configuración de Redsys actualizada
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

// Función exacta del ejemplo de Redsys para codificar a Base64
function stringBase64Encode(input: string): string {
  const utf8Input = CryptoJS.enc.Utf8.parse(input);
  return CryptoJS.enc.Base64.stringify(utf8Input);
}

// Función exacta del ejemplo de Redsys para decodificar Base64
function base64Decode(input: string): CryptoJS.lib.WordArray {
  return CryptoJS.enc.Base64.parse(input);
}

// Función exacta del ejemplo de Redsys para cifrar con TripleDES
function des_encrypt(message: string, key: CryptoJS.lib.WordArray): string {
  const ivArray = [0, 0, 0, 0, 0, 0, 0, 0];
  const IV = ivArray.map(item => String.fromCharCode(item)).join("");
  
  console.log("IV", IV);
  
  const encode_str = CryptoJS.TripleDES.encrypt(message, key, {
    iv: CryptoJS.enc.Utf8.parse(IV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  
  return encode_str.toString();
}

// Función para crear parámetros de pago siguiendo exactamente el ejemplo
export const createRedsysPayment = (paymentData: PaymentData) => {
  try {
    console.log('=== CREANDO PAGO REDSYS ===');
    console.log('Datos originales:', paymentData);

    // Formatear el importe exactamente como en el ejemplo (sin decimales)
    const amount = Math.round(paymentData.amount).toString();
    console.log('Importe formateado:', amount);

    // Formatear el orderId exactamente como en el ejemplo (9 dígitos numéricos)
    let formattedOrderId = paymentData.orderId;
    // Asegurar que es numérico y tiene máximo 12 caracteres
    formattedOrderId = formattedOrderId.replace(/\D/g, ''); // Solo números
    if (formattedOrderId.length > 12) {
      formattedOrderId = formattedOrderId.substring(0, 12);
    } else if (formattedOrderId.length < 9) {
      formattedOrderId = formattedOrderId.padStart(9, '0');
    }
    console.log('OrderId formateado:', formattedOrderId);

    // Crear objeto de datos exactamente como en el ejemplo
    const data = {
      DS_MERCHANT_AMOUNT: amount,
      DS_MERCHANT_CURRENCY: REDSYS_CONFIG.currency,
      DS_MERCHANT_MERCHANTCODE: REDSYS_CONFIG.merchantCode,
      DS_MERCHANT_ORDER: formattedOrderId,
      DS_MERCHANT_TERMINAL: REDSYS_CONFIG.terminal,
      DS_MERCHANT_TRANSACTIONTYPE: REDSYS_CONFIG.transactionType,
      DS_MERCHANT_MERCHANTURL: paymentData.merchantUrl,
      DS_MERCHANT_URLOK: paymentData.urlOk,
      DS_MERCHANT_URLKO: paymentData.urlKo,
      DS_MERCHANT_PRODUCTDESCRIPTION: paymentData.productDescription
    };

    console.log('Datos del comercio:', data);

    // Codificar parámetros exactamente como en el ejemplo
    const encodedParameters = stringBase64Encode(JSON.stringify(data));
    console.log('Parámetros codificados (base64):', encodedParameters);

    // Calcular firma exactamente como en el ejemplo
    const signature = calcularFirma(formattedOrderId, encodedParameters);
    console.log('Firma calculada:', signature);

    const result = {
      Ds_SignatureVersion: 'HMAC_SHA256_V1',
      Ds_MerchantParameters: encodedParameters,
      Ds_Signature: signature
    };

    console.log('Resultado final:', result);
    console.log('=== FIN CREACIÓN PAGO REDSYS ===');

    return result;
  } catch (error) {
    console.error('Error creando el pago de Redsys:', error);
    throw error;
  }
};

// Función exacta del ejemplo de Redsys para calcular la firma
function calcularFirma(merchantOrder: string, encodedParameters: string): string {
  try {
    console.log('=== CALCULANDO FIRMA ===');
    console.log('Merchant Order:', merchantOrder);
    console.log('Encoded Parameters:', encodedParameters);

    // La clave ya está en Base64, como en el ejemplo
    const encodedSignature = REDSYS_CONFIG.secretKey;
    console.log('Clave Base64:', encodedSignature);

    // Se cifra el número de pedido con la clave para obtener la clave de operación
    const encodedSignatureDES = des_encrypt(merchantOrder, base64Decode(encodedSignature));
    console.log('Clave de la operación:', encodedSignatureDES);

    // Se calcula el HMAC de los parámetros en Base64 con la clave de operación
    const encodedDsSignature = CryptoJS.HmacSHA256(encodedParameters, base64Decode(encodedSignatureDES));
    console.log('HMAC', encodedDsSignature);

    // Se pasa a Base64
    const dsSignature = CryptoJS.enc.Base64.stringify(encodedDsSignature);
    console.log('HMAC base64', dsSignature);

    console.log('=== FIN CÁLCULO FIRMA ===');

    return dsSignature;
  } catch (error) {
    console.error('Error calculando la firma:', error);
    throw error;
  }
}

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
