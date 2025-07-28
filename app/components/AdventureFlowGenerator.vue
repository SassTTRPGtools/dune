<template>
  <div class="adventure-flow-generator p-6 bg-yellow-50 rounded shadow">
    <h2 class="text-xl font-bold mb-4 text-yellow-900">冒險流程產生器</h2>
    <button @click="generateAll" class="bg-yellow-700 text-yellow-100 px-4 py-2 rounded hover:bg-orange-400 transition mb-6">一鍵產生完整冒險</button>
    <div v-for="(step, idx) in steps" :key="step.key" class="mb-6">
      <div class="flex items-center mb-1">
        <div class="font-bold text-yellow-800 text-base">{{ step.title }}</div>
        <button @click="reroll(idx)" class="ml-2 px-2 py-1 text-xs bg-yellow-400 rounded hover:bg-orange-500">重骰</button>
      </div>
      <div class="text-sm text-yellow-700 mb-1">{{ step.description }}</div>
      <div v-if="results[idx]" class="bg-yellow-100 rounded p-3 text-orange-900">
        <span v-if="results[idx].roll">🎲 <b>骰點：</b>{{ results[idx].roll }}　</span>
        <span><b>結果：</b>{{ results[idx].result }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const adventureData = ref<any>(null)
const steps = ref<any[]>([])
const results = reactive<any[]>([])

const stepOrder = [
  'starting_path',
  'first_step_event',
  'first_step_npc_type',
  'first_step_npc_loyalty',
  'first_step_enemy_type',
  'first_step_npc_loyalty',
  'plot_reveal_plot',
  'plot_reveal_motive',
  'antagonist_structure',
  'antagonist_type',
  'antagonist_nature',
  'plot_execution_method',
  'complications_random_events',
  'hidden_hand_influence'
]

async function fetchData() {
  if (adventureData.value) return
  const res = await fetch('/adventure_generator/adventure.json')
  const data = await res.json()
  adventureData.value = data
  // 依 stepOrder 排序
  steps.value = stepOrder.map(key => data.adventure_tables.find((t:any) => t.key === key)).filter(Boolean)
}

onMounted(fetchData)

function rollD20() {
  return Math.floor(Math.random() * 20) + 1
}

function getOption(options: any) {
  const roll = rollD20()
  for (const key in options) {
    if (key.includes('-')) {
      const [startStr, endStr] = key.split('-')
      const start = Number(startStr)
      const end = Number(endStr)
      if (!isNaN(start) && !isNaN(end) && roll >= start && roll <= end) return { roll, result: options[key] }
    } else {
      const numKey = Number(key)
      if (!isNaN(numKey) && roll === numKey) return { roll, result: options[key] }
    }
  }
  // fallback
  return { roll, result: Object.values(options)[0] }
}

function generateAll() {
  results.length = 0
  for (let i = 0; i < steps.value.length; i++) {
    results[i] = rollStep(i)
  }
}

function rollStep(idx: number) {
  const step = steps.value[idx]
  if (!step) return null
  return getOption(step.options)
}

function reroll(idx: number) {
  results[idx] = rollStep(idx)
}
</script>

<style scoped>
.adventure-flow-generator {
  max-width: 600px;
  margin: 2rem auto;
}
</style>
