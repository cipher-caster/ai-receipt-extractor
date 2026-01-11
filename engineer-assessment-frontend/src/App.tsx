import { useState } from "react";
import { extractReceipt, type ReceiptResponse } from "./api/receiptApi";
import { ErrorView } from "./components/ErrorView";
import { FilePreview } from "./components/FilePreview";
import { LandingPage } from "./components/LandingPage";
import { LoadingState } from "./components/LoadingState";
import { ResultsView } from "./components/ResultsView";
import { SettingsButton } from "./components/SettingsButton";

type AppState = "landing" | "preview" | "loading" | "results" | "error";

function App() {
  const [state, setState] = useState<AppState>("landing");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<ReceiptResponse | null>(null);
  const [error, setError] = useState<string>("");

  // AI Settings
  const [selectedProvider, setSelectedProvider] = useState("gemini");

  const previewReceipt = (file: File) => {
    setSelectedFile(file);
    setState("preview");
  };

  const cancelPreview = () => {
    setSelectedFile(null);
    setState("landing");
  };

  const resetToLanding = () => {
    setSelectedFile(null);
    setReceipt(null);
    setError("");
    setState("landing");
  };

  const extractData = async () => {
    if (!selectedFile) return;

    setState("loading");
    try {
      const result = await extractReceipt(selectedFile, selectedProvider);
      setReceipt(result);
      setState("results");
    } catch (err: any) {
      console.error(err);
      setError("We couldn't read this receipt. Try uploading a clearer photo?");
      setState("error");
    }
  };

  return (
    <>
      <SettingsButton selectedProvider={selectedProvider} onProviderChange={setSelectedProvider} />

      {(() => {
        switch (state) {
          case "landing":
            return <LandingPage onFileSelect={previewReceipt} />;
          case "preview":
            return selectedFile ? <FilePreview file={selectedFile} onCancel={cancelPreview} onSubmit={extractData} /> : null;
          case "loading":
            return <LoadingState />;
          case "results":
            return receipt ? <ResultsView receipt={receipt} onReset={resetToLanding} /> : null;
          case "error":
            return <ErrorView error={error} onRetry={resetToLanding} />;
          default:
            return null;
        }
      })()}
    </>
  );
}

export default App;
