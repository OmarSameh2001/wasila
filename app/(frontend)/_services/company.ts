import { IntialCompany } from "../_dto/company";
import { axiosInstance } from "./axios"


export const getCompanies = async (page = 1, limit = 10, search = '') => {
    return await axiosInstance.get(`/company?limit=${limit}&page=${page}` + (search ? `&${search}` : ''));
}

export const getCompany = async (id: number) => {
    return await axiosInstance.get(`/company/${id}`);
}

export const createCompany = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        // Only append if it's actually a File, not a string URL
        if (key === 'logo' && typeof data[key] === 'string') {
            return; // Skip existing URL
        }
        formData.append(key, data[key]);
    });
    return await axiosInstance.post('/company', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const updateCompany = async (id: number, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        // Only append if it's actually a File, not a string URL
        if (key === 'logo' && typeof data[key] === 'string') {
            return; // Skip existing URL
        }
        formData.append(key, data[key]);
    });
    return await axiosInstance.put(`/company/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteCompany = async (id: number) => {
    return await axiosInstance.delete(`/company/${id}`);
}

export const searchCompany = async (search: string) => {
    return await axiosInstance.get(`/company/search?${search}`);
}