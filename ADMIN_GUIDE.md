# UU MEMO 管理員設置指南 (Admin Setup Guide)

本文檔說明如何配置後台所需的 **Google Apps Script (GAS)** 與 **GitHub API** 權限，以實現文章與圖片的自動化上傳。

## 1. GitHub 準備工作

### 1.1 產生 Personal Access Token (PAT)
1. 前往 GitHub [Fine-grained personal access tokens](https://github.com/settings/tokens?type=beta)。
2. 點擊 **Generate new token**。
3. **Repository access**：選擇 `Only select repositories` -> `uu-memo.github.io`。
4. **Permissions**：
   - **Contents**: `Read and write` (用於提交新檔案)。
5. 點擊 **Generate token** 並複製保存，這就是您的 `GITHUB_PAT`。

---

## 2. Google Apps Script (GAS) 部署

### 2.1 建立腳本
1. 前往 [Google Apps Script 官網](https://script.google.com/home)。
2. 點擊 **新建專案 (New Project)**。
3. 刪除預設代碼，並貼入專案根目錄下的 `gh-bridge.gs` 內容。

### 2.2 配置環境變數
在 GAS 編輯器左側導覽列，點擊 **專案設定 (Project Settings)** (齒輪圖示)：
1. 捲動到 **指令碼屬性 (Script Properties)**。
2. 點擊 **新增指令碼屬性 (Add script property)** 並設定以下屬性：

| 屬性名稱 (Key) | 說明 | 內容範例 |
| :--- | :--- | :--- |
| **`GITHUB_PAT`** | GitHub 個人存取權杖 | `github_pat_...` (步驟 1.1 生成) |
| **`GITHUB_OWNER`** | GitHub 帳號名稱 | `uu-memo` |
| **`GITHUB_REPO`** | 專案儲存庫名稱 | `uu-memo.github.io` |
| **`GAS_SECRET_TOKEN`** | **重要！** 前後端通訊密鑰 | 須與 `.env` 的 `PUBLIC_GAS_SECRET` 一致 |
| **`TARGET_EMAIL`** | 聯絡表單轉寄目標郵箱 | `your-email@example.com` |

3. 點擊 **儲存指令碼屬性 (Save script properties)**。

### 2.3 部署為 Web 應用程式
1. 點擊右上方 **部署 (Deploy)** > **新增部署 (New deployment)**。
2. 類型選擇 **網頁應用程式 (Web App)**。
3. **誰可以存取 (Who has access)**：選擇 **任何人 (Anyone)** (我們會在程式碼內額外檢查來源或金鑰)。
4. 部署後，複製產生的 **Web App URL**，將其存入後台的設定中。

### 2.4 處理權限授權錯誤 (重要)
如果您在後台控制台看到 `你沒有呼叫「UrlFetchApp.fetch」的權限`：
1. 開啟 GAS 編輯器。
2. 在上方工具列選單中選擇 `doPost` 函式。
3. 點擊 **「執行 (Run)」**。
4. 此時會彈出 **「需要授權 (Authorization Required)」** 視窗。
5. 點擊 **查看權限 (Review Permissions)** -> 選擇您的 Google 帳戶。
6. (如果有警告畫面) 點擊 **進階 (Advanced)** -> **前往 bridge (不安全)**。
7. 點擊 **允許 (Allow)**。
8. 再次點擊「部署」確認版本為最新。

---

## 3. Firebase 部署驗證

本專案鎖定的正式 Firebase 專案為：`uu-memo`。

- **線上網址**：`https://uu-memo.web.app` 或 `https://uu-memo.github.io`
- **確認方式**：檢查專案根目錄下的 `.firebaserc` 檔案，`default` 應為 `uu-memo`。
