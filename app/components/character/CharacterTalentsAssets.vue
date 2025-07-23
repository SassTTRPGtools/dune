<template>
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
</template>
<script setup lang="ts">
defineProps<{ form: any }>()
</script>
