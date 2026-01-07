import { DynamicFormField } from "../_components/form/dynamic_form";
import { TableColumn } from "./general";

export const companiesColumns: TableColumn[] = [
  { name: "Id", key: "id", type: "text" },
  { name: "Name", key: "name", type: "text" },
  { name: "Address", key: "address", type: "text" },
  { name: "Logo", key: "logo", type: "logo" },
];

export interface Company {
  id: number;
  name: string;
  address?: string;
  logo?: string;
  policies?: any[];
}

export interface IntialCompany {
  name: string;
  address?: string;
  logo?: File | string;
}

export const editableCompanyColumns: DynamicFormField[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
    required: true,
  },
  {
    key: "address",
    label: "Address",
    type: "text",
  },
  {
    key: "logo",
    label: "Logo",
    type: "image",
    required: true,
    limit: 1000000,
  },
];
