<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
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
    } else if (!saved) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
  }
})
</script>
<style scoped>
.desert-header {
  border-bottom: 3px solid #eab308;
  box-shadow: 0 4px 16px #eab30833;
  background-image: linear-gradient(90deg, #a16207 0%, #fde68a 60%, #fdba74 100%);
}

:global(.dark) .desert-header {
  border-bottom-color: #4b5563;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  background-image: linear-gradient(90deg, #1f2937 0%, #374151 60%, #4b5563 100%);
}

.desert-title {
  font-family: 'Neon Club Music', 'Cinzel', serif;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 8px #eab30899, 0 1px 0 #fff;
}

:global(.dark) .desert-title {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.1);
}

.font-neon {
  font-family: 'Neon Club Music', 'Cinzel', serif !important;
}
</style>
