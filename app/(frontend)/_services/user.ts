import { intialCLient } from "../_dto/user";
import { axiosInstance } from "./axios";

// user: is a registered user who isn't a broker
// he can just browse products and brokers
// and see his own records
export const getUser = async (id: number) => {
  return await axiosInstance.get(`/user/admin/user/${id}`);
};

export const searchUser = async (search: string) => {
  return await axiosInstance.get(`/user/admin/user/search?${search}`);
};

export const getUsers = async (page = 1, limit = 10, search = "") => {
  return await axiosInstance.get(
    `/user/admin/user?page=${page}&limit=${limit}` +
      (search ? `&${search}` : ""),
  );
};

// broker: is a registered user who is creating products, crm and clients
export const getBrokers = async (page = 1, limit = 10, search = "") => {
  return await axiosInstance.get(
    `/user/broker?page=${page}&limit=${limit}` +
      (search ? `&${search}` : ""),
  );
};

export const getBroker = async (id: number) => {
  return await axiosInstance.get(`/user/broker/${id}`);
};

export const searchBroker = async (search: string) => {
  return await axiosInstance.get(`/user/broker/search?${search}`);
};

// client: non registered user who is made up and controlled by the broker and admin
// until he gets permission from the admin to become a real user
// and inherits all the records of when he was a client

export const getClients = async (page = 1, limit = 10, search = "") => {
  return await axiosInstance.get(
    `/user/client?page=${page}&limit=${limit}` + (search ? `&${search}` : ""),
  );
};

export const getClient = async (id: number) => {
  return await axiosInstance.get(`/user/client/${id}`);
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

export const searchClient = async (search: string) => {
  return await axiosInstance.get(`/user/client/search?${search}`);
};
