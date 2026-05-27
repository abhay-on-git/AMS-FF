Analyze the current Location Module UI/UX and completely transform it from a traditional form-based experience into a modern contextual nested hierarchy management system for enterprise SaaS.

IMPORTANT:
The current implementation still feels like a normal CRUD modal form.
The new experience should feel like an interactive hierarchy builder.

====================================================
CORE PRODUCT LOGIC
====================================================

The selected office itself is the root parent.

DO NOT make users manually select parent locations.

Hierarchy should be contextual.

Users should only:
- enter location name
- choose where to add via actions like:
  - Add Child
  - Add Same Level

The system must support:
- unlimited nesting
- dynamic hierarchy creation
- contextual nesting
- clean hierarchy visualization
- inline structure management

====================================================
CRITICAL UX TRANSFORMATION
====================================================

The current UI problem:
- Feels like static form submission
- No visible hierarchy understanding
- No structure preview
- Too much empty dead space
- Office dropdown psychologically behaves like parent selector
- Users cannot visually understand nesting

Transform the module into:
STRUCTURE-FIRST UX
instead of
FORM-FIRST UX

====================================================
REMOVE THIS UX PATTERN
====================================================

REMOVE:
- traditional office dropdown appearance
- large form-heavy layout
- excessive helper text blocks
- static empty white space
- parent selection workflow
- overly instructional UI

DO NOT make it feel like:
"Fill form and submit"

It should feel like:
"Build hierarchy interactively"

====================================================
NEW MODAL STRUCTURE
====================================================

Create a split modal layout.

LEFT SIDE:
Minimal creation experience

RIGHT SIDE:
Live hierarchy preview tree

====================================================
LEFT PANEL DESIGN
====================================================

Section:
"Adding inside"

Display selected office as contextual root:

🏢 Amman Office

NOT as dropdown.

Then show:

Location Name
[ Input Field ]

Primary CTA:
[ Create Location ]

Keep this area:
- compact
- modern
- highly focused
- minimal friction

====================================================
RIGHT PANEL DESIGN
====================================================

Show:
LIVE HIERARCHY PREVIEW

Example:

🏢 Amman Office
├── Building A
│   ├── Floor 1
│   └── Floor 2
└── Parking

This preview should:
- update dynamically
- visually explain hierarchy
- help users understand nesting instantly

====================================================
TREE EXPERIENCE
====================================================

Each node should support:
- Expand/collapse
- Active selected state
- Hover actions
- Inline child creation
- Inline same-level creation
- Rename
- Delete
- Context menu

====================================================
NODE ACTIONS
====================================================

On hover show elegant lightweight actions:

[ + Child ]
[ + Same Level ]
[ Edit ]
[ Delete ]

Actions should:
- appear softly
- not clutter UI
- feel modern and contextual

====================================================
INLINE CREATION UX
====================================================

CRITICAL:
Avoid opening additional forms or modals.

Instead:
- User clicks “+ Child”
- Inline input appears beneath node
- User types name
- Press enter
- Node instantly appears

Same behavior for:
- Add Same Level
- Rename

This interaction should feel:
- extremely fast
- fluid
- intelligent
- modern

====================================================
VISUAL HIERARCHY
====================================================

Use:
- indentation
- subtle tree guide lines
- clean spacing rhythm
- nested connectors
- expandable sections
- elegant hierarchy depth visualization

Hierarchy must remain readable even at deep nesting levels.

====================================================
DESIGN STYLE
====================================================

Create premium enterprise SaaS styling:

- modern admin dashboard aesthetic
- soft shadows
- subtle borders
- premium spacing
- elegant typography
- hover elevation
- contextual action reveal
- modern empty states
- light and dark mode compatibility

Inspired by:
- Notion
- Linear
- Jira
- VS Code Explorer
- ClickUp
- Figma layers panel

====================================================
INTERACTION DETAILS
====================================================

Add:
- smooth expand/collapse animation
- inline editing transitions
- smooth node insertion
- hover highlighting
- contextual active states
- responsive nested spacing

Focus heavily on:
- clarity
- speed
- low cognitive load
- hierarchy readability
- enterprise usability

====================================================
EMPTY STATES
====================================================

Design modern empty states like:

"No locations added yet"

"Create your first nested location"

with:
- clean illustration
- modern CTA
- premium SaaS feel

====================================================
RESPONSIVENESS
====================================================

Design for:
- desktop enterprise dashboard
- large screens
- tablet responsiveness

====================================================
EXPECTED FINAL RESULT
====================================================

The final experience should feel like:
- interactive hierarchy builder
- modern nested structure manager
- enterprise-grade location management system

NOT:
- traditional CRUD form modal

The hierarchy itself should become the primary experience.