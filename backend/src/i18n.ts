import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await i18next.use(Backend).init({
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'errors', 'validation'],
  preload: ['de', 'en'],
  backend: {
    loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json')
  },
  interpolation: {
    escapeValue: false
  }
});

export default i18next;
