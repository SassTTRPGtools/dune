<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 py-10 px-4">
    <div class="max-w-4xl mx-auto bg-white/80 rounded-xl shadow-lg p-8">
      <h1 class="text-3xl font-bold text-yellow-800 mb-6 text-center drop-shadow desert-title">天賦查詢</h1>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <select v-model="selectedBook" class="px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-yellow-50 text-yellow-900">
          <option value="all">全部規則書</option>
          <option value="core">沙丘：帝國歷險記規則書</option>
          <option value="landsraad">大博弈——蘭茲拉德擴展規則</option>
          <option value="sand&dust">沙塵荒漠——厄拉科斯擴展規則</option>
        </select>
        <select v-model="selectedType" class="px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-yellow-50 text-yellow-900">
          <option value="all">全部類型</option>
          <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
        </select>
        <input v-model="search" type="text" placeholder="輸入天賦名稱或描述..." class="flex-1 px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-yellow-50 text-yellow-900" />
      </div>
      <div v-if="filteredTalents.length === 0" class="text-center text-yellow-700">查無天賦</div>
      <div v-for="talent in filteredTalents" :key="talent.name" class="mb-6 p-4 rounded-lg border border-yellow-300 bg-yellow-100/80 shadow desert-card">
        <h2 class="text-xl font-bold text-yellow-900 mb-1">{{ talent.name }}</h2>
        <div class="text-sm text-yellow-700 mb-1">
          類型：<span v-if="Array.isArray(talent.type)">{{ talent.type.join('、') }}</span><span v-else>{{ talent.type }}</span>
        </div>
        <div class="text-yellow-800 mb-1 italic">{{ talent.description }}</div>
        <div class="bg-yellow-200/80 border-l-4 border-yellow-400 px-3 py-2 rounded text-yellow-900 shadow-sm mb-1"><span class="text-yellow-800">{{ talent.effect }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Talent {
  name: string
  type: string | string[]
  description: string
  effect: string
  _file?: string // 來源檔案
}

const search = ref('')
const talents = ref<Talent[]>([])
const selectedBook = ref<'all' | 'core' | 'landsraad' | 'sand&dust'>('all')
const selectedType = ref('all')

const bookMap = {
  core: {
    file: '/talent/core.json',
    label: '沙丘：帝國歷險記規則書',
  },
  landsraad: {
    file: '/talent/landsraad.json',
    label: '大博弈——蘭茲拉德擴展規則',
  },
  'sand&dust': {
    file: '/talent/sand&dust.json',
    label: '沙塵荒漠——厄拉科斯擴展規則',
  },
}

// 重新包裝 fetch，讓每個天賦都帶有 _file 屬性
const fetchTalents = async () => {
  const files = Object.entries(bookMap)
  let all: (Talent & { _file: string })[] = []
  for (const [key, book] of files) {
    try {
      const res = await fetch(book.file)
      const json = await res.json()
      // 標記來源
      all = all.concat(json.talents.map((t: Talent) => ({ ...t, _file: book.file })))
    } catch (e) {
      // ignore
    }
  }
  talents.value = all
}

onMounted(fetchTalents)

const uniqueTypes = computed(() => {
  const set = new Set<string>()
  talents.value.forEach(t => {
    if (Array.isArray(t.type)) {
      t.type.forEach(type => set.add(type))
    } else {
      set.add(t.type)
    }
  })
  return Array.from(set)
})

const filteredTalents = computed(() => {
  let list = talents.value
  if (selectedBook.value !== 'all') {
    const file = bookMap[selectedBook.value].file
    list = list.filter((t: Talent) => t._file === file)
  }
  if (selectedType.value !== 'all') {
    list = list.filter(t => {
      if (Array.isArray(t.type)) {
        return t.type.includes(selectedType.value)
      } else {
        return t.type === selectedType.value
      }
    })
  }
  if (search.value) {
    const s = search.value.trim().toLowerCase()
    list = list.filter(t =>
      t.name.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s) ||
      t.effect.toLowerCase().includes(s)
    )
  }
  return list
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
