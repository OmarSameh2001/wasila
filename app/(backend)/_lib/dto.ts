export interface UserBackend {
  id: number;
  name: string;
  username: string;
  email: string | null;
  password: string;
  type: string;
  brokerId: number | null;
  refreshTokens: string[];
}

export interface AuthPayload {
  id: string;
  type: "USER" | "ADMIN" | "BROKER";
  iat: number;
  exp: number;
}