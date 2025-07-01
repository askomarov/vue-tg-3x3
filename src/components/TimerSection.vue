<script setup lang="ts">
interface Props {
  gameTime: number
  shotClock: number
  isTimerRunning: boolean
  isShotClockRunning: boolean
}

interface Emits {
  (e: 'toggle-timer'): void
  (e: 'toggle-shot-clock'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const formatGameTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatShotClock = (time: number): string => {
  return time.toFixed(1)
}

const toggleTimer = () => {
  emit('toggle-timer')
}

const toggleShotClock = () => {
  emit('toggle-shot-clock')
}
</script>

<template>
  <div class="flex gap-4">
    <!-- Game Timer -->
    <div class="flex-1 rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800 sm:min-w-[140px]">
      <div
        class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
      >
        Game Time
      </div>
      <button
        @click="toggleTimer"
        :class="[
          'text-3xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 md:text-4xl',
          isTimerRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white',
        ]"
      >
        {{ formatGameTime(gameTime) }}
      </button>
      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {{ isTimerRunning ? 'Running' : 'Paused' }}
      </div>
    </div>

    <!-- Shot Clock -->
    <div class="flex-1 rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800 sm:min-w-[140px]">
      <div
        class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
      >
        Shot Clock
      </div>
      <button
        @click="toggleShotClock"
        :class="[
          'text-3xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 md:text-4xl',
          !isTimerRunning
            ? 'text-gray-400 dark:text-gray-600'
            : isShotClockRunning
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-red-600 dark:text-red-400',
        ]"
        :disabled="!isTimerRunning"
      >
        {{ formatShotClock(shotClock) }}
      </button>
    </div>
  </div>
</template>
