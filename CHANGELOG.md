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
