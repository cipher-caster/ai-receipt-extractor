import { useEffect, useState } from "react";
import { updatedReceipt, type ReceiptResponse } from "../api/receiptApi";

interface EditableReceiptItem {
  name: string;
  cost: number | null;
}

interface FormData {
  items: EditableReceiptItem[];
  gst: number | null;
  total: number | null;
  vendorName: string | null;
  date: string | null;
  currency: string | null;
}

interface UIState {
  editing: boolean;
  submitting: boolean;
  submitted: boolean;
}

interface ResultsViewProps {
  receipt: ReceiptResponse;
  onReset: () => void;
}

const getInitialFormData = (receipt: ReceiptResponse): FormData => ({
  items: receipt.items || [],
  gst: receipt.gst ?? null,
  total: receipt.total ?? null,
  vendorName: receipt.vendorName ?? null,
  date: receipt.date ?? null,
  currency: receipt.currency ?? null,
});

const initialUIState: UIState = {
  editing: false,
  submitting: false,
  submitted: false,
};

export function ResultsView({ receipt, onReset }: ResultsViewProps) {
  const formatMoney = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: receipt.currency || "USD",
    }).format(amount);
  };

  const [formData, setFormData] = useState<FormData>(() => getInitialFormData(receipt));
  const [uiState, setUIState] = useState<UIState>(initialUIState);

  useEffect(() => {
    setFormData(getInitialFormData(receipt));
    setUIState(initialUIState);
  }, [receipt]);

  const updateFormField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: "name" | "cost", value: string) => {
    setFormData((prev) => {
      const newItems = prev.items.map((it) => ({ ...it }));
      if (field === "name") {
        newItems[index].name = value;
      } else {
        newItems[index].cost = value === "" ? null : Number(value);
      }
      return { ...prev, items: newItems };
    });
  };

  const parsedGst = Number(formData.gst) || 0;
  const parsedTotal = Number(formData.total) || 0;
  const itemsSum = formData.items.reduce((acc, it) => acc + (Number(it.cost) || 0), 0);
  const computedSum = itemsSum + parsedGst;

  const cents = (n: number) => Math.round(n * 100);
  const isSumValid = formData.total !== null && cents(computedSum) === cents(parsedTotal);

  const handleSubmit = async () => {
    setUIState((prev) => ({ ...prev, submitting: true }));
    try {
      await updatedReceipt(receipt.id, {
        vendorName: formData.vendorName,
        date: formData.date,
        currency: formData.currency,
        gst: formData.gst,
        total: formData.total,
        items: formData.items.map((it) => ({ name: it.name, cost: it.cost ?? 0 })),
        isValidSum: isSumValid,
      });
      setUIState({ editing: false, submitting: false, submitted: true });
    } catch (error) {
      console.error("Failed to update receipt:", error);
      alert("Failed to update receipt. Please try again.");
      setUIState((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleCancel = () => {
    setFormData(getInitialFormData(receipt));
    setUIState((prev) => ({ ...prev, editing: false }));
  };

  const startEditing = () => {
    setUIState((prev) => ({ ...prev, editing: true }));
  };

  if (uiState.submitted) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto p-4 md:p-8">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Receipt Updated!</h2>
          <p className="text-slate-500 mb-6">Your changes have been saved successfully.</p>
          <button onClick={onReset} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Upload Another Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-blue-600 text-white p-6 rounded-t-xl">
        <h2 className="text-xl font-bold">Extraction Complete</h2>
        <p className="opacity-90 text-sm">Review the extracted data below.</p>
      </div>

      <div className="bg-white border-x border-b border-slate-200 rounded-b-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <h3 className="font-semibold text-slate-700 mb-3">Receipt Image</h3>
            <img src={receipt.imageUrl} alt="Receipt" className="w-full rounded-lg border border-slate-200" />
          </div>

          <div className="md:w-1/2 space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Vendor</span>
                {uiState.editing ? (
                  <input className="font-medium text-slate-800 bg-white border rounded px-2 py-1" value={formData.vendorName ?? ""} onChange={(e) => updateFormField("vendorName", e.target.value)} />
                ) : (
                  <span className="font-medium text-slate-800">{formData.vendorName || "Unknown"}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Date</span>
                {uiState.editing ? (
                  <input className="font-medium text-slate-800 bg-white border rounded px-2 py-1" value={formData.date ?? ""} onChange={(e) => updateFormField("date", e.target.value)} />
                ) : (
                  <span className="font-medium text-slate-800">{formData.date || "Unknown"}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Currency</span>
                {uiState.editing ? (
                  <input className="font-medium text-slate-800 bg-white border rounded px-2 py-1" value={formData.currency ?? ""} onChange={(e) => updateFormField("currency", e.target.value)} />
                ) : (
                  <span className="font-medium text-slate-800">{formData.currency || "USD"}</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Items</h3>
              <ul className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {formData.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between px-3 py-2 text-sm gap-2">
                    {uiState.editing ? (
                      <>
                        <input className="flex-1 text-slate-700 bg-white border rounded px-2 py-1" value={item.name ?? ""} onChange={(e) => updateItem(i, "name", e.target.value)} />
                        <input className="w-28 text-right font-medium text-slate-900 bg-white border rounded px-2 py-1" type="number" step="0.01" value={item.cost ?? 0} onChange={(e) => updateItem(i, "cost", e.target.value)} />
                      </>
                    ) : (
                      <>
                        <span className="text-slate-700">{item.name}</span>
                        <span className="font-medium text-slate-900">{formatMoney(item.cost)}</span>
                      </>
                    )}
                  </li>
                ))}
                {formData.items.length === 0 && <li className="px-3 py-4 text-center text-slate-400 text-sm">No items found</li>}
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm items-center gap-4">
                <span className="text-slate-500">Tax / GST</span>
                {uiState.editing ? (
                  <input
                    className="w-32 text-right font-medium text-slate-900 bg-white border rounded px-2 py-1"
                    type="number"
                    step="0.01"
                    value={formData.gst ?? 0}
                    onChange={(e) => updateFormField("gst", e.target.value === "" ? null : Number(e.target.value))}
                  />
                ) : (
                  <span>{formatMoney(formData.gst)}</span>
                )}
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className={`${isSumValid ? "text-blue-600" : "text-red-600"}`}>
                  {uiState.editing ? (
                    <input
                      className="w-32 text-right font-bold bg-white border rounded px-2 py-1"
                      type="number"
                      step="0.01"
                      value={formData.total ?? 0}
                      onChange={(e) => updateFormField("total", e.target.value === "" ? null : Number(e.target.value))}
                    />
                  ) : (
                    formatMoney(formData.total)
                  )}
                </span>
              </div>
              {!isSumValid && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-1">Total doesn't match</p>
                  <p className="text-sm text-red-700">
                    The items and tax add up to {formatMoney(computedSum)}, but the total shows {formatMoney(formData.total)}. Please review and correct the values.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3 items-center justify-end">
              {!uiState.editing ? (
                <button onClick={startEditing} className={`${isSumValid ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} text-white px-4 py-2 rounded-lg font-medium transition-colors`}>
                  Edit
                </button>
              ) : (
                <>
                  <button onClick={handleSubmit} disabled={uiState.submitting} className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
                    {uiState.submitting ? "Submitting..." : "Submit"}
                  </button>
                  <button onClick={handleCancel} disabled={uiState.submitting} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50">
                    Cancel
                  </button>
                </>
              )}
            </div>

            <div className="mt-4">
              <button onClick={onReset} className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Upload Another Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
