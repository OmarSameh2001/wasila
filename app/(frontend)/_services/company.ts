import { IntialCompany } from "../_dto/company";
import { axiosInstance } from "./axios"


export const getCompanies = async (page = 1, limit = 10, search = '') => {
    return await axiosInstance.get(`/company?limit=${limit}&page=${page}` + (search ? `&${search}` : ''));
}

export const getCompany = async (id: number) => {
    return await axiosInstance.get(`/company/${id}`);
}

export const createCompany = async (data: IntialCompany) => {
    return await axiosInstance.post('/company', data);
}

export const updateCompany = async (id: number, data: IntialCompany) => {
    return await axiosInstance.put(`/company`, {id, ...data});
}

export const deleteCompany = async (id: number) => {
    return await axiosInstance.delete(`/company/${id}`);
}