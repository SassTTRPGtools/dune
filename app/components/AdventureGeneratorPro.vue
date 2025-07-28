<template>
  <div class="adventure-generator-pro p-6 bg-yellow-50 rounded shadow">
    <h2 class="text-xl font-bold mb-4 text-yellow-900">進階冒險要素產生器</h2>
    <div class="mb-4">
      <label class="font-semibold mr-2">選擇表格：</label>
      <select v-model="selectedKey" class="border rounded px-2 py-1">
        <option v-for="table in tables" :key="table.key" :value="table.key">{{ table.title }}</option>
      </select>
    </div>
    <div v-if="currentTable">
      <div class="mb-2 text-lg font-bold text-yellow-800">{{ currentTable.title }}</div>
      <div class="mb-2 text-sm text-yellow-700">{{ currentTable.description }}</div>
      <button @click="rollOption" class="bg-yellow-700 text-yellow-100 px-4 py-2 rounded hover:bg-orange-400 transition">擲骰</button>
      <div v-if="result" class="mt-4 text-base text-orange-900 bg-yellow-100 rounded p-3">
        <b>結果：</b> {{ result }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const tables = ref<any[]>([])
const selectedKey = ref('')
const result = ref('')

async function fetchTables() {
  const res = await fetch('/adventure_generator/adventure.json')
  const data = await res.json()
  tables.value = data.adventure_tables
  if (tables.value.length > 0) selectedKey.value = tables.value[0].key
}

onMounted(fetchTables)

const currentTable = computed(() => tables.value.find(t => t.key === selectedKey.value))

function rollD20() {
  return Math.floor(Math.random() * 20) + 1
}

function getOption(options: any) {
  // 支援 range key（如1-2）與單一key
  const roll = rollD20()
  for (const key in options) {
    if (key.includes('-')) {
      const [startStr, endStr] = key.split('-')
      const start = Number(startStr)
      const end = Number(endStr)
      if (!isNaN(start) && !isNaN(end) && roll >= start && roll <= end) return options[key]
    } else {
      const numKey = Number(key)
      if (!isNaN(numKey) && roll === numKey) return options[key]
    }
  }
  // fallback
  if (options && typeof options === 'object' && options !== undefined && Object.keys(options).length > 0) {
    const firstKey = Object.keys(options)[0]
    return options[firstKey as keyof typeof options]
  }
  return ''
}

function rollOption() {
  if (!currentTable.value) return
  const options = currentTable.value.options
  result.value = getOption(options)
}
</script>

<style scoped>
.adventure-generator-pro {
  max-width: 500px;
  margin: 2rem auto;
}
</style>
