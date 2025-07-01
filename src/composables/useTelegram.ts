import { onMounted, onUnmounted } from 'vue'
import type { TelegramWebApp, GameResult } from '@/types/game'

export function useTelegram() {
  let tg: TelegramWebApp | null = null

  onMounted(() => {
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()

      // Setup theme
      document.documentElement.style.setProperty('--tg-color-scheme', tg.colorScheme)

      // Setup buttons
      setupTelegramButtons()

      // Setup event handlers
      tg.onEvent('themeChanged', updateTheme)
    }
  })

  onUnmounted(() => {
    // Clean up intervals or listeners if needed
  })

  const setupTelegramButtons = () => {
    if (!tg) return

    // Main button - send result
    if (tg.MainButton) {
      tg.MainButton.text = 'Send Result'
      tg.MainButton.color = tg.themeParams.button_color || '#2481cc'
      tg.MainButton.textColor = tg.themeParams.button_text_color || '#ffffff'
      tg.MainButton.hide() // Hidden by default
    }

    // Back button
    if (tg.BackButton) {
      tg.BackButton.show()
      tg.BackButton.onClick(() => {
        tg?.close()
      })
    }
  }

  const updateTheme = () => {
    if (tg) {
      document.documentElement.style.setProperty('--tg-color-scheme', tg.colorScheme)
    }
  }

  const showMainButton = (onClick: () => void) => {
    if (tg?.MainButton) {
      tg.MainButton.onClick(onClick)
      tg.MainButton.show()
    }
  }

  const hideMainButton = () => {
    if (tg?.MainButton) {
      tg.MainButton.hide()
    }
  }

  const sendGameResult = (gameResult: GameResult) => {
    if (!tg) {
      console.warn('Telegram WebApp not available')
      return
    }

    try {
      // Clean team names
      const cleanResult = {
        ...gameResult,
        team1Name: gameResult.team1Name.replace(/[^\w\sА-Яа-я\-\.]/g, '').trim() || 'Team 1',
        team2Name: gameResult.team2Name.replace(/[^\w\sА-Яа-я\-\.]/g, '').trim() || 'Team 2',
      }

      const dataString = JSON.stringify(cleanResult)

      // Check data size limit (Telegram WebApp ~4KB limit)
      if (dataString.length > 4000) {
        // Use compact version
        const compactResult = {
          s1: cleanResult.score1,
          s2: cleanResult.score2,
          f1: cleanResult.fouls1,
          f2: cleanResult.fouls2,
          t1: cleanResult.team1Name,
          t2: cleanResult.team2Name,
          w: cleanResult.winner,
          time: cleanResult.gameTime,
        }

        tg.sendData(JSON.stringify(compactResult))
      } else {
        tg.sendData(dataString)
      }

      // Success feedback
      if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success')
      }

      tg.showAlert('Game result sent to chat!')

      // Close app after delay
      setTimeout(() => {
        tg?.close()
      }, 1500)
    } catch (error) {
      console.error('Error sending game result:', error)

      // Fallback - show result to user
      const resultText = formatGameResultForUser(gameResult)
      tg.showAlert(`Game result:\\n${resultText}\\n\\nSending error occurred.`)
    }
  }

  const formatGameResultForUser = (gameResult: GameResult): string => {
    const winnerText =
      gameResult.winner === 1
        ? `Winner: ${gameResult.team1Name}`
        : gameResult.winner === 2
          ? `Winner: ${gameResult.team2Name}`
          : 'Draw'

    const minutes = Math.floor(gameResult.gameTime / 60)
    const seconds = gameResult.gameTime % 60

    return `🏀 ${gameResult.team1Name} ${gameResult.score1}:${gameResult.score2} ${gameResult.team2Name}
🏆 ${winnerText}
⏱ Time: ${minutes}:${seconds.toString().padStart(2, '0')}
📊 Total points: ${gameResult.totalPoints}
🔴 Fouls: ${gameResult.fouls1} - ${gameResult.fouls2}`
  }

  const showAlert = (message: string) => {
    if (tg) {
      tg.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (tg) {
      tg.showConfirm(message, callback)
    } else {
      const result = confirm(message)
      callback(result)
    }
  }

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type)
    }
  }

  const hapticNotification = (type: 'error' | 'success' | 'warning') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred(type)
    }
  }

  return {
    tg,
    showMainButton,
    hideMainButton,
    sendGameResult,
    showAlert,
    showConfirm,
    hapticFeedback,
    hapticNotification,
  }
}
