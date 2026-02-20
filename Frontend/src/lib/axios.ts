//D:\resumeproject\Frontend\src\lib\axios.ts
import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { ENV } from "@/config/env";
import type { ApiErrorResponse } from "@/types/api.types";

/* --------------------------------------------
   Axios Instance
--------------------------------------------- */

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* --------------------------------------------
   Request Interceptor
--------------------------------------------- */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/* --------------------------------------------
   Response Interceptor
--------------------------------------------- */

apiClient.interceptors.response.use(
  (res) => {
    console.log('<< API RES ', res.config.url, res.data);
    return res;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const serverError = error.response?.data;

    console.error(
      "API Error:",
      serverError?.message ?? error.message
    );

    return Promise.reject(serverError ?? error);
  }
);
