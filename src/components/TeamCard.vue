<script setup lang="ts">
interface Props {
  teamName: string
  score: number
  fouls: number
  isActive?: boolean
  isRight?: boolean
}

interface Emits {
  (e: 'add-score', points: number): void
  (e: 'remove-score'): void
  (e: 'add-foul'): void
  (e: 'remove-foul'): void
}

withDefaults(defineProps<Props>(), {
  isActive: false,
  isRight: false,
})

const emit = defineEmits<Emits>()

const addScore = (points: number = 1) => {
  emit('add-score', points)
}

const removeScore = () => {
  emit('remove-score')
}

const addFoul = () => {
  emit('add-foul')
}

const removeFoul = () => {
  emit('remove-foul')
}
</script>

<template>
  <div
    :class="[
      'flex-1 rounded-2xl p-4 transition-all duration-300 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white',
      'flex flex-col items-center',
      isRight ? '' : '',
    ]"
  >
    <!-- Team Name -->
    <div class="mb-4 text-center">
      <h2 class="text-xl font-semibold md:text-2xl">{{ teamName }}</h2>
    </div>

    <div class="flex flex-col items-center gap-4 w-full">
      <!-- Score Section -->
      <div class="flex flex-col items-center">
        <button
          @click="addScore(1)"
          :class="[
            'mb-2 rounded-xl border-2 text-8xl font-bold transition-all duration-200 hover:scale-105 active:scale-95',
            'h-32 w-32 lg:h-40 lg:w-40',
            'border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
          ]"
        >
          {{ score }}
        </button>

        <button
          @click="removeScore"
          :class="[
            'rounded-lg text-sm font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
            'h-16 w-16',
          ]"
        >
          -
        </button>
      </div>

      <!-- Fouls Section -->
      <div class="flex flex-col items-center">
        <span class="mb-2 text-sm font-medium opacity-80">Fouls</span>

        <button
          @click="addFoul"
          :class="[
            'mb-2 rounded-lg border-2 text-2xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95',
            'h-16 w-16',
            'border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
          ]"
        >
          {{ fouls }}
        </button>

        <button
          @click="removeFoul"
          :class="[
            'rounded-lg text-xs font-medium transition-colors',
            'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
            'h-16 w-16',
          ]"
        >
          -
        </button>
      </div>
    </div>
  </div>
</template>
