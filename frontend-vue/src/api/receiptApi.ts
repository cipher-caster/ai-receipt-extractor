import type { ReceiptResponse } from "@/types/receipt";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

export async function extractReceipt(file: File, provider: string): Promise<ReceiptResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("provider", provider);

  const response = await api.post<ReceiptResponse>("/receipts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function updateReceipt(id: string, data: Partial<ReceiptResponse>): Promise<ReceiptResponse> {
  const response = await api.put<ReceiptResponse>(`/receipts/${id}`, data);
  return response.data;
}
