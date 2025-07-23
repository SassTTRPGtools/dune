<template>
  <span class="relative group cursor-pointer select-text" @mouseenter="show = true" @mouseleave="show = false" @click="copyTalent">
    <slot />
    <div v-if="show && (detail || talent)" class="absolute z-50 left-1/2 -translate-x-1/2 mt-2 w-96 bg-white/90 border border-yellow-400 rounded-lg shadow-lg p-4 text-sm text-yellow-900 transition-opacity duration-200">
      <div v-if="detail">
        <div class="font-bold text-yellow-900 mb-1">{{ detail.name }}</div>
        <div class="text-yellow-700 mb-1">類型：{{ Array.isArray(detail.type) ? detail.type.join('、') : detail.type }}</div>
        <div class="mb-1 text-yellow-800 italic">{{ detail.description }}</div>
        <div class="mb-1 text-yellow-900">效果：{{ detail.effect }}</div>
      </div>
      <div v-else>
        <div class="font-bold text-yellow-900 mb-1">天賦：{{ talent }}</div>
      </div>
      <div v-if="copied" class="text-green-600 text-xs mt-1">已複製！</div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps(['talent'])
const show = ref(false)
const copied = ref(false)
const detail = ref<any>(null)

async function fetchAllTalents() {
const files = [
  `/talent/core.json`,
  `/talent/landsraad.json`,
  `/talent/sand&dust.json`
];
  let all: any[] = []
  for (const file of files) {
    try {
      const res = await fetch(file)
      const json = await res.json()
      all = all.concat(json.talents)
    } catch {}
  }
  return all
}

onMounted(async () => {
  const allTalents = await fetchAllTalents()
  detail.value = allTalents.find(t => t.name === props.talent)
})

function copyTalent() {
  if (detail.value) {
    const text = `【${detail.value.name}】\n${detail.value.description}\n效果：${detail.value.effect}`
    navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1200)
  } else if (props.talent) {
    navigator.clipboard.writeText(props.talent)
    copied.value = true
    setTimeout(() => (copied.value = false), 1200)
  }
}
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
