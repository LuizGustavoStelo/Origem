---
name: Pantanal-Cerrado Moderno
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1b1b1c'
  surface-container: '#1f1f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#d1c5b4'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#303031'
  outline: '#9a8f80'
  outline-variant: '#4e4639'
  surface-tint: '#e9c176'
  primary: '#e9c176'
  on-primary: '#412d00'
  primary-container: '#c5a059'
  on-primary-container: '#4e3700'
  inverse-primary: '#775a19'
  secondary: '#ffb59b'
  on-secondary: '#5b1a00'
  secondary-container: '#7a2f10'
  on-secondary-container: '#ff9b77'
  tertiary: '#b7ccb9'
  on-tertiary: '#233427'
  tertiary-container: '#96ab99'
  on-tertiary-container: '#2d4032'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea5'
  primary-fixed-dim: '#e9c176'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4201'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59b'
  on-secondary-fixed: '#380d00'
  on-secondary-fixed-variant: '#7a2f10'
  tertiary-fixed: '#d3e8d5'
  tertiary-fixed-dim: '#b7ccb9'
  on-tertiary-fixed: '#0e1f13'
  on-tertiary-fixed-variant: '#394b3d'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
  graphite-deep: '#1A1A1B'
  old-gold: '#C5A059'
  clay-terracotta: '#B35A38'
  olive-closed: '#4A5D4E'
  paper-cream: '#F4F1EA'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 72px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-xl: 120px
  stack-lg: 80px
---

## Brand & Style
The design system embodies the "Pantanal-Cerrado Moderno" aesthetic—a fusion of raw territorial authenticity and high-end editorial sophistication. It is designed for a discerning audience that values cultural depth, haute gastronomy, and the curated experience of the Bioceanic Route. 

The visual language follows a **Minimalist-Luxury** direction with **Tactile** influences. It avoids the clutter of traditional tourism sites, opting instead for a "Digital Magazine" feel. Expect generous whitespace (often utilizing deep dark tones), high-contrast serif typography that feels "inked," and subtle organic textures that evoke the clay of the Cerrado and the flora of the Pantanal. The experience should feel like a private invitation to an exclusive estate.

## Colors
The palette is rooted in the earth and the night of the Mato Grosso do Sul interior. 
- **Graphite Deep (#1A1A1B):** The primary canvas. It provides a luxurious, immersive backdrop that allows photography and gold accents to "pop."
- **Old Gold (#C5A059):** Reserved for the "Curatorship Seal," fine borders, and interactive highlights. It represents the premium nature of Chef Paulo Machado’s selection.
- **Clay Terracotta (#B35A38):** Used for storytelling elements, secondary calls to action, and highlights that require a human, warm touch.
- **Olive Closed (#4A5D4E):** A sophisticated neutral-chromatic for Dividers, icon backgrounds, or secondary labels, grounding the design in the natural landscape.

## Typography
The typography contrasts the classical elegance of the serif with the industrial precision of the sans-serif.
- **Headlines:** Uses a refined serif to mimic high-fashion mastheads. Italics should be used sparingly for "vibe" words within a sentence to add an editorial flair.
- **Body:** Inter provides a neutral, highly legible contrast that ensures the content (gastronomy descriptions and travel itineraries) remains the focus.
- **Captions & Labels:** Always use the `label-caps` style for section headers and the Curatorship Seal text to maintain an organized, institutional feel.

## Layout & Spacing
The layout uses a **Fixed Grid** for desktop (12 columns) and a **Fluid Grid** for mobile (4 columns). 

Key Philosophy:
- **Asymmetrical Balance:** Use "white space" (dark space in this case) to create a rhythm. For example, a headline might be offset to the left while the body copy is tucked into a narrow 6-column span on the right.
- **Negative Space:** Sections should be separated by `stack-xl` (120px) to allow the "premium" nature of the imagery to breathe. 
- **The "Seal" Placement:** The Curatorship Seal should often break the grid, floating over the intersection of images and text blocks.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layering** and **Subtle Transparency** rather than heavy shadows.
- **Base Layer:** #1A1A1B (Deep Graphite).
- **Surface Layer:** Use a slightly lighter tint of Graphite or the Olive Green at 10% opacity for card containers.
- **Accents:** 1px solid borders in `old-gold` (#C5A059) at 30% opacity are preferred over shadows to define container boundaries.
- **Overlays:** Images should use a subtle dark-to-transparent gradient bottom-up to ensure white or gold typography remains legible when placed directly on photos.

## Shapes
To maintain an "Atemporal and Luxurious" feel, the system uses **Sharp (0px)** corners. This evokes architectural precision, high-end stationery, and museum framing. 

Circles are used *exclusively* for the "Curatorship Seal" and "Play" buttons for video content, creating a distinct visual hierarchy between structural elements (square/rectilinear) and branded endorsements (circular).

## Components
- **Buttons:** Use a "Ghost" style for secondary actions with a 1px `old-gold` border and no fill. Primary buttons use a solid `clay-terracotta` fill with white text for high emotional impact.
- **The Curatorship Seal:** A circular component with a 1px gold border, containing the `label-caps` typography. It should appear as a "floating badge" on featured gastronomy items.
- **Cards:** For travel destinations or recipes, use "Edge-to-Edge" imagery with no rounded corners. Typography should be placed below the image or in a slight overlap using a semi-transparent dark background.
- **Input Fields:** Minimalist design with only a bottom border (1px) in `olive-closed`. Labels should sit above in `label-caps`.
- **Navigation:** A persistent, ultra-thin top bar. Use a hamburger menu that opens a full-screen overlay with large serif typography for navigation links.
- **Lists:** Use custom icons for list bullets—small 4px "diamonds" in gold—to reinforce the luxury aesthetic.