<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <header class="w-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-orange-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 shadow-lg py-4 px-8 flex items-center justify-between desert-header flex-shrink-0 transition-colors duration-300">
      <div class="text-2xl font-bold text-yellow-100 dark:text-gray-200 tracking-widest desert-title drop-shadow font-neon">DUNE 沙丘資料庫</div>
      <nav class="flex items-center space-x-4">
        <NuxtLink to="/" class="text-yellow-100 dark:text-gray-200 hover:text-orange-900 dark:hover:text-orange-400 font-semibold transition">首頁</NuxtLink>
        <NuxtLink to="/character" class="text-yellow-100 dark:text-gray-200 hover:text-orange-900 dark:hover:text-orange-400 font-semibold transition">角色表</NuxtLink>
        <NuxtLink to="/talent" class="text-yellow-100 dark:text-gray-200 hover:text-orange-900 dark:hover:text-orange-400 font-semibold transition">天賦查詢</NuxtLink>
        <NuxtLink to="/archetype" class="text-yellow-100 dark:text-gray-200 hover:text-orange-900 dark:hover:text-orange-400 font-semibold transition">原型查詢</NuxtLink>
        <NuxtLink to="/npc" class="text-yellow-100 dark:text-gray-200 hover:text-orange-900 dark:hover:text-orange-400 font-semibold transition">盟友與對手</NuxtLink>
        <NuxtLink to="/adventure" class="text-yellow-100 dark:text-gray-200 hover:text-orange-900 dark:hover:text-orange-400 font-semibold transition">冒險產生工具</NuxtLink>
        <button
          @click="toggleTheme"
          class="ml-4 px-3 py-1 rounded-lg bg-yellow-200 dark:bg-gray-700 text-yellow-900 dark:text-yellow-300 hover:bg-yellow-300 dark:hover:bg-gray-600 transition font-semibold"
          :title="isDark ? '切換到亮色主題' : '切換到暗色主題'"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </nav>
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (process.client) {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('dune-theme', isDark.value ? 'dark' : 'light')
  }
}

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('dune-theme')
    if (saved === 'dark') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else if (!saved) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      }
    }
  }
})
</script>