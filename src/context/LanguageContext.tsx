
import React, { createContext, useContext, useState } from 'react';

export type Language = 'ca' | 'es' | 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ca: {
    // Header
    siteTitle: "TRÀMITS COMÚ D'ORDINO",
    nav: {
      inicio: "Inici",
      inscripcions: "Inscripcions",
      tramits: "Tràmits",
      contacte: "Contacte"
    },
    // Summer Camp Form
    summerCamp: {
      title: "INSCRIPCIONS CASAL D'ESTIU",
      description: "Aquest tràmit només es pot fer en cas que l'infant hagi estat inscrit prèviament al Servei de Ludoescola durant el curs escolar vigent. En el cas de famílies nombroses, cal haver presentat prèviament al Servei de Tràmits el Carnet de família nombrosa vigent.",
      subtitle: "INSCRIPCIONS PER CASAL D'ESTIU",
      discount: "25% de descompte per família nombrosa o monoparental :",
      totalGeneral: "TOTAL GENERAL :",
      childName: "Nom i cognoms de l'infant",
      birthDate: "Data de naixement",
      address: "Adreça",
      population: "Població",
      parish: "Parròquia",
      parentsNames: "Noms i cognoms dels pares o tutors",
      phone: "Telèfons",
      email: "Email",
      allergies: "Indicar si l'infant té alguna malaltia, al·lèrgia o intolerància.",
      required: "Paràmetres obligatoris",
      submit: "Enviar",
      dateFormat: "dd/mm/yyyy"
    },
    // Payment
    payment: {
      payWithRedsys: "Pagar amb Redsys",
      processing: "Processant pagament...",
      success: "Pagament realitzat correctament",
      error: "Error en el pagament"
    }
  },
  es: {
    // Header
    siteTitle: "TRÁMITES COMÚ D'ORDINO",
    nav: {
      inicio: "Inicio",
      inscripcions: "Inscripciones",
      tramits: "Trámites",
      contacte: "Contacto"
    },
    // Summer Camp Form
    summerCamp: {
      title: "INSCRIPCIONES CAMPAMENTO DE VERANO",
      description: "Este trámite solo se puede realizar en caso de que el niño haya estado inscrito previamente en el Servicio de Ludoescuela durante el curso escolar vigente. En el caso de familias numerosas, hay que haber presentado previamente al Servicio de Trámites el Carnet de familia numerosa vigente.",
      subtitle: "INSCRIPCIONES PARA CAMPAMENTO DE VERANO",
      discount: "25% de descuento por familia numerosa o monoparental :",
      totalGeneral: "TOTAL GENERAL :",
      childName: "Nombre y apellidos del niño",
      birthDate: "Fecha de nacimiento",
      address: "Dirección",
      population: "Población",
      parish: "Parroquia",
      parentsNames: "Nombres y apellidos de los padres o tutores",
      phone: "Teléfonos",
      email: "Email",
      allergies: "Indicar si el niño tiene alguna enfermedad, alergia o intolerancia.",
      required: "Parámetros obligatorios",
      submit: "Enviar",
      dateFormat: "dd/mm/yyyy"
    },
    // Payment
    payment: {
      payWithRedsys: "Pagar con Redsys",
      processing: "Procesando pago...",
      success: "Pago realizado correctamente",
      error: "Error en el pago"
    }
  },
  en: {
    // Header
    siteTitle: "PROCEDURES COMÚ D'ORDINO",
    nav: {
      inicio: "Home",
      inscripcions: "Registrations",
      tramits: "Procedures",
      contacte: "Contact"
    },
    // Summer Camp Form
    summerCamp: {
      title: "SUMMER CAMP REGISTRATIONS",
      description: "This procedure can only be done if the child has been previously enrolled in the Ludoescola Service during the current school year. In the case of large families, the current large family card must have been previously presented to the Procedures Service.",
      subtitle: "REGISTRATIONS FOR SUMMER CAMP",
      discount: "25% discount for large or single-parent families :",
      totalGeneral: "GENERAL TOTAL :",
      childName: "Child's name and surname",
      birthDate: "Date of birth",
      address: "Address",
      population: "Population",
      parish: "Parish",
      parentsNames: "Names and surnames of parents or guardians",
      phone: "Phone numbers",
      email: "Email",
      allergies: "Indicate if the child has any illness, allergy or intolerance.",
      required: "Mandatory parameters",
      submit: "Submit",
      dateFormat: "dd/mm/yyyy"
    },
    // Payment
    payment: {
      payWithRedsys: "Pay with Redsys",
      processing: "Processing payment...",
      success: "Payment completed successfully",
      error: "Payment error"
    }
  },
  fr: {
    // Header
    siteTitle: "DÉMARCHES COMÚ D'ORDINO",
    nav: {
      inicio: "Accueil",
      inscripcions: "Inscriptions",
      tramits: "Démarches",
      contacte: "Contact"
    },
    // Summer Camp Form
    summerCamp: {
      title: "INSCRIPTIONS CAMP D'ÉTÉ",
      description: "Cette démarche ne peut être effectuée que si l'enfant a été préalablement inscrit au Service Ludoescola pendant l'année scolaire en cours. Dans le cas de familles nombreuses, la carte de famille nombreuse en cours de validité doit avoir été présentée au préalable au Service des Démarches.",
      subtitle: "INSCRIPTIONS POUR LE CAMP D'ÉTÉ",
      discount: "25% de réduction pour famille nombreuse ou monoparentale :",
      totalGeneral: "TOTAL GÉNÉRAL :",
      childName: "Nom et prénoms de l'enfant",
      birthDate: "Date de naissance",
      address: "Adresse",
      population: "Population",
      parish: "Paroisse",
      parentsNames: "Noms et prénoms des parents ou tuteurs",
      phone: "Téléphones",
      email: "Email",
      allergies: "Indiquer si l'enfant a une maladie, allergie ou intolérance.",
      required: "Paramètres obligatoires",
      submit: "Envoyer",
      dateFormat: "jj/mm/aaaa"
    },
    // Payment
    payment: {
      payWithRedsys: "Payer avec Redsys",
      processing: "Traitement du paiement...",
      success: "Paiement effectué avec succès",
      error: "Erreur de paiement"
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ca');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
