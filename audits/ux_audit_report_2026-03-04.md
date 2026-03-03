# UU-MEMO 專案診斷與優化建議報告 (Project Audit & Roadmap)

**角色：** 高階產品技術顧問 & 資深 UX 設計專家
**日期：** 2026-03-04
**專案名稱：** UU-MEMO 備忘錄系統

---

## 1. 待解決問題 (Pending Issues)

| 問題項目 | 描述 | 嚴重程度 |
| :--- | :--- | :---: |
| **多帳號管理權限衝突** | 目前 Firestore Security Rules 仍存在硬編碼 Email (UID) 的情境，若切換管理員帳號 (`uu-memo@outlook.com` vs `jing180804@gmail.com`) 可能導致部分配置無法讀取。 | **高** |
| **GAS Bridge 無狀態反饋** | 由於 `no-cors` 限制，前端在執行 `upload_file` 時無法獲取 GitHub 的成功/失敗回應，僅能「盲目信任」請求已送出。 | **高** |
| **Token 過期機制缺乏提醒** | GitHub PAT (Personal Access Token) 若過期，系統目前無主動通知機制，使用者僅會在發布文章失敗時才察覺。 | **中** |
| **內容管理分頁邊界問題** | 當文章總數正好是分頁倍數或刪除文章後，分頁索引的 UI 更新邏輯仍需進一步驗證魯棒性。 | **低** |

---

## 2. 系統隱患 (Potential Risks)

*   **GitHub API 速率限制 (Rate Limiting)**：
    *   目前高度依賴 Octokit 進行客戶端同步。若網站流量增加或管理頻率過高，可能觸發 GitHub API 的速率限制（特別是未授權或多人同時管理時）。
*   **GAS 執行時間限制 (Execution Timeout)**：
    *   Google Apps Script 每次執行有 6 分鐘限制。若單次 Commit 批次上傳大量未經過適度壓縮的高解析度圖檔，可能在處理 Base64 編碼時超時。
*   **資安曝光風險 (Frontend Secrets)**：
    *   雖然 Token 存儲於 Firestore 加密保管庫，但 API 呼叫均發生在前端。具備開發者工具操作能力的使用者仍能在 Runtime 期間監聽 Payload 提取 Token。

---

## 3. 可優化建議 (General Optimization)

### 技術層面 (Technical)
*   **引入 Astro Middleware**：將目前前端解析 Firebase Auth 的邏輯部分遷移至 Middleware，實現真正的 SSR 權限驗證，減少首屏「未授權」閃爍。
*   **實作 Webhook 閉環**：配置 GitHub Webhook，當 Actions 部署成功後回傳信號，讓 Admin Dashboard 能顯示「正式站已更新成功」的真實狀態標籤。
*   **影像壓縮自動化升級**：目前依賴客戶端 Canvas 壓縮，建議可接入微型 Image API（或自建 Cloudflare Worker）進行更專業的 WebP 轉檔，進一步降低 GitHub 儲存庫容量。

### 業務邏輯 (Business)
*   **草稿自動暫存 (Auto-save)**：實作 `localStorage` 每分鐘自動備份編輯器內容，防止瀏覽器當機或意外重新整理導致的文字遺失。

---

## 4. UI 優化建議 (UI Improvements)

*   **視覺語彙統一 (Design Language)**：
    *   **毛玻璃特效 (Glassmorphism)**：目前背景較為純淨，建議在側邊欄與 Dashboard 卡片引入微弱的 `backdrop-filter: blur()`，提升 Premium 數位質感。
    *   **排版階層 (Typography)**：目前使用的字體偏向系統預設。建議全站引入 **Outfit** (標題) 與 **Inter** (內文) 的組合，增強視覺層級感。
*   **資訊重心優化**：
    *   「發布按鈕」目前的視覺重心與「草稿生成」按鈕過於接近。建議透過漸層色 (Gradient) 或微縮放動畫 (Scale interaction) 將 **FINAL PUSH** 定位為最明顯的 Primary Action。

---

## 5. UX 優化建議 (UX Enhancements)

### 可用性分析 (Heuristic Evaluation)
*   **反饋循環 (Feedback Loop)**：
    *   **現狀**：點擊發布後，只有 Toast 提示。
    *   **建議**：應在發布期間於按鈕旁顯示動態的「進度百分比」或至少一個具備「連動感」的 Loading 狀態。
*   **載入感受 (Perceived Performance)**：
    *   **骨架螢幕 (Skeleton Screen)**：在「內容管理」載入 GitHub 清單的 1-2 秒內，不應顯示空白，而應顯示灰色的骨架屏以降低使用者的焦慮感。

### 使用者路徑 (User Journey)
*   **整合預覽 (Side-by-side Preview)**：目前的編輯與預覽分屬不同狀態（或需滾動），建議在寬螢幕下實作左右雙欄即時對照模式，減少切換頻率。
*   **一鍵錯誤導正 (Self-healing)**：若偵測到圖片檔名衝突，系統應主動建議「自動重命名」而非僅跳出錯誤提示。

---

## 優先級建議清單 (Priority List)

1.  **High (Immediate)**：修復 GAS Bridge 回傳狀態問題，建立基礎的同步成功/失敗閉環。
2.  **High (Security)**：重構 Firestore Rules，確保管理員帳號切換的權限邏輯平滑。
3.  **Medium (UX)**：於內容管理分頁實作 Skeleton Screen，優化載入感受。
4.  **Medium (UI)**：細化全站字體細節與按鈕動態反饋。
5.  **Low (Feature)**：實作編輯器本地暫存功能 (Local Drafts)。

---

**診斷結論：**
UU-MEMO 是一個架構極其明晰、功能針對性極強的個人備忘錄系統。目前的技術債主要集中在「跨平台通訊的可靠性 (Communication Reliability)」。一旦解決了 GitHub 同步的狀態回饋問題，這套系統將具備極高的商用參考價值與極限的操作流暢度。
