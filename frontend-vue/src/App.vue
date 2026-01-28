<script setup lang="ts">
import ErrorView from '@/components/ErrorView.vue';
import FilePreview from '@/components/FilePreview.vue';
import LandingPage from '@/components/LandingPage.vue';
import LoadingState from '@/components/LoadingState.vue';
import ResultsView from '@/components/ResultsView.vue';
import SettingsButton from '@/components/SettingsButton.vue';
import { useReceiptStore } from '@/stores/receipt';
import { storeToRefs } from 'pinia';

const store = useReceiptStore();
const { appState, selectedFile, receipt, error } = storeToRefs(store);
</script>

<template>
  <SettingsButton />
  
  <LandingPage v-if="appState === 'landing'" />
  
  <FilePreview 
    v-else-if="appState === 'preview' && selectedFile" 
  />
  
  <LoadingState v-else-if="appState === 'loading'" />
  
  <ResultsView 
    v-else-if="appState === 'results' && receipt" 
  />
  
  <ErrorView 
    v-else-if="appState === 'error'" 
    :error="error" 
  />
</template>
