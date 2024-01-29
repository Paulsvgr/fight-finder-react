import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const defaultLanguage = 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          'Hello': 'Hello',// English translations
          'Home': 'Home',
        },
      },
      sv: {
        translation: {
          'Hello': 'Hej',
          'Home': 'Hem',
          // French translations
        },
      },
      // Add more languages as needed
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes string values
    },
  });

export default i18n;

export { defaultLanguage };