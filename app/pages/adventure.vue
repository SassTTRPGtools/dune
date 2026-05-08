<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 py-10 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-yellow-900 dark:text-gray-100 text-center">冒險產生工具</h1>
      <div class="mb-12">
        <h2 class="text-xl font-bold mb-4 text-yellow-800 dark:text-gray-200">快速冒險標題</h2>
        <AdventureGenerator />
      </div>
      <div class="mb-12">
        <h2 class="text-xl font-bold mb-4 text-yellow-800 dark:text-gray-200">進階冒險要素（單表格）</h2>
        <AdventureGeneratorPro />
      </div>
      <div class="mb-12">
        <h2 class="text-xl font-bold mb-4 text-yellow-800 dark:text-gray-200">完整冒險流程</h2>
        <AdventureFlowGenerator />
      </div>
      <div class="mb-12">
        <h2 class="text-xl font-bold mb-4 text-yellow-800 dark:text-gray-200">輔助NPC產生器</h2>
        <SupportNPCGenerator />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdventureGenerator from '@/components/AdventureGenerator.vue'
import AdventureGeneratorPro from '@/components/AdventureGeneratorPro.vue'
import AdventureFlowGenerator from '@/components/AdventureFlowGenerator.vue'
import SupportNPCGenerator from '@/components/SupportNPCGenerator.vue'
</script>
