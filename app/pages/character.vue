<template>
  <div class="min-h-screen flex justify-center items-start bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 py-10 px-2">
    <div class="bg-white/90 rounded-2xl shadow-2xl max-w-5xl w-full border-4 border-yellow-300 relative flex flex-col">
      <h1 class="text-3xl font-bold text-yellow-900 text-center mb-2 tracking-widest font-neon">DUNE</h1>
      <!-- 基本資料（圖片風格） -->
      <div class="flex gap-4 mb-2 px-4">
        <!-- 左欄 -->
        <div class="flex flex-col gap-2 flex-1">
          <div class="relative border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-2 pt-5">
            <div class="absolute -top-3 left-6 bg-white/80 px-2 text-yellow-900 font-bold tracking-widest text-x">姓名</div>
            <input v-model="form.name" class="w-full bg-transparent border-0 border-b-2 border-yellow-400 focus:outline-none text-yellow-900 text-base py-1" />
          </div>
          <div class="relative border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-2 pt-5">
            <div class="absolute -top-3 left-6 bg-white/80 px-2 text-yellow-900 font-bold tracking-widest text-x">氏族</div>
            <input v-model="form.house" class="w-full bg-transparent border-0 border-b-2 border-yellow-400 focus:outline-none text-yellow-900 text-base py-1" />
          </div>
          <div class="relative border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-2 pt-5">
            <div class="absolute -top-3 left-6 bg-white/80 px-2 text-yellow-900 font-bold tracking-widest text-x">角色</div>
            <input v-model="form.role" class="w-full bg-transparent border-0 border-b-2 border-yellow-400 focus:outline-none text-yellow-900 text-base py-1" />
          </div>
          <div class="relative border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-2 pt-5">
            <div class="absolute -top-3 left-6 bg-white/80 px-2 text-yellow-900 font-bold tracking-widest text-x">派系</div>
            <input v-model="form.faction" class="w-full bg-transparent border-0 border-b-2 border-yellow-400 focus:outline-none text-yellow-900 text-base py-1" />
          </div>
        </div>
        <!-- 右欄 -->
        <div class="flex flex-col gap-2 flex-1">
          <div class="relative border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-2 pt-5 row-span-3 min-h-[120px] flex-1">
            <div class="absolute -top-3 left-6 bg-white/80 px-2 text-yellow-900 font-bold tracking-widest text-xs">個人特徵</div>
            <textarea v-model="form.trait" rows="5" class="w-full h-full min-h-[90px] bg-transparent border-0 border-b-2 border-yellow-400 focus:outline-none text-yellow-900 text-base py-1 resize-none" />
          </div>
          <div class="relative border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-2 pt-5">
            <div class="absolute -top-3 left-6 bg-white/80 px-2 text-yellow-900 font-bold tracking-widest text-x">野心</div>
            <input v-model="form.ambition" class="w-full bg-transparent border-0 border-b-2 border-yellow-400 focus:outline-none text-yellow-900 text-base py-1" />
          </div>
        </div>
      </div>
      <div class="flex flex-row gap-6 px-4 pb-2">
        <!-- 左側 驅動力/聲明、技能/焦點 -->
        <div class="flex-1 flex flex-col gap-6">
          <!-- 驅動力與聲明 -->
          <div class="border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-4">
            <div class="font-bold text-yellow-900 mb-2 tracking-widest text-lg">驅動力 / 聲明</div>
            <div class="grid grid-cols-1 gap-2">
              <div v-for="drive in driveList" :key="drive" class="flex items-center mb-2">
                <span class="w-14 text-yellow-900 font-bold">{{ drive }}</span>
                <div class="flex justify-center items-center w-20 mr-2">
                  <input type="number" min="0" max="8" v-model.number="form.drives[drive]"
                    class="w-12 h-10 rounded-full border-2 border-yellow-400 bg-yellow-100 text-yellow-900 font-bold text-lg text-center shadow-inner focus:ring-2 focus:ring-yellow-400 focus:outline-none font-orbitron" />
                </div>
                <input v-model="form.statements[drive]" placeholder="聲明..."
                  class="flex-1 border-b-2 border-yellow-400 bg-transparent focus:outline-none py-1 text-yellow-900 ml-2" />
              </div>
            </div>
          </div>
          <!-- 技能與焦點 -->
          <div class="border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-4">
            <div class="font-bold text-yellow-900 mb-2 tracking-widest text-lg">技能 / 焦點</div>
            <div class="grid grid-cols-1 gap-2">
              <div v-for="skill in skillList" :key="skill" class="flex items-center mb-2">
                <span class="w-14 text-yellow-900 font-bold">{{ skill }}</span>
                <div class="flex justify-center items-center w-20 mr-2">
                  <input type="number" min="0" max="8" v-model.number="form.skills[skill]"
                    class="w-12 h-10 rounded-full border-2 border-yellow-400 bg-yellow-100 text-yellow-900 font-bold text-lg text-center shadow-inner focus:ring-2 focus:ring-yellow-400 focus:outline-none font-orbitron" />
                </div>
                <input v-model="form.focuses[skill]" placeholder="焦點..."
                  class="flex-1 border-b-2 border-yellow-400 bg-transparent focus:outline-none py-1 text-yellow-900 ml-2" />
              </div>
            </div>
          </div>

        </div>
        <!-- 右側 天賦與資產 -->
        <div class="w-80 flex flex-col gap-4 h-full">
          <div class="flex flex-col gap-4 flex-1 min-h-0">
            <div class="border-4 border-yellow-900 rounded-xl bg-white/80 shadow p-4 flex flex-col flex-1 mb-2 min-h-0">
              <div class="font-bold text-yellow-900 mb-1 tracking-widest text-lg">天賦</div>
              <textarea v-model="form.talents" rows="7" class="w-full flex-1 min-h-[90px] border-2 border-yellow-400 rounded-lg bg-transparent focus:outline-none p-2 resize-none text-yellow-900" />
            </div>
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
