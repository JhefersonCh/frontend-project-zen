/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldType =
  | 'text'
  | 'select'
  | 'autocomplete'
  | 'date'
  | 'dateRange';

export interface SelectOption {
  value: any;
  label: string;
}

export interface SearchField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: SelectOption[];
  validators?: any[];
  autocompleteOptions?: any[];
  defaultValue?: any;
}

export interface SearchResult {
  title?: string;
  description?: string;
  id?: string | number;
  createdAt?: Date;
  deadline?: Date;
  projectId?: number;
}
