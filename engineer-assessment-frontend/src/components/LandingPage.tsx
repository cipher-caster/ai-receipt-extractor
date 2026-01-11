import { Upload } from "lucide-react";
import { useCallback, useState } from "react";

interface LandingPageProps {
  onFileSelect: (file: File) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export function LandingPage({ onFileSelect }: LandingPageProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      setError(null);
      if (!file) return;
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Unsupported file format. Please use JPG, JPEG, or PNG.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("File is too large. Please select an image under 5MB.");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0]);

  const dropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">Receipt Extractor</h1>
        <p className="text-slate-600 text-lg">Upload a receipt image to extract its contents using AI</p>
      </div>

      <div
        onDrop={dropFile}
        onDragOver={onDragOver}
        className="relative w-full max-w-lg border-2 border-dashed border-slate-300 rounded-2xl p-12 
                   hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 
                   cursor-pointer bg-white shadow-sm"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-medium mb-1">Drag and drop your receipt here</p>
            <p className="text-slate-500 text-sm">or click to browse</p>
          </div>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={selectFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
      </div>

      {error ? <p className="text-red-500 text-sm mt-4">{error}</p> : <p className="text-slate-400 text-sm mt-4">Supported: JPG, JPEG, PNG (max 5MB)</p>}
    </div>
  );
}
