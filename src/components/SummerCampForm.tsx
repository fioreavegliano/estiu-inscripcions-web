
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

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
}

const SummerCampForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
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
    largeFamily: false
  });

  const basePrice = 100; // Price in euros
  const discount = formData.largeFamily ? 0.25 : 0;
  const finalPrice = basePrice * (1 - discount);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

    // Simulate form submission
    console.log('Form submitted:', formData);
    
    toast({
      title: "Formulari enviat",
      description: "La inscripció s'ha processat correctament. Procedirem al pagament.",
    });

    // Here you would typically redirect to payment or handle payment processing
    handlePayment();
  };

  const handlePayment = () => {
    // This is where you would integrate with Redsys
    // For now, we'll simulate the payment process
    toast({
      title: t('payment.processing'),
      description: `Import: ${finalPrice.toFixed(2)}€`,
    });
    
    // In a real implementation, you would call your Redsys integration here
    setTimeout(() => {
      toast({
        title: t('payment.success'),
        description: "Rebràs un correu de confirmació aviat.",
      });
    }, 2000);
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              {t('summerCamp.subtitle')}
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id="largeFamily"
                  checked={formData.largeFamily}
                  onCheckedChange={(checked) => handleInputChange('largeFamily', checked as boolean)}
                />
                <Label htmlFor="largeFamily" className="text-sm">
                  {t('summerCamp.discount')}
                </Label>
              </div>
              
              <div className="text-right mt-4">
                <span className="text-lg font-bold">
                  {t('summerCamp.totalGeneral')} 
                  <span className="text-red-600 ml-2">{finalPrice.toFixed(2)} €</span>
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="childName" className="text-sm font-medium">
                  {t('summerCamp.childName')} *
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
                  {t('summerCamp.birthDate')} *
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="flex-1"
                    required
                  />
                  <span className="text-gray-400 text-sm">{t('summerCamp.dateFormat')}</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                {t('summerCamp.address')} *
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
                  {t('summerCamp.population')} *
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
                  {t('summerCamp.parish')} *
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
                {t('summerCamp.parentsNames')} *
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
                  {t('summerCamp.phone')} *
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
                  {t('summerCamp.email')} *
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
                {t('summerCamp.allergies')}
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
              (*) {t('summerCamp.required')}
            </div>

            <div className="text-center">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                {t('summerCamp.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummerCampForm;
