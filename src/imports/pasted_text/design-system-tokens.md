
### Font Sizes (Increased for Readability)

Because the primary users are older, ALL font sizes should be increased by 2-4px compared to typical enterprise applications.

| Element | Size | Weight | Line Height | Notes |
|---------|------|--------|-------------|-------|
| **H1 - Page Title** | 32px | 600 (Semibold) | 1.2 | Main page headings |
| **H2 - Section Title** | 26px | 600 (Semibold) | 1.2 | Major sections |
| **H3 - Card/Subsection** | 22px | 600 (Semibold) | 1.25 | Cards, subsections |
| **H4 - Group Heading** | 18px | 600 (Semibold) | 1.3 | Form groups, table headers |
| **Body Large** | 18px | 400 (Regular) | 1.5 | Primary body text, descriptions |
| **Body** | 16px | 400 (Regular) | 1.5 | Standard text |
| **Body Small** | 15px | 400 (Regular) | 1.45 | Secondary text |
| **Labels** | 14px | 600 (Semibold) | 1.3 | Form labels, badges |
| **Captions** | 14px | 400 (Regular) | 1.4 | Helper text, timestamps |
| **Table Header** | 14px | 600 (Semibold) | 1.2 | Uppercase, 0.5-1px letter-spacing |
| **Table Cell** | 15px | 400-500 | 1.4 | Table body text |
| **Button Text** | 15px | 500 (Medium) | 1 | All buttons |
| **Input Text** | 15px | 500 (Medium) | 1 | User-entered text |
| **Input Placeholder** | 15px | 400 (Regular) | 1 | Placeholder text |
| **Navigation** | 16px | 500 (Medium) | 1 | Sidebar nav items |
| **Navigation (collapsed)** | 14px | 500 (Medium) | 1 | Collapsed sidebar |

### Typography Guidelines

- **Body line-height:** 1.5 minimum (increased from standard 1.25-1.42)
- **Letter spacing:** Slightly increased for better readability
- **Font weight distribution:** Use 600 (semibold) generously for labels and headings to create clear hierarchy
- **Text contrast:** Ensure sufficient contrast between text and background

---

## COLOR SYSTEM

Maintain semantic color usage from Chorus Summit:

### Brand Colors
| Role | Color | Hex |
|------|-------|-----|
| Primary Brand | Orange | #EF652B |
| Primary Actions | Orange Dark | #DF4417 |
| Links/Interactive | Teal | #2D798D |
| Link Hover | Teal Dark | #2B6373 |

### Text Colors (Semantic)
| Role | Color | Hex |
|------|-------|-----|
| Primary Text | Dark | #121321 |
| Secondary Text | Gray | #767893 |
| Muted/Helper Text | Gray | #989AAE |
| Disabled Text | Light Gray | #AFB1C0 |
| Placeholder | Light Gray | #676983 |
| Error Text | Red | #BD1821 |
| Warning Text | Yellow/Ochre | #B45309 |
| Success Text | Green | #088D2A |
| Link Text | Teal | #2D798D |

### Background Colors
| Role | Color | Hex |
|------|-------|-----|
| Page Background | Light Gray | #F1F1F3 |
| Card/Surface | White | #FFFFFF |
| Sidebar | Dark | #121321 |
| Table Header | Very Light Gray | #F7F7F8 |
| Hover State | Light Gray | #F1F1F3 |
| Disabled/Read-only | Pale Gray | #F7F7F8 |

### Semantic Colors for Data
| Data State | Background | Text |
|------------|------------|------|
| Success/Active | #D8FFE1 | #088D2A |
| Warning/Caution | #FEF3C7 | #B45309 |
| Error/Problem | #FFE1E3 | #BD1821 |
| Neutral/Info | #E0F2FE | #0369A1 |
| Inactive/Off | #F1F5F9 | #64748B |

---

## SPACING SYSTEM

**Base unit:** 4px

### Recommended Spacing (Increased for Clarity)

| Token | Value | Usage |
|-------|-------|-------|
| 1 | 4px | Tight element gaps |
| 2 | 8px | Icon-to-text, tight padding |
| 3 | 12px | Form field gaps |
| 4 | 16px | Standard padding, gaps |
| 5 | 20px | Card padding, section gaps |
| 6 | 24px | Large padding |
| 8 | 32px | Section margins |
| 10 | 40px | Page section spacing |
| 12 | 48px | Major section dividers |

### Component Spacing (Readability-Focused)

| Component | Padding | Notes |
|-----------|---------|-------|
| **Card** | 24px | Comfortable inner padding |
| **Form Field Gap** | 20px | Between form fields |
| **Table Row Height** | 56-64px | Larger for easy clicking |
| **Table Cell Padding** | 16px vertical, 20px horizontal | More breathing room |
| **Table Header** | 14px vertical, 20px horizontal | Clear header area |
| **Button Padding** | 18px horizontal, 12px vertical | Larger touch targets |
| **Input Padding** | 14px horizontal | Comfortable typing area |
| **Navigation Item** | 14px vertical, 16px horizontal | Easy to hit |
| **Dropdown Item** | 12px vertical, 14px horizontal | Spacious dropdown |

### Minimum Touch Targets
- **All interactive elements:** Minimum 44px × 44px (accessibility standard)
- **Table rows:** Minimum 56px height
- **Buttons:** Minimum height 44px
- **Form inputs:** Minimum height 44px

---

## LAYOUT & STRUCTURE

### Page Structure
- **Sidebar width:** 280px (collapsible to 112px)
- **Content padding:** 32px horizontal on desktop, 24px on tablet
- **Max content width:** Uncapped (full-width data tables)

### Visual Rhythm
- **Section spacing:** 32-48px between major sections
- **Card spacing:** 24px between cards
- **Consistent vertical rhythm:** Use 8px grid

---

## COMPONENT GUIDELINES

### Buttons

| Size | Height | Font Size | Padding |
|------|--------|-----------|---------|
| Small | 36px | 14px | 14px × 10px |
| Medium | 44px | 15px | 18px × 12px |
| Large | 52px | 16px | 22px × 14px |

**Button Font:** Sora, Weight 500
**Border Radius:** 8px (rounded-lg)

### Inputs

- **Height:** 44-48px
- **Font Size:** 15px
- **Border Radius:** 8px
- **Focus Ring:** 4px teal (#D9F1F4)
- **Error Ring:** 4px light red (#FFE1E3)

### Tables (Data-Heavy Focus)

**Critical for older users:**

| Element | Style |
|---------|-------|
| Row Height | 56-64px (more breathing room) |
| Header Height | 52px |
| Cell Padding | 16px vertical, 20px horizontal |
| Font Size | 15px |
| Line Height | 1.5 |
| Row Spacing | Clear separation |
| Hover State | Subtle background highlight |

**Table Best Practices:**
- Use zebra striping sparingly (alternative: border separation)
- Ensure text doesn't feel cramped
- Allow text wrapping in cells
- Left-align text, right-align numbers
- Uppercase headers with adequate letter-spacing

### Navigation

| Element | Size |
|---------|------|
| Nav Item Height | 48px |
| Nav Item Font | 16px, Weight 500 |
| Active Indicator | Clear background change + left border |
| Icon Size | 24px |
| Sidebar Padding | 24px horizontal |

### Cards

- **Border Radius:** 12px
- **Padding:** 24px
- **Shadow:** Subtle, multi-layer (0 4px 12px rgba)
- **Header:** Clear hierarchy with 18-22px semibold heading

### Badges/Pills

- **Height:** 28-32px
- **Font Size:** 14px, Weight 600
- **Border Radius:** 20px (pill shape) or 8px
- **Padding:** 8px horizontal minimum

### Tooltips

- **Font Size:** 14px
- **Padding:** 8px horizontal, 6px vertical
- **Max Width:** 280px
- **Background:** Dark or white with shadow

---

## VISUAL PRINCIPLES

### For Older Users, Prioritize:

1. **Readability over density** - More white space, larger text
2. **Clarity over compactness** - Clear hierarchy, obvious groupings
3. **Comfort over efficiency** - Larger touch targets, relaxed layouts
4. **Consistency over novelty** - Familiar patterns throughout
5. **Contrast over subtlety** - Clear visual states (hover, active, disabled)

### Design Language:

| Aspect | Guideline |
|--------|-----------|
| **Border Radius** | Soft corners (8-12px for cards, 8px for buttons) |
| **Shadows** | Subtle, multi-layer for depth |
| **Borders** | Light gray (#E9E9EC) for divisions |
| **Focus States** | 4px colored ring, highly visible |
| **Transitions** | 200-300ms, ease-out |

---

## SHADOWS
