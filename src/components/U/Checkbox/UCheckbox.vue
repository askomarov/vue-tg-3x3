<script setup lang="ts">
interface Props {
  label?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false,
})

const modelValue = defineModel<boolean>({ required: true })
</script>

<template>
  <div
    class="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-600"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </span>
    </div>
    <label class="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" v-model="modelValue" :disabled="disabled" class="sr-only" />
      <div
        :class="[
          'relative h-6 w-11 rounded-full transition-colors duration-200 ease-in-out',
          modelValue ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          disabled && 'cursor-not-allowed opacity-50',
        ]"
      >
        <span
          :class="[
            'inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
            modelValue ? 'translate-x-5' : 'translate-x-0',
            'absolute top-0.5 left-0.5',
          ]"
        />
      </div>
    </label>
  </div>
</template>
