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
