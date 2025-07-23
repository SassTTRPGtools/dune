<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 py-10 px-4">
    <div class="max-w-2xl mx-auto bg-white/80 rounded-xl shadow-lg p-8">
      <h1 class="text-3xl font-bold text-yellow-800 mb-6 text-center drop-shadow desert-title">天賦查詢</h1>
      <input v-model="search" type="text" placeholder="輸入天賦名稱或描述..." class="w-full mb-6 px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-yellow-50 text-yellow-900" />
      <div v-if="filteredTalents.length === 0" class="text-center text-yellow-700">查無天賦</div>
      <div v-for="talent in filteredTalents" :key="talent.name" class="mb-6 p-4 rounded-lg border border-yellow-300 bg-yellow-100/80 shadow desert-card">
        <h2 class="text-xl font-bold text-yellow-900 mb-1">{{ talent.name }}</h2>
        <div class="text-sm text-yellow-700 mb-1">類型：{{ talent.type }}</div>
        <div class="text-yellow-800 mb-1">{{ talent.description }}</div>
        <div class="text-yellow-900 font-semibold">效果：{{ talent.effect }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Talent {
  name: string
  type: string
  description: string
  effect: string
}

const search = ref('')
const talents = ref<Talent[]>([])

const fetchTalents = async () => {
  const files = [
    '/talent/core.json',
    '/talent/landsraad.json',
    '/talent/sand&dust.json',
  ]
  let all: Talent[] = []
  for (const file of files) {
    try {
      const res = await fetch(file)
      const json = await res.json()
      all = all.concat(json.talents)
    } catch (e) {
      // ignore
    }
  }
  talents.value = all
}

onMounted(fetchTalents)

const filteredTalents = computed(() => {
  if (!search.value) return talents.value
  const s = search.value.trim().toLowerCase()
  return talents.value.filter(t =>
    t.name.toLowerCase().includes(s) ||
    t.description.toLowerCase().includes(s) ||
    t.effect.toLowerCase().includes(s)
  )
})
</script>

<style scoped>
.desert-title {
  font-family: 'Cinzel', serif;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 8px #eab30899, 0 1px 0 #fff;
}
.desert-card {
  border-width: 2px;
  border-style: dashed;
  background: linear-gradient(135deg, #fef9c3 60%, #fde68a 100%);
}
body {
  background: linear-gradient(120deg, #fef9c3 0%, #fde68a 100%);
}
</style>
