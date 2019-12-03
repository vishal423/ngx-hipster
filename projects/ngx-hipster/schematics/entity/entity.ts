export interface Entity {
  name: string;
  pageTitle: string;
  fields: Field[];
}

export interface Field {
  name: string;
  label: string;
  dataType: string;
  controlType: string;
  validation: Validation;
}

export interface Validation {
  required: boolean;
  minlength: number;
  maxlength: number;
  min: number;
  max: number;
  pattern: string;
}
