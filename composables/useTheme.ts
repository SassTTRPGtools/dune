import { ref, computed } from 'vue'

export const useTheme = () => {
  const theme = ref<'light' | 'dark'>('light')

  const isDark = computed(() => theme.value === 'dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
    if (process.client) {
      localStorage.setItem('dune-theme', theme.value)
    }
  }

  const applyTheme = () => {
    if (process.client) {
      const html = document.documentElement
      if (theme.value === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  const initTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem('dune-theme') as 'light' | 'dark' | null
      if (saved) {
        theme.value = saved
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme.value = prefersDark ? 'dark' : 'light'
      }
      applyTheme()
    }
  }

  return {
    theme: computed(() => theme.value),
    isDark,
    toggleTheme,
    applyTheme,
    initTheme
  }
}

