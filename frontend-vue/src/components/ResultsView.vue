<script setup lang="ts">
import { updateReceipt } from '@/api/receiptApi';
import { useReceiptStore } from '@/stores/receipt';
import type { ReceiptItem } from '@/types/receipt';
import { formatCurrency } from '@/utils/formatters';
import { Check, Loader2, Pencil, RotateCcw, X } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, reactive, watch } from 'vue';

const store = useReceiptStore();
const { receipt } = storeToRefs(store);

interface FormData {
  items: ReceiptItem[];
  gst: number | null;
  total: number | null;
  vendorName: string | null;
  date: string | null;
  currency: string | null;
}

interface UIState {
  editing: boolean;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

const formData = reactive<FormData>({
  items: [],
  gst: null,
  total: null,
  vendorName: null,
  date: null,
  currency: null,
});

const uiState = reactive<UIState>({
  editing: false,
  submitting: false,
  submitted: false,
  error: null,
});

function initFormData() {
  if (!receipt.value) return;
  formData.items = (receipt.value.items || []).map(it => ({ ...it }));
  formData.gst = receipt.value.gst;
  formData.total = receipt.value.total;
  formData.vendorName = receipt.value.vendorName;
  formData.date = receipt.value.date;
  formData.currency = receipt.value.currency;
  uiState.editing = false;
  uiState.submitting = false;
  uiState.submitted = false;
}

watch(receipt, initFormData, { immediate: true });

// Live sum validation
const parsedGst = computed(() => Number(formData.gst) || 0);
const parsedTotal = computed(() => Number(formData.total) || 0);
const itemsSum = computed(() => formData.items.reduce((acc, it) => acc + (Number(it.cost) || 0), 0));
const computedSum = computed(() => itemsSum.value + parsedGst.value);
const cents = (n: number) => Math.round(n * 100);
const isSumValid = computed(() => formData.total !== null && cents(computedSum.value) === cents(parsedTotal.value));

function updateItem(index: number, field: 'name' | 'cost', value: string) {
  if (field === 'name') {
    formData.items[index].name = value;
  } else {
    formData.items[index].cost = value === '' ? 0 : Number(value);
  }
}

async function submitReceipt() {
  if (!receipt.value) return;

  uiState.submitting = true;
  uiState.error = null;
  try {
    await updateReceipt(receipt.value.id, {
      vendorName: formData.vendorName,
      date: formData.date,
      currency: formData.currency,
      gst: formData.gst,
      total: formData.total,
      items: formData.items.map(it => ({ name: it.name, cost: it.cost ?? 0 })),
    });
    uiState.editing = false;
    uiState.submitting = false;
    uiState.submitted = true;
  } catch (error: unknown) {
    console.error('Failed to update receipt:', error);
    const err = error as { response?: { data?: { message?: string } } };
    uiState.error = err.response?.data?.message || 'Failed to update receipt. Please try again.';
    uiState.submitting = false;
  }
}
</script>

<template>
  <!-- Success State -->
  <div v-if="uiState.submitted" class="page-container">
    <div class="card p-8 max-w-md text-center">
      <div class="mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check class="w-8 h-8 text-green-600" />
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Receipt Updated!</h2>
      <p class="text-gray-600 mb-6">Your changes have been saved successfully.</p>
      <button @click="store.resetToLanding" class="btn-primary w-full py-3">
        Upload Another Receipt
      </button>
    </div>
  </div>

  <!-- Results View -->
  <div v-else-if="receipt" class="min-h-screen bg-gray-50 p-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-blue-600 text-white p-6 rounded-t-2xl">
        <h2 class="text-xl font-bold">Extraction Complete</h2>
        <p class="opacity-90 text-sm">Review the extracted data below.</p>
      </div>

      <!-- Content -->
      <div class="bg-white border-x border-b border-gray-200 rounded-b-2xl p-6 shadow-sm">
        <!-- Error Banner -->
        <div v-if="uiState.error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800">{{ uiState.error }}</p>
          </div>
          <button @click="uiState.error = null" class="text-red-500 hover:text-red-700">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Image Column -->
          <div class="md:w-1/2">
            <h3 class="font-semibold text-gray-700 mb-3">Receipt Image</h3>
            <img v-if="receipt.imageUrl" :src="receipt.imageUrl" alt="Receipt"
              class="w-full rounded-xl border border-gray-200" />
            <div v-else class="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          </div>

          <!-- Data Column -->
          <div class="md:w-1/2 space-y-6">
            <!-- Vendor Info -->
            <div class="bg-gray-50 p-4 rounded-xl space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Vendor</span>
                <input v-if="uiState.editing" v-model="formData.vendorName" class="input text-right" />
                <span v-else class="font-medium text-gray-900">{{ formData.vendorName || 'Unknown' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Date</span>
                <input v-if="uiState.editing" v-model="formData.date" class="input text-right" />
                <span v-else class="font-medium text-gray-900">{{ formData.date || 'Unknown' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Currency</span>
                <input v-if="uiState.editing" v-model="formData.currency" class="input text-right w-20" />
                <span v-else class="font-medium text-gray-900">{{ formData.currency || 'USD' }}</span>
              </div>
            </div>

            <!-- Items -->
            <div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Items</h3>
              <ul class="border border-gray-200 rounded-xl divide-y divide-gray-200 max-h-64 overflow-y-auto bg-white">
                <li v-for="(item, i) in formData.items" :key="i"
                  class="flex items-center justify-between px-4 py-3 text-sm gap-2">
                  <template v-if="uiState.editing">
                    <input :value="item.name" @input="updateItem(i, 'name', ($event.target as HTMLInputElement).value)"
                      class="input flex-1" />
                    <input type="number" step="0.01" :value="item.cost"
                      @input="updateItem(i, 'cost', ($event.target as HTMLInputElement).value)"
                      class="input w-28 text-right" />
                  </template>
                  <template v-else>
                    <span class="text-gray-700">{{ item.name }}</span>
                    <span class="font-medium text-gray-900">{{ formatCurrency(item.cost, formData.currency) }}</span>
                  </template>
                </li>
                <li v-if="formData.items.length === 0" class="px-4 py-6 text-center text-gray-500 text-sm">
                  No items found
                </li>
              </ul>
            </div>

            <!-- Totals -->
            <div class="space-y-3 pt-4 border-t border-gray-200">
              <div class="flex justify-between text-sm items-center">
                <span class="text-gray-500">Tax / GST</span>
                <input v-if="uiState.editing" type="number" step="0.01" v-model.number="formData.gst"
                  class="input w-32 text-right" />
                <span v-else class="text-gray-900">{{ formatCurrency(formData.gst, formData.currency) }}</span>
              </div>

              <div class="flex justify-between text-lg font-bold items-center">
                <span class="text-gray-900">Total</span>
                <span :class="isSumValid ? 'text-blue-600' : 'text-red-600'">
                  <input v-if="uiState.editing" type="number" step="0.01" v-model.number="formData.total"
                    class="input w-32 text-right font-bold" :class="isSumValid ? 'text-blue-600' : 'text-red-600'" />
                  <template v-else>{{ formatCurrency(formData.total, formData.currency) }}</template>
                </span>
              </div>

              <!-- Sum Mismatch Warning -->
              <div v-if="!isSumValid" class="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p class="text-sm font-medium text-red-600 mb-1">Total doesn't match</p>
                <p class="text-sm text-red-500">
                  Items + tax = {{ formatCurrency(computedSum, formData.currency) }},
                  but total shows {{ formatCurrency(formData.total, formData.currency) }}.
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 items-center justify-end pt-2">
              <template v-if="!uiState.editing">
                <button @click="uiState.editing = true"
                  :class="isSumValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'"
                  class="text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Pencil class="w-4 h-4" />
                  Edit
                </button>
              </template>
              <template v-else>
                <button @click="submitReceipt" :disabled="uiState.submitting"
                  class="btn-primary flex items-center gap-2">
                  <Loader2 v-if="uiState.submitting" class="w-4 h-4 animate-spin" />
                  {{ uiState.submitting ? 'Submitting...' : 'Submit' }}
                </button>
                <button @click="initFormData" :disabled="uiState.submitting"
                  class="btn-secondary flex items-center gap-2">
                  <X class="w-4 h-4" />
                  Cancel
                </button>
              </template>
            </div>

            <!-- Upload Another -->
            <button @click="store.resetToLanding"
              class="btn-secondary w-full mt-4 py-3 flex items-center justify-center gap-2">
              <RotateCcw class="w-5 h-5" />
              Upload Another Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
