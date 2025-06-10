
import React from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import Header from '../components/Header';
import SummerCampForm from '../components/SummerCampForm';
import { useDatabaseInit } from '../hooks/useDatabaseInit';

const Index = () => {
  // Inicializar base de datos al cargar la aplicación
  useDatabaseInit();

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <SummerCampForm />
        </main>
        <footer className="bg-blue-800 text-white text-center py-4 mt-12">
          <p>© Tràmits - Comú d'Ordino</p>
        </footer>
      </div>
    </LanguageProvider>
  );
};

export default Index;
