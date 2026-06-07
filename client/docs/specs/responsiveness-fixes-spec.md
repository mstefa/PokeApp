# 📱 Specification: Responsiveness and Mobile Optimization Fixes

This specification outlines the changes required to implement full responsiveness and touch target compliance for the PokeApp Frontend Client (`client/`) on mobile viewports (widths 320px–640px).

---

## 🚦 Architectural Goals

1.  **Compliance with Design System**:
    *   **Fluid Width Layouts**: All component panels and container slots must scale relative to the viewport. Ensure no fixed horizontal overflows exist.
    *   **Touch Targets**: All interactive elements (buttons, inputs) must measure no less than `48px` on mobile screens to ensure accessibility.
2.  **Zero-Jank Layout Refactoring**: Leverage CSS Modules media queries to keep styles scoped and maintain Astro SSR output integrity.

---

## 🛠️ Proposed Changes

### 1. Global Viewport Adjustments
*   Ensure that the global stylesheet or main view wrappers do not force horizontal scrollbars.

### 2. Navbar Mobile Adaptations (`client/src/components/Navbar.module.css`)
*   **Breakpoint `@media (max-width: 640px)`**:
    *   Reduce `.navbar` container padding to `0 1rem`.
    *   Shrink nav button container dimensions: set height/width of `.navButton` to `44px` and set padding to `0.5rem`.
    *   Hide the text label `span` inside `.navButton` elements to keep buttons icon-only.
*   **Breakpoint `@media (max-width: 480px)`**:
    *   Hide the `.logoText` span to display only the Pikachu logo mark in narrow viewports.

### 3. Landing Page Mobile Scaling (`client/src/pages/index.astro`)
*   **Breakpoint `@media (max-width: 480px)`**:
    *   Reduce title font-size `.title` from `3.5rem` to `2.5rem`.
    *   Reduce card padding `.landing-card` from `3rem 2.5rem` to `2rem 1.5rem`.
    *   Scale down the Pokéball graphic `.pokeball-wrapper` from `10rem` to `8rem` square.
    *   Reduce primary button text `.start-btn` to `1.1rem` and adjust padding to `0.875rem 2rem`.

### 4. Search & Filter Bar Flex wrapping (`client/src/components/SearchBar.module.css`)
*   Enable flex-wrap (`flex-wrap: wrap`) on the filter group `.filters`.
*   **Breakpoint `@media (max-width: 768px)`**:
    *   Allow the search form `.formContainer` to span full width (`width: 100%; max-width: none`).
    *   Allow the `.filters` list and `.sort` section to span full width.
*   **Breakpoint `@media (max-width: 600px)`**:
    *   Increase `.buttonFilter`, `.buttonClear`, and `.selectInput` height to `48px` (touch target minimum).
    *   Allow filter buttons to grow (`flex-grow: 1`) to form a neat block of controls on mobile.

### 5. Pagination Mobile Layout (`client/src/components/Pagination.module.css`)
*   Enable flex-wrap (`flex-wrap: wrap`) and centering (`justify-content: center`) on the `.pagination` list.
*   **Breakpoint `@media (max-width: 600px)`**:
    *   Scale page action buttons `.pageButton` from `40px` to `48px` width and height.

### 6. Create Pokémon Form Scaling (`client/src/components/CreatePokemon.module.css`)
*   **Breakpoint `@media (max-width: 600px)`**:
    *   Reduce container card padding `.container` from `2.5rem` to `1.5rem`.
    *   Change `.statGrid` to fit smaller column allocations (minmax `140px` instead of `180px`).
    *   Set submit button `.buttonSubmit` to span full width (`max-width: 100%`).

### 7. Pokémon Detail Card Mobile Enhancements (`client/src/components/PokemonDetail.module.css`)
*   **Breakpoint `@media (max-width: 600px)`**:
    *   Reduce main container padding `.container` from `2.5rem` to `1.5rem`.
    *   Reduce Pokéball image wrapper `.imageWrapper` size to `10rem`.
    *   Set `.name` font size to `2rem`.
    *   Stack dimensions `.dimensionsSection` vertically (`flex-direction: column`) and adjust `.dimensionItem` padding from `2.5rem` to `1.5rem`.

---

## 📂 Affected Files
*   `client/src/components/Navbar.module.css`
*   `client/src/pages/index.astro`
*   `client/src/components/SearchBar.module.css`
*   `client/src/components/Pagination.module.css`
*   `client/src/components/CreatePokemon.module.css`
*   `client/src/components/PokemonDetail.module.css`
