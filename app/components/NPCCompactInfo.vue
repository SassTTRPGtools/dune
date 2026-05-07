<template>
  <!-- NPC信息显示组件（支持单一模式和紧凑模式） -->
  <div>
    <!-- 特徵 -->
    <div :class="[compact ? 'text-sm text-yellow-900' : 'text-yellow-900 text-sm sm:text-base', 'mb-2']" v-if="npc.traits && npc.traits.length">
      特徵：{{ npc.traits.join('、') }}
    </div>

    <!-- 資產 -->
    <div :class="[compact ? 'text-sm text-yellow-900' : 'text-yellow-900 text-sm sm:text-base', 'mb-2']" v-if="npc.assets && npc.assets.length">
      資產：{{ npc.assets.join('、') }}
    </div>

    <!-- 天賦 -->
    <div v-if="npc.talents && npc.talents.length" :class="[compact ? 'mb-2' : 'mb-2']">
      <div :class="compact ? 'text-sm font-bold text-yellow-900 mb-1' : 'text-yellow-900 text-sm sm:text-base font-bold mb-1'">天賦：</div>
      <ul class="talent-list">
        <li v-for="talent in (compact ? npc.talents.slice(0, 4) : npc.talents)" :key="talent" class="talent-item text-sm">{{ talent }}</li>
      </ul>
    </div>

    <!-- 驅動力和技能並排 -->
    <div :class="[compact ? 'grid grid-cols-1 md:grid-cols-2 gap-3 text-sm' : 'grid grid-cols-1 md:grid-cols-2 gap-4']">
      <div :class="compact ? 'text-yellow-900' : 'text-yellow-900 text-sm sm:text-base'" v-if="npc.drives">
        <div :class="compact ? 'font-bold mb-2 text-sm' : 'font-bold mb-2'">驅動力：</div>
        <ul :class="[compact ? 'ml-4 list-disc text-sm' : 'ml-4 list-disc']">
          <li v-for="(drive, key) in compactDrives" :key="key">
            <span class="font-semibold">{{ key }}：</span>
            <span>{{ drive.value }}</span>
            <span v-if="drive.statement">，{{ drive.statement }}</span>
          </li>
        </ul>
      </div>
      <div :class="compact ? 'text-yellow-900' : 'text-yellow-900 text-sm sm:text-base'" v-if="npc.skills">
        <div :class="compact ? 'font-bold mb-2 text-sm' : 'font-bold mb-2'">技能：</div>
        <ul :class="[compact ? 'ml-4 list-disc text-sm' : 'ml-4 list-disc']">
          <li v-for="(skill, key) in compactSkills" :key="key">
            <span class="font-semibold">{{ key }}：</span>
            <span>{{ skill.value }}</span>
            <span v-if="skill.focuses && skill.focuses.length">（{{ skill.focuses.join('、') }}）</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Drive {
  value: number
  statement?: string
}

interface Skill {
  value: number
  focuses?: string[]
}

interface NPC {
  traits?: string[]
  assets?: string[]
  talents?: string[]
  drives?: Record<string, Drive>
  skills?: Record<string, Skill>
}

const props = withDefaults(defineProps<{
  npc: NPC
  compact?: boolean
}>(), {
  compact: false
})

// 根据compact模式，驱动力和技能的显示逻辑
const compactDrives = computed(() => {
  if (!props.npc.drives) return {}
  return props.npc.drives
})

const compactSkills = computed(() => {
  if (!props.npc.skills) return {}
  return props.npc.skills
})
</script>