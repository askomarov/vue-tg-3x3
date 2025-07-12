// Типизация для рекламной функции
declare global {
  interface Window {
    show_9535967?: (config: {
      type: string
      inAppSettings: {
        frequency: number
        capping: number
        interval: number
        timeout: number
        everyPage: boolean
      }
    }) => void
  }
}

export const useAds = () => {
  const showInterstitialAd = () => {
    // Проверяем, что функция рекламы доступна
    if (typeof window.show_9535967 === 'function') {
      try {
        window.show_9535967({
          type: 'inApp',
          inAppSettings: {
            frequency: 1, // показать 1 рекламы
            capping: 0.1, // в течение 0.1 часа (6 минут)
            interval: 30, // с интервалом 30 секунд
            timeout: 0.05, // задержка 0,05 секунд перед первым показом
            everyPage: false, // сохранять сессию при переходах между страницами
          },
        })
      } catch (error) {
        console.warn('Ошибка при показе рекламы:', error)
      }
    }
  }

  return {
    showInterstitialAd,
  }
}
