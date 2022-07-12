import { Searchable, Services } from '@types';

export const searchables: Searchable[] = [];

export const register: Services['registerSearchable'] = searchable => {
  searchables.push(searchable);
};
