
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updatePaymentStatus } from '../services/supabaseDatabaseService';

const PaymentResponse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processPaymentResponse = async () => {
      try {
        // Obtener parámetros de Redsys
        const dsResponse = searchParams.get('Ds_Response');
        const dsOrder = searchParams.get('Ds_Order');
        const dsSignature = searchParams.get('Ds_Signature');

        console.log('Respuesta de Redsys:', { dsResponse, dsOrder, dsSignature });

        if (!dsResponse || !dsOrder) {
          console.error('Faltan parámetros en la respuesta de Redsys');
          navigate('/payment-error');
          return;
        }

        // Verificar si el pago fue exitoso
        // En Redsys, códigos 0000-0099 son exitosos
        const responseCode = parseInt(dsResponse);
        const isSuccessful = responseCode >= 0 && responseCode <= 99;

        console.log(`Código de respuesta: ${responseCode}, Exitoso: ${isSuccessful}`);

        // Actualizar estado en base de datos
        if (dsOrder) {
          const status = isSuccessful ? 'completed' : 'failed';
          await updatePaymentStatus(dsOrder, status);
          console.log(`Estado de pago actualizado para ${dsOrder}: ${status}`);
        }

        // Redirigir según el resultado
        setTimeout(() => {
          if (isSuccessful) {
            navigate('/payment-success?order=' + dsOrder);
          } else {
            navigate('/payment-error?order=' + dsOrder + '&code=' + responseCode);
          }
        }, 2000);

      } catch (error) {
        console.error('Error procesando respuesta de pago:', error);
        navigate('/payment-error');
      } finally {
        setProcessing(false);
      }
    };

    processPaymentResponse();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-blue-800">
            Processant Pagament
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {processing ? (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Processant la resposta del pagament...</p>
            </div>
          ) : (
            <p>Redirigint...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResponse;
