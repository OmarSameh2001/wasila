import { DynamicFormField } from "../_components/form/dynamic_form";
import { TableColumn } from "./general";
import { HealthPolicy, Policy } from "./policy";


export const recordsColumns: TableColumn[] = [
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
  policy: HealthPolicy
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


export interface RecordData {
  id: number;
  state: string;
  clientId: number;
  brokerId: number;
  issueDate: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    name: string;
  };
  broker: {
    id: number;
    name: string;
  };
  policies: RecordPolicy[];
}
export interface RecordPolicy {
  recordId: number;
  policyId: number;
  companyName: string;
  policy: HealthPolicy;
  totalAmount: string;
  totalTaxed: string;
  policyDescription: string;
  numberOfInsureds: number;
  numberOfPersons: number;
  averageAge: string;
  avgPricePerPerson: string;
}