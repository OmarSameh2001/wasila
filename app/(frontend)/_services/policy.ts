import { IntialPolicy } from "../_dto/policy";
import { axiosInstance } from "./axios"


export const getPolicies = async (page = 1, limit = 10, search = '') => {
    return await axiosInstance.get(`/policy?limit=${limit}&page=${page}` + (search ? `&${search}` : ''));
}

export const getPolicy = async (id: number) => {
    return await axiosInstance.get(`/policy/${id}`);
}

export const deletePolicy = async (id: number) => {
    return await axiosInstance.delete(`/policy/${id}`);
}

export const createPolicy = async (data: IntialPolicy) => {
    return await axiosInstance.post('/policy', data);
}

export const updatePolicy = async (id: number, data: IntialPolicy) => {
    return await axiosInstance.put(`/policy/${id}`, data);
}