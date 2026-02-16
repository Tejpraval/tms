import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { ENV } from "@/config/env";
import type { ApiErrorResponse } from "@/types/api.types";

/* --------------------------------------------
   Axios Instance
--------------------------------------------- */

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* --------------------------------------------
   Request Interceptor
--------------------------------------------- */

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
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const serverError = error.response?.data;

    console.error(
      "API Error:",
      serverError?.message ?? error.message
    );

    return Promise.reject(serverError ?? error);
  }
);
