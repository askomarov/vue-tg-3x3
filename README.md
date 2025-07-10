# vue-tg-3x3

Баскетбольный счетчик для игр 3x3, интегрированный с Telegram Mini Apps.

## Особенности

- 🏀 **Счетчик очков** - отслеживание счета для двух команд
- ⏱️ **Таймер игры** - игровое время и время владения мячом
- 🔴 **Счетчик нарушений** - подсчет фолов команд
- 📱 **Telegram Integration** - полная интеграция с Telegram Mini Apps API
- 🎮 **Haptic Feedback** - тактильная обратная связь для действий
- 🌗 **Адаптивная тема** - автоматическая смена темы в зависимости от настроек Telegram
- 📱 **Полноэкранный режим** - поддержка полноэкранного режима для лучшего игрового опыта
- 🔒 **Блокировка ориентации** - фиксация ориентации экрана во время игры
- 📤 **Отправка результатов** - интеграция с ботом для сохранения результатов в базе данных

## Telegram Mini Apps возможности

### Интегрированные функции:

- ✅ **Bot API 9.1** - последняя версия API с поддержкой скрытия клавиатуры
- ✅ **Кнопки управления** - MainButton, SecondaryButton, BackButton
- ✅ **Haptic Feedback** - различные типы тактильной обратной связи
- ✅ **Safe Areas** - поддержка безопасных зон экрана
- ✅ **Fullscreen Mode** - полноэкранный режим для игр
- ✅ **Orientation Lock** - блокировка ориентации экрана
- ✅ **Theme Integration** - автоматическая адаптация к теме Telegram
- ✅ **Data Sending** - отправка результатов игры боту через sendData()

### Поддерживаемые события:

- `themeChanged` - смена темы
- `fullscreenChanged` - изменение полноэкранного режима
- `safeAreaChanged` - изменение безопасных зон
- `activated`/`deactivated` - активация/деактивация приложения

## Технологии

- **Vue 3** - современный фреймворк с Composition API
- **TypeScript** - типизированный JavaScript
- **Vite** - быстрая сборка и разработка
- **Telegram Web Apps SDK** - интеграция с Telegram
- **ESLint** - линтинг кода
- **Vitest** - тестирование

## Установка

```sh
pnpm install
```

## Разработка

```sh
pnpm dev
```

## Сборка для продакшена

```sh
pnpm build
```

## Тестирование

```sh
pnpm test:unit
```

## Линтинг

```sh
pnpm lint
```

## Развертывание как Telegram Mini App

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Разместите собранное приложение на HTTPS сервере
4. Настройте Web App URL в [@BotFather](https://t.me/botfather) через `/setmenubutton` или Bot Settings > Menu Button
5. Добавьте бота в attachment menu для лучшего доступа

### Для тестирования:

1. Используйте тестовую среду Telegram
2. iOS: тапните 10 раз на иконку Settings > Accounts > Login to another account > Test
3. Desktop: Settings > Shift + Alt + Right click 'Add Account' > Test Server
4. Создайте бота в тестовой среде через [@BotFather](https://t.me/botfather)
5. Используйте HTTP ссылки без TLS для тестирования

## Архитектура

```
src/
├── components/          # Vue компоненты
│   ├── GameSetupModal.vue    # Настройка игры
│   ├── GameStats.vue         # Статистика игры
│   ├── TeamCard.vue          # Карточка команды
│   └── TimerSection.vue      # Секция таймеров
├── composables/         # Композируемые функции
│   ├── useGame.ts           # Логика игры
│   └── useTelegram.ts       # Telegram API интеграция
├── types/              # TypeScript типы
│   └── game.ts             # Типы игры и Telegram
├── views/              # Страницы приложения
│   ├── HomeView.vue        # Главная страница игры
│   └── AboutView.vue       # О приложении
└── assets/             # Статические ресурсы
    ├── base.css           # Базовые стили с Telegram переменными
    └── main.css           # Основные стили
```

## Лицензия

MIT
