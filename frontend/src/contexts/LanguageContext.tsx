import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isChangingLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('preferredLanguage') as Language) || 'en';
  });
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const setLanguage = (lang: Language) => {
    setIsChangingLanguage(true);
    
    // Simulate translation loading
    setTimeout(() => {
      setLanguageState(lang);
      localStorage.setItem('preferredLanguage', lang);
      setIsChangingLanguage(false);
    }, 1500);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isChangingLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.select': 'Select',
    'common.selected': 'Selected',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    
    // Language Selection
    'language.title': 'Select Your Preferred Language',
    'language.description': 'Choose the language you are most comfortable with',
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.marathi': 'मराठी (Marathi)',
    'language.changing': 'Changing language...',
    
    // Signup
    'signup.title': 'Create Your Business Profile',
    'signup.subtitle': 'Get funding in 20 minutes, not 20 hours',
    'signup.name': 'Full Name',
    'signup.namePlaceholder': 'Enter your full name',
    'signup.phone': 'Phone Number',
    'signup.phonePlaceholder': 'Enter 10-digit mobile number',
    'signup.email': 'Email (Optional)',
    'signup.emailPlaceholder': 'your.email@example.com',
    'signup.sendOtp': 'Send OTP',
    'signup.alreadyHaveAccount': 'Already have an account?',
    'signup.login': 'Login',
    
    // OTP Verification
    'otp.title': 'Verify Your Phone',
    'otp.subtitle': "We've sent a 6-digit OTP to your mobile number",
    'otp.sentTo': 'Enter the 6-digit OTP sent to',
    'otp.verify': 'Verify OTP',
    'otp.resend': 'Resend OTP',
    'otp.resendIn': 'Resend in',
    'otp.seconds': 'seconds',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to MSME Funding Platform! 🎉',
    'onboarding.subtitle': "Let's find the perfect government schemes for your business",
    'onboarding.knowSchemes': 'I Know About Government Schemes',
    'onboarding.knowSchemesDesc': 'Browse all available schemes and select the ones that match your business needs',
    'onboarding.browseSchemes': 'Browse Schemes',
    'onboarding.needHelp': "I Don't Know - Help Me",
    'onboarding.needHelpDesc': "Answer a few questions about your business and we'll match you with the best schemes",
    'onboarding.getMatched': 'Get Matched',
    
    // Questions
    'questions.questionOf': 'Question {current} of {total}',
    'questions.q1': 'What is your business type?',
    'questions.q1.manufacturing': 'Manufacturing',
    'questions.q1.service': 'Service Provider',
    'questions.q1.trading': 'Trading/Retail',
    'questions.q1.technology': 'Technology/IT',
    'questions.q2': 'What is your annual turnover?',
    'questions.q2.under5': 'Under ₹5 Crore',
    'questions.q2.5to50': '₹5 - ₹50 Crore',
    'questions.q2.50to100': '₹50 - ₹100 Crore',
    'questions.q2.above100': 'Above ₹100 Crore',
    'questions.q3': 'How many employees do you have?',
    'questions.q3.under10': 'Under 10',
    'questions.q3.10to50': '10 - 50',
    'questions.q3.50to100': '50 - 100',
    'questions.q3.above100': 'Above 100',
    'questions.q4': 'What type of funding are you looking for?',
    'questions.q4.workingCapital': 'Working Capital',
    'questions.q4.machinery': 'Machinery/Equipment',
    'questions.q4.expansion': 'Business Expansion',
    'questions.q4.technology': 'Technology Upgrade',
    'questions.q5': 'Is your business owned by?',
    'questions.q5.woman': 'Woman Entrepreneur',
    'questions.q5.scst': 'SC/ST Category',
    'questions.q5.minority': 'Minority Community',
    'questions.q5.general': 'General Category',
    'questions.viewSchemes': 'View Schemes',
    
    // Schemes
    'schemes.title': '{type} Government Schemes',
    'schemes.recommended': 'Recommended',
    'schemes.all': 'All',
    'schemes.subtitle': 'Based on your answers, here are the best matches for your business',
    'schemes.allSubtitle': 'Browse all available schemes and select the ones that fit your needs',
    'schemes.selected': '{count} scheme(s) selected',
    'schemes.match': '% Match',
    'schemes.fundingAmount': 'Funding Amount:',
    'schemes.keyBenefits': 'Key Benefits:',
    'schemes.selectScheme': 'Select Scheme',
    'schemes.continueProfile': 'Continue to Profile Setup',
    'schemes.eligibility': 'Eligibility Criteria',
    'schemes.unselect': 'Unselect',
  },
  hi: {
    // Common
    'common.continue': 'जारी रखें',
    'common.back': 'पीछे',
    'common.next': 'आगे',
    'common.select': 'चुनें',
    'common.selected': 'चयनित',
    'common.close': 'बंद करें',
    'common.loading': 'लोड हो रहा है...',
    
    // Language Selection
    'language.title': 'अपनी पसंदीदा भाषा चुनें',
    'language.description': 'वह भाषा चुनें जिसमें आप सबसे अधिक सहज हैं',
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.marathi': 'मराठी (Marathi)',
    'language.changing': 'भाषा बदली जा रही है...',
    
    // Signup
    'signup.title': 'अपना व्यवसाय प्रोफ़ाइल बनाएं',
    'signup.subtitle': '20 घंटों में नहीं, 20 मिनट में फंडिंग प्राप्त करें',
    'signup.name': 'पूरा नाम',
    'signup.namePlaceholder': 'अपना पूरा नाम दर्ज करें',
    'signup.phone': 'फोन नंबर',
    'signup.phonePlaceholder': '10 अंकों का मोबाइल नंबर दर्ज करें',
    'signup.email': 'ईमेल (वैकल्पिक)',
    'signup.emailPlaceholder': 'your.email@example.com',
    'signup.sendOtp': 'OTP भेजें',
    'signup.alreadyHaveAccount': 'पहले से खाता है?',
    'signup.login': 'लॉगिन',
    
    // OTP Verification
    'otp.title': 'अपना फोन सत्यापित करें',
    'otp.subtitle': 'हमने आपके मोबाइल नंबर पर 6 अंकों का OTP भेजा है',
    'otp.sentTo': 'भेजे गए 6 अंकों का OTP दर्ज करें',
    'otp.verify': 'OTP सत्यापित करें',
    'otp.resend': 'OTP पुनः भेजें',
    'otp.resendIn': 'पुनः भेजें',
    'otp.seconds': 'सेकंड में',
    
    // Onboarding
    'onboarding.welcome': 'MSME फंडिंग प्लेटफॉर्म में आपका स्वागत है! 🎉',
    'onboarding.subtitle': 'आइए आपके व्यवसाय के लिए सही सरकारी योजनाएं खोजें',
    'onboarding.knowSchemes': 'मुझे सरकारी योजनाओं के बारे में पता है',
    'onboarding.knowSchemesDesc': 'सभी उपलब्ध योजनाओं को देखें और अपनी व्यावसायिक आवश्यकताओं से मेल खाने वाली योजनाओं का चयन करें',
    'onboarding.browseSchemes': 'योजनाएं देखें',
    'onboarding.needHelp': 'मुझे नहीं पता - मेरी मदद करें',
    'onboarding.needHelpDesc': 'अपने व्यवसाय के बारे में कुछ सवालों के जवाब दें और हम आपको सर्वश्रेष्ठ योजनाओं से मिलाएंगे',
    'onboarding.getMatched': 'मिलान प्राप्त करें',
    
    // Questions
    'questions.questionOf': 'प्रश्न {current} का {total}',
    'questions.q1': 'आपका व्यवसाय किस प्रकार का है?',
    'questions.q1.manufacturing': 'विनिर्माण',
    'questions.q1.service': 'सेवा प्रदाता',
    'questions.q1.trading': 'व्यापार/खुदरा',
    'questions.q1.technology': 'प्रौद्योगिकी/आईटी',
    'questions.q2': 'आपका वार्षिक कारोबार क्या है?',
    'questions.q2.under5': '₹5 करोड़ से कम',
    'questions.q2.5to50': '₹5 - ₹50 करोड़',
    'questions.q2.50to100': '₹50 - ₹100 करोड़',
    'questions.q2.above100': '₹100 करोड़ से अधिक',
    'questions.q3': 'आपके कितने कर्मचारी हैं?',
    'questions.q3.under10': '10 से कम',
    'questions.q3.10to50': '10 - 50',
    'questions.q3.50to100': '50 - 100',
    'questions.q3.above100': '100 से अधिक',
    'questions.q4': 'आप किस प्रकार की फंडिंग की तलाश में हैं?',
    'questions.q4.workingCapital': 'कार्यशील पूंजी',
    'questions.q4.machinery': 'मशीनरी/उपकरण',
    'questions.q4.expansion': 'व्यवसाय विस्तार',
    'questions.q4.technology': 'प्रौद्योगिकी उन्नयन',
    'questions.q5': 'आपका व्यवसाय किसके स्वामित्व में है?',
    'questions.q5.woman': 'महिला उद्यमी',
    'questions.q5.scst': 'एससी/एसटी श्रेणी',
    'questions.q5.minority': 'अल्पसंख्यक समुदाय',
    'questions.q5.general': 'सामान्य श्रेणी',
    'questions.viewSchemes': 'योजनाएं देखें',
    
    // Schemes
    'schemes.title': '{type} सरकारी योजनाएं',
    'schemes.recommended': 'अनुशंसित',
    'schemes.all': 'सभी',
    'schemes.subtitle': 'आपके उत्तरों के आधार पर, आपके व्यवसाय के लिए सबसे अच्छे मिलान यहां दिए गए हैं',
    'schemes.allSubtitle': 'सभी उपलब्ध योजनाओं को देखें और अपनी आवश्यकताओं के अनुरूप योजनाओं का चयन करें',
    'schemes.selected': '{count} योजना(एं) चयनित',
    'schemes.match': '% मिलान',
    'schemes.fundingAmount': 'फंडिंग राशि:',
    'schemes.keyBenefits': 'मुख्य लाभ:',
    'schemes.selectScheme': 'योजना चुनें',
    'schemes.continueProfile': 'प्रोफाइल सेटअप जारी रखें',
    'schemes.eligibility': 'पात्रता मानदंड',
    'schemes.unselect': 'चयन रद्द करें',
  },
  mr: {
    // Common
    'common.continue': 'सुरू ठेवा',
    'common.back': 'मागे',
    'common.next': 'पुढे',
    'common.select': 'निवडा',
    'common.selected': 'निवडले',
    'common.close': 'बंद करा',
    'common.loading': 'लोड होत आहे...',
    
    // Language Selection
    'language.title': 'तुमची पसंतीची भाषा निवडा',
    'language.description': 'तुम्हाला सर्वात सोयीस्कर असलेली भाषा निवडा',
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.marathi': 'मराठी (Marathi)',
    'language.changing': 'भाषा बदलली जात आहे...',
    
    // Signup
    'signup.title': 'तुमचे व्यवसाय प्रोफाइल तयार करा',
    'signup.subtitle': '20 तासांत नाही, 20 मिनिटांत फंडिंग मिळवा',
    'signup.name': 'पूर्ण नाव',
    'signup.namePlaceholder': 'तुमचे पूर्ण नाव टाका',
    'signup.phone': 'फोन नंबर',
    'signup.phonePlaceholder': '10 अंकी मोबाइल नंबर टाका',
    'signup.email': 'ईमेल (पर्यायी)',
    'signup.emailPlaceholder': 'your.email@example.com',
    'signup.sendOtp': 'OTP पाठवा',
    'signup.alreadyHaveAccount': 'आधीपासून खाते आहे?',
    'signup.login': 'लॉगिन',
    
    // OTP Verification
    'otp.title': 'तुमचा फोन सत्यापित करा',
    'otp.subtitle': 'आम्ही तुमच्या मोबाइल नंबरवर 6 अंकी OTP पाठवला आहे',
    'otp.sentTo': 'पाठवलेला 6 अंकी OTP टाका',
    'otp.verify': 'OTP सत्यापित करा',
    'otp.resend': 'OTP पुन्हा पाठवा',
    'otp.resendIn': 'पुन्हा पाठवा',
    'otp.seconds': 'सेकंदात',
    
    // Onboarding
    'onboarding.welcome': 'MSME फंडिंग प्लॅटफॉर्मवर आपले स्वागत आहे! 🎉',
    'onboarding.subtitle': 'चला तुमच्या व्यवसायासाठी योग्य सरकारी योजना शोधूया',
    'onboarding.knowSchemes': 'मला सरकारी योजनांबद्दल माहिती आहे',
    'onboarding.knowSchemesDesc': 'सर्व उपलब्ध योजना पहा आणि तुमच्या व्यवसायाच्या गरजांशी जुळणाऱ्या योजना निवडा',
    'onboarding.browseSchemes': 'योजना पहा',
    'onboarding.needHelp': 'मला माहित नाही - मला मदत करा',
    'onboarding.needHelpDesc': 'तुमच्या व्यवसायाबद्दल काही प्रश्नांची उत्तरे द्या आणि आम्ही तुम्हाला सर्वोत्तम योजनांशी जोडू',
    'onboarding.getMatched': 'जुळणी मिळवा',
    
    // Questions
    'questions.questionOf': 'प्रश्न {current} पैकी {total}',
    'questions.q1': 'तुमचा व्यवसाय कोणत्या प्रकारचा आहे?',
    'questions.q1.manufacturing': 'उत्पादन',
    'questions.q1.service': 'सेवा प्रदाता',
    'questions.q1.trading': 'व्यापार/किरकोळ',
    'questions.q1.technology': 'तंत्रज्ञान/आयटी',
    'questions.q2': 'तुमचा वार्षिक उलाढाल काय आहे?',
    'questions.q2.under5': '₹5 कोटी पेक्षा कमी',
    'questions.q2.5to50': '₹5 - ₹50 कोटी',
    'questions.q2.50to100': '₹50 - ₹100 कोटी',
    'questions.q2.above100': '₹100 कोटी पेक्षा जास्त',
    'questions.q3': 'तुमच्याकडे किती कर्मचारी आहेत?',
    'questions.q3.under10': '10 पेक्षा कमी',
    'questions.q3.10to50': '10 - 50',
    'questions.q3.50to100': '50 - 100',
    'questions.q3.above100': '100 पेक्षा जास्त',
    'questions.q4': 'तुम्ही कोणत्या प्रकारचे फंडिंग शोधत आहात?',
    'questions.q4.workingCapital': 'कार्यरत भांडवल',
    'questions.q4.machinery': 'यंत्रसामग्री/उपकरणे',
    'questions.q4.expansion': 'व्यवसाय विस्तार',
    'questions.q4.technology': 'तंत्रज्ञान सुधारणा',
    'questions.q5': 'तुमचा व्यवसाय कोणाच्या मालकीचा आहे?',
    'questions.q5.woman': 'महिला उद्योजक',
    'questions.q5.scst': 'एससी/एसटी प्रवर्ग',
    'questions.q5.minority': 'अल्पसंख्याक समुदाय',
    'questions.q5.general': 'सामान्य प्रवर्ग',
    'questions.viewSchemes': 'योजना पहा',
    
    // Schemes
    'schemes.title': '{type} सरकारी योजना',
    'schemes.recommended': 'शिफारस केलेले',
    'schemes.all': 'सर्व',
    'schemes.subtitle': 'तुमच्या उत्तरांवर आधारित, तुमच्या व्यवसायासाठी सर्वोत्तम जुळण्या येथे आहेत',
    'schemes.allSubtitle': 'सर्व उपलब्ध योजना पहा आणि तुमच्या गरजांशी जुळणाऱ्या योजना निवडा',
    'schemes.selected': '{count} योजना निवडल्या',
    'schemes.match': '% जुळणी',
    'schemes.fundingAmount': 'फंडिंग रक्कम:',
    'schemes.keyBenefits': 'मुख्य फायदे:',
    'schemes.selectScheme': 'योजना निवडा',
    'schemes.continueProfile': 'प्रोफाइल सेटअप सुरू ठेवा',
    'schemes.eligibility': 'पात्रता निकष',
    'schemes.unselect': 'निवड रद्द करा',
  },
};
