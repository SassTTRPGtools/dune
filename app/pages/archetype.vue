<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Factions Section -->
      <h1 class="text-2xl font-bold text-yellow-900 mb-4 tracking-widest">派系模板</h1>
      <div class="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="faction in factions" :key="faction.name" class="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col">
          <h2 class="text-xl font-bold text-yellow-900 mb-2">{{ faction.name }}</h2>
          <div class="text-yellow-800 mb-2">{{ faction.description }}</div>
          <div class="text-sm text-yellow-700 mb-1">額外特徵：{{ faction.extraTrait }}</div>
          <div class="text-sm text-yellow-700 mb-1">
            推薦原型：
            <template v-for="(archetypeName, idx) in faction.recommendedArchetypes" :key="archetypeName">
              <FactionTooltip :archetype="findArchetype(archetypeName)">
                <span
                  class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer"
                  @click.prevent="scrollToArchetype(archetypeName)"
                >{{ archetypeName }}</span>
              </FactionTooltip>
              <span v-if="idx !== faction.recommendedArchetypes.length - 1">、</span>
            </template>
          </div>
          <div v-if="faction.mandatoryTalents" class="text-sm text-yellow-700 mb-1">
            必選天賦：
            <template v-if="Array.isArray(faction.mandatoryTalents)">
                <template v-for="(tal, i) in faction.mandatoryTalents" :key="tal">
                  <TalentTooltip :talent="getTalentName(tal)">
                    <span class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer">{{ tal }}</span>
                  </TalentTooltip>
                  <span v-if="i !== faction.mandatoryTalents.length - 1">、</span>
                </template>
            </template>
            <template v-else>
              <TalentTooltip :talent="getTalentName(faction.mandatoryTalents)">
                <span class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer">{{ getTalentName(faction.mandatoryTalents) }}</span>
              </TalentTooltip>
            </template>
          </div>
          <div v-if="faction.talentRule" class="text-xs text-yellow-600 mt-1">{{ faction.talentRule }}</div>
        </div>
      </div>
      <!-- Archetype Section (合併) -->
      <div v-for="archetype in allArchetypes" :key="archetype.name" class="mb-10">
        <div :id="'archetype-' + archetype.name" class="bg-white/90 rounded-xl shadow-lg p-6 mb-4">
          <h2 class="text-2xl font-bold text-yellow-900 mb-2">{{ archetype.name }}</h2>
          <div class="text-yellow-800 mb-2">{{ archetype.description }}</div>
          <div class="italic text-yellow-700 mb-2">{{ archetype.quote }}</div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div v-for="role in archetype.roles" :key="role.name" class="bg-yellow-100/80 rounded-lg border border-yellow-300 p-4 flex flex-col">
              <h3 class="text-lg font-bold text-yellow-900 mb-1">{{ role.name }}</h3>
              <div class="text-yellow-800 mb-1">特徵：{{ role.trait }}</div>
              <div class="text-yellow-700 mb-1">主技能：{{ role.primary_skill }}</div>
              <div class="text-yellow-700 mb-1">副技能：{{ role.secondary_skill }}</div>
              <div class="text-yellow-700 mb-1">焦點：{{ role.focuses.join('、') }}</div>
              <div v-if="role.talent" class="text-yellow-900 font-semibold mb-1">
                天賦：
                <template v-if="Array.isArray(role.talent)">
                <template v-for="(tal, i) in role.talent" :key="tal">
                  <TalentTooltip :talent="getTalentName(tal)">
                    <span class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer">{{ getTalentName(tal) }}</span>
                  </TalentTooltip>
                  <span v-if="i !== role.talent.length - 1">、</span>
                </template>
                </template>
                <template v-else>
                  <TalentTooltip :talent="getTalentName(role.talent)">
                    <span class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer">{{ getTalentName(role.talent) }}</span>
                  </TalentTooltip>

                </template>
              </div>
              <div class="text-yellow-600 text-xs">驅動力：{{ role.drive }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

function scrollToArchetype(roleName: string) {
  // 找到該角色所屬的 archetype
  const archetype = findArchetype(roleName)
  if (archetype) {
    const el = document.getElementById('archetype-' + archetype.archetypeName)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

import { ref, onMounted } from 'vue'
import FactionTooltip from '@/components/FactionTooltip.vue'
import TalentTooltip from '@/components/TalentTooltip.vue'

// 取得括號前的天賦名稱
function getTalentName(tal: string) {
  if (!tal) return ''
  const idx = tal.indexOf('（')
  if (idx === -1) return tal
  return tal.slice(0, idx)
}

const factions = ref<any[]>([])
const allArchetypes = ref<any[]>([])

function findArchetype(name: string) {
  for (const archetype of allArchetypes.value) {
    const role = archetype.roles?.find((r: any) => r.name === name)
    if (role) {
      return {
        archetypeName: archetype.name,
        archetypeDescription: archetype.description,
        archetypeQuote: archetype.quote,
        role
      }
    }
  }
  return null
}

onMounted(async () => {
  // 讀取 factions.json
  const factionsRes = await fetch('/archetype/factions.json')
  factions.value = await factionsRes.json()
  // 讀取 core.json
  const coreRes = await fetch('/archetype/core.json')
  const coreJson = await coreRes.json()
  // 讀取 sand&dust.json
  const sandRes = await fetch('/archetype/sand&dust.json')
  const sandJson = await sandRes.json()
  // 合併 archetypes
  allArchetypes.value = [...(coreJson.archetypes || []), ...(sandJson.archetypes || [])]
})
</script>
