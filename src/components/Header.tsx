
import React from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'ca', name: 'Català', flag: '🏴‍☠️' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/25e83cca-7210-4687-a0dc-07d670cc9350.png" 
              alt="Comú d'Ordino Logo" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold">{t('siteTitle')}</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="hover:text-blue-200 transition-colors">
              {t('nav.inicio')}
            </a>
            <a href="/inscripcions" className="hover:text-blue-200 transition-colors">
              {t('nav.inscripcions')}
            </a>
            <a href="/tramits" className="hover:text-blue-200 transition-colors">
              {t('nav.tramits')}
            </a>
            <a href="/contacte" className="hover:text-blue-200 transition-colors">
              {t('nav.contacte')}
            </a>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-blue-800">
                <Globe className="h-4 w-4 mr-2" />
                {languages.find(lang => lang.code === language)?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="cursor-pointer"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
