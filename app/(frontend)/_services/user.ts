import { intialCLient, loginUser, registerUser } from "../_dto/user";
import { axiosAuth, axiosInstance } from "./axios";

export const getSession = async () => {
  return await axiosAuth.get("/user/me");
};

export const getProfile = async () => {
  return await axiosAuth.get("/user/profile");
};
export const registerBroker = async (data: registerUser) => {
  return await axiosAuth.post("/user/register", data);
};

export const login = async (data: loginUser) => {
  return await axiosAuth.post("/user/login", data);
};

export const forgetPassword = async (email: string) => {
  return await axiosInstance.post("/user/forget_password", { email });
}

export const resetPassword = async (data: any) => {
  return await axiosInstance.post("/user/verify/password", data);
}

export const verifyEmail = async (data: any) => {
  return await axiosInstance.post("/user/verify/email", data);
}

export const resendVerification = async (data: any) => {
  return await axiosInstance.post("/user/verify/resend_email", data);
}

export const getBrokers = async (page = 1, limit = 10, search = "") => {
  return await axiosInstance.get(
    `/user/admin/broker?page=${page}&limit=${limit}` + (search ? `&${search}` : "")
  );
};

export const getUsers = async (page = 1, limit = 10, search = "") => {
  return await axiosInstance.get(
    `/user/admin/user?page=${page}&limit=${limit}` + (search ? `&${search}` : "")
  );
};

export const getClients = async (page = 1, limit = 10, search = "") => {
  return await axiosInstance.get(
    `/user/client=${page}&limit=${limit}` + (search ? `&${search}` : "")
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

export const searchClient = async (search: string) => {
    return await axiosInstance.get(`/user/client/search?${search}`);
}

export const searchUser = async (search: string) => {
    return await axiosInstance.get(`/user/admin/user/search?${search}`);
}

export const searchBroker = async (search: string) => {
    return await axiosInstance.get(`/user/admin/broker/search?${search}`);
}