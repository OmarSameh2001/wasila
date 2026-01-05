export const clientsList = [{
    id: 1,
    name: "Omar Ali",
    email: "o@gmail.com",
    broker: "John Doe",
    clientCount: 2
},
{
    id: 2,
    name: "Omar Ahmed",
    email: "oasdfgh@gmail.com",
    broker: "",
    clientCount: 5
},
{
    id: 3,
    name: "Omar Mohamed",
    email: "omar@gmail.com",
    broker: "John Daniel",
    clientCount: 2
}]

export const clientsColumns = [
  { name: "Id", key: "id", type: "text" },
  { name: "Name", key: "name", type: "text" },
  { name: "Email", key: "email", type: "text" },
//   { name: "Broker", key: "broker.name", type: "text" },
  { name: "Records Count", key: "clientCount", type: "text" },
]

export const brokersList = [{
    id: 1,
    name: "Amr Ali",
    email: "amr@gmail.com",
    broker: "John Doe",
    managedCount: 2,
    
},
{
    id: 2,
    name: "Mohamed Ahmed",
    email: "mohamed@gmail.com",
    managedCount: 5
},
{
    id: 3,
    name: "Mahmoud Mohamed",
    email: "mahmoud@gmail.com",
    managedCount: 2
}]

export const brokersColumns = [
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