import { AlertCircle } from "lucide-react";

interface ErrorViewProps {
  error: string;
  onRetry: () => void;
}

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something Went Wrong</h2>
        <p className="text-slate-600 mb-6">{error}</p>

        <button
          onClick={onRetry}
          className="px-8 py-3 bg-blue-500 text-white rounded-xl font-medium 
                     hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
