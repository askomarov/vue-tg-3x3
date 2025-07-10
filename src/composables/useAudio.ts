import { ref } from 'vue'
import { useTelegram } from './useTelegram'

// Global state for audio - shared across all instances
const isAudioEnabled = ref(true)

// Global audio action queue
let currentAudioAction: (() => Promise<void>) | null = null

export function useAudio() {
  const { hapticNotification } = useTelegram()

  // Get base path from Vite config
  const basePath = import.meta.env.BASE_URL

  // Create audio instances with proper base path
  const buzzerAudio = new Audio(`${basePath}assets/audio/buzzeer.mp3`)
  buzzerAudio.preload = 'auto'
  buzzerAudio.volume = 0.8

  const beepAudio = new Audio(`${basePath}assets/audio/beep.mp3`)
  beepAudio.preload = 'auto'
  beepAudio.volume = 0.6

  // Function to trigger hidden button click
  const triggerHiddenAudioButton = (audioAction: () => Promise<void>) => {
    currentAudioAction = audioAction
    const hiddenButton = document.getElementById('hidden-audio-trigger')
    if (hiddenButton) {
      hiddenButton.click()
    }
  }

  // Function to be called by hidden button
  const executeQueuedAudio = async () => {
    if (currentAudioAction) {
      await currentAudioAction()
      currentAudioAction = null
    }
  }

  const playBuzzer = async () => {
    if (!isAudioEnabled.value) return

    // Haptic feedback for time's up
    hapticNotification('warning')

    const buzzerAction = async () => {
      try {
        // Reset audio to beginning
        buzzerAudio.currentTime = 0
        await buzzerAudio.play()
      } catch (error) {
        console.warn('Failed to play buzzer sound:', error)
        // Simple fallback beep
        try {
          // Try to create a simple beep sound
          if (typeof AudioContext !== 'undefined') {
            const audioContext = new AudioContext()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 800
            oscillator.type = 'square'

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
          }
        } catch (fallbackError) {
          console.warn('Fallback buzzer also failed:', fallbackError)
        }
      }
    }

    // Trigger hidden button to play audio with user gesture
    triggerHiddenAudioButton(buzzerAction)
  }

  const playBeep = async () => {
    if (!isAudioEnabled.value) return

    // Light haptic feedback for countdown
    hapticNotification('success')

    const beepAction = async () => {
      try {
        // Reset audio to beginning
        beepAudio.currentTime = 0
        await beepAudio.play()
      } catch (error) {
        console.warn('Failed to play beep sound:', error)
        // Fallback beep with higher pitch
        try {
          if (typeof AudioContext !== 'undefined') {
            const audioContext = new AudioContext()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 1200 // Higher pitch than buzzer
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.2)
          }
        } catch (fallbackError) {
          console.warn('Fallback beep also failed:', fallbackError)
        }
      }
    }

    // Trigger hidden button to play audio with user gesture
    triggerHiddenAudioButton(beepAction)
  }

  const setAudioEnabled = (enabled: boolean) => {
    isAudioEnabled.value = enabled
  }

  return {
    isAudioEnabled,
    playBuzzer,
    playBeep,
    setAudioEnabled,
    executeQueuedAudio, // Export this for the hidden button
  }
}
