import { reactive, ref } from 'vue'
import type { GameState, GameResult, GameStats } from '@/types/game'

export function useGame() {
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
  const winner = ref<number>(0)
  const isGameFinished = ref<boolean>(false)

  // Add points to team
  const addScore = (team: 1 | 2, points: number = 1) => {
    if (isGameFinished.value) return

    if (team === 1) {
      gameState.score1 += points
    } else {
      gameState.score2 += points
    }

    // Restart shot clock after made basket (only if main timer is running)
    if (gameState.isTimerRunning) {
      startShotClock()
    }

    checkWinCondition()
  }

  // Remove points from team
  const removeScore = (team: 1 | 2) => {
    if (isGameFinished.value) return

    if (team === 1 && gameState.score1 > 0) {
      gameState.score1--
    } else if (team === 2 && gameState.score2 > 0) {
      gameState.score2--
    }
  }

  // Add foul to team
  const addFoul = (team: 1 | 2) => {
    if (isGameFinished.value) return

    if (team === 1) {
      gameState.fouls1++
    } else {
      gameState.fouls2++
    }
  }

  // Remove foul from team
  const removeFoul = (team: 1 | 2) => {
    if (isGameFinished.value) return

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
          // Auto-finish game when time is up
          if (gameState.score1 !== gameState.score2) {
            finishGame()
          }
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
        gameState.shotClock -= 0.1
        gameState.shotClock = Math.max(0, Math.round(gameState.shotClock * 10) / 10)

        if (gameState.shotClock <= 0) {
          pauseShotClock()
          pauseTimer()
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
        gameState.shotClock -= 0.1
        gameState.shotClock = Math.max(0, Math.round(gameState.shotClock * 10) / 10)

        if (gameState.shotClock <= 0) {
          pauseShotClock()
          pauseTimer()
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

  // Check win condition
  const checkWinCondition = () => {
    const { score1, score2 } = gameState

    // Win condition: 21 points or 2-point difference after 20
    if (score1 >= 21 || score2 >= 21) {
      if (score1 >= 20 && score2 >= 20) {
        if (Math.abs(score1 - score2) >= 2) {
          finishGame()
        }
      } else {
        finishGame()
      }
    }
  }

  // Finish game
  const finishGame = () => {
    pauseTimer()
    pauseShotClock()
    isGameFinished.value = true
    winner.value =
      gameState.score1 > gameState.score2 ? 1 : gameState.score2 > gameState.score1 ? 2 : 0
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

    winner.value = 0
    isGameFinished.value = false
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

    return {
      score1: gameState.score1,
      score2: gameState.score2,
      fouls1: gameState.fouls1,
      fouls2: gameState.fouls2,
      team1Name: gameState.team1Name,
      team2Name: gameState.team2Name,
      winner: winner.value,
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
    winner,
    isGameFinished,
    addScore,
    removeScore,
    addFoul,
    removeFoul,
    toggleTimer,
    toggleShotClock,
    resetGame,
    startNewGame,
    getGameStats,
    getGameResult,
    formatTime,
    formatShotClock,
  }
}
