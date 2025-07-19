<script setup lang="ts">
import ButtonTG from '@/components/ButtonTG/ButtonTG.vue'
</script>

<template>
  <div class="flex justify-center mb-6 flex-col items-center text-center space-y-4">
    <!-- Hero Section -->
    <div class="max-w-2xl space-y-4">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">🏀 3x3 Basketball Scorer</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Professional scoreboard for 3x3 basketball games
        </p>
      </div>

      <!-- Features List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>Real-time score tracking</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>Game timer & shot clock</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>Foul counting</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>Haptic feedback</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>Game statistics</span>
        </div>
      </div>

      <!-- Call to Action -->
      <div
        class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
      >
        <p class="text-blue-800 dark:text-blue-200 font-medium mb-3">
          🚀 Get the full experience in Telegram!
        </p>
        <p class="text-sm text-blue-700 dark:text-blue-300 mb-4">
          Open in Telegram to save game results, access statistics, and enjoy all features.
        </p>
        <ButtonTG class="mx-auto" size="lg" />
      </div>
    </div>
  </div>
</template>
