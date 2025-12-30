import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';


const url = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: url + '/api',
  withCredentials: true, // important for sending cookies automatically
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint to get new access token via cookie
        await axiosInstance.post('/user/refresh', {}, { withCredentials: true });

        // Retry original request after refresh
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const axiosAuth: AxiosInstance = axios.create({
  baseURL: url + '/api',
});

export { axiosAuth, axiosInstance };