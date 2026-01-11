export interface ExtractedReceipt {
  date: string | null;
  currency: string | null;
  vendorName: string | null;
  items: Array<{
    name: string;
    cost: number;
  }>;
  gst: number | null;
  total: number | null;
}

export interface AiProvider {
  extractReceipt(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<ExtractedReceipt>;
}
