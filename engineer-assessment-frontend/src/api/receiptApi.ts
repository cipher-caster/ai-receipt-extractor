import axios from "axios";

export interface ReceiptItem {
  name: string;
  cost: number;
}

export interface ReceiptResponse {
  id: string;
  imageUrl: string;
  date: string | null;
  currency: string | null;
  vendorName: string | null;
  items: ReceiptItem[];
  gst: number | null;
  total: number | null;
  isValidSum: boolean;
  createdAt: string;
}

const api = axios.create({
  baseURL: "/api",
  timeout: 30000, // 30 seconds
});

export async function extractReceipt(file: File, provider?: string): Promise<ReceiptResponse> {
  const formData = new FormData();
  formData.append("file", file);

  if (provider) formData.append("provider", provider);

  const response = await api.post<ReceiptResponse>("/receipts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updatedReceipt(id: string, data: Partial<ReceiptResponse>): Promise<ReceiptResponse> {
  const response = await api.put<ReceiptResponse>(`/receipts/${id}`, data);
  return response.data;
}


