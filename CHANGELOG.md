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


### [2026-02-13.16] - UI Standardization & Componentization

#### Summary of changes
- Created a standardized `PrimaryButton` component to ensure visual consistency for all primary actions across the site.
- Integrated `PrimaryButton` into Admin and User dashboards, replacing legacy hard-coded button styles.
- Implemented the "Author Settings" functional module (profile & bio management) in the Admin dashboard.
- Resolved a critical "500 Internal Server Error" caused by code squashing during automated edits.
- Implemented real-time nickname update logic in the User Dashboard.

#### Technical details
- Developed `src/components/PrimaryButton.astro`:
    - Encapsulates: `bg-uu-main`, `rounded-full`, `tracking-[0.3em]`, `uppercase`, and animated loaders.
    - Props-driven: Supports `id`, `text`, `icon`, `showLoader`, and custom IDs for dynamic text/loader manipulation.
- Refactored `src/pages/admin/index.astro`:
    - Integrated `PrimaryButton` for "SYNC TO GITHUB", "SAVE SETTINGS" (Author), and "SAVE CONFIGURATION" (System).
    - Re-implemented the "Author Settings" tab with Markdown preview/editor and Firestore sync (`site_config/about_me`).
- Refactored `src/pages/user/index.astro`:
    - Integrated `PrimaryButton` for profile updates.
    - Added Firestore integration for the `users` collection to store and retrieve custom nicknames linked to Firebase UIDs.
- Re-stabilized page structures in both dashboards to prevent future syntax-related server errors.

#### Affected files
- `src/components/PrimaryButton.astro` (New file)
- `src/pages/admin/index.astro`
- `src/pages/user/index.astro`
- `CHANGELOG.md`

#### Side effects
- None anticipated.


### [2026-02-13.17] - Dashboard Layout Refactoring & Vertical Rhythm

#### Summary of changes
- Refactored the "System Settings" module into a full-width dashboard layout to match the high-fidelity aesthetic of the Content Editor.
- Enforced absolute height consistency for the `PrimaryButton` component.
- Standardized vertical spacing (`pt-8`) and container widths across all admin and user dashboard sections.

#### Technical details
- Updated `src/components/PrimaryButton.astro` with a hard-coded `h-14` class to eliminate rendering variance across browsers.
- Redesigned the "System Settings" tab in `src/pages/admin/index.astro`:
    - Switched from a centered `max-w-md` layout to a full-width responsive grid/card system.
    - Integrated status toggles into the section header for improved information density.
    - Applied `shadow-inner` and `bg-uu-base/10` to input fields for consistent tactile feedback.
- Unified the vertical rhythm by setting a global `pt-8` padding for all primary action button containers in both Admin and User views.

#### Affected files
- `src/components/PrimaryButton.astro`
- `src/pages/admin/index.astro`
- `src/pages/user/index.astro`
- `CHANGELOG.md`

#### Side effects
- None anticipated.

**中文說明：最終佈局統整。將「全站設定」模組重構為與編輯器一致的全寬儀表板風格，並透過固定 PrimaryButton 高度與統一全站 pt-8 間距，解決了按鈕大小不一的問題。**


### [2026-02-13.18] - User Dashboard Refactor & Avatar Selection System

#### Summary of changes
- Refactored User Dashboard Profile section into a segmented, full-width layout matching Admin dashboard aesthetics.
- Implemented a custom avatar selection system allowing users to choose from 10 Material Symbols icons or revert to their Google account photo.
- Added real-time avatar preview in the sidebar during selection.

#### Technical details
- Redesigned `src/pages/user/index.astro` Profile tab:
    - Split into two independent white card modules: "Basic Profile Settings" and "Avatar Selection".
    - Removed centered `max-w-md` constraint in favor of full-width responsive cards.
    - Created a 5-column icon grid (11 options total: 1 original + 10 symbols).
- Avatar selection logic:
    - Clicking an icon updates both the hidden input value and provides immediate visual feedback (scale, color change).
    - Live preview updates the sidebar avatar in real-time without requiring save.
    - "Original" option (represented by `account_circle` icon) allows users to switch back to Google profile photo.
- Firestore integration:
    - Stores selected icon in `users/{uid}/avatar_icon` field.
    - `null` or `"original"` value triggers display of Google account photo.
    - Pre-loads saved preference on login and applies visual selection state.
- UI refinements:
    - Removed icon name labels for cleaner appearance.
    - Fixed grid to 5 columns (`grid-cols-5`) for consistent layout.
    - Applied project color scheme strictly (`uu-main`, `uu-sub`, `uu-base`).

#### Affected files
- `src/pages/user/index.astro`
- `CHANGELOG.md`

#### Side effects
- Page reloads after saving profile to ensure avatar synchronization across all UI elements.

**中文說明：使用者儀表板重構與頭像系統。將個人設定頁面改為分段式全寬佈局，並新增虛擬頭像選擇功能，提供 10 個 Material Symbols 圖示供使用者挑選，同時保留切換回 Google 原始照片的選項。選取時會即時預覽於側邊欄，儲存後同步至 Firestore。**


### [2026-02-13.19] - Avatar System Refinement & Google Reset Feature

#### Summary of changes
- Redesigned Google account data reset functionality with dedicated button in Profile Settings module.
- Expanded avatar icon selection from 10 to 15 Material Symbols with responsive auto-sizing grid.
- Removed confusing "original photo" option from icon grid and relocated it to a clearer reset button.
- Applied full-width layout to nickname input and reset button for visual consistency.

#### Technical details
- **Google Reset Button**:
    - Added standalone button in "Basic Profile Settings" module with clear labeling: "使用 Google 帳號原始資料".
    - Clicking triggers confirmation dialog, then clears `nickname` and `avatar_icon` from Firestore.
    - Automatically reverts both display name and avatar to Google account defaults.
    - Provides visual feedback with hover states and refresh icon.
- **Responsive Icon Grid**:
    - Implemented CSS Grid with `repeat(5, 1fr)` for consistent 5-column layout.
    - Used `clamp()` for responsive sizing:
        - Gap: `clamp(0.75rem, 2vw, 1.5rem)`
        - Icon size: `clamp(1.5rem, 3vw, 2.5rem)`
    - Icons automatically scale based on container width while maintaining aspect ratio.
- **Expanded Icon Library**:
    - Added 5 new icons: `favorite`, `star`, `pets`, `eco`, `nightlight`.
    - Total selection now offers 15 distinct Material Symbols.
- **Layout Refinements**:
    - Removed `max-w-md` constraints from nickname input container and Google reset button.
    - Both elements now extend full-width within their card containers for better visual balance.
- **Logic Simplification**:
    - Removed `"original"` as a selectable avatar option.
    - Simplified avatar loading: if `avatar_icon` is `null`, display Google photo; otherwise show selected icon.

#### Affected files
- `src/pages/user/index.astro`
- `CHANGELOG.md`

#### Side effects
- Users who previously had no custom avatar will now see their Google photo by default (no functional change, just clearer logic).

**中文說明：頭像系統優化與 Google 重置功能。將「恢復原始資料」功能從頭像網格中獨立出來，改為專屬按鈕並放置於基本資料模組中，點擊後可一鍵清除自訂名稱與頭像。頭像選擇區擴增至 15 個 Icon，並採用響應式網格自動調整尺寸，確保一行固定 5 個且視覺比例協調。同時移除輸入欄位與按鈕的寬度限制，實現滿版佈局。**

### [2026-02-21] - Cloud Bookmark System & Realized Sharing Feature

#### Summary of changes
- Implemented a persistent cloud bookmark system using Firestore.
- Added a "real-time" article sharing feature with Native Web Share API.
- Fixed local network access issue by binding the dev server to `0.0.0.0`.
- Revamped the Bookmarks page to display dynamic content based on user data.

#### Technical details
- **Cloud Bookmarks**:
    - Integrated Firestore to store user bookmarks at `users/{uid}/bookmarks/{postId}`.
    - Updated `[...slug].astro` with client-side scripts to toggle bookmark status.
    - Added visual feedback (filled vs. border icon) synchronized with user's cloud data.
- **Bookmarks Page Overhaul**:
    - Replaced static placeholder with a dynamic grid that filters posts by bookmarked IDs.
    - Implemented loading and empty states for better UX.
    - Used `define:vars` to pass post metadata safely from server to client.
- **Realized Sharing**:
    - Leveraged `navigator.share` for native mobile sharing experience.
    - Provided a robust clipboard fallback for desktop browsers.
- **Environment & DX**:
    - Updated dev server configuration to allow external access via local network IP.
    - Resolved TypeScript lint errors related to implicit `any` types in post mapping.

#### Affected files
- `src/pages/posts/[...slug].astro`
- `src/pages/bookmarks/index.astro`
- `CHANGELOG.md`
- `package.json`

#### Side effects
- Users must be logged in to use the bookmarking feature; anonymous users are redirected to the login page.

**中文說明：實作雲端書籤系統與真實分享功能。透過 Firestore 儲存使用者的收藏清單，並在各文章頁面提供即時的收藏按鈕與原生分享介面（支援手機原生分享與桌面端複製連結）。同時優化了書籤頁面，使其能動態顯示已收藏的文章列表，並解決了區域網路無法連線測試的問題。**


### [2026-02-21] - FIX: UI Refinement & Bookmark Stability

#### Summary of changes
- Completely removed all remaining "Read More" (看更多) buttons from the homepage and listing pages as requested.
- Fixed the "No Reaction" issue with bookmarks caused by Astro View Transitions skipping script execution.
- Improved the Bookmarks page rendering logic and fixed Firebase module import issues.
- Updated Firestore security rules configuration to support user bookmarks.

#### Technical details
- **UI Refinement**:
    - Removed redundant `btn-text` links in `src/pages/index.astro`.
    - Wrapped horizontal card images in `<a>` tags to match the new "all-clickable" design pattern.
- **View Transitions Fix**:
    - Wrapped client-side scripts in `astro:page-load` listeners in both `[...slug].astro` and `bookmarks/index.astro`.
    - This ensures event listeners are correctly attached even when a user navigates between pages without a full browser reload.
- **Data Passing**:
    - Replaced `define:vars` with `data-posts` attribute serialization in `bookmarks/index.astro` to allow standard ES Module imports to work correctly alongside server-provided data.
- **Security & Deployment**:
    - Prepared `firebase.json` and updated `firestore.rules`.
    - Note: Manual deployment via `npx firebase deploy --only firestore:rules` is required to apply permission updates.

#### Affected files
- `src/pages/index.astro`
- `src/pages/posts/[...slug].astro`
- `src/pages/bookmarks/index.astro`
- `firebase.json`
- `CHANGELOG.md`

**中文說明：修復介面與書籤穩定性。徹底移除首頁殘留的「看更多」按鈕，並將圖片改為可點選連結。解決了因 Astro View Transitions 導致導覽後書籤按鈕失效的問題，並修正了書籤頁面的資料傳遞邏輯，確保 Firebase 功能在所有頁面切換情況下皆能正常運行。**

### [2026-02-21] - FIX: Instant Login & Bookmark Button Reliability

#### Summary of changes
- Integrated "Instant Login" directly into the Bookmarks page, removing the intermediate redirect.
- Fixed the Bookmark (收藏) button responsiveness in article pages by refining the View Transitions event lifecycle.
- Improved the authentication state logic to ensure consistent UI across page navigations.

#### Technical details
- **Bookmarks Page**:
    - Embedded the Google Login card directly into the unauthenticated state of `/bookmarks`.
    - Implemented `signInWithPopup` within the page script for a seamless login experience.
- **Article Actions**:
    - Cleaned up the `astro:page-load` event listener to prevent redundant handler registration.
    - Verified `onAuthStateChanged` integration to ensure the bookmark status is checked on every page entry.
- **Workflow**:
    - Synchronized latest changes to the remote repository.

#### Affected files
- `src/pages/bookmarks/index.astro`
- `src/pages/posts/[...slug].astro`
- `CHANGELOG.md`

**中文說明：實作即時登入與書籤按鈕穩定性修復。將登入組件直接嵌入書籤頁面，使用者不再需要跳轉頁面即可登入。同時修正了文章頁面書籤按鈕失效的問題，優化了 Astro View Transitions 下的腳本執行邏輯，確保導覽後各項功能依然穩定運作。**

### [2026-02-21] - FEAT: User Dashboard Synchronization & Enhanced UI Feedback

#### Summary of changes
- Synchronized the "My Bookmarks" tab in the User Dashboard with real-time Firestore data.
- Significantly improved the visual feedback for the Bookmark button in article pages.
- Standardized the bookmarking logic across the Article Page and User Dashboard.

#### Technical details
- **User Dashboard**:
    - Implemented real-time bookmark fetching in `src/pages/user/index.astro`.
    - Mirroring the main Bookmarks page logic to show bookmarked articles directly in the dashboard.
- **Improved UI Feedback**:
    - Updated `updateBookmarkUI` in `[...slug].astro` to use a high-contrast dark background and filled bookmark icon when an article is saved.
    - Added extensive console logging to track authentication and Firestore interaction lifecycle.
- **Workflow**:
    - Committed and pushed all changes to ensure GitHub Actions triggers the latest build.

#### Affected files
- `src/pages/user/index.astro`
- `src/pages/posts/[...slug].astro`
- `CHANGELOG.md`

**中文說明：實作會員中心同步與強化書籤視覺反饋。現在「會員中心」的書籤分頁能即時顯示收藏的文章清單。同時大幅強化了文章頁面的收藏按鈕視覺，當文章被收藏時會顯示深色實心樣式，並優化了後端邏輯與日誌追蹤，確保各頁面狀態同步且穩定。**

### [2026-02-21] - FEAT: Enhanced Markdown Rendering & Script Stabilization

#### Summary of changes
- Redesigned Markdown table rendering for better readability and aesthetics.
- Enabled Astro `ClientRouter` (ViewTransitions) for smoother navigation and reliable script execution.
- Fixed an issue where article action buttons (Bookmark, Share, Link) were non-responsive.
- Synchronized User Dashboard scripts with the new client-side routing lifecycle.

#### Technical details
- **Markdown Tables**:
    - Added custom CSS in `global.css` for `.prose table`, including rounded borders, sticky-like headers, and zebra stripes.
    - Implemented responsive horizontal scrolling for tables on mobile devices.
- **Navigation & Lifecycle**:
    - Integrated `ClientRouter` in `Layout.astro` to enable `astro:page-load` events.
    - Standardized all interactive scripts to use `astro:page-load` instead of standard `DOMContentLoaded`.
    - Fixed Frontmatter syntax in `Layout.astro` and `user/index.astro`.

#### Affected files
- `src/layouts/Layout.astro`
- `src/pages/user/index.astro`
- `src/styles/global.css`
- `CHANGELOG.md`

**中文說明：強化 Markdown 渲染與腳本穩定性修復。重新設計了文章中的表格樣式，加入圓角邊框、標題背景與條紋裝飾，並優化了行動版橫向捲動。同時開啟了 Astro 的 ClientRouter 功能，確保導覽後的各項功能（書籤、分享、個人資料更新）都能穩定運作且擁有流暢的切換動畫。**

### [2026-02-22] - MAINT: Brand Identity & Contact Update

#### Summary of changes
- Updated the "About Me" page avatar to use the official source (`uu-memo.png`).
- Migrated all project-wide contact and system emails to `uu-memo@outlook.com`.
- Updated administrative access controls and default author metadata to reflect the new identity.

#### Technical details
- **Visuals**:
    - Modified `src/content/pages/about.md` to replace the placeholder icon with `uu-memo.png`.
- **Identity & Auth**:
    - Replaced `contact@uu.memo` and `jing180804@gmail.com` with `uu-memo@outlook.com` in:
        - `src/pages/index.astro` (sidebar)
        - `src/pages/user/index.astro` (admin redirect check)
        - `src/pages/admin/index.astro` (credentials verification & seed data)
        - `src/content/pages/contact.md`
        - `src/content/pages/terms.md`
- **Quality of Life**:
    - Fixed a TypeScript implicit 'any' error in `admin/index.astro`.

#### Affected files
- `src/content/pages/about.md`
- `src/content/pages/contact.md`
- `src/content/pages/terms.md`
- `src/pages/index.astro`
- `src/pages/user/index.astro`
- `src/pages/admin/index.astro`
- `src/content/posts/markdown-style.md`
- `CHANGELOG.md`

**中文說明：站點身分與聯繫資訊更新。將「關於我」頁面的佔位頭像更換為正式原始檔案 (`uu-memo.png`)。同時將全站所有聯繫信箱、系統管理員判定信箱統一更新為 `uu-memo@outlook.com`。**

### [2026-02-22] - FEAT: Dynamic Contact Form & Email Notification

#### Summary of changes
- Replaced the static `contact.md` page with a dynamic `contact.astro` form.
- Implemented automatic data storage to Firestore (`messages` collection).
- Integrated Google Apps Script for real-time email notifications to `uu-memo@outlook.com`.
- Updated Firestore security rules to allow anonymous form submissions while protecting administrative access.

#### Technical details
- **Frontend**:
    - Created `src/pages/contact.astro` using project UI tokens and `PrimaryButton` component.
    - Added Client-side validation and submission logic with `astro:page-load` compatibility.
- **Backend/Integration**:
    - Configured `firestore.rules` to permit `create` operations on the `messages` collection.
    - Setup POST request to GAS for email forwarding.
- **Maintenance**:
    - Removed deprecated `src/content/pages/contact.md`.

#### Affected files
- `src/pages/contact.astro` [NEW]
- `src/content/pages/contact.md` [DELETE]
- `firestore.rules`
- `CHANGELOG.md`

### [2026-02-24] - FIX: Contact Form Email Delivery & Error Handling

#### Summary of changes
- Resolved email delivery issues by removing restricted Gmail aliases from the GAS script.
- Improved contact form debug logging to track environment variable status.
- Fixed false-positive success messages in the contact form UI when environment configuration is missing.

#### Technical details
- **GAS Script**:
    - Updated `contact-handler.gs` to send emails directly from the authenticated account, bypassing alias authorization errors.
- **Frontend**:
    - Enhanced `src/pages/contact.astro` with detailed console logging for Firestore and GAS submission steps.
    - Added explicit checks for `GAS_URL` to prevent silent failures.

#### Affected files
- `contact-handler.gs`
- `src/pages/contact.astro`
- `CHANGELOG.md`

**中文說明：修復聯繫表單郵件寄送與前端回饋邏輯。移除了 GAS 腳本中造成授權錯誤的別名設定，並強化前端的偵錯日誌，確保在環境變數缺失時能正確提示，避免誤報成功。**

### [2026-02-24.3] - FEAT: Contact Handler Robustness & Health Check

#### Summary of changes
- Added a `doGet` endpoint to the contact handler for easy service availability testing.
- Implemented stricter payload validation and enhanced error reporting.
- Refined the HTML email template for maximum mobile and desktop compatibility.

#### Technical details
- Added `doGet` function in `contact-handler.gs` returning JSON status and timestamp.
- Integrated explicit `e.postData` existence check to prevent silent internal crashes.
- Improved CSS in the HTML template (e.g., `font-size` refinements and link colors).
- Standardized all JSON response formats for easier frontend parsing.

#### Affected files
- `contact-handler.gs`
- `CHANGELOG.md`

#### Side effects
- Requires a "New Version" deployment in GAS to enable the `doGet` endpoint.

**中文說明：強化聯絡表單處理程式的健壯性與健康檢查功能。新增 `doGet` 介面方便測試連通性，加入更嚴格的資料驗證邏輯，並微調了通知郵件的 HTML 樣式以確保在各式設備上的最佳顯示效果。**

### [2026-02-25] - FIX: Contact Form Target Email Override

#### Summary of changes
- Updated the Google Apps Script contact handler to use a configurable target email address.

#### Technical details
- Modified `contact-handler.gs` to check for `TARGET_EMAIL` in `PropertiesService`.
- Implemented a fallback mechanism to route emails to `wj209ing@gmail.com` if the property is undefined.
- Replaced the dynamic `Session.getEffectiveUser().getEmail()` call to prevent routing issues when the script runner isn't the intended recipient.

#### Affected files
- `contact-handler.gs`

**中文說明：修復聯絡表單收件人問題。將 GAS 腳本原本動態取得執行者信箱的邏輯，改為優先讀取 `TARGET_EMAIL` 環境變數，若未設定則預設發送至 `wj209ing@gmail.com`，確保信件準確送達。**

### [2026-02-26] - FIX: Contact Handler Recipient & Validation Alignment

#### Summary of changes
- Updated the default recipient email in the contact handler to `uu-memo@outlook.com`.
- Aligned internal secret validation logic with environment variables.
- Improved documentation for GAS manual configuration.

#### Technical details
- Modified `contact-handler.gs` default `targetEmail` to match the project's official Outlook address.
- Verified that the `PUBLIC_GAS_SECRET` from `.env` matches the expected `token` in the payload.
- Added instructions for the administrator to update "Script Properties" in the GAS console.

#### Affected files
- `contact-handler.gs`
- `CHANGELOG.md`

**中文說明：修復聯絡表單收件人地址並同步驗證金鑰。將預設收件信箱更新為 `uu-memo@outlook.com`，並確保 GAS 腳本的驗證邏輯與環境變數一致，同時提供完整的後台設定教學。**
