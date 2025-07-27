<template>
  <div class="flex flex-col min-h-screen">
    <header class="w-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-orange-300 shadow-lg py-4 px-8 flex items-center justify-between desert-header flex-shrink-0">
      <div class="text-2xl font-bold text-yellow-100 tracking-widest desert-title drop-shadow font-neon">DUNE 沙丘資料庫</div>
      <nav class="space-x-4">
        <NuxtLink to="/" class="text-yellow-100 hover:text-orange-900 font-semibold transition">首頁</NuxtLink>
        <NuxtLink to="/character" class="text-yellow-100 hover:text-orange-900 font-semibold transition">角色表</NuxtLink>
        <NuxtLink to="/talent" class="text-yellow-100 hover:text-orange-900 font-semibold transition">天賦查詢</NuxtLink>
        <NuxtLink to="/archetype" class="text-yellow-100 hover:text-orange-900 font-semibold transition">原型查詢</NuxtLink>
        <NuxtLink to="/npc" class="text-yellow-100 hover:text-orange-900 font-semibold transition">盟友與對手</NuxtLink>
        <NuxtLink to="/adventure" class="text-yellow-100 hover:text-orange-900 font-semibold transition">冒險產生工具</NuxtLink>
      </nav>
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.desert-header {
  border-bottom: 3px solid #eab308;
  box-shadow: 0 4px 16px #eab30833;
  background-image: linear-gradient(90deg, #a16207 0%, #fde68a 60%, #fdba74 100%);
}
.desert-title {
  font-family: 'Neon Club Music', 'Cinzel', serif;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 8px #eab30899, 0 1px 0 #fff;
}
.font-neon {
  font-family: 'Neon Club Music', 'Cinzel', serif !important;
}
</style>
