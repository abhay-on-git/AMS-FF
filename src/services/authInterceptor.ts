import { apiClient } from './apiClient';

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export const authInterceptor = apiClient;
