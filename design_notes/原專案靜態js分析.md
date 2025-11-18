# 原專案靜態 JavaScript 檔案分析

## 檔案位置：`public/static/speeches/js/`

### 1. **jquery.js**
- **用途**：jQuery 函式庫核心檔案（版本 1.10.2）
- **說明**：提供 DOM 操作、事件處理、AJAX 等基礎功能，為其他 JavaScript 檔案提供依賴

### 2. **foundation/foundation.js**
- **用途**：Foundation 框架核心檔案（版本 4.3.1）
- **說明**：
  - 提供 Foundation 框架的初始化與管理機制
  - 包含 polyfill（matchMedia、Array.filter、Function.bind 等）
  - 提供共用的工具方法（throttle、scrollTo、data_options 等）
  - 支援 jQuery 或 Zepto

### 3. **foundation/foundation.dropdown.js**
- **用途**：Foundation 框架的 Dropdown 元件（版本 4.3.0）
- **說明**：
  - 實作下拉選單功能
  - 支援點擊與滑鼠懸停兩種觸發方式
  - 處理下拉選單的開啟、關閉、定位與響應式調整

### 4. **select2-override.js**
- **用途**：覆蓋 django-select2 的 URL 參數取得函數
- **說明**：
  - 在刪除頁面（`/[數字]/delete`）時，自動將 `object_id` 加入 Select2 的 AJAX 請求參數
  - 確保在刪除頁面使用 Select2 時能正確傳遞物件 ID

### 5. **speeches.js**
- **用途**：專案主要功能 JavaScript
- **說明**：
  - **日期選擇器**：初始化 fdatepicker，並處理開始/結束日期的連動
  - **AJAX 檔案上傳**：處理音訊檔案上傳，包含進度顯示與錯誤處理
  - **鍵盤導航**：使用 J/K 鍵在上一筆/下一筆記錄間切換
  - **表單區塊摺疊**：處理不重要表單區塊的顯示/隱藏
  - **演講者控制**：在管理頁面中控制新演講者選項的顯示

