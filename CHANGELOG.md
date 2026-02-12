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

#### Affected files
- `package.json` (Added `firebase` dependency)
- `src/lib/firebase.js` (New file)
- `src/pages/user/index.astro` (New file)

#### Side effects
- Admin users will be redirected to `/admin`, which currently returns 404 until created.

**中文說明：實作 Firebase Google 登入功能，建立包含書籤、留言與個人資料管理的使用者儀表板 (`/user`)，並針對特定信箱設置管理員後台自動跳轉邏輯。**

### [2026-02-13.2] - User Dashboard UI Overhaul & Fixes

#### Summary of changes
- Rebuilt the User Dashboard with a modern, responsive sidebar layout.
- Fixed mobile navigation issues and click-through bugs in the Header.
- Replaced "Logout account" text with a functional icon for a cleaner UI.
- Implemented smooth transitions and a loading overlay to prevent layout flickering on refresh.

#### Technical details
- Updated `src/components/Header.astro` with higher `z-index` and expanded click targets for mobile user icons.
- Redesigned `src/pages/user/index.astro` to use a `flex-col lg:flex-row` layout, placing navigation on the left for desktop users.
- Added a full-screen loading overlay in `src/pages/user/index.astro` that fades out once auth state is confirmed.
- Replaced the logout button with a `material-symbols-outlined` icon wrapped in a styled button.
- Integrated `opacity` and `translate` transitions to all major sections for a premium feel.

#### Affected files
- `src/components/Header.astro`
- `src/pages/user/index.astro`

#### Side effects
- None anticipated.

**中文說明：重構使用者頁面為現代化側邊欄佈局，提升電腦版大感官；修復手機版登入按鈕點擊失效與重新整理時畫面閃爍問題，並將登出文字改為簡潔圖示。**

### [2026-02-13.3] - Dashboard Layout Refinement

#### Summary of changes
- Standardized the dimensions and positioning of content cards to prevent layout shifts.
- Consolidated user profile, navigation, and logout into a unified sidebar structure.
- Moved the logout button to the bottom of the navigation menu with a distinct icon+text style.
- Centered user profile information within its container for better visual balance.

#### Technical details
- Refactored `src/pages/user/index.astro` to use a `flex-col lg:flex-row` main container with a fixed-width (`lg:w-72`) sidebar.
- Set `min-h-[500px]` and consistent padding for all tab content containers to ensure stability.
- Implemented `mt-auto` on the logout button to pin it to the bottom of the sidebar flex container.
- Added a confirmation dialog before logout to prevent accidental clicks.

### [2026-02-13.4] - Brand Consistency Fix

#### Summary of changes
- Removed the red hover effect from the logout button to strictly adhere to the project's color palette.
- Replaced non-standard colors with `uu-main` and `uu-sub/10`.

#### Technical details
- Updated `src/pages/user/index.astro` to change the logout button's `hover` classes from red variants to `hover:text-uu-main`, `hover:bg-uu-sub/10`, and `hover:border-uu-sub/30`.

#### Affected files
- `src/pages/user/index.astro`

#### Side effects
- None anticipated.

**中文說明：移除登出按鈕的紅色 Hover 效果，確保專案色調完全符合既有定義（uu-main/uu-sub）。**

#### Affected files
- `src/pages/user/index.astro`

#### Side effects
- None anticipated.

**中文說明：優化儀表板佈局，固定內容卡片尺寸以防止跳動；將個人資料、導航與登出功能整合至統一側邊欄（手機版為垂直堆疊），並將使用者資訊置中對齊。**

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




