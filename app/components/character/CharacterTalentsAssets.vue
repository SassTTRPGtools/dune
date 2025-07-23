
<template>
  <div class="flex flex-col gap-2 flex-1">
    <div class="flex flex-col gap-4 flex-1 min-h-0">
      <!-- 天賦區塊 -->
      <div class="border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-4 flex flex-col flex-1 mb-2 min-h-0 relative">
        <div class="flex items-center justify-between mb-1">
          <div class="font-bold text-yellow-900 tracking-widest text-lg">天賦</div>
          <button @click="showModal = true" class="text-yellow-900 hover:text-yellow-600 font-bold text-sm border border-yellow-400 rounded px-2 py-1">編輯</button>
        </div>
        <TalentList :list="talentList" @remove="removeTalent" />
        <TalentEditModal :show="showModal" :talents="allTalents" @add="addTalent" @close="showModal = false" />
      </div>
      <!-- 資產區塊 -->
      <div class="border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-4 flex flex-col flex-1 mb-2 min-h-0">
        <div class="font-bold text-yellow-900 mb-1 tracking-widest text-lg">資產</div>
        <textarea v-model="form.assets" rows="7" class="w-full flex-1 min-h-[90px] border-2 border-yellow-400 rounded-lg bg-transparent focus:outline-none p-2 resize-none text-yellow-900" />
      </div>
    </div>
    <div class="flex gap-4 w-full mt-auto">
      <div class="flex-1 border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-4 flex flex-col items-center">
        <div class="font-bold text-yellow-900 mb-1 tracking-widest">升級點</div>
        <input type="number" min="0" v-model.number="form.xp" class="w-20 h-12 rounded-full border-2 border-yellow-400 bg-yellow-100 text-yellow-900 font-orbitron font-bold text-2xl text-center shadow-inner focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
      </div>
      <div class="flex-1 border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-4 flex flex-col items-center">
        <div class="font-bold text-yellow-900 mb-1 tracking-widest">決心點</div>
        <input type="number" min="0" v-model.number="form.determination" class="w-20 h-12 rounded-full border-2 border-yellow-400 bg-yellow-100 text-yellow-900 font-orbitron font-bold text-2xl text-center shadow-inner focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TalentEditModal from './TalentEditModal.vue'
import TalentList from './TalentList.vue'
const props = defineProps<{ form: any, talentList: any[] }>()
const emit = defineEmits(['update:talentList'])

function addTalent(talent: any) {
  emit('update:talentList', [...(props.talentList || []), talent])
}

const showModal = ref(false)
const allTalents = ref<any[]>([])

onMounted(async () => {
  // 載入所有天賦
  const files = [
    '/talent/core.json',
    '/talent/landsraad.json',
    '/talent/sand&dust.json'
  ]
  let talents: any[] = []
  for (const file of files) {
    try {
      const res = await fetch(file)
      const json = await res.json()
      if (json.talents) talents = talents.concat(json.talents)
    } catch {}
  }
  allTalents.value = talents
})

function removeTalent(idx: number) {
  const newList = [...(props.talentList || [])]
  newList.splice(idx, 1)
  emit('update:talentList', newList)
}
</script>
