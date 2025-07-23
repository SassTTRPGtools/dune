<template>
  <div class="min-h-screen flex justify-center items-start bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 py-10 px-2">
    <div class="bg-white/90 rounded-2xl shadow-2xl max-w-5xl w-full border-4 border-yellow-300 relative flex flex-col">
      <h1 class="text-3xl font-bold text-yellow-900 text-center mb-2 tracking-widest font-neon">DUNE</h1>
      <CharacterBasic :form="form" />
      <div class="flex flex-row gap-6 px-4 pb-2">
        <CharacterDrivesSkills :form="form" :driveList="driveList" :skillList="skillList" />
        <CharacterTalentsAssets :form="form" />
      </div>
      <!-- 匯出/重置按鈕 -->
      <div class="flex justify-end gap-4 px-4 pb-2">
        <button @click="resetForm" class="px-4 py-2 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold shadow">重置</button>
        <button @click="exportJson" class="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow">匯出JSON</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import CharacterBasic from '~/components/character/CharacterBasic.vue'
import CharacterDrivesSkills from '~/components/character/CharacterDrivesSkills.vue'
import CharacterTalentsAssets from '~/components/character/CharacterTalentsAssets.vue'

const driveList = ['責責', '信仰', '正義', '權力', '真理']
const skillList = ['戰鬥', '溝通', '紀律', '移動', '理解']

const form = reactive({
  name: '',
  trait: '',
  house: '',
  ambition: '',
  role: '',
  faction: '',
  drives: Object.fromEntries(driveList.map(d => [d, 0])),
  statements: Object.fromEntries(driveList.map(d => [d, ''])),
  skills: Object.fromEntries(skillList.map(s => [s, 0])),
  focuses: Object.fromEntries(skillList.map(s => [s, ''])),
  talents: '',
  assets: '',
  xp: 0,
  determination: 0
})

function resetForm() {
  form.name = ''
  form.trait = ''
  form.house = ''
  form.ambition = ''
  form.role = ''
  form.faction = ''
  driveList.forEach(d => { form.drives[d] = 0; form.statements[d] = '' })
  skillList.forEach(s => { form.skills[s] = 0; form.focuses[s] = '' })
  form.talents = ''
  form.assets = ''
  form.xp = 0
  form.determination = 0
}

function exportJson() {
  const data = JSON.stringify(form, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${form.name || 'dune_character'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Neon+Club+Music&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
 .font-orbitron {
   font-family: 'Orbitron', 'Neon Club Music', 'Cinzel', serif !important;
 }
input, textarea {
  font-family: inherit;
}
.font-neon {
  font-family: 'Neon Club Music', 'Cinzel', serif !important;
}
</style>
