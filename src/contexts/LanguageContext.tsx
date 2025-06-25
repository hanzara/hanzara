
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
    'nav.home': 'Home',
    'nav.chamas': 'Chamas',
    'nav.analytics': 'Analytics',
    'nav.create': 'Create',
    'nav.signOut': 'Sign Out',
    'nav.signIn': 'Sign In',
    'nav.welcome': 'Welcome',
    'auth.join': 'Join Chama Circle',
    'auth.join.desc': 'Sign in to manage your Chamas or create a new account',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.signIn.button': 'Sign In',
    'auth.signingIn.button': 'Signing in...',
    'auth.createAccount.button': 'Create Account',
    'auth.creatingAccount.button': 'Creating account...',
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
    'nav.home': 'Nyumbani',
    'nav.chamas': 'Chama',
    'nav.analytics': 'Takwimu',
    'nav.create': 'Unda',
    'nav.signOut': 'Toka',
    'nav.signIn': 'Ingia',
    'nav.welcome': 'Karibu',
    'auth.join': 'Jiunge na Chama Circle',
    'auth.join.desc': 'Ingia ili kudhibiti Chama chako au ufungue akaunti mpya',
    'auth.signIn': 'Ingia',
    'auth.signUp': 'Jisajili',
    'auth.email': 'Barua pepe',
    'auth.password': 'Nenosiri',
    'auth.fullName': 'Jina Kamili',
    'auth.confirmPassword': 'Thibitisha Nenosiri',
    'auth.signIn.button': 'Ingia',
    'auth.signingIn.button': 'Unaingia...',
    'auth.createAccount.button': 'Fungua Akaunti',
    'auth.creatingAccount.button': 'Inafungua akaunti...',
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
    'nav.home': 'Mtaani',
    'nav.chamas': 'Machama',
    'nav.analytics': 'Kuchanganua',
    'nav.create': 'Anzisha',
    'nav.signOut': 'Logi Out',
    'nav.signIn': 'Ingia',
    'nav.welcome': 'Karibu',
    'auth.join': 'Join Chama Circle',
    'auth.join.desc': 'Ingia umange machama zako ama utengeneze account mpya',
    'auth.signIn': 'Ingia',
    'auth.signUp': 'Jisajili',
    'auth.email': 'Barua pepe',
    'auth.password': 'Nenosiri',
    'auth.fullName': 'Jina Mkam',
    'auth.confirmPassword': 'Thibitisha Nenosiri',
    'auth.signIn.button': 'Ingia',
    'auth.signingIn.button': 'Inaingia...',
    'auth.createAccount.button': 'Tengeneza Akaunti',
    'auth.creatingAccount.button': 'Inatengeneza akaunti...',
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
  },
  giriama: {
    'nav.home': '[Giriama] Home',
    'nav.chamas': '[Giriama] Chamas',
    'nav.analytics': '[Giriama] Analytics',
    'nav.create': '[Giriama] Create',
    'nav.signOut': '[Giriama] Sign Out',
    'nav.signIn': '[Giriama] Sign In',
    'nav.welcome': '[Giriama] Welcome',
    'auth.join': '[Giriama] Join Chama Circle',
    'auth.join.desc': '[Giriama] Sign in to manage your Chamas or create a new account',
    'auth.signIn': '[Giriama] Sign In',
    'auth.signUp': '[Giriama] Sign Up',
    'auth.email': '[Giriama] Email',
    'auth.password': '[Giriama] Password',
    'auth.fullName': '[Giriama] Full Name',
    'auth.confirmPassword': '[Giriama] Confirm Password',
    'auth.signIn.button': '[Giriama] Sign In',
    'auth.signingIn.button': '[Giriama] Signing in...',
    'auth.createAccount.button': '[Giriama] Create Account',
    'auth.creatingAccount.button': '[Giriama] Creating account...',
    'chama.name': '[Giriama] Chama Name',
    'chama.description': '[Giriama] Description',
    'chama.contribution.amount': '[Giriama] Contribution Amount (KES)',
    'chama.frequency': '[Giriama] Frequency',
    'chama.max.members': '[Giriama] Maximum Members',
    'chama.create': '[Giriama] Create Chama',
    'chama.cancel': '[Giriama] Cancel',
    'dashboard.net.worth': '[Giriama] Net Worth',
    'dashboard.upcoming.contributions': '[Giriama] Upcoming Contributions',
    'dashboard.pending.votes': '[Giriama] Pending Votes',
    'dashboard.repayment.performance': '[Giriama] Repayment Performance',
    'dashboard.roi': '[Giriama] ROI',
    'reputation.contribution': '[Giriama] Contribution Score',
    'reputation.repayment': '[Giriama] Repayment Score',
    'reputation.participation': '[Giriama] Participation Score',
    'reputation.overall': '[Giriama] Overall Score',
    'member.reputation': '[Giriama] Member Reputation',
    'language.settings': '[Giriama] Language Settings'
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
