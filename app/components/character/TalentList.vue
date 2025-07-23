<template>
  <div class="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-2 relative">
    <div v-for="(talent, idx) in list" :key="idx" class="relative group flex items-center gap-1 mb-1">
      <span class="font-bold text-yellow-900 cursor-pointer px-2 py-0.5 bg-yellow-50 rounded hover:bg-yellow-100 transition" @mouseenter="onMouseEnter(idx, $event)" @mouseleave="onMouseLeave" @click="copyTalent(talent)">
        {{ talent.title || talent.name }}
      </span>
      <button @click.stop="remove(idx)" class="text-xs text-red-600 hover:text-red-800">移除</button>
      <teleport to="body">
        <div v-if="hoverIdx === idx && hoverPos" :style="hoverStyle" class="fixed z-50 bg-white border border-yellow-400 rounded shadow p-2 w-80 text-yellow-900 whitespace-pre-line">
          <div class="font-bold mb-1">{{ talent.title || talent.name }}</div>
          <div>{{ talent.description }}</div>
          <div class="mt-1 text-xs">效果：{{ talent.effect }}</div>
        </div>
      </teleport>
    </div>
  </div>
      <transition name="fade">
      <div v-if="copied" class="absolute left-1/2 -translate-x-1/2 top-4 z-50 bg-yellow-500 text-white px-6 py-2 rounded shadow-lg font-bold text-lg pointer-events-none select-none">
        已複製！
      </div>
    </transition>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ list: any[] }>()
const emit = defineEmits(['remove'])

const hoverIdx = ref<number|null>(null)
const hoverPos = ref<{x: number, y: number}|null>(null)
const copied = ref(false)

function remove(idx: number) {
  emit('remove', idx)
}

function copyTalent(talent: any) {
  const text = `${talent.title || talent.name}\n${talent.description || ''}\n效果：${talent.effect || ''}`
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
function onMouseEnter(idx: number, event: MouseEvent) {
  hoverIdx.value = idx
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  hoverPos.value = { x: rect.left, y: rect.bottom }
}
function onMouseLeave() {
  hoverIdx.value = null
  hoverPos.value = null
}

const hoverStyle = computed(() => {
  if (!hoverPos.value) return {}
  return {
    left: hoverPos.value.x + 'px',
    top: hoverPos.value.y + 4 + 'px'
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
