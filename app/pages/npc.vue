<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300">
    <div class="flex flex-col lg:flex-row h-screen">
      <!-- 左側：NPC清單與分頁 - 響應式側邊欄 -->
      <div class="w-full lg:w-80 xl:w-96 bg-yellow-100/80 border-b-2 lg:border-b-0 lg:border-r-2 border-yellow-300 flex flex-col shadow-lg max-h-96 lg:max-h-none overflow-y-auto lg:overflow-visible">
        <div class="p-4 border-b border-yellow-300 bg-yellow-200/80 flex flex-col gap-2">
          <div class="flex flex-col sm:flex-row gap-2 mb-1">
            <button @click="selectAllCategories" :class="['px-3 py-1 rounded font-bold text-sm', selectedCategories.length === npcFiles.length ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-900 hover:bg-yellow-200']">全選</button>
            <div class="relative flex-1">
              <select multiple v-model="selectedCategories" class="w-full rounded border-yellow-300 focus:ring-yellow-400 focus:border-yellow-400 px-2 py-1 text-sm">
                <option v-for="file in npcFiles" :key="file.key" :value="file.key">{{ file.label }}</option>
              </select>
            </div>
          </div>
          <input v-model="searchText" type="text" placeholder="搜尋 NPC..." class="w-full rounded border-yellow-300 focus:ring-yellow-400 focus:border-yellow-400 px-2 py-1 text-sm" />
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-for="(npcs, faction) in groupedNpcList" :key="faction" class="mb-2">
            <div class="flex items-center px-4 py-2 bg-yellow-200/80 border-b border-yellow-300 cursor-pointer select-none group" @click="toggleFactionCollapse(faction)">
              <span class="font-bold text-yellow-900 flex-1 text-sm sm:text-base">{{ faction }}</span>
              <svg :class="['w-4 h-4 transition-transform', collapsedFactions[faction] ? 'rotate-90' : '']" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
            <ul v-show="!collapsedFactions[faction]">
              <li v-for="npc in npcs" :key="npc.id || npc.name"
                :class="['cursor-pointer px-2 sm:px-4 py-2 sm:py-3 border-b border-yellow-200 hover:bg-yellow-200 flex items-center justify-between group', selectedNpc && selectedNpc.name === npc.name ? 'bg-yellow-300/80 font-bold' : '']">
                <div @click="selectNpc(npc)" class="flex-1 min-w-0">
                  <div class="text-yellow-900 text-sm sm:text-base truncate">{{ npc.name }}</div>
                  <div class="text-xs text-yellow-700 truncate">{{ npc.role || npc.type }}</div>
                </div>
                <button @click="toggleTag(npc)" 
                  :class="['ml-2 px-1 sm:px-2 py-1 rounded text-xs font-bold transition-all duration-200', 
                    'lg:opacity-0 lg:group-hover:opacity-100',
                    isTagged(npc) ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-white hover:bg-yellow-600']">
                  {{ isTagged(npc) ? '★' : '☆' }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 中間：標籤NPC列表 - 響應式 -->
      <div class="w-full lg:w-64 xl:w-72 bg-orange-100/80 border-b-2 lg:border-b-0 lg:border-r-2 border-yellow-300 flex flex-col shadow-lg max-h-64 lg:max-h-none overflow-y-auto lg:overflow-visible">
        <div class="p-3 lg:p-4 border-b border-yellow-300 bg-orange-200/80">
          <h3 class="text-base lg:text-lg font-bold text-orange-900">標籤清單</h3>
          <p class="text-xs text-orange-700">{{ taggedNpcs.length }} 位NPC</p>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-if="taggedNpcs.length === 0" class="p-3 lg:p-4 text-center text-orange-600 text-sm">
            尚無標籤NPC
          </div>
          <ul v-else>
            <li v-for="npc in taggedNpcs" :key="npc.name"
              :class="['cursor-pointer px-2 sm:px-4 py-2 sm:py-3 border-b border-orange-200 hover:bg-orange-200 flex items-center justify-between group', 
                selectedNpc && selectedNpc.name === npc.name ? 'bg-orange-300/80 font-bold' : '']">
              <div @click="selectFromTag(npc)" class="flex-1 min-w-0">
                <div class="text-orange-900 text-sm font-medium truncate">{{ npc.name }}</div>
                <div class="text-xs text-orange-700 truncate">{{ npc.role || npc.type }}</div>
              </div>
              <button @click="removeTag(npc)" 
                class="ml-2 px-1 sm:px-2 py-1 rounded text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-all duration-200 lg:opacity-0 lg:group-hover:opacity-100">
                ✕
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右側：NPC詳細資料 - 響應式主內容區 -->
      <div class="flex-1 bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 overflow-y-auto min-h-96 lg:min-h-0">
        <div class="p-3 sm:p-4 lg:p-6">
          <div v-if="selectedNpc" class="npc-details-card bg-yellow-50/80 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-yellow-300">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-900">{{ selectedNpc.name }}</h2>
              <button @click="toggleTag(selectedNpc)" 
                :class="['px-3 sm:px-4 py-2 rounded-lg font-bold transition-colors text-sm sm:text-base', 
                  isTagged(selectedNpc) ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-yellow-500 text-white hover:bg-yellow-600']">
                {{ isTagged(selectedNpc) ? '★ 已標籤' : '☆ 加入標籤' }}
              </button>
            </div>
            <div class="mb-2 text-yellow-700 italic text-sm sm:text-base" v-if="selectedNpc.description">
              <div v-for="desc in (Array.isArray(selectedNpc.description) ? selectedNpc.description : [selectedNpc.description])" :key="desc">{{ desc }}</div>
            </div>
            <div class="mb-2 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.traits && selectedNpc.traits.length">特徵：{{ selectedNpc.traits.join('、') }}</div>
            <div class="mb-2 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.assets && selectedNpc.assets.length">資產：{{ selectedNpc.assets.join('、') }}</div>
            <div class="mb-2 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.talents && selectedNpc.talents.length">
              <div class="font-bold mb-1">天賦：</div>
              <ul class="talent-list">
                <li v-for="talent in selectedNpc.talents" :key="talent" class="talent-item">{{ talent }}</li>
              </ul>
            </div>
            <div class="mb-2 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.drives">
              <div class="font-bold">驅動力：</div>
              <ul class="ml-4 list-disc">
                <li v-for="(drive, key) in selectedNpc.drives" :key="key">
                  <span class="font-semibold">{{ key }}：</span>
                  <span>{{ drive.value }}</span>
                  <span v-if="drive.statement">，{{ drive.statement }}</span>
                </li>
              </ul>
            </div>
            <div class="mb-2 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.skills">
              <div class="font-bold">技能：</div>
              <ul class="ml-4 list-disc">
                <li v-for="(skill, key) in selectedNpc.skills" :key="key">
                  <span class="font-semibold">{{ key }}：</span>
                  <span>{{ skill.value }}</span>
                  <span v-if="skill.focuses && skill.focuses.length">，專長：{{ skill.focuses.join('、') }}</span>
                </li>
              </ul>
            </div>
            <div class="mb-2 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.exampleCharacters && selectedNpc.exampleCharacters.length">
              <div class="font-bold">範例角色：</div>
              <ul class="ml-4 list-disc">
                <li v-for="ex in selectedNpc.exampleCharacters" :key="ex">{{ ex }}</li>
              </ul>
            </div>
            <div class="mb-2 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.scenarioHooks && selectedNpc.scenarioHooks.length">
              <div class="font-bold">劇情鉤子：</div>
              <ul class="ml-4 list-disc">
                <li v-for="hook in selectedNpc.scenarioHooks" :key="hook">{{ hook }}</li>
              </ul>
            </div>
          </div>
          <div v-else class="npc-details-card bg-yellow-50/80 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-yellow-300 text-yellow-700 text-center">
            <p class="text-lg sm:text-xl lg:text-2xl font-medium">請從左側選擇一位盟友或對手</p>
            <p class="text-sm sm:text-base lg:text-lg mt-2 opacity-75">或從中間的標籤清單中選擇</p>
          </div>
        </div>
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
const taggedNpcs = ref<any[]>([]) // 標籤NPC列表

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

// 標籤功能
function toggleTag(npc: any) {
  const index = taggedNpcs.value.findIndex(tagged => tagged.name === npc.name)
  if (index > -1) {
    taggedNpcs.value.splice(index, 1)
  } else {
    taggedNpcs.value.push(npc)
  }
}

function isTagged(npc: any) {
  return taggedNpcs.value.some(tagged => tagged.name === npc.name)
}

function removeTag(npc: any) {
  const index = taggedNpcs.value.findIndex(tagged => tagged.name === npc.name)
  if (index > -1) {
    taggedNpcs.value.splice(index, 1)
  }
}

function selectFromTag(npc: any) {
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

/* NPC詳細資料卡片樣式 */
.npc-details-card {
  min-height: 200px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.npc-details-card:hover {
  transform: translateY(-2px);
}

/* 響應式調整 */
@media (max-width: 1023px) {
  .npc-details-card {
    min-height: 300px;
  }
}

@media (max-width: 639px) {
  .npc-details-card {
    min-height: 250px;
  }
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
