import i18n from 'i18next';

const languages = require('../locale/all.json');
let i18nInstance = null;

function getI18nInstance() {
  if ( !i18nInstance ) {
    i18nInstance = i18n.createInstance();

    i18nInstance
        .init({
          fallbackLng: 'eng',
          resources: languages,
          ns: ['placeholders'],
          defaultNS: 'placeholders',
          debug: false,
          interpolation: {
            escapeValue: false, // not needed for react!!
          },
          react: {
            wait: true,
          },
        });
  }
  return i18nInstance;
}

export {
  getI18nInstance,
};
