# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### [2026-02-12] - Responsive UX Improvements

#### Summary of changes
- Implemented a responsive mobile navigation menu (Hamburger menu).
- Refactored the comments section for better mobile layout.
- Optimized touch targets for interactive elements on mobile devices.

#### Technical details
- Added a state-driven hamburger menu in `Header.astro` with a full-screen overlay for mobile users.
- Updated `[...slug].astro` to use vertical stacking for comment inputs on small screens.
- Enhanced `global.css` with media queries to increase hit areas for `.btn-text` secondary buttons.

#### Affected files
- `src/components/Header.astro`
- `src/pages/posts/[...slug].astro`
- `src/styles/global.css`

#### Side effects
- None anticipated.

**中文說明：實作行動版響應式導航選單與留言區佈局優化，同時擴大了手機上的連結點擊範圍。**

### [2026-02-12.2] - Feature Expansion & Navigation Refactor

#### Summary of changes
- Refactored site navigation and menu items.
- Implemented "All Posts" archive with dynamic category filtering and tags.
- Added Tags, Bookmarks, Share, and Copy Link features to article pages.
- Optimized About page with author avatar and layout.
- Fixed mobile menu visual jumps and overlay transparency.

#### Technical details
- Integrated dynamic category loader in `posts/index.astro` for client-side filtering.
- Updated `config.ts` schema to support `tags` array across posts.
- Implemented scroll-lock with padding compensation in `Header.astro` to prevent layout shift on mobile menu toggle.
- Enforced site-wide line-height and primary color mapping for interactive states in `global.css`.

#### Affected files
- `src/components/Header.astro`
- `src/pages/posts/index.astro`
- `src/pages/posts/[...slug].astro`
- `src/content/config.ts`
- `src/styles/global.css`
- `src/content/pages/about.md`
- `src/pages/bookmarks/index.astro`

#### Side effects
- None anticipated.

**中文說明：重構導航選單，新增「所有文章」頁面（含分類篩選與標籤），並在文章頁面實作書籤、分享與標籤功能。同時修復了手機選單跳動問題，並優化全站閱讀行距。**

### [2026-02-12.3] - Schema Update & Article Navigation

#### Summary of changes
- Updated content schema to support multi-category arrays.
- Implemented Previous/Next article navigation on post pages.
- Expanded comment input area with a multi-line textarea.
- Fixed mobile viewport scaling and horizontal overflow issues.
- Optimized navigation card titles for single-line display.

#### Technical details
- Modified `src/content/config.ts` to support category arrays and `publishDate` alias via Zod transformations.
- Updated `src/pages/posts/[...slug].astro` to fetch adjacent posts during static path generation.
- Corrected viewport meta settings in `src/layouts/Layout.astro` to prevent unauthorized scaling on mobile.
- Enforced `overflow-x: hidden` and `width: 100%` on body to stabilize layout.

#### Affected files
- `src/content/config.ts`
- `src/pages/posts/[...slug].astro`
- `src/layouts/Layout.astro`
- `src/styles/global.css`
- `src/pages/posts/index.astro`
- `src/pages/category/[category].astro`

#### Side effects
- None anticipated.

**中文說明：升級 YAML 前置資料格式（支援多分類陣列），實作文章底部「上一篇/下一篇」導航，加高留言輸入框，並解決手機視窗寬度偵測與跑版問題。**

### [2026-02-12.4] - User Authentication & Dashboard

#### Summary of changes
- Implemented Google Sign-In via Firebase Authentication.
- Created User Dashboard at `/user` with tabs for Bookmarks, Comments, and Profile management.
- Added Admin redirection logic for specific email accounts.

#### Technical details
- Integrated `firebase` SDK and configured initialization in `src/lib/firebase.js`.
- Implemented Google Auth Provider with popup flow in `src/pages/user/index.astro`.
- Added client-side state management for user session and tab navigation (Vanilla JS).
- Enforced strict project color tokens (`uu-base`, `uu-main`, `uu-sub`) for the new interface.
- Configured automatic redirect to `/admin` (future route) for authorized admin email `jing180804@gmail.com`.
- Connected Header user icons to the `/user` dashboard for both desktop and mobile views.

#### Affected files
- `package.json` (Added `firebase` dependency)
- `src/lib/firebase.js` (New file)
- `src/pages/user/index.astro` (New file)

#### Side effects
- Admin users will be redirected to `/admin`, which currently returns 404 until created.

**中文說明：實作 Firebase Google 登入功能，建立包含書籤、留言與個人資料管理的使用者儀表板 (`/user`)，並針對特定信箱設置管理員後台自動跳轉邏輯。**

### [2026-02-13.1] - Branding & Visual Assets Update

#### Summary of changes
- Updated the website favicon.
- Replaced placeholder author avatar with custom profile image.

#### Technical details
- Copied `uu-memo_favorites.ico` to `public/favicon.ico`.
- Copied `uu-memo.png` to `public/uu-memo.png`.
- Updated `src/layouts/Layout.astro` to include the favicon link tag.
- Updated `src/pages/index.astro` to replace the Material icon with an `<img>` tag for the author bio section.

#### Affected files
- `src/layouts/Layout.astro`
- `src/pages/index.astro`
- `public/favicon.ico`
- `public/uu-memo.png`

#### Side effects
- None anticipated.

**中文說明：更新網站 Favicon 圖標，並將首頁作者介紹區的頭像替換為真實圖片文件。**

### [2026-02-13.9] - Final Dashboard UI Stabilization & Language Alignment

#### Summary of changes
- Achieved absolute pixel-perfect stability for the dashboard by implementing a "Width Chain" synchronization.
- Resolved the root cause of layout jumping: the dashboard container was shrinking to fit content because parent elements lacked explicit widths.
- Reverted sidebar and content labels to Traditional Chinese per user request.

#### Technical details
- Enforced `width: 100%` and `self-stretch` on the `<main>` element to ensure it fills the `body` (which uses `flex-col`).
- Applied `width: 100%` to the `#user-dashboard` grid container, allowing the `minmax(0, 1fr)` calculation to remain static regardless of content.
- Standardized internal padding to a fixed `p-10` (40px) across all tabs to eliminate padding-related jitter.
- Updated sidebar labels:
    - "MY BOOKMARKS" → "我的書籤"
    - "MY COMMENTS" → "留言管理"
    - "SETTINGS" → "名稱設定"
    - "LOGOUT" → "登出帳號"
- Synchronized "Profile" section header label to "名稱設定".

#### Affected files
- `src/pages/user/index.astro`

#### Side effects
- None anticipated.

**中文說明：最終儀表板穩定化處理。透過建立 body → main → dashboard 的完整 100% 寬度鍊，徹底解決因為容器寬度隨內容縮放而產生的跳動。同步將介面文字語系改回繁體中文，並將設定頁面標題統一為「名稱設定」。**

### [2026-02-13.10] - Site-wide Container Width Stabilization

#### Summary of changes
- Synchronized the physical width of all content-heavy pages (About, Contact, Terms, and Post Details).
- Resolved an issue where pages with short content (e.g., Contact) would shrink horizontally due to parent Flexbox constraints.
- Ensured a consistent reading area of `max-w-4xl` (896px) across all single-column pages.

#### Technical details
- Applied `w-full` and `self-stretch` to the `<main>` element in `src/pages/[slug].astro` and `src/pages/posts/[...slug].astro`.
- This ensures that even when content length is minimal, the container fills its parent and respects the `max-w-4xl` limit, preventing unpredictable shrinking.

#### Affected files
- `src/pages/[slug].astro`
- `src/pages/posts/[...slug].astro`

#### Side effects
- None anticipated.

**中文說明：全站內容頁面寬度穩定化。透過在主容器加上 `w-full` 與 `self-stretch`，解決了內容較短的頁面（如：「與我聯繫」）會因此縮窄的問題，確保關於我、聯繫、條款與文章頁面的視覺寬度始終保持一致。**

### [2026-02-13.11] - Admin Dashboard Premium Overhaul & Firestore Integration

#### Summary of changes
- Rebuilt the Admin Dashboard interface to strictly follow the high-quality design language of the User Dashboard.
- Implemented an advanced Markdown content creation workflow with drag-and-drop support.
- Upgraded the "Image Workshop" with intelligent orientation-aware previews.
- Integrated Firestore-backed system configuration for site-wide settings (e.g., Donation/Support).

#### Technical details
- Replaced the initial admin layout with the standardized `dashboard-layout` Grid (sidebar + content mirroring `/user`).
- Implemented a drag-and-drop zone and file input for `.md` files; added automatic slug generation based on filename.
- Developed a dynamic "Image Workshop" previewer that detects and renders specific aspect ratios (Landscape 16:9, Portrait 3:4, Square 1:1) instead of fixed squares.
- Expanded the Markdown textarea to `min-h-[500px]` with premium styling and shadow effects.
- Integrated `firebase/firestore` to manage the `site_config/donation_settings` document.
- Created a custom, high-fidelity toggle switch (Apple-style) for system settings, bypassing native browser checkboxes.
- Updated `src/lib/firebase.js` to export the `db` (Firestore) instance.

#### Affected files
- `src/pages/admin/index.astro`
- `src/lib/firebase.js`
- `CHANGELOG.md`

#### Side effects
- None anticipated.

**中文說明：管理員後台介面全面進化。完全沿用 User Dashboard 的佈局邏輯（圓角容器、側邊欄分頁），並新增 .md 拖移上傳、自動生成 Slug、具備比例感知（Aspect Ratio Aware）的影像預覽功能。同時整合 Firestore 實作「全站設定」模組，包含自定義 Apple 風格開關與打賞資訊管理。**


### [2026-02-13.15] - Advanced Comment Management & UI Refinement

#### Summary of changes
- Enhanced the Comment Management module with real-time Firestore integration, filtering, and a nested reply system.
- Refined UI/UX consistency: unified button styles, fixed overlapping elements, and ensured strict color compliance.
- Implemented "Latest" vs "Archive" workflow for better moderation.
- Translated the admin dashboard interface to Traditional Chinese.

#### Technical details
- Developed a dynamic filtering system within `onSnapshot`:
    - **Latest**: Filtered by `!is_read && !is_hidden && !is_deleted`.
    - **All**: Public active comments `!is_hidden && !is_deleted`.
    - **Hidden/Deleted**: Strictly category-specific views.
- Implemented a "Mark as Read" backend toggle to manage the administrative "inbox" workflow.
- Built a nested reply viewer that groups management responses under original author comments using a `parent_id` architecture.
- Integrated "UU (站長)" identity with the project's brand asset (`uu-memo.png`) for replies.
- Added permanent deletion logic for the "Trash" category to purge documents from Firestore.
- Fixed UI regressions in the reply component where timestamps and actions overlapped.
- Updated the sidebar to replace the "Back" link with a functional Firebase Auth `signOut` button.
- Created `firestore.rules` to document and backup database security policies.

#### Affected files
- `src/pages/admin/index.astro`
- `firestore.rules`
- `CHANGELOG.md`

#### Side effects
- None anticipated.

**中文說明：留言管理模組深度開發。實作實時 Firestore 篩選邏輯（分流最新、所有、隱藏、回收），支援「UU (站長)」嵌套回覆功能與已讀標記 Inbox 系統。統一全站按鈕樣式並完善回收桶永久刪除機制。同時完成介面全面中文化、備份資料庫安全規則，並優化側邊欄登出功能。**
