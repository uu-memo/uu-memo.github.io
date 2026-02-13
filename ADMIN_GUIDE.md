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
2. 新增以下屬性：
   - `GITHUB_PAT`: 您剛生成的 GitHub Token。
   - `GITHUB_OWNER`: `uu-memo` (或您的用戶名)。
   - `GITHUB_REPO`: `uu-memo.github.io`。

### 2.3 部署為 Web 應用程式
1. 點擊右上方 **部署 (Deploy)** > **新增部署 (New deployment)**。
2. 類型選擇 **網頁應用程式 (Web App)**。
3. **誰可以存取 (Who has access)**：選擇 **任何人 (Anyone)** (我們會在程式碼內額外檢查來源或金鑰)。
4. 部署後，複製產生的 **Web App URL**，將其存入後台的設定中。

---

## 3. 圖片處理邏輯 (自動執行)

系統會在瀏覽器端執行以下預處理，再傳送至 GAS：

- **橫式 (Landscape)**:
  - 條件：寬 > 高
  - 動作：智慧中心裁切 + 壓縮
  - 輸出：`1200 x 630`
- **直式 (Portrait)**:
  - 條件：高 > 寬
  - 動作：等比縮放
  - 輸出：`高度固定 1200`
- **正方形 (Square)**:
  - 條件：寬 = 高
  - 動作：等比縮放
  - 輸出：`1200 x 1200`

---

**中文說明：此文件定義了管理員後台的連線邏輯，包含 GitHub Token 的申請流程，以及 GAS 如何作為中間人處理圖片備份與轉傳。**
