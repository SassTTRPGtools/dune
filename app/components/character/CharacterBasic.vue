<template>
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
</template>
<script setup lang="ts">
defineProps<{ form: any }>()
</script>
