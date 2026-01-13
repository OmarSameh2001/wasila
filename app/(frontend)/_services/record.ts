import { intialRecord } from "../_dto/record";
import { axiosInstance } from "./axios";

export const getRecords = async (page = 1, limit = 10, search = '') => {
    return await axiosInstance.get(`/record?limit=${limit}&page=${page}` + (search ? `&${search}` : ''));
}

export const getRecord = async (id: number) => {
    return await axiosInstance.get(`/record/${id}`);
}

export const deleteRecord = async (id: number) => {
    return await axiosInstance.delete(`/record/${id}`);
}

export const createRecord = async (data: intialRecord) => {
    return await axiosInstance.post('/record', data);
}

export const updateRecord = async (id: number, data: any) => {
    return await axiosInstance.put(`/record/${id}`, data);
}

export const calculateRecords = async (data: any) => {
    return await axiosInstance.post("/record/calculate", data);
}
