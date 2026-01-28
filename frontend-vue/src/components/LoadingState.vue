<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
</script>

<template>
  <div class="page-container">
    <div class="text-center">
      <div class="mb-6">
        <Loader2 class="w-16 h-16 text-blue-600 animate-spin mx-auto" />
      </div>
      <p class="text-xl text-gray-900 font-medium mb-2">Analyzing Receipt</p>
      <p class="text-gray-600">Our AI is extracting the details...</p>
    </div>
  </div>
</template>
