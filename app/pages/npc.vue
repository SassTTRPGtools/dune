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
          <div class="flex gap-2 mt-2">
            <button @click="gridMode = false" 
              :class="['px-2 py-1 rounded text-xs font-bold transition-colors', 
                !gridMode ? 'bg-orange-500 text-white' : 'bg-orange-300 text-orange-900 hover:bg-orange-400']">
              單一
            </button>
            <button @click="gridMode = true" 
              :class="['px-2 py-1 rounded text-xs font-bold transition-colors', 
                gridMode ? 'bg-orange-500 text-white' : 'bg-orange-300 text-orange-900 hover:bg-orange-400']">
              2x2
            </button>
          </div>
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

      <!-- 右側：2x1 NPC網格 - 響應式主內容區 -->
      <div class="flex-1 bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 overflow-hidden min-h-96 lg:min-h-0">
        <div class="p-3 sm:p-4 lg:p-6 h-full flex flex-col">
          <!-- 2x2 網格模式 -->
          <div v-if="gridMode">
            <!-- 2x1 網格 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <div v-for="(npc, idx) in displayedNpcs" :key="idx" 
                @click="selectGridNpc(idx)"
                :class="['relative bg-yellow-50/80 rounded-lg shadow-md p-4 border-2 transition-all cursor-pointer flex flex-col',
                  selectedGridIdx === idx ? 'border-orange-500 shadow-lg' : 'border-yellow-300 hover:shadow-lg']">
                <div v-if="npc" class="flex flex-col flex-1 overflow-hidden">
                  <div class="flex justify-between items-start mb-2 flex-shrink-0">
                    <h3 class="text-base font-bold text-yellow-900 truncate flex-1">{{ npc.name }}</h3>
                    <button @click.stop="removeFromGrid(idx)" class="ml-2 px-2 py-1 rounded text-xs font-bold bg-red-500 text-white hover:bg-red-600">✕</button>
                  </div>
                  
                  <!-- 使用紧凑组件显示2x1网格中的NPC信息 -->
                  <div class="overflow-y-auto flex-1">
                    <NPCCompactInfo :npc="npc" :compact="true" />
                  </div>
                </div>
                <div v-else class="flex items-center justify-center text-yellow-600 flex-1">
                  <span class="text-center">
                    <div class="text-2xl mb-2">+</div>
                    <div class="text-xs">點擊選擇NPC</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 單一模式 -->
          <div v-else class="flex flex-col h-full overflow-hidden">
            <div v-if="selectedNpc" class="npc-details-card bg-yellow-50/80 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-yellow-300 flex flex-col h-full overflow-y-auto">
              <div class="mb-4">
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-900">{{ selectedNpc.name }}</h2>
              </div>
              <div class="mb-2 text-yellow-700 italic text-sm sm:text-base" v-if="selectedNpc.description">
                <div v-for="desc in (Array.isArray(selectedNpc.description) ? selectedNpc.description : [selectedNpc.description])" :key="desc">{{ desc }}</div>
              </div>
              <!-- 使用可复用组件显示基本信息 -->
              <NPCCompactInfo :npc="selectedNpc" />
              <div class="mt-4 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.exampleCharacters">
                <div class="font-bold">範例角色：</div>
                <ul class="ml-4 list-disc" v-if="selectedNpc.exampleCharacters.length">
                  <li v-for="ex in selectedNpc.exampleCharacters" :key="ex">{{ ex }}</li>
                </ul>
                <div v-else class="text-yellow-700 italic">無</div>
              </div>
              <div class="mt-4 text-yellow-900 text-sm sm:text-base" v-if="selectedNpc.scenarioHooks">
                <div class="font-bold">劇情鉤子：</div>
                <ul class="ml-4 list-disc" v-if="selectedNpc.scenarioHooks.length">
                  <li v-for="hook in selectedNpc.scenarioHooks" :key="hook">{{ hook }}</li>
                </ul>
                <div v-else class="text-yellow-700 italic">無</div>
              </div>
            </div>
            <div v-else class="text-yellow-700 text-center text-sm py-8">
              <p>請從左側或中間選擇NPC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
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
const displayedNpcs = ref<(any | null)[]>([null, null]) // 2x1網格的2個位置
const selectedGridIdx = ref<number | null>(null) // 當前選中的網格位置
const gridMode = ref(true) // 是否為2x2網格模式

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
  // 如果有選中的grid位置，自動添加到該位置
  if (selectedGridIdx.value !== null) {
    displayedNpcs.value[selectedGridIdx.value] = npc
    selectedGridIdx.value = null
  }
}

function selectGridNpc(idx: number) {
  selectedGridIdx.value = idx
}

function removeFromGrid(idx: number) {
  displayedNpcs.value[idx] = null
  if (selectedGridIdx.value === idx) {
    selectedGridIdx.value = null
  }
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
  // 如果有選中的grid位置，自動添加到該位置
  if (selectedGridIdx.value !== null) {
    displayedNpcs.value[selectedGridIdx.value] = npc
    selectedGridIdx.value = null
  }
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

/* 限制行數 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate {
  overflow: hidden;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
