<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGame } from '@/composables/useGame'
import { useTelegram } from '@/composables/useTelegram'
import { useAudio } from '@/composables/useAudio'
import GameSetupModal from '@/components/GameSetupModal.vue'
import TeamCard from '@/components/TeamCard.vue'
import TimerSection from '@/components/TimerSection.vue'

// Game composable
const {
  gameState,
  addScore,
  removeScore,
  addFoul,
  removeFoul,
  toggleTimer,
  toggleShotClock,
  resetGame,
  startNewGame,
  getGameResult,
} = useGame()

// Telegram composable
const { showMainButton, hideMainButton, sendGameResult, showConfirm, hapticFeedback } =
  useTelegram()

// Audio composable for hidden button handler
const { executeQueuedAudio } = useAudio()

// UI state
const showSetupModal = ref(true)

// Handle game actions with haptic feedback
const handleAddScore = (team: 1 | 2, points: number = 1) => {
  hapticFeedback('light')
  addScore(team, points)
}

const handleRemoveScore = (team: 1 | 2) => {
  hapticFeedback('light')
  removeScore(team)
}

const handleAddFoul = (team: 1 | 2) => {
  hapticFeedback('light')
  addFoul(team)
}

const handleRemoveFoul = (team: 1 | 2) => {
  hapticFeedback('light')
  removeFoul(team)
}

const handleToggleTimer = () => {
  hapticFeedback('medium')
  toggleTimer()
}

const handleToggleShotClock = () => {
  hapticFeedback('light')
  toggleShotClock()
}

// Game setup
const handleStartGame = (team1Name: string, team2Name: string) => {
  hapticFeedback('medium')
  startNewGame(team1Name, team2Name)
}

// New game
const handleNewGame = () => {
  showConfirm('Start a new game? Current progress will be lost.', (confirmed) => {
    if (confirmed) {
      showSetupModal.value = true
    }
  })
}

// Reset game
const handleResetGame = () => {
  showConfirm('Reset game and start over?', (confirmed) => {
    if (confirmed) {
      hapticFeedback('heavy')
      resetGame()
      showSetupModal.value = true
    }
  })
}

// Send result
const handleSendResult = () => {
  const result = getGameResult()
  sendGameResult(result)
}

// Watch for game activity to show/hide main button
const hasGameActivity = computed(() => {
  return (
    gameState.score1 > 0 ||
    gameState.score2 > 0 ||
    gameState.fouls1 > 0 ||
    gameState.fouls2 > 0 ||
    gameState.gameStartTime !== null
  )
})

watch(hasGameActivity, (hasActivity) => {
  if (hasActivity) {
    showMainButton(handleSendResult)
  } else {
    hideMainButton()
  }
})
</script>

<template>
  <div class="min-h-screen bg-white p-4 dark:bg-gray-900">
    <!-- Mobile Layout (< 600px) -->
    <div class="mx-auto max-w-2xl space-y-6 sm:hidden">
      <!-- Scoreboard -->
      <div class="flex gap-4">
        <TeamCard
          :team-name="gameState.team1Name"
          :score="gameState.score1"
          :fouls="gameState.fouls1"
          :is-active="gameState.isTimerRunning"
          @add-score="handleAddScore(1, $event)"
          @remove-score="handleRemoveScore(1)"
          @add-foul="handleAddFoul(1)"
          @remove-foul="handleRemoveFoul(1)"
        />

        <TeamCard
          :team-name="gameState.team2Name"
          :score="gameState.score2"
          :fouls="gameState.fouls2"
          :is-active="gameState.isTimerRunning"
          :is-right="true"
          @add-score="handleAddScore(2, $event)"
          @remove-score="handleRemoveScore(2)"
          @add-foul="handleAddFoul(2)"
          @remove-foul="handleRemoveFoul(2)"
        />
      </div>

      <!-- Timers -->
      <TimerSection
        :game-time="gameState.timer"
        :shot-clock="gameState.shotClock"
        :is-timer-running="gameState.isTimerRunning"
        :is-shot-clock-running="gameState.isShotClockRunning"
        @toggle-timer="handleToggleTimer"
        @toggle-shot-clock="handleToggleShotClock"
      />

      <!-- Game Controls -->
      <div class="flex gap-3 text-center">
        <button
          @click="handleNewGame"
          class="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          New Game
        </button>
        <button
          @click="handleResetGame"
          class="flex-1 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Desktop Layout (>= 600px) -->
    <div class="hidden sm:flex sm:min-h-screen sm:items-center sm:justify-center">
      <div class="flex w-full max-w-6xl items-center justify-between gap-4">
        <!-- Left Team Panel -->
        <div class="flex w-64 flex-col">
          <TeamCard
            :team-name="gameState.team1Name"
            :score="gameState.score1"
            :fouls="gameState.fouls1"
            :is-active="gameState.isTimerRunning"
            @add-score="handleAddScore(1, $event)"
            @remove-score="handleRemoveScore(1)"
            @add-foul="handleAddFoul(1)"
            @remove-foul="handleRemoveFoul(1)"
          />
        </div>

        <!-- Center Panel - Timers and Controls -->
        <div class="flex flex-1 flex-col items-center gap-3">
          <!-- Timers -->
          <TimerSection
            :game-time="gameState.timer"
            :shot-clock="gameState.shotClock"
            :is-timer-running="gameState.isTimerRunning"
            :is-shot-clock-running="gameState.isShotClockRunning"
            @toggle-timer="handleToggleTimer"
            @toggle-shot-clock="handleToggleShotClock"
          />

          <!-- Game Controls -->
          <div class="flex gap-3">
            <button
              @click="handleNewGame"
              class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              New Game
            </button>
            <button
              @click="handleResetGame"
              class="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- Right Team Panel -->
        <div class="flex w-64 flex-col">
          <TeamCard
            :team-name="gameState.team2Name"
            :score="gameState.score2"
            :fouls="gameState.fouls2"
            :is-active="gameState.isTimerRunning"
            :is-right="true"
            @add-score="handleAddScore(2, $event)"
            @remove-score="handleRemoveScore(2)"
            @add-foul="handleAddFoul(2)"
            @remove-foul="handleRemoveFoul(2)"
          />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <GameSetupModal
      :open="showSetupModal"
      @close="showSetupModal = false"
      @start-game="handleStartGame"
    />

    <!-- Hidden audio trigger button for WebView autoplay workaround -->
    <button id="hidden-audio-trigger" @click="executeQueuedAudio" aria-hidden="true" hidden>
      Audio Trigger
    </button>
  </div>
</template>
