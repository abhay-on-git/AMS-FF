I want you to replicate the COMPLETE visual design system of Chorus Summit (a fleet management platform) in my existing Figma design file. Apply ALL of the following design tokens and specifications exactly:

---

## BRAND IDENTITY

**Primary Brand Color:** #EF652B (orange) - use for primary buttons, key actions, and brand highlights
**Secondary/Links Color:** #2D798D (teal) - use for all links, secondary actions, focus states
**Dark Sidebar Color:** #121321 (chorus-black-500) - sidebar background
**Light Background:** #F1F1F3 (chorus-gray-100) - main content area background
**White Surface:** #FFFFFF - cards, inputs, dropdowns

---

## COMPLETE COLOR PALETTE

**ORANGE (Brand/Primary):**
- Orange 50: #FEF5EE (light backgrounds)
- Orange 350: #FF8D41 (highlights)
- Orange 400: #F27F45 (hover states)
- Orange 500: #EF652B (PRIMARY - primary buttons, brand)
- Orange 600: #DF4417 (active states)

**TEAL (Links/Actions):**
- Teal 50: #F0FAFB
- Teal 100: #D9F1F4 (hover backgrounds)
- Teal 200: #B8E3E9 (focus rings, backgrounds)
- Teal 400: #4FB1C1
- Teal 500: #3395A7
- Teal 600: #2D798D (PRIMARY - links, secondary actions)
- Teal 700: #2B6373
- Teal 800: #2A5260

**BLACK (Dark surfaces):**
- Black 100: #353750 (borders)
- Black 200: #2B2D46 (secondary dark)
- Black 300: #202239 (text on light backgrounds)
- Black 400: #1A1B2E (sidebar hover)
- Black 500: #121321 (sidebar background - PRIMARY)

**GRAY (Neutral):**
- Gray 50: #F7F7F8 (card backgrounds)
- Gray 100: #F1F1F3 (body background, hover)
- Gray 200: #E9E9EC (table borders)
- Gray 300: #DCDDE5 (input borders)
- Gray 400: #C6C7D2 (dividers)
- Gray 500: #AFB1C0 (disabled text)
- Gray 600: #989AAE (placeholder text, muted)
- Gray 700: #8789A1
- Gray 800: #767893 (secondary text)
- Gray 900: #676983 (muted text)

**RED (Errors):**
- Red 50: #FEF2F3
- Red 100: #FFE1E3 (error backgrounds, focus error ring)
- Red 300: #FEA3A8 (error borders)
- Red 600: #E0222D
- Red 700: #BD1821 (error text)

**YELLOW (Warnings):**
- Yellow 50: #FFFBEB
- Yellow 100: #FEF3C7 (warning backgrounds)
- Yellow 500: #F59E0B (warning icons)
- Yellow 700: #B45309 (warning text)

**GREEN (Success):**
- Green 50: #EEFFF1
- Green 100: #D8FFE1 (success backgrounds)
- Green 500: #0DC93C (success icons)
- Green 600: #05B430
- Green 700: #088D2A (success text)

**BLUE (Info/Trip lines):**
- Blue 300: #7DD3FC
- Blue 400: #38BDF8
- Blue 600: #0284C7
- Blue 700: #0369A1

---

## TYPOGRAPHY

**FONT FAMILIES:**
- Display/Headings/UI: Sora (weights: 350, 400, 450, 550, 650)
- Body text: Manrope (weights: 300, 400, 500, 600, 700)

**Import from Google Fonts:**
`https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Sora:wght@350;400;450;550;650&display=swap`

**FONT SIZES (with line-height and letter-spacing):**
- display-2xl: 72px / line-height 1.11 / letter-spacing -0.045rem
- display-xl: 60px / line-height 1.2 / letter-spacing -0.038rem
- display-lg: 48px / line-height 1.16 / letter-spacing -0.03rem
- display-md: 36px / line-height 1.22 / letter-spacing -0.023rem
- display-sm: 30px / line-height 1.2 / letter-spacing -0.019rem
- display-xs: 24px / line-height 1.16 / letter-spacing -0.015rem
- display-xxs: 20px / line-height 1.2 / letter-spacing -0.013rem
- xl: 20px / line-height 1.4 / letter-spacing 0.025rem
- lg: 18px / line-height 1.33 / letter-spacing 0.023rem
- md: 16px / line-height 1.25 / letter-spacing 0.02rem
- sm: 14px / line-height 1.42 / letter-spacing 0.018rem
- xs: 13px / line-height 1.23 / letter-spacing 0.016rem
- xxs: 12px / line-height 1.333 / letter-spacing 0.015rem

**FONT WEIGHTS:**
- Light/Normal: 300 (body text)
- Regular: 400 (default body)
- Medium: 500 (emphasis)
- Semibold: 600 (labels, strong emphasis)
- Bold: 700 (headings)

---

## LAYOUT SYSTEM

**SIDEBAR:**
- Width expanded: 280px
- Width collapsed: 112px
- Background: #121321 (chorus-black-500)
- Logo area height: 64px (h-16)
- Nav item height: 48px (h-12)
- Nav item padding (expanded): 12px horizontal (px-3)
- Nav item padding (collapsed): 0 horizontal, 64px min-height
- Gap between nav items: 18px
- Active item: background #1A1B2E (chorus-black-400), text #C6C7D2
- Inactive item: text #C6C7D2 (gray-300)
- Icon color active: #C6C7D2 (gray-400)
- Icon color inactive: #989AAE (gray-600)
- Collapse button: 32px × 32px, rounded-xl, positioned 18px from sidebar edge

**MAIN CONTENT:**
- Background: #F1F1F3 (chorus-gray-100)
- Padding: 24px horizontal on desktop (xl:px-8), 16px on tablet (sm:px-6)
- Page padding top: 0 on details pages, 24px on mobile
- Sticky header height: 64px

**BREAKPOINTS:**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1440px

---

## SPACING SYSTEM (4px base unit)

**Tailwind-style spacing tokens:**
- 0: 0px
- 0.5: 2px
- 1: 4px
- 1.5: 6px
- 2: 8px
- 2.5: 10px
- 3: 12px
- 3.5: 14px
- 4: 16px
- 4.5: 18px
- 5: 20px
- 5.5: 22px
- 6: 24px
- 7: 28px
- 8: 32px
- 9: 36px
- 10: 40px
- 11: 44px
- 12: 48px
- 14: 56px
- 16: 64px

---

## BORDER RADIUS

- None/sm: 2px
- DEFAULT: 4px
- md (buttons default): 6px
- lg (cards/buttons): 8px
- 7: 7px
- 10: 10px
- xl: 12px
- 18: 18px
- 20 (badges/pills): 20px
- full (circular): 9999px

---

## SHADOWS

**box (default cards):** `0px 4px 12px rgba(10, 18, 28, 0.06), 0px 1px 4px rgba(10, 18, 28, 0.04)`

**focus (input focus):** `0px 0px 0px 4px #D9F1F4`

**focus-error (input error focus):** `0px 0px 0px 4px #FFE1E3`

**switch (toggle off):** `1px 1px 4px #C6C7D2`

**switch-1 (toggle on):** `-1px 1px 4px #369DB0`

**box-1:** `1px 1px 4px #C6C7D2`

**box-2 (dropdowns/popovers):** `0 12px 20px -2px rgba(32, 34, 57, 0.04), 0 6px 8px -4px rgba(32, 34, 57, 0.02)`

**box-3 (tooltips):** `0px 0px 6px 0px rgba(26, 29, 35, 0.04)`

**box-4 (elevated):** `0px 12px 20px -2px #2022390A, 0px 6px 8px -4px #20223905`

**xl (modals):** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

---

## BUTTONS

**SIZES:**
- xs: height 32px, padding 14px horizontal, font 12px, rounded-md
- sm: height 36px, padding 16px horizontal, font 12px, rounded-md
- md: height 40px, padding 18px horizontal, font 14px, rounded-lg
- lg: height 44px, padding 22px horizontal, font 14px, rounded-lg

**Typography for all buttons:** Sora, font-weight regular (400), line-height 1, letter-spacing -0.008rem to -0.009rem

**VARIANTS:**
- Primary: bg #202239 (chorus-black-300), text #F7F7F8 (gray-50), hover bg #1A1B2E (black-400), disabled text #AFB1C0 (gray-500), disabled bg #F1F1F3 (gray-100)
- Secondary: bg #B8E3E9 (teal-200), text #121321 (black-500), disabled text #989AAE (gray-600)
- Tertiary: bg #F1F1F3 (gray-100), text #353750 (black-100), disabled text #AFB1C0 (gray-500)
- Outline: bg white, border #DCDDE5 (gray-200), text #202239 (black-300), disabled text #AFB1C0 (gray-500)
- Link: bg transparent, text #2B6373 (teal-700), disabled text #AFB1C0 (gray-500)
- White: bg white, text #475569 (slate-600), disabled text #94A3B8

**ICON BUTTONS:**
- xxxs: 20px × 20px
- xs: 32px × 32px
- sm: 36px × 36px
- md: 40px × 40px

---

## INPUTS

**HEIGHT:**
- md: 40px
- lg: 44px

**STYLES:**
- Background: white
- Border: none (ring 1px)
- Border radius: 6px (rounded-md)
- Padding left: 18px (pl-4.5)
- Padding right: 40px (pr-10) for icon buttons
- Font: Manrope, 12px (xxs), font-weight 500 (medium)
- Text color: #121321 (chorus-black-500)
- Placeholder color: #676983 (chorus-gray-900)
- Disabled background: #F7F7F8 (gray-50)

**FOCUS STATES:**
- Default: ring #DCDDE5 (gray-300), focus shadow `0px 0px 0px 4px #D9F1F4` (teal-100), ring #B8E3E9 (teal-200)
- Error: ring #FEA3A8 (red-300), focus shadow `0px 0px 0px 4px #FFE1E3` (red-100), ring #FEA3A8 (red-300)

**ERROR MESSAGE:**
- Font: Manrope, 12px (xxs)
- Color: #BD1821 (red-700)
- Margin top: 7px
- Animation: slide up with 0.2s duration

---

## TEXTAREA

- Border radius: 6px (rounded-md)
- Font: Manrope, 12px (xxs)
- Min height md: 72px (padding 12px vertical, 18px horizontal)
- Min height lg: 80px (padding 14px vertical, 18px horizontal)
- Same focus/error states as inputs

---

## TABLES

**CONTAINER:**
- Font size: 12px (xxs)
- Horizontal scroll on mobile

**HEADER:**
- Background: #F7F7F8 (gray-50)
- Height: 48px
- Padding: 22px horizontal, 14px vertical
- Font: Manrope, 12px, uppercase, font-weight 600
- Text color: #767893 (gray-800)
- First cell: rounded-l-md, last cell: rounded-r-md

**ROW:**
- Background: white
- Border bottom: 1px #E9E9EC (gray-200)
- Hover: show background highlight with 48px height, centered
- Transition: colors only

**CELL:**
- Height: 64px
- Padding: 12px vertical, 22px left
- Font: Manrope, 12px, font-weight 500
- Text color: #353750 (black-100)

---

## BADGES

**SIZES:**
- xs: height 16px, font 10.4px, no padding
- sm: height 20px, font 12px, padding 2px horizontal, 2-3px vertical
- md: height 24px, font 12px, padding 10px horizontal, 4px vertical
- lg: height 28px, font 14px, padding 10px horizontal, 4px vertical

**VARIANTS (background/text):**
- Green: #DCFCE7 / #15803D
- Yellow: #FEF3C7 / #B45309
- Red: #FEE2E2 / #B91C1C
- Gray: #F1F5F9 / #64748B
- Teal: #D9F1F4 / #2D798D
- Purple: #F3E8FF / #9333EA
- Sky: #E0F2FE / #0369A1
- Slate: #F1F5F9 / #475569 (with border #E2E8F0)
- Black: #202239 / white
- Orange: #FEF5EE / #DF4417
- Pink: #FCE7F3 / #BE185D
- Lime: #ECFCCB / #4D7C0F
- Indigo: #E0E7FF / #4338CA
- Outline: white / #353750 (with border #AFB1C0)

**BORDER RADIUS:** 20px (pill shape) or 4px (rounded)

---

## TOOLTIPS

- Background (dark): #121321 (chorus-black-500)
- Background (light): white with shadow `0px 4px 40px 0px rgba(60, 64, 67, 0.08)`
- Border (light): #F7F7F8
- Min width: 80px
- Padding: 2px horizontal, 3px top, 5px bottom
- Font: Manrope, 12px, font-weight 500
- Text color (dark): #C6C7D2 (gray-300)
- Border radius: 2px (rounded-sm)
- Shadow: box-3
- Arrow: 10px wide, 5px tall
- Z-index: 50

---

## SWITCHES/TOGGLES

**SIZES:**
- xs: root 20px × 36px, thumb 16px × 16px
- md: root 24px × 40px, thumb 20px × 20px

**STYLES:**
- Off: bg #DCDDE5 (gray-300), thumb shadow `1px 1px 4px #C6C7D2`
- On: bg #4FB1C1 (teal-400), thumb shadow `-1px 1px 4px #369DB0`
- Focus ring: 2px ring #B8E3E9 (teal-200), offset 1px
- Thumb transition: transform 0.2s

---

## CHECKBOXES

- Size: 16px × 16px (size-4)
- Border radius: 2px (rounded-sm)
- Border: 1px #DCDDE5 (gray-300)
- Background unchecked: white
- Background checked: #B8E3E9 (teal-200)
- Check icon color: #152D37 (teal-950)
- Disabled unchecked: bg #DCDDE5 (gray-300)
- Disabled checked: bg #E9E9EC (gray-200), icon #8789A1 (gray-700)

---

## DROPDOWNS

**CONTENT:**
- Background: white
- Border: 1px #F1F1F3 (gray-100)
- Border radius: 8px (rounded-lg)
- Padding: 6px horizontal, 6px vertical
- Shadow: box-2
- Width: 192px (w-48)
- Z-index: 99

**ITEM:**
- Padding: 8px vertical, 10px horizontal
- Border radius: 6px (rounded-md)
- Font: Manrope, 14px, font-weight 500
- Text color: #353750 (black-100)
- Hover/focus background: #F1F1F3 (gray-100)
- Selected: same as hover

---

## ACCORDION

**HEADER:**
- Background: #F1F1F3 (gray-100)
- Hover: #D9F1F4 (teal-100)
- Active/open: #D9F1F4 (teal-100)
- Padding: 12px vertical, 20px left, 16px right
- Border radius: 6px (rounded-md)
- Font: Sora, 14px, font-weight 400
- Text color: #202239 (black-300)
- Chevron icon: #353750 (black-100), rotates 180° when open

**CONTENT:**
- Padding top: 17px, bottom: 19px, left: 20px (on desktop)
- Font: Manrope, 14px, font-weight 400
- Text color: #202239 (black-300)
- Animation: 0.2s ease-out for open/close

---

## SPINNERS

**SIZES (diameter × stroke-width):**
- xxs: 14px × 1.2px
- xs: 16px × 1.6px
- sm: 20px × 2.3px
- md: 24px × 3px
- lg: 32px × 4px
- xl: 40px × 5px
- xxl: 48px × 6px

**ANIMATION:** Rotating arc with 1.4s linear infinite
**Color:** Inherits from parent (text-chorus-black-100 default)

---

## SKELETON LOADERS

- Animation: pulse
- Border radius: 6px (rounded-md)
- Light variant bg: #F7F7F8 (gray-50)
- Dark variant bg: #E9E9EC (gray-200)

---

## NAVIGATION SIDEBAR

**LOGO AREA:**
- Height: 64px
- Margin top: 24px
- Padding: 32px left (expanded), 0 (collapsed)
- Logo centered when collapsed

**NAV ITEMS (expanded):**
- Height: 48px
- Padding: 0 horizontal, 12px vertical
- Border radius: 6px
- Gap from icon to text: 10px
- Font: Manrope, 16px, font-weight 500
- Margin between sections: 18px

**NAV ITEMS (collapsed):**
- Min height: 64px
- Padding: 8px vertical, 0 horizontal
- Icon size: 24px
- Text below icon: 12px, centered

**BADGE (notification count):**
- Min width: 30px
- Height: 20px
- Padding: 0 8px
- Border radius: 20px (full)
- Background: #BD1821 (red-700)
- Text: #FFE1E3 (red-100), 12px, font-weight 600

**DIVIDER:**
- Border top: 1px #353750 (black-100)
- Margin: 16px vertical

---

## MODALS/DIALOGS

- Overlay: rgba(26, 27, 46, 0.8) or rgba(18, 19, 33, 0.5)
- Modal background: white
- Modal border radius: 12px (rounded-xl)
- Modal padding: 20px (p-5)
- Modal shadow: xl shadow
- Max width: 518px
- Z-index overlay: 1000
- Z-index content: 9999
- Close button: 32px × 32px, positioned top-right

---

## Z-INDEX SCALE

- Base: 0
- Sticky: 1
- Fixed: 10
- Dropdown: 99
- Modal backdrop: 1000
- Modal content: 9999
- Tooltip: 50
- Sidebar: 50
- Sidebar expand button: 100
- Mobile nav: 999999

---

## ANIMATION/EASING

**DEFAULT TIMING:**
- Duration fast: 150ms
- Duration normal: 200ms
- Duration slow: 300ms
- Duration slide: 600ms

**EASING:**
- Default: cubic-bezier(0.4, 0, 0.2, 1)
- Slide animations: cubic-bezier(0.16, 1, 0.3, 1)
- Accordion: ease-out
- Menu/dropdown: ease-in-out

**SLIDE ANIMATIONS:**
- slide-down: translateY(-10px) → translateY(0), opacity 0 → 1
- slide-up: translateY(10px) → translateY(0), opacity 0 → 1
- slide-right: translateX(-10px) → translateX(0), opacity 0 → 1
- slide-left: translateX(10px) → translateX(0), opacity 0 → 1

---

## FORM STYLING NOTES

- Labels: Manrope, 12px, font-weight 600, color #767893 (gray-800)
- Required indicator: not specified (follow current pattern)
- Help text: Manrope, 12px, color #989AAE (gray-600)
- Error text: Manrope, 12px, color #BD1821 (red-700)
- Gap between form fields: 16px (gap-4)

---

## SUMMARY OF KEY TOKENS TO APPLY

| Token | Value |
|-------|-------|
| Primary Brand | #EF652B |
| Primary Link | #2D798D |
| Sidebar BG | #121321 |
| Content BG | #F1F1F3 |
| Card BG | #FFFFFF |
| Primary Font | Sora |
| Body Font | Manrope |
| Border Radius (buttons) | 6px |
| Border Radius (cards) | 8px |
| Border Radius (badges) | 20px |
| Sidebar Width | 280px |
| Sidebar Collapsed | 112px |
| Shadow Default | multi-layer subtle |
| Transition Duration | 300ms |
| Focus Ring | 4px teal-100 |

---

Apply ALL of these tokens to EVERY component in the design file to match Chorus Summit exactly. This includes but is not limited to: buttons, inputs, tables, cards, badges, tooltips, dropdowns, modals, navigation, form elements, and any other UI components. Ensure consistency across all states: default, hover, active, focus, and disabled.