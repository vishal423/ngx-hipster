export interface Entity {
  name: string;
  pageTitle: string;
  primaryField: string;
  fields: Field[];
  pageOptions?: PageOptions;
}

export interface PageOptions {
  edit?: EditPageOptions;
  list?: ListPageOptions;
}

export interface EditPageOptions {
  hideFields: string[];
}

export interface ListPageOptions {
  displayFields: string[];
}

export interface Field {
  name: string;
  label: string;
  dataType: string;
  controlType: string;
  format: string;
  multiple: boolean;
  validation: Validation;
  options: FieldOption[];
}

export interface FieldOption {
  name: string;
  label: string;
}

export interface Validation {
  required: boolean;
  minlength: number;
  maxlength: number;
  min: number;
  max: number;
  pattern: string;
}
