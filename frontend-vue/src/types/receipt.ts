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
