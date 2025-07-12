import { reactive, ref } from 'vue'
import type { GameState, GameResult, GameStats } from '@/types/game'
import { useAudio } from './useAudio'
import { useTelegram } from '@/composables/useTelegram'
export function useGame() {
  const { playBuzzer, playBeep } = useAudio()
  const { hapticFeedback } = useTelegram()
  const gameState = reactive<GameState>({
    score1: 0,
    score2: 0,
    fouls1: 0,
    fouls2: 0,
    team1Name: 'Team 1',
    team2Name: 'Team 2',
    timer: 600, // 10 minutes
    originalTimer: 600,
    shotClock: 12.0,
    isTimerRunning: false,
    isShotClockRunning: false,
    gameStartTime: null,
  })

  const timerInterval = ref<NodeJS.Timeout | null>(null)
  const shotClockInterval = ref<NodeJS.Timeout | null>(null)

  // Add points to team
  const addScore = (team: 1 | 2, points: number = 1) => {
    if (team === 1) {
      gameState.score1 += points
    } else {
      gameState.score2 += points
    }

    // Restart shot clock after made basket (only if main timer is running)
    if (gameState.isTimerRunning) {
      startShotClock()
    }
  }

  // Remove points from team
  const removeScore = (team: 1 | 2) => {
    if (team === 1 && gameState.score1 > 0) {
      gameState.score1--
    } else if (team === 2 && gameState.score2 > 0) {
      gameState.score2--
    }
  }

  // Add foul to team
  const addFoul = (team: 1 | 2) => {
    if (team === 1) {
      gameState.fouls1++
    } else {
      gameState.fouls2++
    }
  }

  // Remove foul from team
  const removeFoul = (team: 1 | 2) => {
    if (team === 1 && gameState.fouls1 > 0) {
      gameState.fouls1--
    } else if (team === 2 && gameState.fouls2 > 0) {
      gameState.fouls2--
    }
  }

  // Start main timer
  const startTimer = () => {
    if (!gameState.gameStartTime) {
      gameState.gameStartTime = Date.now()
    }

    gameState.isTimerRunning = true

    // Shot clock start logic
    if (!gameState.isShotClockRunning) {
      if (gameState.shotClock === 0) {
        startShotClock()
      } else if (gameState.shotClock > 0) {
        resumeShotClock()
      }
    }

    timerInterval.value = setInterval(() => {
      if (gameState.timer > 0) {
        gameState.timer--

        // Time's up
        if (gameState.timer === 0) {
          pauseTimer()
          // Play buzzer sound when time runs out
          playBuzzer()
        }
      }
    }, 1000)
  }

  // Pause main timer
  const pauseTimer = () => {
    gameState.isTimerRunning = false
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    pauseShotClock()
  }

  // Toggle main timer
  const toggleTimer = () => {
    if (gameState.isTimerRunning) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  // Start shot clock
  const startShotClock = () => {
    if (!gameState.isTimerRunning) return

    pauseShotClock()
    gameState.shotClock = 12.0
    gameState.isShotClockRunning = true

    shotClockInterval.value = setInterval(() => {
      if (gameState.shotClock > 0) {
        const prevTime = gameState.shotClock
        gameState.shotClock -= 0.1
        gameState.shotClock = Math.max(0, Math.round(gameState.shotClock * 10) / 10)

        // Play beep when crossing 4, 3, 2, 1 seconds
        const currentTime = Math.floor(gameState.shotClock)
        const prevTimeFloored = Math.floor(prevTime)

        // Beep when we cross from 5->4, 4->3, 3->2, 2->1, 1->0
        if (prevTimeFloored > currentTime && prevTimeFloored >= 1 && prevTimeFloored <= 4) {
          playBeep()
          hapticFeedback('light')
        }

        if (gameState.shotClock <= 0) {
          pauseShotClock()
          pauseTimer()
          // Play buzzer sound when shot clock runs out
          playBuzzer()
          hapticFeedback('heavy')
        }
      }
    }, 100)
  }

  // Resume shot clock
  const resumeShotClock = () => {
    if (!gameState.isTimerRunning) return

    gameState.isShotClockRunning = true

    shotClockInterval.value = setInterval(() => {
      if (gameState.shotClock > 0) {
        const prevTime = gameState.shotClock
        gameState.shotClock -= 0.1
        gameState.shotClock = Math.max(0, Math.round(gameState.shotClock * 10) / 10)

        // Play beep when crossing 4, 3, 2, 1 seconds
        const currentTime = Math.floor(gameState.shotClock)
        const prevTimeFloored = Math.floor(prevTime)

        // Beep when we cross from 5->4, 4->3, 3->2, 2->1, 1->0
        if (prevTimeFloored > currentTime && prevTimeFloored >= 1 && prevTimeFloored <= 4) {
          playBeep()
        }

        if (gameState.shotClock <= 0) {
          pauseShotClock()
          pauseTimer()
          // Play buzzer sound when shot clock runs out
          playBuzzer()
        }
      }
    }, 100)
  }

  // Pause shot clock
  const pauseShotClock = () => {
    gameState.isShotClockRunning = false
    if (shotClockInterval.value) {
      clearInterval(shotClockInterval.value)
      shotClockInterval.value = null
    }
  }

  // Toggle shot clock
  const toggleShotClock = () => {
    if (!gameState.isTimerRunning) {
      pauseShotClock()
      gameState.shotClock = 12.0
    } else {
      startShotClock()
    }
  }

  // Reset game
  const resetGame = () => {
    pauseTimer()
    pauseShotClock()

    gameState.score1 = 0
    gameState.score2 = 0
    gameState.fouls1 = 0
    gameState.fouls2 = 0
    gameState.timer = 600
    gameState.originalTimer = 600
    gameState.shotClock = 12.0
    gameState.isTimerRunning = false
    gameState.isShotClockRunning = false
    gameState.gameStartTime = null
  }

  // Start new game with team names
  const startNewGame = (team1Name: string, team2Name: string) => {
    resetGame()
    gameState.team1Name = team1Name || 'Team 1'
    gameState.team2Name = team2Name || 'Team 2'
  }

  // Get game stats
  const getGameStats = (): GameStats => {
    const totalPoints = gameState.score1 + gameState.score2
    let gameTime = 0

    if (gameState.gameStartTime) {
      gameTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000)
    }

    return {
      totalPoints,
      gameTime,
      teamFouls: `${gameState.fouls1} - ${gameState.fouls2}`,
    }
  }

  // Get game result
  const getGameResult = (): GameResult => {
    const stats = getGameStats()

    // Calculate winner
    const winner =
      gameState.score1 > gameState.score2 ? 1 : gameState.score2 > gameState.score1 ? 2 : 0

    return {
      score1: gameState.score1,
      score2: gameState.score2,
      fouls1: gameState.fouls1,
      fouls2: gameState.fouls2,
      team1Name: gameState.team1Name,
      team2Name: gameState.team2Name,
      winner: winner,
      gameTime: stats.gameTime,
      totalPoints: stats.totalPoints,
      timestamp: Date.now(),
    }
  }

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Format shot clock display
  const formatShotClock = (time: number): string => {
    return time.toFixed(1)
  }

  return {
    gameState,
    addScore,
    removeScore,
    addFoul,
    removeFoul,
    toggleTimer,
    toggleShotClock,
    pauseTimer,
    startTimer,
    resetGame,
    startNewGame,
    getGameStats,
    getGameResult,
    formatTime,
    formatShotClock,
  }
}
