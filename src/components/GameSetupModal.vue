<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useAudio } from '@/composables/useAudio'
import UCheckbox from '@/components/U/Checkbox/UCheckbox.vue'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'start-game', team1Name: string, team2Name: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { isAudioEnabled, setAudioEnabled } = useAudio()
const team1Name = ref('')
const team2Name = ref('')

// Create computed property for v-model to work properly
const audioEnabled = computed({
  get: () => isAudioEnabled.value,
  set: (value: boolean) => setAudioEnabled(value),
})

const startGame = () => {
  const name1 = team1Name.value.trim() || 'Team 1'
  const name2 = team2Name.value.trim() || 'Team 2'

  emit('start-game', name1, name2)
  emit('close')
}

const cancel = () => {
  emit('close')
}

// Reset form when modal opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      team1Name.value = 'Team 1'
      team2Name.value = 'Team 2'

      // Focus first input after modal animation
      nextTick(() => {
        const input = document.getElementById('team1-name-input') as HTMLInputElement
        if (input) {
          input.focus()
          input.select()
        }
      })
    }
  },
)
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="cancel"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
      <h3 class="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-white">
        🏀 New Game Setup
      </h3>

      <form @submit.prevent="startGame" class="space-y-4">
        <div>
          <label
            for="team1-name-input"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Team 1 Name
          </label>
          <input
            id="team1-name-input"
            v-model="team1Name"
            type="text"
            maxlength="20"
            placeholder="Team 1"
            class="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label
            for="team2-name-input"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Team 2 Name
          </label>
          <input
            id="team2-name-input"
            v-model="team2Name"
            type="text"
            maxlength="20"
            placeholder="Team 2"
            class="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <!-- Audio settings -->
        <UCheckbox v-model="audioEnabled" label="🔊 Sound Effects" />
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="cancel"
            class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Start Game
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
