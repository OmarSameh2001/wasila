import { DynamicFormField } from "../_components/form/dynamic_form";
import { TableColumn } from "./general";

export const policyColumns: TableColumn[] = [
  // {
  //   name: "Id",
  //   key: "id",
  //   type: "text",
  // },
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
  {
    name: "Broker",
    key: "broker.name",
    type: "text",
  },
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
    healthPricings?: HealthPricings;
  };
}
// export interface healthPricing {
//   age: number;
//   mainPrice?: number;
//   dependentPrice?: number;
// }
export interface HealthPricings {
  [age: string]: HealthPricingData;
}
interface HealthPricingData {
  mainPrice?: number | null;
  dependentPrice?: number | null;
}
// export interface HealthPolicyWithPricing extends HealthPolicy {
//   healthPricings?: healthPricing[];
// }

export const editablePolicyColumns: DynamicFormField[] = [
  {
    key: "type",
    label: "Type",
    type: "select",
    choices: ["CAR", "Individual_Medical", "SME"],
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

export const healthPolicyGroups: Record<string, string[]> = {
  'Life Benefits': ['lifeInsurance', 'totalPermanentDisability', 'accidentalDeath', 'partialPermanentDisability'],
  'Medical Benefits': ['medicalTpa', 'network', 'areaOfCoverage', 'annualCeilingPerPerson'],
  'In-Patient Benefits': ['inPatientAccommodation', 'icu', 'parentAccommodation'],
  'Out-Patient Benefits': ['doctorConsultation', 'labScan', 'physiotherapy', 'medication'],
  'Additional Benefits': ['dental', 'optical', 'maternityLimit', 'newbornCeiling'],
  'Other Benefits': ['preExistingCases', 'newChronic', 'organTransplant', 'groundAmbulance'],
  'Reimbursement Rules': ['reimbursementCoverage']
};