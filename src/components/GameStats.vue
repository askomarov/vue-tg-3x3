<script setup lang="ts">
import type { GameStats } from '@/types/game'

interface Props {
  stats: GameStats
}

defineProps<Props>()

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="rounded-xl bg-gray-100 p-6 dark:bg-gray-800">
    <h3 class="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
      📊 Game Statistics
    </h3>

    <div class="space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Total Points:</span>
        <span class="font-semibold text-gray-900 dark:text-white">{{ stats.totalPoints }}</span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Game Time:</span>
        <span class="font-semibold text-gray-900 dark:text-white">{{
          formatTime(stats.gameTime)
        }}</span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Team Fouls:</span>
        <span class="font-semibold text-gray-900 dark:text-white">{{ stats.teamFouls }}</span>
      </div>
    </div>
  </div>
</template>
