<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt';
import { Sparkles, X } from 'lucide-vue-next';
import { computed, onUnmounted } from 'vue';

const store = useReceiptStore();

const imageUrl = computed(() => {
  return store.selectedFile ? URL.createObjectURL(store.selectedFile) : '';
});

onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-lg border border-gray-200">
      <div class="relative mb-6">
        <img 
          :src="imageUrl" 
          alt="Receipt preview" 
          class="rounded-2xl w-full max-h-96 object-contain bg-gray-100" 
        />
        <button
          class="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-slate-600 
                 hover:text-white hover:bg-red-500 transition-all"
          @click="store.cancelPreview"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <p class="text-gray-600 text-center text-sm mb-6">
        {{ store.selectedFile?.name }}
      </p>
      
      <div class="flex gap-4">
        <button 
          class="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 
                 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
          @click="store.cancelPreview"
        >
          Cancel
        </button>
        <button 
          class="flex-1 px-4 py-3 rounded-xl bg-blue-600 
                 text-white hover:bg-blue-700 transition-all 
                 font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
          @click="store.extractData"
        >
          <Sparkles class="w-5 h-5" />
          Extract Data
        </button>
      </div>
    </div>
  </div>
</template>
