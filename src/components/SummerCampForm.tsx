import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { sendSummerCampEmail } from '../services/emailService';
import { redirectToRedsysPayment } from '../services/redsysService';

interface Week {
  id: number;
  name: string;
  period: string;
  basePrice: number;
  menjadorPrice: number;
  guarderiaPrice: number;
  available: boolean;
}

interface WeekService {
  menjador: boolean;
  guarderia: boolean;
}

interface FormData {
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
  selectedWeeks: { [key: number]: boolean };
  weekServices: { [key: number]: WeekService };
}

interface SelectedWeekInfo {
  name?: string;
  period?: string;
  basePrice?: number;
  menjador: boolean;
  guarderia: boolean;
  menjadorPrice: number | undefined;
  guarderiaPrice: number | undefined;
}

// Ampliamos la interfaz EmailData para incluir la información de semanas seleccionadas
interface ExtendedEmailData {
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
  selectedWeeksInfo: SelectedWeekInfo[];
}

const SummerCampForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weeks: Week[] = [
    { id: 1, name: "Setmana 1", period: "de l'1 al 4 de juliol (4 dies)", basePrice: 30, menjadorPrice: 30.8, guarderiaPrice: 17.2, available: false },
    { id: 2, name: "Setmana 2", period: "del 8 a l'11 de juliol (4 dies)", basePrice: 30, menjadorPrice: 30.8, guarderiaPrice: 17.2, available: false },
    { id: 3, name: "Setmana 3", period: "del 14 al 18 de juliol", basePrice: 47.5, menjadorPrice: 38.5, guarderiaPrice: 21.5, available: true },
    { id: 4, name: "Setmana 4", period: "del 21 al 25 de juliol", basePrice: 47.5, menjadorPrice: 38.5, guarderiaPrice: 21.5, available: false },
    { id: 5, name: "Setmana 5", period: "del 28 de juliol al 1 d'agost", basePrice: 47.5, menjadorPrice: 38.5, guarderiaPrice: 21.5, available: true },
    { id: 6, name: "Setmana 6", period: "del 4 al 8 d'agost", basePrice: 47.5, menjadorPrice: 38.5, guarderiaPrice: 21.5, available: true },
    { id: 7, name: "Setmana 7", period: "del 11 al 14 d'agost (4 dies)", basePrice: 30, menjadorPrice: 30.8, guarderiaPrice: 17.2, available: true },
    { id: 8, name: "Setmana 8", period: "del 18 al 22 d'agost", basePrice: 47.5, menjadorPrice: 38.5, guarderiaPrice: 21.5, available: false },
    { id: 9, name: "Setmana 9", period: "del 25 al 29 d'agost", basePrice: 47.5, menjadorPrice: 38.5, guarderiaPrice: 21.5, available: true },
    { id: 10, name: "Setmana 10", period: "de l'1 al 5 de setembre", basePrice: 47.5, menjadorPrice: 38.5, guarderiaPrice: 21.5, available: true }
  ];

  const [formData, setFormData] = useState<FormData>({
    childName: '',
    birthDate: '',
    address: '',
    population: '',
    parish: '',
    parentsNames: '',
    phone: '',
    email: '',
    allergies: '',
    largeFamily: false,
    selectedWeeks: {},
    weekServices: {}
  });

  const calculateTotal = () => {
    let total = 0;
    Object.keys(formData.selectedWeeks).forEach(weekId => {
      if (formData.selectedWeeks[parseInt(weekId)]) {
        const week = weeks.find(w => w.id === parseInt(weekId));
        if (week) {
          total += week.basePrice;
          const services = formData.weekServices[parseInt(weekId)] || { menjador: false, guarderia: false };
          if (services.menjador) total += week.menjadorPrice;
          if (services.guarderia) total += week.guarderiaPrice;
        }
      }
    });
    
    const discount = formData.largeFamily ? 0.25 : 0;
    return total * (1 - discount);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWeekSelection = (weekId: number, selected: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedWeeks: {
        ...prev.selectedWeeks,
        [weekId]: selected
      },
      weekServices: {
        ...prev.weekServices,
        [weekId]: selected 
          ? (prev.weekServices[weekId] || { menjador: false, guarderia: false }) 
          : { menjador: false, guarderia: false }
      }
    }));
  };

  const handleServiceSelection = (weekId: number, service: 'menjador' | 'guarderia', selected: boolean) => {
    setFormData(prev => ({
      ...prev,
      weekServices: {
        ...prev.weekServices,
        [weekId]: {
          ...(prev.weekServices[weekId] || { menjador: false, guarderia: false }),
          [service]: selected
        }
      }
    }));
  };

  const finalPrice = calculateTotal();
  const hasSelectedWeeks = Object.values(formData.selectedWeeks).some(selected => selected);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['childName', 'birthDate', 'address', 'population', 'parish', 'parentsNames', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: "Si us plau, omple tots els camps obligatoris",
        variant: "destructive"
      });
      return;
    }

    if (!hasSelectedWeeks) {
      toast({
        title: "Error",
        description: "Si us plau, selecciona almenys una setmana",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generamos un orderId único
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      const orderId = `${timestamp}${randomNum}`.substring(0, 12);

      // Preparar datos para la base de datos
      const selectedWeeksInfo = Object.keys(formData.selectedWeeks)
        .filter(weekId => formData.selectedWeeks[parseInt(weekId)])
        .map(weekId => {
          const weekIdNum = parseInt(weekId);
          const week = weeks.find(w => w.id === weekIdNum);
          const services = formData.weekServices[weekIdNum] || { menjador: false, guarderia: false };
          return {
            weekId: weekIdNum,
            name: week?.name,
            period: week?.period,
            basePrice: week?.basePrice,
            menjador: services.menjador,
            guarderia: services.guarderia,
            menjadorPrice: services.menjador ? week?.menjadorPrice : 0,
            guarderiaPrice: services.guarderia ? week?.guarderiaPrice : 0
          };
        });

      // Guardar en base de datos MySQL
      const { insertInscription } = await import('../services/databaseService');
      
      const inscriptionData = {
        child_name: formData.childName,
        birth_date: formData.birthDate,
        address: formData.address,
        population: formData.population,
        parish: formData.parish,
        parents_names: formData.parentsNames,
        phone: formData.phone,
        email: formData.email,
        allergies: formData.allergies,
        large_family: formData.largeFamily,
        selected_weeks: JSON.stringify(selectedWeeksInfo),
        week_services: JSON.stringify(formData.weekServices),
        total_price: finalPrice,
        payment_status: 'pending' as const,
        payment_order_id: orderId
      };

      const inscriptionId = await insertInscription(inscriptionData);
      console.log('Inscripción guardada en MySQL con ID:', inscriptionId);

      // Enviar email como backup
      try {
        const emailData = {
          ...formData,
          selectedWeeksInfo,
          totalPrice: finalPrice
        };
        await sendSummerCampEmail(emailData as any);
        console.log('Email de confirmación enviado');
      } catch (emailError) {
        console.warn('Error enviando email, pero inscripción guardada:', emailError);
      }

      toast({
        title: "Inscripció guardada",
        description: "La inscripció s'ha guardat correctament. Redirigint al pagament...",
      });

      setTimeout(() => {
        handlePayment(orderId);
      }, 2000);

    } catch (error) {
      console.error('Error guardando inscripción:', error);
      toast({
        title: "Error",
        description: "Hi ha hagut un error guardant la inscripció. Si us plau, torna-ho a intentar.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = (orderId: string) => {
    try {
      // El importe debe estar en céntimos (sin decimales)
      const amountInCents = Math.round(finalPrice * 100);

      const selectedWeeksText = Object.keys(formData.selectedWeeks)
        .filter(weekId => formData.selectedWeeks[parseInt(weekId)])
        .map(weekId => weeks.find(w => w.id === parseInt(weekId))?.name)
        .join(', ');

      console.log(`Preparando pago de ${finalPrice}€ (${amountInCents} céntimos) para OrderID: ${orderId}`);

      const paymentData = {
        amount: amountInCents,
        orderId: orderId,
        productDescription: `Inscripció Casal d'Estiu - ${formData.childName} - ${selectedWeeksText}`,
        merchantUrl: `${window.location.origin}/payment-response`,
        urlOk: `${window.location.origin}/payment-success`,
        urlKo: `${window.location.origin}/payment-error`
      };

      console.log('Datos de pago enviados a Redsys:', paymentData);
      redirectToRedsysPayment(paymentData);
    } catch (error) {
      console.error('Error al preparar el pago:', error);
      toast({
        title: "Error",
        description: "Hi ha hagut un error preparant el pagament. Si us plau, contacta amb nosaltres.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl text-blue-800 text-center">
            {t('summerCamp.title')}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {t('summerCamp.description')}
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Selección de semanas */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Selecciona les setmanes *
            </h3>
            
            <div className="space-y-4">
              {weeks.filter(week => week.available).map((week) => (
                <Card key={week.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={`week-${week.id}`}
                        checked={formData.selectedWeeks[week.id] || false}
                        onCheckedChange={(checked) => handleWeekSelection(week.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Label htmlFor={`week-${week.id}`} className="font-medium cursor-pointer">
                              {week.name} - {week.period}
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">
                              Preu base: {week.basePrice}€
                            </p>
                          </div>
                        </div>
                        
                        {formData.selectedWeeks[week.id] && (
                          <div className="mt-3 pl-4 border-l-2 border-blue-200">
                            <p className="text-sm font-medium mb-2">Serveis opcionals:</p>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`menjador-${week.id}`}
                                  checked={formData.weekServices[week.id]?.menjador || false}
                                  onCheckedChange={(checked) => handleServiceSelection(week.id, 'menjador', checked as boolean)}
                                />
                                <Label htmlFor={`menjador-${week.id}`} className="text-sm cursor-pointer">
                                  Servei de menjador (+{week.menjadorPrice}€)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`guarderia-${week.id}`}
                                  checked={formData.weekServices[week.id]?.guarderia || false}
                                  onCheckedChange={(checked) => handleServiceSelection(week.id, 'guarderia', checked as boolean)}
                                />
                                <Label htmlFor={`guarderia-${week.id}`} className="text-sm cursor-pointer">
                                  Servei de guarderia (+{week.guarderiaPrice}€)
                                </Label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Descuento y total */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id="largeFamily"
                  checked={formData.largeFamily}
                  onCheckedChange={(checked) => handleInputChange('largeFamily', checked as boolean)}
                />
                <Label htmlFor="largeFamily" className="text-sm">
                  25% de descompte per família nombrosa o monoparental
                </Label>
              </div>
              
              <div className="text-right mt-4">
                <span className="text-lg font-bold">
                  TOTAL GENERAL: 
                  <span className="text-red-600 ml-2">{finalPrice.toFixed(2)} €</span>
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del niño/a */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="childName" className="text-sm font-medium">
                  Nom del nen/a *
                </Label>
                <Input
                  id="childName"
                  value={formData.childName}
                  onChange={(e) => handleInputChange('childName', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="birthDate" className="text-sm font-medium">
                  Data de naixement *
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Adreça *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="population" className="text-sm font-medium">
                  Població *
                </Label>
                <Input
                  id="population"
                  value={formData.population}
                  onChange={(e) => handleInputChange('population', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="parish" className="text-sm font-medium">
                  Parròquia *
                </Label>
                <Input
                  id="parish"
                  value={formData.parish}
                  onChange={(e) => handleInputChange('parish', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="parentsNames" className="text-sm font-medium">
                Nom dels pares *
              </Label>
              <Input
                id="parentsNames"
                value={formData.parentsNames}
                onChange={(e) => handleInputChange('parentsNames', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Telèfon *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Correu electrònic *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="allergies" className="text-sm font-medium">
                Al·lèrgies, intoleràncies o malalties
              </Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                className="mt-1"
                rows={3}
                placeholder="Descripció d'al·lèrgies, intoleràncies o malalties..."
              />
            </div>

            <div className="text-center text-sm text-gray-500 mb-4">
              (*) Camps obligatoris
            </div>

            <div className="text-center">
              <Button 
                type="submit" 
                disabled={isSubmitting || !hasSelectedWeeks}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Enviant i redirigint al pagament...' : 'Enviar i Pagar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummerCampForm;
