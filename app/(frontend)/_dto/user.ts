import { TableColumn } from "./general";


export const clientsColumns: TableColumn[] = [
  { name: "Id", key: "id", type: "text" },
  { name: "Name", key: "name", type: "text" },
  { name: "Email", key: "email", type: "text" },
//   { name: "Broker", key: "broker.name", type: "text" },
  { name: "Records Count", key: "clientCount", type: "text" },
]


export const brokersColumns: TableColumn[] = [
  { name: "Id", key: "id", type: "text" },
  { name: "Name", key: "name", type: "text" },
  { name: "Email", key: "email", type: "text" },
  { name: "Managed Records", key: "managedCount", type: "text" },
]

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