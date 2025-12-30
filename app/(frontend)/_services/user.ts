import { intialCLient, loginUser, registerUser } from "../_dto/user";
import { axiosAuth, axiosInstance } from "./axios";

export const getPrsonal = async () => {
  return await axiosAuth.get("/user/me");
};

export const registerBroker = async (data: registerUser) => {
  return await axiosAuth.post("/user/register", data);
};

export const login = async (data: loginUser) => {
  return await axiosAuth.post("/user/login", data);
};

export const getBrokers = async (search = "") => {
  return await axiosInstance.get(
    "/user/admin/broker" + (search ? `?${search}` : "")
  );
};

export const getUsers = async (search = "") => {
  return await axiosInstance.get(
    "/user/admin/user" + (search ? `?${search}` : "")
  );
};

export const getClients = async (search = "") => {
  return await axiosInstance.get(
    "/user/client" + (search ? `?${search}` : "")
  );
};

export const getClient = async (id: number) => {
  return await axiosInstance.get(`/user/client/${id}`);
};

export const getBroker = async (id: number) => {
  return await axiosInstance.get(`/user/admin/broker/${id}`);
};

export const getUser = async (id: number) => {
  return await axiosInstance.get(`/user/admin/user/${id}`);
};

export const createClient = async (data: intialCLient) => {
  return await axiosInstance.post("/user/client", data);
};

export const updateClient = async (id: number, data: any) => {
  return await axiosInstance.put(`/user/client/${id}`, data);
};

export const deleteClient = async (id: number) => {
  return await axiosInstance.delete(`/user/client/${id}`);
};