import { extractReceipt } from "@/api/receiptApi";
import type { ReceiptResponse } from "@/types/receipt";
import { defineStore } from "pinia";
import { ref } from "vue";

export type AppState = "landing" | "preview" | "loading" | "results" | "error";

export const useReceiptStore = defineStore("receipt", () => {
  const appState = ref<AppState>("landing");
  const selectedFile = ref<File | null>(null);
  const receipt = ref<ReceiptResponse | null>(null);
  const error = ref<string>("");
  const selectedProvider = ref<string>("openai");

  function previewReceipt(file: File) {
    selectedFile.value = file;
    appState.value = "preview";
  }

  function cancelPreview() {
    selectedFile.value = null;
    appState.value = "landing";
  }

  function resetToLanding() {
    selectedFile.value = null;
    receipt.value = null;
    error.value = "";
    appState.value = "landing";
  }

  async function extractData() {
    if (!selectedFile.value) return;

    appState.value = "loading";
    try {
      const result = await extractReceipt(selectedFile.value, selectedProvider.value);
      receipt.value = result;
      appState.value = "results";
    } catch (err) {
      console.error(err);
      error.value = "We couldn't read this receipt. Try uploading a clearer photo?";
      appState.value = "error";
    }
  }

  return {
    appState,
    selectedFile,
    receipt,
    error,
    selectedProvider,
    previewReceipt,
    cancelPreview,
    resetToLanding,
    extractData,
  };
});
