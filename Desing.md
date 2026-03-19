Design System Strategy: The Midnight Architect
This design system is a high-end, editorial framework for a marketing ecosystem SaaS. It rejects the "flat" utility of standard dashboards in favor of Tonal Depth, Intentional Asymmetry, and Luminous Accents. We aren't just building a tool; we are building a command center that feels like a premium physical workspace.

---

1. Overview & Creative North Star
   The Creative North Star: "The Digital Obsidian"
   The interface should feel like a polished piece of volcanic glass—deep, dark, and multi-layered. We break the "template" look by using exaggerated typographic scales and avoiding rigid 1px containers. By leveraging a hierarchy of dark tones rather than borders, we create an environment that feels expansive and immersive.
   Core Principles:
   Depth over Division: Use surface shifts to define sections, never lines.
   Luminous Interaction: Accents (Primary/Secondary) should feel like light sources in a dark room.
   Editorial Authority: High-contrast typography transitions that command attention.

---

2. Colors & Surface Philosophy
   The color palette is rooted in absolute depth (`background: #0e0e0e`) and uses high-chroma accents to guide the user's eye to conversion points and data trends.
   The "No-Line" Rule
   Explicit Instruction: 1px solid borders for sectioning are strictly prohibited.
   Structure is defined by background shifts. To separate a sidebar from a main feed, transition from `surface-container-low` (#131313) to `surface` (#0e0e0e). This creates a sophisticated, seamless transition that mimics expensive hardware.
   Surface Hierarchy & Nesting
   Treat the UI as a series of nested, stacked sheets. Use the following logic for layering:
   Base Layer: `surface` (#0e0e0e) for the global background.
   Sectional Layer: `surface-container-low` (#131313) for large layout blocks like sidebars.
   Component Layer: `surface-container` (#1a1a1a) for cards or data modules.
   Elevation Layer: `surface-container-high` (#20201f) for active states or floating popovers.
   The "Glass & Gradient" Rule
   Standard flat colors lack "soul."
   Glassmorphism: For floating modals or navigation overlays, use `surface-container` with an opacity of 60% and a `backdrop-blur` of 20px.
   Signature Gradients: For primary CTAs, use a linear gradient from `primary` (#b6a0ff) to `primary-container` (#a98fff) at a 135-degree angle to provide a metallic, premium sheen.

---

3. Typography: The Editorial Voice
   We use a dual-typeface system to balance technical precision with high-end brand authority.
   Display & Headlines (Manrope): Chosen for its geometric modernism. Use `display-lg` (3.5rem) and `headline-md` (1.75rem) to create aggressive, editorial headers that make marketing data feel like a magazine feature.
   Body & Labels (Inter): The workhorse. Use `body-md` (0.875rem) for all data and analytical text. The high x-height ensures readability against high-contrast dark backgrounds.
   Typographic Hierarchy: Always lead with a significant gap between Headline and Body sizes (e.g., using `headline-lg` next to `body-sm`) to create a clear "Information Architecture" through scale.

---

4. Elevation & Depth
   The Layering Principle
   Depth is achieved through Tonal Layering. Instead of applying a shadow to a card, place a `surface-container-highest` (#262626) card inside a `surface-container-low` (#131313) zone. The contrast alone provides the necessary "lift."
   Ambient Shadows
   When an element must float (e.g., a dropdown), use an ultra-diffused shadow:
   X: 0, Y: 20, Blur: 40, Spread: -5
   Color: `on-surface` (#ffffff) at 4% opacity.
   This mimics a soft ambient light rather than a harsh, artificial drop shadow.
   The "Ghost Border" Fallback
   If an element must have a boundary for accessibility (like an input field), use a Ghost Border:
   Stroke: `outline-variant` (#484847) at 20% opacity.
   Never use 100% opacity on borders; it breaks the immersion of the dark theme.

---

5. Component Guidelines
   Statistics Cards
   Background: `surface-container` (#1a1a1a).
   Structure: No divider lines. Use `8` (2rem) padding to create internal breathing room.
   Visuals: Use `secondary` (#00e3fd) for growth trends and `tertiary` (#ff6c95) for focus metrics.
   Data Tables
   Header: Use `surface-container-high` (#20201f) with `label-md` typography in all-caps.
   Rows: Remove all horizontal lines. Use a background shift to `surface-container-highest` (#262626) on hover to indicate selection.
   Spacing: Use `spacing-4` (1rem) for cell padding to maintain an airy, premium feel.
   Buttons & CTAs
   Primary: Gradient of `primary` to `primary_dim`. Roundedness: `md` (0.375rem).
   Secondary: Ghost style. `outline` stroke at 30% opacity with `on_surface` text.
   Interaction: On hover, increase the `backdrop-filter: brightness(1.2)` rather than changing the hex code.
   Sidebars
   Layout: Fixed position, `surface-container-low` (#131313).
   Active State: Do not use a box. Use a vertical "light bar" (2px wide) of `secondary` (#00e3fd) on the far left edge of the active menu item.

---

6. Do’s and Don’ts
   Do:
   Do use `20` (5rem) or `24` (6rem) spacing for top-level margins to create an "expensive" amount of white space.
   Do use `tertiary` (#ff6c95) sparingly for "Alert" or "Urgent" marketing insights to contrast against the cool `secondary` blues.
   Do ensure all text on `primary` surfaces uses `on_primary` (#340090) for maximum legibility.
   Don't:
   Don’t use pure white (#ffffff) for large blocks of body text; use `on_surface_variant` (#adaaaa) to reduce eye strain in the dark environment.
   Don’t use the `DEFAULT` roundedness (0.25rem) for large cards; use `xl` (0.75rem) to soften the "Brutalist" edge of the dark theme.
   Don’t use a divider line to separate a header from a body. Use a `10` (2.5rem) spacing gap instead.
