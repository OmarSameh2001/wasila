import { DynamicFormField } from "../_components/form/dynamic_form";

export const recordsList = [{
  id: 1,
  totalAmount: 5000,
  state: "APPROVED",
  client: 'Omar Ali',
  agent:'John Doe',
  policyDescription: 'Full AXA SME',
  createdAt: '12/11/2025',
  updatedAt: '12/11/2025'
},
{
  id: 2,
  totalAmount: 4000,
  state: "APPROVED",
  client: 'Omar Ali',
  agent:'John Doe',
  policyDescription: 'Full GIG Health',
  createdAt: '12/11/2025',
  updatedAt: '12/11/2025'
},
{
  id: 3,
  totalAmount: 2000,
  state: "DRAFT",
  client: 'Omar Ali',
  agent:'John Doe',
  policyDescription: 'Full Allianz Car',
  createdAt: '12/11/2025',
  updatedAt: '12/11/2025'
}]

export const recordsColumns = [
  { name: "Id", key: "id", type: "text" },
  { name: "State", key: "state", type: "text" },
  { name: "Client", key: "client", type: "text" },
  { name: "Broker", key: "broker", type: "text" },
  { name: "Issued At", key: "issueDate", type: "date" },
]


export interface intialRecord {
  state: string;
  clientId: number;
  agentId: number;
  policyDescription?: string;
  policyId: number;
}

export interface Record extends intialRecord {
  id: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    name: string;
  };
  agent: {
    id: number;
    name: string;
  };
  policy: {
    id: number;
    name: string;
  };
}


export const editableRecordColumns: DynamicFormField[] = [
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
    type: "text",
  },
];



export interface CalculatedPolicyRecord {
  policyId: number;
  policyName: string;
  companyName: string;
  companyLogo: string;
  numberOfInsureds: number;
  numberOfPersons: number;
  averageAge: number;
  totalAmount: number;
  totalTaxed: number;
  avgPricePerPerson: number;
  policyDescription: string;
  insuredPeople: InsuredPerson[];
}
export interface InsuredPersonData {
  birthDate: string;
  type: "Employee" | "Dependent";
}

export interface InsuredPerson {
  age: number;
  type: "Employee" | "Dependent";
  price: number;
  isInsured: boolean;
  reason?: string;
}