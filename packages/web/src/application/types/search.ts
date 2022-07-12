import { ReactNode } from 'react';

export interface SearchOption {
  type: string;
  label: string;
  value: string;
}

export interface SearchContext {
  searchables: Searchable[];
  search?: string;
  getSearchable(option: SearchOption): Searchable;
  getOptions(search: string): Promise<SearchOption[]>;
}

export interface Searchable {
  getOptions(search: string): Promise<SearchOption[]>;
  formatOptionLabel(option: SearchOption): ReactNode;
  onChange(option: SearchOption): void;
  isSearchableOption(option: SearchOption): boolean;
}
