<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt';
import { AlertCircle, RotateCcw } from 'lucide-vue-next';

defineProps<{
  error: string;
}>();

const store = useReceiptStore();
</script>

<template>
  <div class="page-container">
    <div class="card p-8 max-w-md text-center">
      <div class="mb-6">
        <div class="inline-block p-4 rounded-full bg-red-100">
          <AlertCircle class="w-12 h-12 text-red-600" />
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
      <p class="text-gray-600 mb-8 leading-relaxed">{{ error }}</p>

      <button class="btn-primary px-8 py-4 flex items-center justify-center gap-2 mx-auto"
        @click="store.resetToLanding">
        <RotateCcw class="w-5 h-5" />
        Try Again
      </button>
    </div>
  </div>
</template>
