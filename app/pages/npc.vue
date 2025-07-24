<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 py-10 px-4">
    <div class="max-w-6xl mx-auto flex rounded-xl shadow-lg bg-white/80 border-4 border-yellow-300 overflow-hidden">
      <!-- 左側：NPC清單與分頁 -->
      <div class="w-96 bg-yellow-100/80 border-r-2 border-yellow-300 flex flex-col">
        <div class="p-4 border-b border-yellow-300 bg-yellow-200/80 flex flex-col gap-2">
          <div class="flex gap-2 mb-1">
            <button @click="selectAllCategories" :class="['px-3 py-1 rounded font-bold', selectedCategories.length === npcFiles.length ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-900 hover:bg-yellow-200']">全選</button>
            <div class="relative flex-1">
              <select multiple v-model="selectedCategories" class="w-full rounded border-yellow-300 focus:ring-yellow-400 focus:border-yellow-400 px-2 py-1">
                <option v-for="file in npcFiles" :key="file.key" :value="file.key">{{ file.label }}</option>
              </select>
            </div>
          </div>
          <input v-model="searchText" type="text" placeholder="搜尋 NPC..." class="w-full rounded border-yellow-300 focus:ring-yellow-400 focus:border-yellow-400 px-2 py-1" />
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-for="(npcs, faction) in groupedNpcList" :key="faction" class="mb-2">
            <div class="flex items-center px-4 py-2 bg-yellow-200/80 border-b border-yellow-300 cursor-pointer select-none group" @click="toggleFactionCollapse(faction)">
              <span class="font-bold text-yellow-900 flex-1">{{ faction }}</span>
              <svg :class="['w-4 h-4 transition-transform', collapsedFactions[faction] ? 'rotate-90' : '']" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
            <ul v-show="!collapsedFactions[faction]">
              <li v-for="npc in npcs" :key="npc.id || npc.name" @click="selectNpc(npc)"
                :class="['cursor-pointer px-4 py-3 border-b border-yellow-200 hover:bg-yellow-200', selectedNpc && selectedNpc.name === npc.name ? 'bg-yellow-300/80 font-bold' : '']">
                <div class="text-yellow-900">{{ npc.name }}</div>
                <div class="text-xs text-yellow-700 truncate">{{ npc.role || npc.type }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 右側：NPC詳細資料 -->
      <div class="flex-1 p-8 flex flex-col">
        <div v-if="selectedNpc" class="bg-yellow-50/80 rounded-xl shadow p-6 border-2 border-yellow-300">
          <h2 class="text-2xl font-bold text-yellow-900 mb-2">{{ selectedNpc.name }}</h2>
          <div class="mb-2 text-yellow-700 italic" v-if="selectedNpc.description">
            <div v-for="desc in (Array.isArray(selectedNpc.description) ? selectedNpc.description : [selectedNpc.description])" :key="desc">{{ desc }}</div>
          </div>
          <div class="mb-2 text-yellow-900" v-if="selectedNpc.traits && selectedNpc.traits.length">特徵：{{ selectedNpc.traits.join('、') }}</div>
          <div class="mb-2 text-yellow-900" v-if="selectedNpc.assets && selectedNpc.assets.length">資產：{{ selectedNpc.assets.join('、') }}</div>
          <div class="mb-2 text-yellow-900" v-if="selectedNpc.talents && selectedNpc.talents.length">
            <div class="font-bold mb-1">天賦：</div>
            <ul class="talent-list">
              <li v-for="talent in selectedNpc.talents" :key="talent" class="talent-item">{{ talent }}</li>
            </ul>
          </div>
          <div class="mb-2 text-yellow-900" v-if="selectedNpc.drives">
            <div class="font-bold">驅動力：</div>
            <ul class="ml-4 list-disc">
              <li v-for="(drive, key) in selectedNpc.drives" :key="key">
                <span class="font-semibold">{{ key }}：</span>
                <span>{{ drive.value }}</span>
                <span v-if="drive.statement">，{{ drive.statement }}</span>
              </li>
            </ul>
          </div>
          <div class="mb-2 text-yellow-900" v-if="selectedNpc.skills">
            <div class="font-bold">技能：</div>
            <ul class="ml-4 list-disc">
              <li v-for="(skill, key) in selectedNpc.skills" :key="key">
                <span class="font-semibold">{{ key }}：</span>
                <span>{{ skill.value }}</span>
                <span v-if="skill.focuses && skill.focuses.length">，專長：{{ skill.focuses.join('、') }}</span>
              </li>
            </ul>
          </div>
          <div class="mb-2 text-yellow-900" v-if="selectedNpc.exampleCharacters && selectedNpc.exampleCharacters.length">
            <div class="font-bold">範例角色：</div>
            <ul class="ml-4 list-disc">
              <li v-for="ex in selectedNpc.exampleCharacters" :key="ex">{{ ex }}</li>
            </ul>
          </div>
          <div class="mb-2 text-yellow-900" v-if="selectedNpc.scenarioHooks && selectedNpc.scenarioHooks.length">
            <div class="font-bold">劇情鉤子：</div>
            <ul class="ml-4 list-disc">
              <li v-for="hook in selectedNpc.scenarioHooks" :key="hook">{{ hook }}</li>
            </ul>
          </div>
        </div>
        <div v-else class="text-yellow-700 text-center my-20">請從左側選擇一位盟友或對手</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
const npcFiles = [
  { key: 'core', file: '/npc/core.json', label: '沙丘：帝國歷險記規則書' },
  { key: 'landsraad', file: '/npc/landsraad.json', label: '大博弈——蘭茲拉德擴展規則' },
  { key: 'sand&dust', file: '/npc/sand&dust.json', label: '沙塵荒漠——厄拉科斯擴展規則' },
  // 你可以根據 public/npc 目錄下的檔案增加更多分頁
]
const config = useRuntimeConfig()
const base = config.app.baseURL || '/'
const selectedCategories = ref<string[]>(npcFiles.length > 0 && typeof npcFiles[0]?.key === 'string' ? [npcFiles[0].key as string] : [])
const searchText = ref('')
const npcListMap = ref<Record<string, any[]>>({})
const selectedNpc = ref<any | null>(null)

async function loadAllNpcLists() {
  const map: Record<string, any[]> = {}
  for (const file of npcFiles) {
    try {
      const json = await $fetch<any>(file.file, { baseURL: base })
      if (Array.isArray(json)) {
        map[file.key] = json
      } else if (Array.isArray(json.npcs)) {
        map[file.key] = json.npcs
      } else {
        map[file.key] = []
      }
    } catch {
      map[file.key] = []
    }
  }
  npcListMap.value = map
  // 預設選第一個分類的第一個 NPC
  const firstKey = selectedCategories.value.length > 0 ? selectedCategories.value[0] : undefined
  const firstList = firstKey && map[firstKey] ? map[firstKey] : []
  selectedNpc.value = firstList[0] || null
}

function selectNpc(npc: any) {
  selectedNpc.value = npc
}

function selectAllCategories() {
  if (selectedCategories.value.length === npcFiles.length) {
    selectedCategories.value = []
  } else {
    selectedCategories.value = npcFiles.map(f => f.key)
  }
}


const filteredNpcList = computed(() => {
  // 合併所有選中分類的 NPC
  let all: any[] = []
  for (const key of selectedCategories.value) {
    all = all.concat(npcListMap.value[key] || [])
  }
  // 模糊查詢
  if (!searchText.value.trim()) return all
  const q = searchText.value.trim().toLowerCase()
  return all.filter(npc => {
    const fields = [npc.name]
    return fields.some(f => f && String(f).toLowerCase().includes(q))
  })
})

// 依 faction 分組，無 faction 歸為「未分類」
const groupedNpcList = computed(() => {
  const groups: Record<string, any[]> = {}
  for (const npc of filteredNpcList.value) {
    const faction = npc.faction || '未分類'
    if (!groups[faction]) groups[faction] = []
    groups[faction].push(npc)
  }
  return groups
})

const collapsedFactions = ref<Record<string, boolean>>({})
function toggleFactionCollapse(faction: string) {
  collapsedFactions.value[faction] = !collapsedFactions.value[faction]
}

watch(selectedCategories, () => {
  // 切換分類時自動選第一個 NPC
  const all = filteredNpcList.value
  selectedNpc.value = all[0] || null
})

onMounted(loadAllNpcLists)
</script>

<style scoped>
.bg-yellow-100\/80 {
  background: linear-gradient(135deg, #fef9c3 60%, #fde68a 100%) !important;
}
.bg-yellow-50\/80 {
  background: linear-gradient(135deg, #fefce8 60%, #fef9c3 100%) !important;
}

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
