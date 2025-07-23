<template>
  <span class="relative group cursor-pointer" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <div v-if="show && archetype" class="absolute z-50 left-1/2 -translate-x-1/2 mt-2 w-96 bg-white/90 border border-yellow-400 rounded-lg shadow-lg p-4 text-sm text-yellow-900 transition-opacity duration-200">
      <h3 class="font-bold text-lg mb-1">{{ archetype.role.name }}</h3>
      <div class="mb-1">{{ archetype.archetypeName }}</div>
      <div class="text-yellow-800 mb-1">{{ archetype.archetypeDescription }}</div>
      <div class="italic text-yellow-700 mb-1">{{ archetype.archetypeQuote }}</div>
      <div class="text-yellow-800">特徵：{{ archetype.role.trait }}</div>
      <div class="text-yellow-700">主技能：{{ archetype.role.primary_skill }}，副技能：{{ archetype.role.secondary_skill }}</div>
      <div class="text-yellow-700">焦點：{{ archetype.role.focuses?.join('、') }}</div>
      <div v-if="archetype.role.talent" class="text-yellow-900 font-semibold">
        天賦：
        <template v-if="Array.isArray(archetype.role.talent)">
          <template v-for="(tal, i) in archetype.role.talent" :key="tal">
            <TalentTooltip :talent="tal">
              <span class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer">{{ tal }}</span>
            </TalentTooltip>
            <span v-if="i !== archetype.role.talent.length - 1">、</span>
          </template>
        </template>
        <template v-else>
          <TalentTooltip :talent="archetype.role.talent">
            <span class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer">{{ archetype.role.talent }}</span>
          </TalentTooltip>
        </template>
      </div>
      <div v-if="archetype.role.talents" class="text-yellow-900 font-semibold">
        天賦：
        <template v-if="Array.isArray(archetype.role.talents)">
          <template v-for="(tal, i) in archetype.role.talents" :key="tal">
            <TalentTooltip :talent="tal">
              <span class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer">{{ tal }}</span>
            </TalentTooltip>
            <span v-if="i !== archetype.role.talents.length - 1">、</span>
          </template>
        </template>
        <template v-else>
          <TalentTooltip :talent="archetype.role.talents">
            <span class="underline decoration-dotted decoration-yellow-700 hover:text-yellow-900 cursor-pointer">{{ archetype.role.talents }}</span>
          </TalentTooltip>
        </template>
      </div>
      <div class="text-yellow-600 text-xs">驅動力：{{ archetype.role.drive || archetype.role.drives }}</div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TalentTooltip from './TalentTooltip.vue'
const props = defineProps<{ archetype: any }>()
const show = ref(false)
</script>

<style scoped>
.group > div {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.group:hover > div,
.group:focus-within > div {
  opacity: 1;
  pointer-events: auto;
}
</style>
