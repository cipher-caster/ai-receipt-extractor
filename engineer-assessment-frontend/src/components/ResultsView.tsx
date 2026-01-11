import type { ReceiptResponse } from "../api/receiptApi";

interface ResultsViewProps {
  receipt: ReceiptResponse;
  onReset: () => void;
}

export function ResultsView({ receipt, onReset }: ResultsViewProps) {
  const formatMoney = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: receipt.currency || "USD",
    }).format(amount);
  };

  return (
    <div className="flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-blue-600 text-white p-6 rounded-t-xl">
        <h2 className="text-xl font-bold">Extraction Complete</h2>
        <p className="opacity-90 text-sm">Review the extracted data below.</p>
      </div>

      <div className="bg-white border-x border-b border-slate-200 rounded-b-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Column */}
          <div className="md:w-1/2">
            <h3 className="font-semibold text-slate-700 mb-3">Receipt Image</h3>
            <img src={receipt.imageUrl} alt="Receipt" className="w-full rounded-lg border border-slate-200" />
          </div>

          {/* Data Column */}
          <div className="md:w-1/2 space-y-6">
            {/* Header Data */}
            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Vendor</span>
                <span className="font-medium text-slate-800">{receipt.vendorName || "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Date</span>
                <span className="font-medium text-slate-800">{receipt.date || "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Currency</span>
                <span className="font-medium text-slate-800">{receipt.currency || "USD"}</span>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Items</h3>
              <ul className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {receipt.items.map((item, i) => (
                  <li key={i} className="flex justify-between px-3 py-2 text-sm">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="font-medium text-slate-900">{formatMoney(item.cost)}</span>
                  </li>
                ))}
                {receipt.items.length === 0 && <li className="px-3 py-4 text-center text-slate-400 text-sm">No items found</li>}
              </ul>
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax / GST</span>
                <span>{formatMoney(receipt.gst)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-800">
                <span>Total</span>
                <span className="text-blue-600">{formatMoney(receipt.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={onReset} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Upload Another Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
