<template>
  <!-- 基本信息显示组件 -->
  <div>
    <!-- 特徵 -->
    <div class="mb-2 text-yellow-900 dark:text-gray-100 text-sm sm:text-base" v-if="npc.traits && npc.traits.length">
      特徵：{{ npc.traits.join('、') }}
    </div>

    <!-- 資產 -->
    <div class="mb-2 text-yellow-900 dark:text-gray-100 text-sm sm:text-base" v-if="npc.assets && npc.assets.length">
      資產：{{ npc.assets.join('、') }}
    </div>

    <!-- 天賦 -->
    <div class="mb-2 text-yellow-900 dark:text-gray-100 text-sm sm:text-base" v-if="npc.talents && npc.talents.length">
      <div class="font-bold mb-1">天賦：</div>
      <ul class="talent-list">
        <li v-for="talent in npc.talents" :key="talent" class="talent-item">{{ talent }}</li>
      </ul>
    </div>

    <!-- 驅動力和技能並排 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="text-yellow-900 dark:text-gray-100 text-sm sm:text-base" v-if="npc.drives">
        <div class="font-bold mb-2">驅動力：</div>
        <ul class="ml-4 list-disc">
          <li v-for="(drive, key) in npc.drives" :key="key">
            <span class="font-semibold">{{ key }}：</span>
            <span>{{ drive.value }}</span>
            <span v-if="drive.statement">，{{ drive.statement }}</span>
          </li>
        </ul>
      </div>
      <div class="text-yellow-900 dark:text-gray-100 text-sm sm:text-base" v-if="npc.skills">
        <div class="font-bold mb-2">技能：</div>
        <ul class="ml-4 list-disc">
          <li v-for="(skill, key) in npc.skills" :key="key">
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

defineProps<{
  npc: NPC
}>()
</script>

<style scoped>
/* 天賦樣式 */
.talent-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.talent-item {
  background: linear-gradient(90deg, #fef9c3 70%, #fde68a 100%);
  border-left: 5px solid #facc15;
  border-radius: 0.375rem;
  margin-bottom: 0.3em;
  padding: 0.4em 0.8em;
  font-weight: 500;
  color: #b45309;
  box-shadow: 0 1px 4px #eab30822;
  transition: background 0.2s;
}

.talent-item:last-child {
  margin-bottom: 0;
}
</style>
