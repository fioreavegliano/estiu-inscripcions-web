
import React from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';
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
    <header className="bg-gradient-to-r from-blue-400 to-blue-300 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <nav className="flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-blue-100 flex items-center space-x-1">
                  <span>Inscripcions</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white z-50">
                <DropdownMenuItem className="cursor-pointer">
                  <a href="/" className="w-full">Casal d'Estiu</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <a href="/concursos" className="w-full">Concursos</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-blue-800 bg-white">
                <Globe className="h-4 w-4 mr-2" />
                {languages.find(lang => lang.code === language)?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-50">
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
