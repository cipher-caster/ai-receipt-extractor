<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt';
import { Upload } from 'lucide-vue-next';

const store = useReceiptStore();

function uploadFile(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    store.previewReceipt(input.files[0]);
  }
}

function dropFile(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer?.files?.[0]) {
    store.previewReceipt(event.dataTransfer.files[0]);
  }
}
</script>

<template>
  <div class="page-container" @dragover.prevent @drop="dropFile">
    <div class="text-center max-w-lg w-full">
      <div class="mb-8">
        <h1 class="text-5xl font-bold text-blue-600 mb-4">Receipt Extractor</h1>
        <p class="text-gray-600 text-lg">Upload a receipt photo and let AI extract all the details</p>
      </div>

      <label class="cursor-pointer group block p-12 border-2 border-dashed border-gray-300 rounded-3xl 
               hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 bg-white shadow-sm">
        <div class="flex flex-col items-center gap-4">
          <div
            class="p-4 rounded-full bg-gray-100 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
            <Upload class="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <span class="text-gray-700 text-lg font-medium block">Drop a receipt here</span>
            <span class="text-gray-500 text-sm">or click to upload</span>
          </div>
          <span class="text-xs text-gray-400 mt-2">Supports JPG, PNG, WEBP</span>
        </div>
        <input type="file" accept="image/*" class="hidden" @change="uploadFile" />
      </label>
    </div>
  </div>
</template>
