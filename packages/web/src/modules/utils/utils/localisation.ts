import { Country } from '@types';

import languages from '../languages.json';
import countries from '../countries.json';

export const getLanguages = () => languages;
export const getCountries = () => countries;
export const getCountryByCode = (() => {
  const countryMap = countries.reduce<Record<string, Country>>(
    (result, country) => {
      result[country.cca2] = country;
      return result;
    },
    {},
  );

  return (cca2: string) => countryMap[cca2];
})();
