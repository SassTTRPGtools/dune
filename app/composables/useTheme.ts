import { useState, computed, onMounted } from '#app'

export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')
  const isDark = computed(() => theme.value === 'dark')

  const initTheme = () => {
    if (process.client) {
      // 檢查 localStorage 中的主題設置
      const savedTheme = localStorage.getItem('dune-theme') as 'light' | 'dark' | null
      if (savedTheme) {
        theme.value = savedTheme
      } else {
        // 檢查系統偏好設置
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme.value = prefersDark ? 'dark' : 'light'
      }
      applyTheme(theme.value)
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
  }

  const applyTheme = (themeValue: 'light' | 'dark') => {
    if (process.client) {
      const html = document.documentElement
      if (themeValue === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      localStorage.setItem('dune-theme', themeValue)
    }
  }

  onMounted(() => {
    initTheme()
  })

  return {
    theme,
    isDark,
    toggleTheme,
  }
}
