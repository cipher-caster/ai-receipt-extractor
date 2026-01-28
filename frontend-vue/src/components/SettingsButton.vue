<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt';
import { Cpu, Settings, Sparkles, X } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const store = useReceiptStore();
const { selectedProvider } = storeToRefs(store);

const isOpen = ref(false);

const providers = [
  { value: 'openai', label: 'OpenAI', icon: Cpu },
  { value: 'gemini', label: 'Gemini', icon: Sparkles },
];
</script>

<template>
  <div class="fixed top-4 right-4 z-50">
    <button
      class="p-3 rounded-full bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all border border-gray-200 shadow-lg"
      @click="isOpen = !isOpen">
      <Settings class="w-5 h-5" />
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-3 w-64 card overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <span class="text-gray-900 font-medium">Settings</span>
        <button class="p-1 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          @click="isOpen = false">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="p-4">
        <label class="text-sm text-gray-600 block mb-3">AI Provider</label>
        <div class="space-y-2">
          <button v-for="provider in providers" :key="provider.value"
            class="w-full flex items-center gap-3 p-3 rounded-xl transition-all" :class="selectedProvider === provider.value
              ? 'bg-blue-100 border border-blue-300 text-gray-900'
              : 'bg-gray-100 border border-transparent text-gray-600 hover:bg-gray-200'"
            @click="selectedProvider = provider.value">
            <component :is="provider.icon" class="w-5 h-5" />
            <span>{{ provider.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
