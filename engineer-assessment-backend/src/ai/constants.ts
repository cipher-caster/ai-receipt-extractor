export const AI_CONSTANTS = {
  GEMINI: {
    MODEL: 'gemini-flash-latest',
  },
  OPENAI: {
    MODEL: 'gpt-4o',
  },
};

export const SYSTEM_PROMPT = `Analyze this receipt image and extract the following information in JSON format:
{
  "date": "receipt date as string (e.g., '2024-01-15') or null if not found",
  "currency": "3-letter currency code (e.g., 'USD', 'SGD', 'EUR') or null if not found",
  "vendorName": "name of the store/vendor or null if not found",
  "items": [
    { "name": "item name", "cost": 12.99 }
  ],
  "gst": "GST/tax amount as number (can be null)",
  "total": "total amount as number (can be null)"
}

Important:
- All costs/totals must be NUMBERS, not strings
- If a field is missing, use null
- Extract ALL visible line items
- Do not make up data
- Return ONLY the raw JSON object, no markdown formatting`;
