---
title: "系統功能測試：Markdown 渲染器極限挑戰"
description: "這是一篇用於測試管理後台寫作、渲染與上傳功能的範例文章。包含站內外連結、表格、程式碼塊等複雜語法。"
pubDate: "2026-02-27"
heroImage: "/uu-memo.png"
category: ["技術文檔", "測試"]
tags: ["Markdown", "測試", "Astro"]
---

# 🚀 測試文章：深度語法驗證

這是一段簡介。我們將在此測試管理介面對各類 Markdown 標籤的支援程度，確保發布後的呈現效果符合 **UU Memo** 的 premium 設計美學。

## 📎 連結功能測試

### 1. 外部連結
測試跳轉至外部網站的能力：
*   前往 [Google 搜尋](https://www.google.com)
*   閱讀 [Astro 官方文件](https://docs.astro.build)

### 2. 站內導向 (Internal Links)
測試網站內部的路徑跳轉：
*   🏠 [返回首頁](/)
*   📚 [瀏覽所有文章](/posts)
*   👤 [前往會員中心](/user)

---

## 💻 程式碼區塊測試

測試語法高亮 (Syntax Highlighting) 的效果：

```javascript
// 測試 Firebase 留言提交邏輯
async function submitComment(data) {
  try {
    const docRef = await addDoc(collection(db, "comments"), {
      ...data,
      created_at: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
```

---

## 📊 數據表格測試

| 測試項目 | 預期結果 | 目前狀態 |
| :--- | :--- | :--- |
| UID 身份識別 | 顯示最新頭像 | ✅ 通過 |
| 巢狀回覆 | 正確縮排顯示 | ✅ 通過 |
| Markdown 上傳 | frontmatter 解析正常 | ⏳ 測試中 |

---

## 📝 綜合標籤驗證

### 列表與檢查清單
- [x] 建立精美的 UI 介面
- [x] 整合 Firebase 資料庫
- [ ] 實現 PWA 離線支援

### 引用與強調
> 「程式碼應該像情書一樣，簡潔、優雅且富有邏輯。」 —— 匿名工程師

我們可以使用 **粗體文字** 來強調重點，或是使用 *斜體文字* 增加語感，甚至使用 ~~刪除線~~ 來標註捨棄的想法。

### 數學公式建議 (若支援)
$E = mc^2$

---

## 🖼️ 圖片測試

![範例封面圖](/uu-memo.png)
*圖：UU Memo 系統圖示測試*

最後，我們放一段長文字來測試行高與字體渲染：
這裡是一些測試文字，用來觀察在不同螢幕尺寸下的換行與排列效果。UU Memo 追求的是極致的閱讀體驗，無論是在手機、平板還是桌機上，文字都應該清晰易讀，間距配置得宜，讓讀者能完全沉浸在文字與思考之中。
