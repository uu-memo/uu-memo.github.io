# 網頁原生組件汰換診斷報告 (Native Components Migration Audit)

**角色：** 高階前端架構師 & UI/UX 工程師
**日期：** 2026-03-04
**專案名稱：** UU-MEMO 備忘錄系統

---

## 第一部分：原生組件分布清單 (Discovery List)

經由對 `src/pages/admin/index.astro` 及核心邏輯的掃描，目前系統中仍大量依賴瀏覽器原生（Native）組件處理關鍵互動。

### 1. 瀏覽器對話框 (Native Dialogs)
| 組件類型 | 出現位置 (Line) | 用途 |
| :--- | :--- | :--- |
| **`window.confirm()`** | 871, 1016, 1460, 1515, 1521, 1611, 1685, 1714 | 刪除留言、同步 GitHub、儲存模板、刪除測試資料等二次確認。 |
| **`window.alert()`** | 1755, 1757, 1767, 1809 | 登入失敗提示、測試資料建置成功反饋、權限不足警告。 |

### 2. 表單控制項 (Form Controls)
| 組件類型 | 出現位置 (Line) | 用途 |
| :--- | :--- | :--- |
| **`<select>`** | 190 | 文章權限設定 (Public / Private)。 |
| **`<input type="file">`** | 229, 275 | Markdown 檔案上傳預覽、影像工坊批次圖片上傳。 |

---

## 第二部分：UX 痛點分析 (UX Pain Points)

### 1. 阻斷性 (Blocking Nature)
`window.confirm` 與 `alert` 會掛起（Freeze）瀏覽器的所有 Javascript 執行緒。在進行 GitHub 同步等異步操作時，若彈窗出現，背景的動畫、定時器甚至 Socket 連線皆會中斷，造成明顯的效能斷裂感。

### 2. 視覺斷點 (Visual Conflict)
UU-MEMO 擁有一套精緻的灰黑美學設計（UU-Main / UU-Sub），然而原生對話框的外觀完全由作業系統決定（如 macOS 的系統彈窗 vs Windows 的方框），這會讓使用者感覺從「專屬品牌空間」被抽離，降低了產品的專業信任感。

### 3. 無法美化與客製 (Lack of Styling)
原生對話框無法更改按鈕文字、顏色，也無法加入品牌圖示（如 UU 的 Logo）或動畫，導致反饋流於生硬單調。

---

## 第三部分：組件轉換技術提案 (Technical Migration Proposal)

### 1. 對話框：從同步到異步 (Promise-based Modal)

建議建立一個單一實例（Singleton）的 `CustomModal` 組件，透過 Promise 封裝，實現無縫重構。

#### 【Before】原生同步寫法：
```javascript
if (confirm("確定要同步嗎？")) {
    handleSync();
}
```

#### 【After】自定義異步寫法：
```javascript
// 邏輯層呼叫
const confirmed = await MyModal.confirm({
    title: "GitHub 同步確認",
    content: "確定要將變更同步至遠端倉庫嗎？",
    confirmText: "開始同步",
    cancelText: "取消"
});

if (confirmed) {
    handleSync();
}
```

### 2. 樣式覆蓋策略 (Styling Strategy)
- **實作方式**：在 `index.astro` 的 `<style>` 或全局 CSS 中定義一個固定在 `fixed inset-0` 的底層 (Backdrop)，並使用 `opacity-0` 配合 `z-50` 進行過渡動畫。
- **變數連動**：背景使用 `bg-uu-dark/80`，卡片使用 `bg-white` 配合 `rounded-3xl`，與系統按鈕組件 `PrimaryButton` 複用同一套樣式。

---

## 第四部分：一致性優化建議 (Consistency Suggestions)

### 1. UI 規格建議
*   **圓角 (Border Radius)**：統一使用 `rounded-2xl` (1rem)，模擬 macOS 柔和感。
*   **陰影 (Shadow)**：使用 `shadow-2xl shadow-uu-main/20`，增加層級深度。
*   **動畫 (Animation)**：
    *   **Backdrop**：`fade-in` (duration-200)。
    *   **Modal Body**：`scale-in` (從 0.95 放大至 1) 配合 `duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)` 實現 Q 彈的反饋感。

### 2. 替代原生 `<select>` 的 Dropdown
建議仿照目前 Visibility 設定的 UI，但將原生 `select` 設為完全透明且 `absolute` 置於中央，覆蓋一組自定義的 Div 視圖，這樣可以保留原生的無障礙（Accessibility）與表單行為，同時完全控制視覺外觀。

---

**優先級建議：**
1. **P0**：將所有 `confirm()` 替換為 `CustomModal.confirm`（提升 GitHub 同步流程的流暢度）。
2. **P1**：將 `alert()` 全數替換為已實作的 `showToast()` 系統或 `CustomModal.info`。
3. **P2**：美化影像上傳的 `<input type="file">` 觸發區域，增加上傳進度條。
