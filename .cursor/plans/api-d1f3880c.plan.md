<!-- d1f3880c-ef5a-4d92-b12f-d0a98ec186ac f0986dbb-5ef9-4c0b-b915-437ba0d10b88 -->
# 實作段落頁面 API 整合

## 目標

在 `SingleParagraphView.vue` 中：

1. 調用 `GET /api/section/{paragraphId}` 獲取段落數據
2. 處理 JSON 跳脫字符（使用 JSON.parse）
3. 用 API 數據取代樣稿中的靜態內容
4. 將所有 `<a href>` 改為 `<router-link :to>`

## 實作步驟

### 1. 定義 TypeScript 介面

- 定義 `Section` 介面，包含：filename, section_id, section_speaker, section_content, previous_section_id, next_section_id
- 定義 `Speaker` 介面（用於講者信息）

### 2. 實作 API 調用邏輯

- 在 `onMounted` 中使用 `axios` 調用 `/api/section/{paragraphId}`
- 處理 `section_content` 的 JSON 跳脫字符（如果返回的是字符串，使用 `JSON.parse` 解析）
- 如果 `section_speaker` 存在，從 `speakers_index.json` 查找對應的講者信息（route_pathname, photoURL）

### 3. 更新模板

- 用 `v-if` 條件渲染，只在數據載入後顯示內容
- 將講者頭像和名稱連結改為 `<router-link :to="/speaker/{route_pathname}">`
- 用 `v-html` 渲染 `section_content`（已解析的 HTML）
- 將麵包屑導航連結改為 `<router-link :to="/{filename}">`
- 將 "Show context" 連結改為 `<router-link :to="{ path: '/{filename}', hash: '#s{section_id}' }">`
- 將上一段/下一段導航按鈕改為 `<router-link :to="/speech/{section_id}">`，並處理 null 情況
- 講者頭像要另外發GET Request到後端取得(網址`https://sayit-backend.audreyt.workers.dev/api/speaker_detail/{route_pathname}`)，其中route_pathname為段落內容的section_speaker資料

### 4. 更新 useHead

- 動態更新頁面標題，包含段落 ID 或演講名稱

## 檔案變更

- `/Users/bestian/Documents/GitHub/sayit/src/views/SingleParagraphView.vue` - 主要實作檔案

## 注意事項

- `section_content` 可能包含 HTML，需要使用 `v-html` 渲染
- 需要處理 `section_speaker`、`previous_section_id`、`next_section_id` 為 null 的情況
- 講者信息需要額外調用 `speakers_index.json` API 來獲取完整信息
- 所有連結都需要使用 Vue Router 的 `router-link` 組件

### To-dos

- [ ] 定義 TypeScript 介面（Section, Speaker）
- [ ] 實作 API 調用邏輯，處理 JSON 跳脫字符，獲取講者信息
- [ ] 更新模板，用動態數據取代靜態內容，將所有 <a href> 改為 <router-link :to>
- [ ] 更新 useHead 動態標題