<template>
  <div class="support-npc-generator p-6 bg-yellow-50 rounded shadow">
    <h2 class="text-xl font-bold mb-4 text-yellow-900">輔助NPC產生器</h2>
    <button @click="generateNPC" class="bg-yellow-700 text-yellow-100 px-4 py-2 rounded hover:bg-orange-400 transition mb-4">產生NPC</button>
    <div v-if="npc" class="mt-4 text-base text-orange-900 bg-yellow-100 rounded p-3">
      <div><b>背景：</b>{{ npc.background }}（技能：{{ npc.skill }}）</div>
      <div><b>動機：</b>{{ npc.motivation }}（驅動：{{ npc.drive }}）</div>
      <div><b>效忠：</b>{{ npc.loyalty }}</div>
      <div><b>特徵：</b>
        <ul class="list-disc ml-6">
          <li v-for="(trait, idx) in npc.traits" :key="idx">{{ trait }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const npc = ref<any>(null)
const data = ref<any>(null)

async function fetchData() {
  if (data.value) return
  const res = await fetch('/adventure_generator/supportNPC.json')
  data.value = await res.json()
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1
}

function getByRange(table: any) {
  const roll = rollD20()
  for (const key in table) {
    if (key.includes('-')) {
      const [startStr, endStr] = key.split('-')
      const start = Number(startStr)
      const end = Number(endStr)
      if (!isNaN(start) && !isNaN(end) && roll >= start && roll <= end) return table[key]
    } else {
      const numKey = Number(key)
      if (!isNaN(numKey) && roll === numKey) return table[key]
    }
  }
  return Object.values(table)[0]
}

function getTrait(traitGroup: any) {
  const roll = rollD20()
  for (const key in traitGroup) {
    if (key.includes('-')) {
      const [startStr, endStr] = key.split('-')
      const start = Number(startStr)
      const end = Number(endStr)
      if (!isNaN(start) && !isNaN(end) && roll >= start && roll <= end) return traitGroup[key]
    } else {
      const numKey = Number(key)
      if (!isNaN(numKey) && roll === numKey) return traitGroup[key]
    }
  }
  return Object.values(traitGroup)[0]
}

async function generateNPC() {
  await fetchData()
  if (!data.value) return
  const backgrounds = getByRange(data.value.generator.backgrounds)
  const motivations = getByRange(data.value.generator.motivations)
  const loyalty = getByRange(data.value.generator.loyalties)
  // traits: 20組，每組1d20
  const traits: string[] = []
  for (const group of data.value.generator.traits) {
    traits.push(getTrait(group))
  }
  npc.value = {
    background: backgrounds.background,
    skill: backgrounds.skill,
    motivation: motivations.motivation,
    drive: motivations.drive,
    loyalty,
    traits: traits.slice(0, 3) // 只顯示3個隨機特徵，避免過長
  }
}
</script>

<style scoped>
.support-npc-generator {
  max-width: 500px;
  margin: 2rem auto;
}
</style>
