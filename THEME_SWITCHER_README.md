# 配色主題切換功能說明

## 功能概述
已為你的沙丘資料庫網站添加了**暗色/亮色主題切換功能**，玩家可以根據個人偏好切換配色方案。

## 如何使用

### 玩家操作
1. 進入網站後，在頂部導航欄右側會看到一個**主題切換按鈕**
   - 🌙 = 切換到暗色主題
   - ☀️ = 切換到亮色主題

2. 點擊按鈕即可切換主題，主題選擇會自動保存到本地瀏覽器

3. 下次訪問時，會自動使用上次選擇的主題

## 主題配置

### 亮色主題（預設）
- 背景：明亮的黃色和橙色漸層（沙漠風格）
- 文字：深棕色和黃色
- 卡片：半透明白色背景

### 暗色主題
- 背景：深灰色漸層（#1f2937 到 #374151）
- 文字：淺灰色和白色
- 卡片：深灰色背景 (#1f2937)

## 技術實現

### 已建立的文件

1. **composables/useTheme.ts**
   - 管理主題狀態的 composable
   - 處理 localStorage 保存和載入

2. **plugins/theme.client.ts**
   - 應用啟動時初始化主題
   - 確保首次載入時應用正確的主題

3. **tailwind.config.ts**
   - 配置 Tailwind CSS 的 darkMode
   - 定義自訂顏色配置

4. **app/assets/css/tailwind.css**
   - 全局暗色主題樣式
   - 提供通用的組件樣式 class

### 更新的文件

已為以下文件添加了 `dark:` 前綴的 Tailwind 類：
- ✅ `app/layouts/default.vue` - 主導航欄
- ✅ `app/pages/index.vue` - 首頁
- ✅ `app/pages/character.vue` - 角色表
- ✅ `app/pages/talent.vue` - 天賦查詢
- ✅ `app/pages/archetype.vue` - 原型查詢
- ✅ `app/pages/npc.vue` - 盟友與對手
- ✅ `app/pages/adventure.vue` - 冒險產生工具
- ✅ `app/components/AdventureGenerator.vue`

## 自訂主題

如需進一步調整暗色主題的顏色，可編輯：

1. **tailwind.config.ts** - 定義色彩配置
2. **app/assets/css/tailwind.css** - 定義組件樣式
3. 各組件的 `dark:` 類名 - 調整特定組件的暗色樣式

## 瀏覽器支援

主題切換功能支援所有現代瀏覽器，包括：
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ 其他基於 Chromium 的瀏覽器

## 注意事項

- 主題選擇保存在 `localStorage` 中，具有 `dune-theme` 的 key
- 如果玩家未做任何選擇，系統會檢測系統偏好設置（OS 級別的深色模式設定）
- 主題資訊不會上傳到伺服器，完全本地化保存
