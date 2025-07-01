<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  winner: number
  team1Name: string
  team2Name: string
  visible: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const winnerName = computed(() => {
  if (props.winner === 1) return props.team1Name
  if (props.winner === 2) return props.team2Name
  return 'Draw'
})

const celebrationText = computed(() => {
  if (props.winner === 0) return "🤝 It's a Draw!"
  return `🎉 ${winnerName.value} Wins! 🎉`
})

const close = () => {
  emit('close')
}

// Auto-hide after 3 seconds
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      setTimeout(() => {
        close()
      }, 3000)
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-50"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-50"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click="close"
      >
        <div
          class="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-center text-white shadow-2xl"
          @click.stop
        >
          <div class="text-4xl font-bold mb-4">
            {{ celebrationText }}
          </div>

          <div v-if="winner !== 0" class="text-xl">🏆 Congratulations!</div>

          <div v-else class="text-xl">Great game!</div>

          <button
            @click="close"
            class="mt-6 rounded-lg bg-white/20 px-6 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            Close
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
