import { DynamicFormField } from "../_components/form/dynamic_form";
import { companiesList } from "./company";

export const policiesList = [
  {
    id: 1,
    type: "CAR",
    name: "Full",
    company: companiesList[0].name,
    tax: 0.2,
    brokerId: 1,
    records: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    type: "HEALTH",
    name: "General",
    company: companiesList[1].name,
    tax: 0.1,
    brokerId: 2,
    records: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    type: "SME",
    name: "Full",
    company: companiesList[2].name,
    tax: 0.1,
    brokerId: 3,
    records: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
export const policyColumns: any[] = [
  {
    name: "Id",
    key: "id",
    type: "text",
  },
  {
    name: "Type",
    key: "type",
    type: "text",
  },
  {
    name: "Name",
    key: "name",
    type: "text",
  },
  {
    name: "Company",
    key: "company",
    type: "logo",
  },
  {
    name: "Tax",
    key: "tax",
    type: "text",
  },
  // {
  //   name: "Broker",
  //   key: "broker",
  //   type: "text",
  // },
  // {
  //   name: "Actions",
  //   key: "actions",
  //   type: "actions",
  //   actions: [
  //     {
  //       name: "View",
  //       icon: "eye",
  //       color: "blue",
  //       onClick: (id: number) => {
  //         console.log("View policy", id);
  //       },
  //     },
  //   ],
  // },
];

export interface IntialPolicy {
  type: string;
  name: string;
  companyId: number;
  tax?: number;
  brokerId?: number;
}

export interface Policy extends IntialPolicy {
  id: number;
  company: {
    id: number;
    name: string;
    logo?: string;
  };
  broker?: {
    id: number;
    name: string;
  };
  // records?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthPolicy extends Policy {
  healthPolicy: {
    lifeInsurance: string;
    totalPermanentDisability: string;
    accidentalDeath: string;
    partialPermanentDisability: string;
    medicalTpa: string;
    network: string;
    areaOfCoverage: string;
    annualCeilingPerPerson: string;
    inPatientAccommodation: string;
    icu: string;
    parentAccommodation: string;
    doctorConsultation: string;
    labScan: string;
    physiotherapy: string;
    medication: string;
    dental: string;
    optical: string;
    maternityLimit: string;
    newbornCeiling: string;
    preExistingCases: string;
    newChronic: string;
    organTransplant: string;
    groundAmbulance: string;
    reimbursementCoverage: string;
    // numberOfInsuredMembers: number;
    // averagePremiumPerHead: number;
    healthPricings?: healthPricing[];
  };
}
export interface healthPricing {
  age: number;
  mainPrice?: number;
  dependentPrice?: number;
}
// export interface HealthPolicyWithPricing extends HealthPolicy {
//   healthPricings?: healthPricing[];
// }

export const editablePolicyColumns: DynamicFormField[] = [
  {
    key: "type",
    label: "Type",
    type: "select",
    choices: ["CAR", "HEALTH", "SME"],
    required: true,
  },
  {
    key: "name",
    label: "Name",
    type: "text",
    required: true,
  },
  {
    key: "companyId",
    label: "Company",
    type: "search",
    required: true,
    prev: "company.name",
  },
  {
    key: "tax",
    label: "Tax",
    type: "text",
    required: true,
  },
];
