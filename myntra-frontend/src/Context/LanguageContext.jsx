import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard Overview',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    categories: 'Category',
    subscriptions: 'Subscriptions',
    clients: 'Clients / Tenants',
    aiStyling: 'AI Styling',
    logout: 'Logout',
    welcome: 'Welcome back, Admin. Here is what is happening today.',
    totalProducts: 'Total Products (MongoDB)',
    activeTenants: 'Active Tenants',
    aiTryOns: 'AI Try-Ons Today'
  },
  hi: {
    dashboard: 'डैशबोर्ड सारांश',
    products: 'उत्पाद',
    orders: 'ऑर्डर',
    customers: 'ग्राहक',
    categories: 'श्रेणी',
    subscriptions: 'सदस्यता',
    clients: 'क्लाइंट / टेनेंट्स',
    aiStyling: 'एआई स्टाइलिंग',
    logout: 'लॉग आउट',
    welcome: 'वापस स्वागत है, एडमिन। यहाँ आज की गतिविधियों का विवरण है।',
    totalProducts: 'कुल उत्पाद (MongoDB)',
    activeTenants: 'सक्रिय टेनेंट्स',
    aiTryOns: 'आज के एआई ट्राई-ऑन्स'
  },
  mr: {
    dashboard: 'डॅशबोर्ड पुनरावलोकन',
    products: 'उत्पादने',
    orders: 'ऑर्डर्स',
    customers: 'ग्राहक',
    categories: 'श्रेणी',
    subscriptions: 'सदस्यता',
    clients: 'क्लायंट्स / टेनेंट्स',
    aiStyling: 'एआय स्टायलिंग',
    logout: 'बाहेर पडा',
    welcome: 'परत स्वागत आहे, ॲडमिन. आजची स्थिती खालीलप्रमाणे आहे.',
    totalProducts: 'एकूण उत्पादने (MongoDB)',
    activeTenants: 'सक्रिय टेनेंट्स',
    aiTryOns: 'आजचे एआय ट्राय-ऑन्स'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);