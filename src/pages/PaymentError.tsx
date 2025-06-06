
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const PaymentError = () => {
  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-xl text-red-800 text-center">
            Error en el Pagament
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          
          <h3 className="text-lg font-medium mb-2">Hi ha hagut un problema amb el pagament</h3>
          
          <p className="mb-6">
            La teva transacció no s'ha pogut completar. Si us plau, intenta-ho de nou o contacta amb nosaltres per rebre assistència.
          </p>
          
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Tornar a l'inici</Link>
            </Button>
            
            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
              <Link to="/">Intentar de nou</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentError;
