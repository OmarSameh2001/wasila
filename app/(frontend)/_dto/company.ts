import { DynamicFormField } from "../_components/form/dynamic_form";

export const companiesList = [
  {
    id: 1,
    name: "AXA",
    address: "Roxy",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/AXA_Logo.svg/2048px-AXA_Logo.svg.png",
    policies: [],
  },
  {
    id: 2,
    name: "GIG",
    address: "Nasr City",
    logo: "https://www.giglt.com.eg/ar/images/gig-logo.png",
    policies: [],
  },
  {
    id: 3,
    name: "Allianz",
    address: "Cairo Settlement",
    logo: "https://pbs.twimg.com/profile_images/1673744347509014549/JN7Bh2UX_400x400.jpg",
    policies: [],
  },
];

export const companiesColumns = [
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
