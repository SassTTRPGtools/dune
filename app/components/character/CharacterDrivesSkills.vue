<template>
  <div class="flex flex-col gap-2 flex-1">
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
              class="flex-1 min-w-80 border-b-2 border-yellow-400 bg-transparent focus:outline-none py-1 text-yellow-900 ml-2" />
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
              class="flex-1 min-w-0 border-b-2 border-yellow-400 bg-transparent focus:outline-none py-1 text-yellow-900 ml-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ form: any, driveList: string[], skillList: string[] }>()
</script>
