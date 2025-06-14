
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'chama.name': 'Chama Name',
    'chama.description': 'Description',
    'chama.contribution.amount': 'Contribution Amount (KES)',
    'chama.frequency': 'Frequency',
    'chama.max.members': 'Maximum Members',
    'chama.create': 'Create Chama',
    'chama.cancel': 'Cancel',
    'dashboard.net.worth': 'Net Worth',
    'dashboard.upcoming.contributions': 'Upcoming Contributions',
    'dashboard.pending.votes': 'Pending Votes',
    'dashboard.repayment.performance': 'Repayment Performance',
    'dashboard.roi': 'ROI',
    'reputation.contribution': 'Contribution Score',
    'reputation.repayment': 'Repayment Score',
    'reputation.participation': 'Participation Score',
    'reputation.overall': 'Overall Score',
    'member.reputation': 'Member Reputation',
    'language.settings': 'Language Settings'
  },
  sw: {
    'chama.name': 'Jina la Chama',
    'chama.description': 'Maelezo',
    'chama.contribution.amount': 'Kiasi cha Mchango (KES)',
    'chama.frequency': 'Mzunguko',
    'chama.max.members': 'Idadi ya Wanachama',
    'chama.create': 'Unda Chama',
    'chama.cancel': 'Ghairi',
    'dashboard.net.worth': 'Thamani ya Jumla',
    'dashboard.upcoming.contributions': 'Michango Inayokuja',
    'dashboard.pending.votes': 'Kura Zinazongoja',
    'dashboard.repayment.performance': 'Utendaji wa Malipo',
    'dashboard.roi': 'Faida ya Uwekezaji',
    'reputation.contribution': 'Alama ya Mchango',
    'reputation.repayment': 'Alama ya Malipo',
    'reputation.participation': 'Alama ya Ushiriki',
    'reputation.overall': 'Alama ya Jumla',
    'member.reputation': 'Sifa ya Mwanachama',
    'language.settings': 'Mipangilio ya Lugha'
  },
  sheng: {
    'chama.name': 'Jina ya Chama',
    'chama.description': 'Maelezo',
    'chama.contribution.amount': 'Pesa ya Mchango (KES)',
    'chama.frequency': 'Mara Ngapi',
    'chama.max.members': 'Watu Wangapi',
    'chama.create': 'Tengeneza Chama',
    'chama.cancel': 'Achana',
    'dashboard.net.worth': 'Pesa Zote',
    'dashboard.upcoming.contributions': 'Michango Inakam',
    'dashboard.pending.votes': 'Kura Bado',
    'dashboard.repayment.performance': 'Malipo Vipi',
    'dashboard.roi': 'Faida ya Biashara',
    'reputation.contribution': 'Points za Mchango',
    'reputation.repayment': 'Points za Malipo',
    'reputation.participation': 'Points za Kujiunga',
    'reputation.overall': 'Points Zote',
    'member.reputation': 'Heshima ya Member',
    'language.settings': 'Settings za Lugha'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string, defaultValue?: string): string => {
    return translations[language]?.[key] || defaultValue || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
