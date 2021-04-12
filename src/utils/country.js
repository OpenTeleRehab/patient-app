import store from '../store';

export const getUserCountryIsoCode = () => {
  const profile = store.getState().user.profile;
  const countries = store.getState().country.countries;
  const country = countries.find((item) => item.id === profile.country_id);

  return country ? country.iso_code : '';
};

export const getCountryCodeFromStore = () => {
  return store.getState().user.countryCode;
};
