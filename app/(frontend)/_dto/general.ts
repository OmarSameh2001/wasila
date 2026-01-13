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
  type: "text" | "number" | "date" | "select" | "boolean" | "id";
  choices?: string[];
  searchType?: "search"; // For foreign key relations
  searchLabel?: string; // Label for search dropdown
}

export interface TableActionButton {
  name: string;
  onClick: (
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
  pagination: PaginationProps;
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
  {
    key: "type",
    label: "Type",
    type: "select",
    choices: ["CAR", "HEALTH", "SME"],
  },
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
  },
];

// Record Filterable Columns
export const filterableRecordColumns: FilterableField[] = [
  {
    key: "state",
    label: "State",
    type: "select",
    choices: ["DRAFT", "CONTACTED", "WON", "LOST"],
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
    key: "updatedAt",
    label: "Updated At",
    type: "date",
  },
];

// User Filterable Columns
const filterableUserColumns: FilterableField[] = [
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
    choices: ["ADMIN", "USER", "BROKER", "CLIENT"],
  },
  {
    key: "emailVerified",
    label: "Email Verified",
    type: "boolean",
  },
  {
    key: "brokerId",
    label: "Broker",
    type: "number",
    searchType: "search",
    searchLabel: "Broker",
  },
  {
    key: "managedCount",
    label: "Managed Count",
    type: "number",
  },
  {
    key: "clientCount",
    label: "Client Count",
    type: "number",
  },
  {
    key: "dob",
    label: "Date of Birth",
    type: "date",
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
  },
  {
    key: "updatedAt",
    label: "Updated At",
    type: "date",
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
  },
  {
    key: "emailVerified",
    label: "Email Verified",
    type: "boolean",
  },
  {
    key: "brokerId",
    label: "Broker",
    type: "id",
    searchType: "search",
    searchLabel: "Broker",
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