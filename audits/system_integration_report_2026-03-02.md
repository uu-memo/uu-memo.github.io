# 系統對接排查報告 (System Integration Audit Report)
**日期：2026-03-02**
**目標：排查潛在未知隱患、評估現有同步機制可靠性與提出系統優化建議**

---

## ⚠️ 1. 潛在隱患與待處理事項 (Potential Issues / To-Do)

### A. GitHub 雙向同步的「無回饋」盲點 (GAS Sync Feedback)
*   **現狀**：目前管理後台透過 `no-cors` 模式呼叫 Google Apps Script (GAS) 進行 GitHub 同步。
*   **隱患**：`no-cors` 會導致瀏覽器無法讀取 GAS 的回傳結果（如：成功、失敗、API 次數限制或過期）。
*   **影響**：即便同步失敗，前端也會彈出「同步請求已送出」的提示，可能導致管理員誤以為文章已發布成功。
*   **建議方案**：應調整 GAS 的 CORS 設定，改用 `cors` 模式並回傳正確的 JSON 狀態碼，讓前端能精準捕捉錯誤。

### B. 圖片上傳效能與 Payload 限制 (Image Payload Size)
*   **現狀**：批次圖片透過 Base64 編碼隨同 Markdown 文章內容一次性發送。
*   **隱患**：若單次上傳 5 張以上高解析度圖片（單張 > 3MB），整體 Request Payload 將超過 GAS 或 GitHub API 的接收限制。
*   **影響**：導致同步請求超時 (Timeout) 或被伺服器直接拒絕 (Request Entity Too Large)。
*   **建議方案**：引入前端圖片壓縮機制，將寬度限制在 `1920px` 並將品質降至 `80%`。

### C. Firestore 安全規則與多重 Email 的衝突
*   **現狀**：`firestore.rules` 僅允許 `jing180804@gmail.com` 寫入，但前端管理員白名單包含 `uu-memo@outlook.com`。
*   **隱患**：若使用後者登入，雖能看到後台介面，但所有儲存操作（如：更新關於我、儲存草稿模板）都會被資料庫直接阻斷，且前端僅會報出 `Permission Denied`。
*   **建議方案**：將管理員規則改為檢查一個特定的 `role: "admin"` 欄位，而非寫死 Email。

---

## ⚡ 2. 系統優化建議 (Optimization Recommendations)

### A. 導入 Toast Notification 彈窗系統
*   **現狀**：目前全站使用瀏覽器原生 `alert()` 作為互動回饋。
*   **優化**：替換為現代化的 Toast 元件（如：位於右下角的浮動通知）。
*   **價值**：可提供「非同步處理中」的 Loading 狀態（例如：同步文章中...），大幅提升使用者操作信心感。

### B. 常規化前端圖片預處理 (Client-side Processing)
*   **計劃**：在 `renderImagePreview` 階段即完成圖片規格調整與壓縮。 Canvas 壓縮最大邊（Max Edge）定在1600px
*   **價值**：降低頻寬負擔，避免因檔案過大導致的同步失敗，並確保 GitHub 空間不被原始大檔佔據。

### C. 遷移同步邏輯至 Astro Server Endpoints
*   **計劃**：利用 Astro 5 的 Server Endpoint 功能，將 GitHub 推送邏輯寫在專案內部的 `/api/sync.ts`。
*   **價值**：徹底擺脫 GAS 的維護成本與 CORS 的麻煩，並能更直接地利用 GitHub SDK (Octokit) 進行版本控制操作。

---

## ✅ 3. 無異狀事項與最新進度 (Healthy Updates)

### A. 文章 Slug 與相片命名連動
*   **狀態**：**運作良好**。已成功實作 `post-slug` 欄位與影像工坊的即時監聽機制，目前上傳相片會自動套用 `{YYMMDD}-{slug}-` 前綴。

### B. 草稿模板自訂化
*   **狀態**：**運作良好**。管理員已能直接在 UI 界面編輯 AI 指令模板，且支持 `{{q1}}` 等變數替換，系統彈性顯著提升。

### C. 靜態建置穩定性
*   **狀態**：**運作良好**。已修復所有 SSR 階段的 `document is not defined` 與模板解析錯誤，目前全站建置流程順暢。

---

**審核執行：Antigravity Engineering Agent**
**2026-03-02**
