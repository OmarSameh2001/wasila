import { axiosAuth } from "./axios";
import { loginUser, registerUser } from "../_dto/user";


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
  return await axiosAuth.post("/user/forget_password", { email });
}

export const resetPassword = async (data: any) => {
  return await axiosAuth.post("/user/verify/password", data);
}

export const verifyEmail = async (data: any) => {
  return await axiosAuth.post("/user/verify/email", data);
}

export const resendVerification = async (data: any) => {
  return await axiosAuth.post("/user/verify/resend_email", data);
}
