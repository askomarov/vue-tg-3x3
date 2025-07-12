<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}

withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const handleBackdropClick = () => {
  emit('cancel')
  emit('close')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center"
    @click.self="handleBackdropClick"
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    <div
      class="relative w-full max-w-[calc(100%-32px)] rounded-2xl bg-white p-8 shadow-lg sm:max-w-sm"
    >
      <div class="mx-auto flex w-full flex-col items-center justify-center gap-6 text-center">
        <h3 class="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>

        <p class="mb-6 text-center text-gray-700 dark:text-gray-300">
          {{ message }}
        </p>

        <div class="flex gap-3">
          <button
            @click="handleCancel"
            class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            class="flex-1 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
