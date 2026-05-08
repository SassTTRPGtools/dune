<template>
  <div class="min-h-screen flex justify-center items-start bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-10 px-2 transition-colors duration-300">
    <div class="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-black/50 max-w-5xl w-full border-4 border-yellow-300 dark:border-gray-600 relative flex flex-col">
      <h1 class="text-7xl font-bold text-yellow-900 dark:text-gray-100 text-center mb-2 tracking-widest">ᑐᑌᑎᑢ</h1>
      <CharacterBasic :form="form" />
      <div class="flex gap-4 mb-2 px-4">
        <CharacterDrivesSkills :form="form" :driveList="driveList" :skillList="skillList" />
        <CharacterTalentsAssets :form="form" v-model:talentList="form.talents" />
      </div>
      <!-- 匯入/匯出按鈕 -->
      <div class="flex flex-wrap justify-center gap-4 px-4 pb-2 items-center">
        <input ref="importInput" type="file" accept="application/json" class="hidden" @change="importJson" />
        <button @click="triggerImport" class="px-4 py-2 rounded bg-yellow-200 dark:bg-yellow-700 hover:bg-yellow-300 dark:hover:bg-yellow-600 text-yellow-900 dark:text-yellow-100 font-bold shadow transition">匯入JSON</button>
        <button @click="exportJson" class="px-4 py-2 rounded bg-yellow-500 dark:bg-gray-700 hover:bg-yellow-600 dark:hover:bg-gray-600 text-white dark:text-gray-100 font-bold shadow transition">匯出JSON</button>
        <button @click="copyText" class="px-4 py-2 rounded bg-yellow-700 dark:bg-orange-700 hover:bg-yellow-800 dark:hover:bg-orange-600 text-white dark:text-orange-100 font-bold shadow transition">複製角色卡文字</button>
        <span v-if="copied" class="text-green-700 dark:text-green-400 font-bold ml-2">已複製！</span>
        <button @click="clearAll" class="px-4 py-2 rounded bg-red-400 dark:bg-red-900 hover:bg-red-600 dark:hover:bg-red-800 text-white dark:text-red-100 font-bold shadow transition">清空全部</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import CharacterBasic from '~/components/character/CharacterBasic.vue'
import CharacterDrivesSkills from '~/components/character/CharacterDrivesSkills.vue'
import CharacterTalentsAssets from '~/components/character/CharacterTalentsAssets.vue'

const driveList = ['職責', '信仰', '正義', '權力', '真理']
const skillList = ['戰鬥', '溝通', '紀律', '移動', '理解']

// 複製角色卡文字
import { onMounted } from 'vue'
const allTalents = ref<any[]>([])
const copied = ref(false)
const talentFiles = [
  '/talent/core.json',
  '/talent/landsraad.json',
  '/talent/sand&dust.json'
]
async function fetchAllTalents() {
  let talents: any[] = []
  for (const file of talentFiles) {
    try {
      const json = await $fetch<{ talents?: any[] }>(file)
      if (json && json.talents) talents = talents.concat(json.talents)
    } catch {}
  }
  allTalents.value = talents
}
onMounted(fetchAllTalents)

function getTalentDetail(name: string) {
  return allTalents.value.find((t: any) => t.name === name)
}

function copyText() {
  let text = ''
  text += `氏族：${form.house || ''}\n`
  text += `角色：${form.name || ''}\n`
  text += `特徵：${form.trait || ''}\n`
  text += `野心：${form.ambition || ''}\n`
  text += `資產：\n${(form.assets || '').split(/\n|\r/).filter(Boolean).map(a => a.trim()).join('\n') || ''}\n\n`
  // 天賦
  text += '天賦：\n'
  for (const t of form.talents as any[]) {
    // 標題優先 title，再 name
    let name = t.title || t.name || t
    let desc = t.description || ''
    let effect = t.effect || ''
    // 若無自訂內容則查表
    if (!desc && !effect) {
      const detail = getTalentDetail(name)
      if (detail) {
        desc = detail.description || ''
        effect = detail.effect || ''
      }
    }
    text += `${name}\n${desc}\n${effect ? `效果：${effect}\n` : ''}\n`
  }
  // 驅動力
  text += '驅動力（聲明）：\n'
  for (const d of driveList) {
    const v = form.drives[d] || 0
    let s = form.statements[d] || ''
    // 若已有「」則不重複加註
    if (s && !/^「.*」$/.test(s)) s = `「${s}」`
    text += `${d} ${v}：${s || '——'}\n`
  }
  // 技能
  text += '\n技能（焦點）：\n'
  for (const s of skillList) {
    const v = form.skills[s] || 0
    const f = form.focuses[s] || ''
    text += `${s} ${v}：${f ? f : '——'}\n`
  }
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1800)
}

const defaultForm = () => ({
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
  talents: [],
  assets: '',
  xp: 0,
  determination: 0
})
const form = reactive(defaultForm())
// localStorage key
const STORAGE_KEY = 'dune_character_form'


// 載入 localStorage（僅瀏覽器端）
let saved = null
if (typeof window !== 'undefined') {
  saved = localStorage.getItem(STORAGE_KEY)
}
if (saved) {
  try {
    Object.assign(form, JSON.parse(saved))
  } catch {}
}

// 監聽 form 變動自動存檔（僅瀏覽器端）
import { watch } from 'vue'
if (typeof window !== 'undefined') {
  watch(form, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })
}

const importInput = ref<HTMLInputElement | null>(null)

function triggerImport() {
  importInput.value?.click()
}

function importJson(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target?.result as string)
      Object.assign(form, defaultForm()) // 先清空
      Object.assign(form, data)          // 再匯入
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      }
    } catch {
      alert('JSON格式錯誤')
    }
  }
  reader.readAsText(input.files[0])
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

function clearAll() {
  Object.assign(form, defaultForm())
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}
</script>
