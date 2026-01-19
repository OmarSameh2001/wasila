import { AxiosResponse } from "axios";

export interface TableColumn {
    key: string;
    name: string;
    type: string;
}

// src/app/_dto/filters.ts or wherever you keep your column definitions

export interface FilterableField {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "boolean" | "id" | "sort";
  choices?: string[];
  searchType?: "search"; // For foreign key relations
  searchLabel?: string; // Label for search dropdown
  adminOnly?: boolean;
}

export interface TableActionButton {
  name: string;
  onClick?: (
    id: number,
    value?: any
  ) => Promise<AxiosResponse<any, any, {}>> | void;
}

export interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  hasNextPage: boolean;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
}
export interface TableProps {
  name: string;
  columns: any[];
  data: any[];
  actions?: TableActionButton[];
  loading: boolean;
  query: string;
  addNew?: () => void;
  buttonName?: string;
  pagination: PaginationProps;
  base: string;
}



// Company Filterable Columns
export const filterableCompanyColumns: FilterableField[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
  },
  {
    key: "address",
    label: "Address",
    type: "text",
  },
];

// Policy Filterable Columns
export const filterablePolicyColumns: FilterableField[] = [
  // {
  //   key: "type",
  //   label: "Type",
  //   type: "select",
  //   choices: ["CAR", "Individual_Medical", "SME"],
  // },
  {
    key: "name",
    label: "Name",
    type: "text",
  },
  {
    key: "companyId",
    label: "Company",
    type: "id",
    searchType: "search",
    searchLabel: "Company",
  },
  {
    key: "tax",
    label: "Tax",
    type: "number",
  },
  {
    key: "brokerId",
    label: "Broker",
    type: "id",
    searchType: "search",
    searchLabel: "Broker",
    adminOnly: true,
  },
  {
    key: "sort",
    label: "Sort By",
    type: "sort",
    choices: ["tax"],
  },
];

// Record Filterable Columns
export const filterableRecordColumns: FilterableField[] = [
  {
    key: "state",
    label: "State",
    type: "select",
    choices: ["DRAFT", "KYC", "QUOTATION", "REQUEST", "PROPOSITION", "WON", "LOST"],
  },
  {
    key: "clientId",
    label: "Client",
    type: "id",
    searchType: "search",
    searchLabel: "Client",
  },
  {
    key: "brokerId",
    label: "Broker",
    type: "id",
    searchType: "search",
    searchLabel: "Broker",
    adminOnly: true,
  },
  {
    key: "issueDate",
    label: "Issue Date",
    type: "date",
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
  },
  {
    key: "type",
    label: "Insurance Type",
    type: "select",
    choices: ["Individual_Medical", "SME"],
  },
  {
    key: "updatedAt",
    label: "Updated At",
    type: "date",
  },
  {
    key: "sort",
    label: "Sort By",
    type: "sort",
    choices: ["createdAt", "updatedAt", "issueDate",],
  },
];

export const filterableBrokerColumns: FilterableField[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
  },
  {
    key: "username",
    label: "Username",
    type: "text",
  },
  {
    key: "email",
    label: "Email",
    type: "text",
  },
  {
    key: "managedCount",
    label: "Managed Records",
    type: "number",
  },
  // {
  //   key: "dob",
  //   label: "Date of Birth",
  //   type: "date",
  // },
  
  {
    key: "emailVerified",
    label: "Email Verified",
    type: "boolean",
    adminOnly: true
  },
  {
    key: "sort",
    label: "Sort By",
    type: "sort",
    choices: ["managedCount"],
  },
];
export const filterableCLientColumns: FilterableField[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
  },
  {
    key: "username",
    label: "Username",
    type: "text",
  },
  {
    key: "email",
    label: "Email",
    type: "text",
  },
  {
    key: "type",
    label: "Type",
    type: "select",
    choices: ["USER", "CLIENT"],
    adminOnly: true
    
  },
  {
    key: "emailVerified",
    label: "Email Verified",
    type: "boolean",
    adminOnly: true
  },
  {
    key: "brokerId",
    label: "Broker",
    type: "id",
    searchType: "search",
    searchLabel: "Broker",
    adminOnly: true
  },
  {
    key: "clientCount",
    label: "Records Count",
    type: "number",
  },
  // {
  //   key: "dob",
  //   label: "Date of Birth",
  //   type: "date",
  // },
  {
    key: "sort",
    label: "Sort By",
    type: "sort",
    choices: ["clientCount"],
  },
];
// RecordPolicy Filterable Columns
// export const filterableRecordPolicyColumns: FilterableField[] = [
//   {
//     key: "recordId",
//     label: "Record ID",
//     type: "number",
//   },
//   {
//     key: "policyId",
//     label: "Policy ID",
//     type: "number",
//   },
//   {
//     key: "totalAmount",
//     label: "Total Amount",
//     type: "number",
//   },
//   {
//     key: "totalTaxed",
//     label: "Total Taxed",
//     type: "number",
//   },
//   {
//     key: "numberOfInsureds",
//     label: "Number of Insureds",
//     type: "number",
//   },
//   {
//     key: "numberOfPersons",
//     label: "Number of Persons",
//     type: "number",
//   },
//   {
//     key: "averageAge",
//     label: "Average Age",
//     type: "number",
//   },
//   {
//     key: "avgPricePerPerson",
//     label: "Avg Price Per Person",
//     type: "number",
//   },
// ];