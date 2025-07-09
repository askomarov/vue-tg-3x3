import { onMounted } from 'vue'
import type { TelegramWebApp, GameResult } from '@/types/game'

export function useTelegram() {
  let tg: TelegramWebApp | null = null

  onMounted(() => {
    if (window.Telegram?.WebApp) {
      tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      document.documentElement.style.setProperty('--tg-color-scheme', tg.colorScheme)
      setupTelegramButtons()
      tg.onEvent('themeChanged', updateTheme)
    }
  })

  const setupTelegramButtons = () => {
    if (!tg) return

    if (tg.MainButton) {
      tg.MainButton.text = 'Send Result'
      tg.MainButton.color = tg.themeParams.button_color || '#2481cc'
      tg.MainButton.textColor = tg.themeParams.button_text_color || '#ffffff'
      tg.MainButton.hide()
    }

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
    } else {
      console.warn('MainButton not available')
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
      // Prepare game result with only required fields
      const cleanResult = {
        score1: gameResult.score1 || 0,
        score2: gameResult.score2 || 0,
        team1Name: gameResult.team1Name?.replace(/[^\w\sА-Яа-я\-\.]/g, '').trim() || 'Team 1',
        team2Name: gameResult.team2Name?.replace(/[^\w\sА-Яа-я\-\.]/g, '').trim() || 'Team 2',
        winner: gameResult.winner || 0,
        gameTime: gameResult.gameTime || 0,
        totalPoints: gameResult.totalPoints || gameResult.score1 + gameResult.score2 || 0,
        fouls1: gameResult.fouls1 || 0,
        fouls2: gameResult.fouls2 || 0,
      }

      const dataString = JSON.stringify(cleanResult)

      // Send data
      tg.sendData(dataString)

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
      const resultText = formatGameResultForUser(gameResult)
      tg.showAlert(`Game result:\n${resultText}\n\nSending error occurred.`)
    }
  }

  const formatGameResultForUser = (gameResult: GameResult): string => {
    const winnerText =
      gameResult.winner === 1
        ? `Winner: ${gameResult.team1Name || 'Team 1'}`
        : gameResult.winner === 2
          ? `Winner: ${gameResult.team2Name || 'Team 2'}`
          : 'Draw'

    const minutes = Math.floor((gameResult.gameTime || 0) / 60)
    const seconds = (gameResult.gameTime || 0) % 60

    return `🏀 ${gameResult.team1Name || 'Team 1'} ${gameResult.score1 || 0}:${gameResult.score2 || 0} ${gameResult.team2Name || 'Team 2'}
🏆 ${winnerText}
⏱ Time: ${minutes}:${seconds.toString().padStart(2, '0')}
📊 Total points: ${gameResult.totalPoints || gameResult.score1 + gameResult.score2 || 0}
🔴 Fouls: ${gameResult.fouls1 || 0} - ${gameResult.fouls2 || 0}`
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
