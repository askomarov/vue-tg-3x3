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

// Event data types
export interface TelegramEventData {
  isStateStable?: boolean
  button_id?: string
  data?: string
  status?: string
  url?: string
  error?: string
  isAuthenticated?: boolean
  biometricToken?: string
  isUpdated?: boolean
  locationData?: LocationData
}

// Location data from Telegram API
export interface LocationData {
  latitude: number
  longitude: number
  altitude?: number
  course?: number
  speed?: number
  horizontal_accuracy?: number
  vertical_accuracy?: number
  course_accuracy?: number
  speed_accuracy?: number
}

// Error type for callbacks
export interface TelegramError {
  message: string
  code?: number
}

export interface TelegramWebApp {
  ready: () => void
  expand: () => void

  // Main and Secondary Buttons
  MainButton: {
    text: string
    color: string
    textColor: string
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    enable?: () => void
    disable?: () => void
    isVisible?: boolean
    isActive?: boolean
  }
  SecondaryButton?: {
    text: string
    color: string
    textColor: string
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    enable?: () => void
    disable?: () => void
    isVisible?: boolean
    isActive?: boolean
    position?: 'left' | 'right' | 'top' | 'bottom'
  }
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    isVisible?: boolean
  }

  // Haptic Feedback
  HapticFeedback: {
    impactOccurred: (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }

  // Core methods
  sendData: (data: string) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void
  close: () => void
  onEvent: (eventType: string, eventHandler: (data?: TelegramEventData) => void) => void
  offEvent: (eventType: string, eventHandler: (data?: TelegramEventData) => void) => void

  // Theme and colors
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  headerColor: string
  backgroundColor: string
  bottomBarColor?: string
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  setBottomBarColor?: (color: string) => void

  // Fullscreen and orientation (Bot API 8.0+)
  isFullscreen?: boolean
  isOrientationLocked?: boolean
  requestFullscreen?: () => void
  exitFullscreen?: () => void
  lockOrientation?: () => void
  unlockOrientation?: () => void

  // Safe areas (Bot API 8.0+)
  safeAreaInset?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  contentSafeAreaInset?: {
    top: number
    bottom: number
    left: number
    right: number
  }

  // Device capabilities
  version: string
  platform: string
  isActive?: boolean
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight?: number

  // Data and validation
  initData: string
  initDataUnsafe: Record<string, unknown>
  isVersionAtLeast: (version: string) => boolean

  // Advanced features
  switchInlineQuery?: (query: string, chatTypes?: string[]) => void
  openTelegramLink?: (url: string) => void
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void

  // Home screen shortcuts (Bot API 8.0+)
  addToHomeScreen?: () => void
  checkHomeScreenStatus?: (
    callback?: (status: 'unsupported' | 'unknown' | 'added' | 'missed') => void,
  ) => void

  // Keyboard control (Bot API 9.1+)
  hideKeyboard?: () => void

  // Closing confirmation
  isClosingConfirmationEnabled?: boolean
  enableClosingConfirmation?: () => void
  disableClosingConfirmation?: () => void

  // Vertical swipes control
  isVerticalSwipesEnabled?: boolean
  enableVerticalSwipes?: () => void
  disableVerticalSwipes?: () => void
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}
