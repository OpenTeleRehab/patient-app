import {callApi} from '../utils/request';

const getAboutPage = async (lang) => {
  const options = {
    uri: '/page/about',
    body: {
      'url-segment': 'about-us',
      platform: 'patient_app',
      lang: lang,
    },
  };

  return await callApi(options, 'get', false, true);
};

export const AboutPage = {
  getAboutPage,
};
