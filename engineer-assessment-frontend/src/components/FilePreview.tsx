import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { formatFileSize } from "../utils/formatters";

interface FilePreviewProps {
  file: File;
  onCancel: () => void;
  onSubmit: () => void;
}

export function FilePreview({ file, onCancel, onSubmit }: FilePreviewProps) {
  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Selected File</h2>

        <div className="mb-6">
          <img src={fileUrl} alt="Receipt preview" className="w-full max-h-64 object-contain rounded-lg border border-slate-200" />
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 font-medium truncate">{file.name}</p>
              <p className="text-slate-500 text-sm">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-slate-300 rounded-xl text-slate-700 
                       font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium 
                       hover:bg-blue-600 transition-colors"
          >
            Extract Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
