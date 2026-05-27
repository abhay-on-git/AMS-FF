Design a modern enterprise-grade “Nested Location Hierarchy Management” experience for a SaaS admin dashboard.

The goal is to create an extremely intuitive and flexible nested location system where users can create unlimited hierarchy levels without manually selecting parent locations from dropdowns.

This should feel like a premium product used by enterprise companies.

====================================================
CORE UX PHILOSOPHY
====================================================

The office itself is the root parent.

DO NOT ask the user to select a parent location inside the “Add Location” flow.

The hierarchy should work contextually:
- User selects where they are in the tree
- Then they can:
  - Add Child
  - Add Same Level
  - Rename
  - Delete

The system should support:
- Infinite nesting
- Dynamic hierarchy creation
- Clean visual structure
- Extremely low cognitive load
- Fast inline creation
- Modern enterprise UX

The UX should feel inspired by:
- Notion nested pages
- VS Code explorer
- Jira hierarchy trees
- Linear
- ClickUp
- Figma layers panel

====================================================
DESIGN STYLE
====================================================

Create a premium modern UI with:
- Minimal but rich enterprise styling
- Soft shadows
- Rounded corners
- Subtle borders
- Beautiful spacing
- Clean typography
- Smooth hierarchy indentation
- Elegant hover states
- Modern inline actions
- Professional dark + light mode compatible design
- Extremely polished interaction patterns

Use:
- Neutral modern palette
- Subtle accent color
- Smooth micro interactions
- Modern tree connectors
- Premium SaaS dashboard feel

The UI should feel:
- scalable
- organized
- intelligent
- flexible
- modern
- powerful

====================================================
MAIN LAYOUT
====================================================

Create a split layout:

LEFT PANEL:
- Hierarchy tree explorer
- Nested expandable structure
- Indentation based hierarchy
- Expand/collapse arrows
- Hover interactions
- Active selected state
- Scrollable tree panel

RIGHT PANEL:
- Selected location details
- Quick actions
- Metadata
- Breadcrumb path
- Add child actions
- Inline editing experience

====================================================
TREE STRUCTURE UX
====================================================

Example hierarchy:

Pune HQ
├── Floor 1
│   ├── Cabin A
│   │   └── Locker Room
│   └── Cabin B
├── Floor 2
└── Warehouse

Each node should support:
- Expand/collapse
- Hover reveal actions
- Active selection state
- Inline add
- Drag handle
- Context menu
- Rename inline

====================================================
NODE ACTIONS
====================================================

On hover show elegant actions:

[ + Child ]
[ + Same Level ]
[ Edit ]
[ Delete ]
[ More ]

Actions should appear softly on hover.

Do NOT clutter the UI.

====================================================
INLINE CREATION UX
====================================================

CRITICAL:
Avoid opening large modal forms for every action.

Instead:
- User clicks “+ Child”
- Inline input appears directly below node
- User types location name
- Press enter
- Node instantly appears

Same for:
- Add Same Level
- Rename

This should feel extremely fast and fluid.

====================================================
ADD LOCATION EXPERIENCE
====================================================

When adding location:
ONLY ask:
- Location Name

NO:
- Parent dropdown
- Hierarchy selection
- Complex forms

Hierarchy is automatically inferred from context.

====================================================
VISUAL HIERARCHY
====================================================

Use:
- Indentation
- Vertical guide lines
- Tree connectors
- Smooth spacing rhythm
- Collapsible nested sections
- Clean typography hierarchy

The tree should remain readable even with deep nesting.

====================================================
INTERACTION DETAILS
====================================================

Add:
- Smooth expand/collapse animation
- Hover elevation
- Active glow/subtle highlight
- Inline editing transition
- Drag & drop placeholder states
- Ghost preview while dragging
- Smooth node insertion animation

====================================================
ADVANCED UX FEATURES
====================================================

Include visual concepts for:
- Drag and drop nesting
- Reordering hierarchy
- Moving nodes across levels
- Multi-level nesting
- Deep hierarchy navigation
- Breadcrumb navigation
- Search locations
- Filter hierarchy

====================================================
EMPTY STATES
====================================================

Design elegant empty states like:

“No locations added yet”
“Create your first location”

with:
- minimal illustration
- modern empty state UI
- CTA button

====================================================
RESPONSIVENESS
====================================================

Design should work for:
- Desktop admin dashboard
- Large screens
- Tablet responsive layout

====================================================
DESIGN OUTPUT EXPECTATION
====================================================

Create:
- Full high-fidelity UI
- Enterprise dashboard quality
- Multiple hierarchy examples
- Expanded and collapsed states
- Hover states
- Inline add state
- Selected node state
- Drag-drop interaction concept
- Context menu design
- Empty state
- Deep nested example

The design should look production-ready and comparable to modern enterprise SaaS products.