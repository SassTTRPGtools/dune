<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
      <button class="absolute top-2 right-2 text-yellow-900 hover:text-yellow-600 text-2xl" @click="$emit('close')">×</button>
      <div class="font-bold text-yellow-900 text-xl mb-4">新增天賦</div>
      <div class="mb-2">
        <label class="block text-yellow-900 font-bold mb-1">選擇天賦</label>
        <select v-model="selectedTalentIndex" class="w-full border-2 border-yellow-400 rounded p-2">
          <option value="">-- 請選擇 --</option>
          <optgroup v-for="(group, groupName) in talentGroups" :key="groupName" :label="groupName">
            <option v-for="(talent, idx) in group" :key="talent.name" :value="talent.globalIndex">{{ talent.name }}</option>
          </optgroup>
        </select>
      </div>
      <div class="mb-2">
        <label class="block text-yellow-900 font-bold mb-1">自定義標題（可選）</label>
        <input v-model="customTitle" class="w-full border-2 border-yellow-400 rounded p-2" placeholder="自定義標題..." />
      </div>
      <div v-if="selectedTalent" class="bg-yellow-50 border border-yellow-300 rounded p-3 mb-2">
        <div class="font-bold text-yellow-900">內容預覽：</div>
        <div class="text-yellow-900 whitespace-pre-line">{{ selectedTalent.description }}</div>
        <div class="text-yellow-900 mt-1 text-sm">效果：{{ selectedTalent.effect }}</div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button @click="$emit('close')" class="px-4 py-2 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold shadow">取消</button>
        <button @click="addTalent" :disabled="!selectedTalent" class="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow disabled:opacity-50">新增</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
const props = defineProps<{ show: boolean, talents: any[], onAdd: Function }>()
const emit = defineEmits(['close'])

const selectedTalentIndex = ref<number|string>('')
const customTitle = ref('')

const selectedTalent = computed(() => {
  if (selectedTalentIndex.value === '') return null
  const idx = typeof selectedTalentIndex.value === 'string' ? parseInt(selectedTalentIndex.value) : selectedTalentIndex.value
  if (isNaN(idx)) return null
  return props.talents[idx]
})

const talentGroups = computed(() => {
  // 分組顯示
  const groups: Record<string, any[]> = {}
  props.talents.forEach((talent: any, idx: number) => {
    const type = talent.type && talent.type.length ? talent.type[0] : '其他'
    if (!groups[type]) groups[type] = []
    groups[type].push({ ...talent, globalIndex: idx })
  })
  return groups
})

function addTalent() {
  if (!selectedTalent.value) return
  props.onAdd({
    ...selectedTalent.value,
    title: customTitle.value.trim() ? customTitle.value : selectedTalent.value.name
  })
  selectedTalentIndex.value = ''
  customTitle.value = ''
  emit('close')
}

watch(() => props.show, (val) => {
  if (!val) {
    selectedTalentIndex.value = ''
    customTitle.value = ''
  }
})
</script>
