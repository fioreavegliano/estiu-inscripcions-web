
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-xl text-green-800 text-center">
            Pagament Completat
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          
          <h3 className="text-lg font-medium mb-2">Gràcies per la teva inscripció!</h3>
          
          <p className="mb-4">
            El pagament s'ha processat correctament. Rebràs un correu electrònic amb la confirmació.
          </p>
          
          <Button asChild>
            <Link to="/">Tornar a l'inici</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
