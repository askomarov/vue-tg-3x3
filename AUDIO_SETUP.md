# Установка звукового файла

Для работы звукового сигнала окончания времени игры:

1. Скопируйте файл `buzzeer.mp3` в папку `public/` проекта
2. Структура должна быть: `public/buzzeer.mp3`

Звук будет проигрываться:

- Когда заканчивается основное время игры (10 минут)
- Когда заканчивается время владения мячом (12 секунд)

## Настройки звука

Звук можно отключить/включить через composable `useAudio`:

```typescript
import { useAudio } from '@/composables/useAudio'

const { isAudioEnabled, setAudioEnabled } = useAudio()

// Отключить звук
setAudioEnabled(false)

// Включить звук
setAudioEnabled(true)
```

## Резервный звук

Если основной файл не загрузится, будет использован синтетический звук через Web Audio API.
