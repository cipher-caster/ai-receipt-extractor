import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full text-center">
        <div className="mb-6">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">Hang Tight!</h2>
        <p className="text-slate-600">We're reading your receipt. This usually takes a few seconds...</p>
      </div>
    </div>
  );
}
