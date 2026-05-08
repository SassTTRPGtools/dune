<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 確保主題已應用到 HTML 元素
  if (process.client) {
    const html = document.documentElement
    const savedTheme = localStorage.getItem('dune-theme') as 'light' | 'dark' | null
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }
})
</script>

