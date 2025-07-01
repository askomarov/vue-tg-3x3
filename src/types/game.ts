export interface GameState {
  score1: number
  score2: number
  fouls1: number
  fouls2: number
  team1Name: string
  team2Name: string
  timer: number // seconds
  originalTimer: number
  shotClock: number // seconds with decimal
  isTimerRunning: boolean
  isShotClockRunning: boolean
  gameStartTime: number | null
}

export interface GameResult {
  score1: number
  score2: number
  fouls1: number
  fouls2: number
  team1Name: string
  team2Name: string
  winner: number // 0 = draw, 1 = team1, 2 = team2
  gameTime: number
  totalPoints: number
  timestamp: number
}

export interface GameStats {
  totalPoints: number
  gameTime: number
  teamFouls: string
}

export interface TelegramWebApp {
  ready: () => void
  expand: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
  }
  BackButton: {
    show: () => void
    onClick: (callback: () => void) => void
  }
  HapticFeedback: {
    impactOccurred: (type: 'light' | 'medium' | 'heavy') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
  }
  sendData: (data: string) => void
  showAlert: (message: string) => void
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void
  close: () => void
  onEvent: (eventType: string, eventHandler: () => void) => void
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  version: string
  platform: string
  initData: string
  initDataUnsafe: Record<string, unknown>
  isVersionAtLeast: (version: string) => boolean
  switchInlineQuery?: (query: string, chatTypes: string[]) => void
  openTelegramLink?: (url: string) => void
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}
