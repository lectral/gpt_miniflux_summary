// apiClient.ts
import axios, { AxiosInstance } from "axios";
import { MINIFLUX_API_KEY, MINIFLUX_URL } from "./config";

export interface IApiClient {
  get<T>(url: string, params?: any): Promise<T>;
  put<T>(url: string, data?: any): Promise<T>;
}

export class ApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: MINIFLUX_URL,
      headers: {
        "X-Auth-Token": MINIFLUX_API_KEY,
      },
    });
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }
}
