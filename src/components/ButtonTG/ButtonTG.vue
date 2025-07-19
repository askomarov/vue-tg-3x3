<script setup lang="ts">
interface Props {
  href?: string
  variant?: 'default' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  href: 'https://t.me/Scorer3x3_bot',
  variant: 'default',
  size: 'md',
})
</script>

<template>
  <a
    :href="href"
    rel="noopener noreferrer"
    target="_blank"
    :class="[
      'main-link inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:scale-105 active:scale-95',
      {
        'bg-[#2c9ed8] text-white hover:bg-[#14a8f3]': variant === 'default',
        'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },
    ]"
    aria-label="telegram"
  >
    <svg
      :class="[
        'transition-colors',
        {
          'w-6 h-6': size === 'sm',
          'w-8 h-8': size === 'md',
          'w-10 h-10': size === 'lg',
        },
      ]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.14-.04-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
      />
    </svg>
    <span>Open Bot in Telegram</span>
  </a>
</template>

<style scoped>
.main-link {
  text-decoration: none;
}
</style>
