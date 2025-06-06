
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PaymentResponse = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  useEffect(() => {
    // Aquí podrías procesar la respuesta de Redsys si es necesario
    console.log('Parámetros de respuesta recibidos:', Object.fromEntries(queryParams.entries()));
    
    // Simulamos un tiempo de procesamiento
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [queryParams]);

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-xl text-blue-800 text-center">
            Processant la resposta del pagament
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 text-center">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
              <p>Estem processant la teva transacció...</p>
            </>
          ) : (
            <>
              <p className="mb-4">La resposta ha estat processada.</p>
              <Button asChild>
                <Link to="/">Tornar a l'inici</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResponse;
