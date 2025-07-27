<template>
  <div class="adventure-generator p-6 bg-yellow-50 rounded shadow">
    <div class="flex justify-center mb-2">
      <button @click="generateAdventure" class="bg-yellow-700 text-yellow-100 px-4 py-2 rounded hover:bg-orange-400 transition">產生冒險標題</button>
    </div>
    <div v-if="result" class="mt-6 text-lg font-semibold text-orange-900">
      <span>結果：</span>
      <span>{{ result.title }}</span>
      <div class="mt-4 text-base text-yellow-900 bg-yellow-100 rounded p-3" v-if="result.structure">
        <div><b>原始結構：</b> {{ result.structure }}</div>
        <div v-if="result.details && result.details.length">
          <b>骰出內容：</b>
          <ul class="list-disc ml-6">
            <li v-for="(item, idx) in result.details" :key="idx">
              <span>{{ item.key }}：{{ item.type }} <span v-if="item.example">（{{ item.example }}）</span></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

function rollD20() {
  return Math.floor(Math.random() * 20) + 1
}

function getByRange(table: any[], value: number) {
  for (const item of table) {
    const [start, end] = item.range.split('-').map(Number)
    if (end) {
      if (value >= start && value <= end) return item
    } else {
      if (value === start) return item
    }
  }
  return null
}

interface AdventureResult {
  title: string
  structure?: string
  details?: Array<{ key: string, type: string, example?: string }>
}
const result = ref<AdventureResult | null>(null)
const adventureData = ref<any>(null)

async function fetchAdventureData() {
  if (adventureData.value) return
  const res = await fetch('/adventure_generator/adventureTitle.json')
  adventureData.value = await res.json()
}

async function generateAdventure() {
  await fetchAdventureData()
  if (!adventureData.value) {
    result.value = { title: '資料載入失敗，請重試。' }
    return
  }
  // Step 1: 擲骰決定 title_structure
  const roll = rollD20()
  const structureItem = getByRange(adventureData.value.title_structure, roll)
  if (!structureItem) {
    result.value = { title: '無法產生標題，請重試。' }
    return
  }
  // Step 2: 處理特殊結構（如諺語）
  if (structureItem.examples) {
    const ex = structureItem.examples[Math.floor(Math.random() * structureItem.examples.length)]
    result.value = {
      title: ex,
      structure: structureItem.structure,
      details: []
    }
    return
  }
  // Step 3: 解析 structure 內的 KEY
  let title = structureItem.structure
  const details: AdventureResult['details'] = []
  for (const key in adventureData.value.structure_mapping) {
    if (title.includes(`（${key}）`)) {
      const tableKey = adventureData.value.structure_mapping[key]
      const table = adventureData.value[tableKey]
      const subRoll = rollD20()
      const subItem = getByRange(table, subRoll)
      let subText = ''
      let example = ''
      if (subItem.examples) {
        example = subItem.examples[Math.floor(Math.random() * subItem.examples.length)]
        subText = example
      } else {
        subText = subItem.type
      }
      title = title.replace(`（${key}）`, subText)
      details.push({ key, type: subItem.type, example })
    }
  }
  result.value = {
    title,
    structure: structureItem.structure,
    details
  }
}
</script>

<style scoped>
.adventure-generator {
  max-width: 400px;
  margin: 2rem auto;
}
</style>
