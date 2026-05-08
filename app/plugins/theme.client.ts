export default defineNuxtPlugin(() => {
  if (process.client) {
    // 初始化主題
    const savedTheme = localStorage.getItem('dune-theme') as 'light' | 'dark' | null
    let theme = 'light'

    if (savedTheme) {
      theme = savedTheme
    } else {
      // 檢查系統偏好設置
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme = prefersDark ? 'dark' : 'light'
    }

    // 應用主題到 HTML 元素
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    localStorage.setItem('dune-theme', theme)
  }
})
