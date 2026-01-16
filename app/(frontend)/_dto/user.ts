import { DynamicFormField } from "../_components/form/dynamic_form";
import { TableColumn } from "./general";

export const clientsColumns: TableColumn[] = [
  { name: "Id", key: "id", type: "text" },
  { name: "Name", key: "name", type: "text" },
  { name: "Username", key: "username", type: "text" },
  { name: "Email", key: "email", type: "text" },
  { name: "Broker", key: "broker", type: "text" },
  { name: "Lead Source", key: "leadSource", type: "text" },
  { name: "Records Count", key: "clientCount", type: "text" },
  { name: "Type", key: "type", type: "text" },
];

export const brokersColumns: TableColumn[] = [
  { name: "Id", key: "id", type: "text" },
  { name: "Name", key: "name", type: "text" },
  { name: "Username", key: "username", type: "text" },
  { name: "Email", key: "email", type: "text" },
  { name: "Managed Records", key: "managedCount", type: "text" },
];

export interface registerUser {
  email?: string;
  password: string;
  name: string;
  username: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email?: string | null;
  password?: string | null;
  type: string;
  brokerId?: number | null;
  refreshToken?: string | null;
}

export interface intialCLient {
  name: string;
  email?: string;
  brokerId?: number;
}

export interface loginUser {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UserContext {
  id: number;
  name: string;
  username: string;
  email?: string | null;
  type: string;
}

export const editableClientColumns: DynamicFormField[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
    required: true,
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    // adminOnly: true,
    required: true,
  },
  {
    key: "username",
    label: "Username",
    type: "text",
    required: true,
  },
  {
    key: "leadSource",
    label: "Lead Source",
    type: "text",
  },
  {
    key: "contactInfo",
    label: "Contact Info",
    type: "contact",
  },
];
