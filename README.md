# Tracker App

A multi-view project tracker built with **React + TypeScript** featuring:
- Shared state across Kanban, List, and Timeline views
- Custom pointer-events drag-and-drop (no DnD library)
- Custom virtual scrolling in list view (no virtualization library)
- Simulated live collaboration indicators
- URL-synced filters for shareable state

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## State Management Choice

I used **React Context + useReducer** to keep the app lightweight while still offering a centralized, predictable update flow. The task data, filters, view mode, and collaboration presence all live in one store so switching views is instant and does not re-fetch or reset state.

Why not add another dependency?
- The required state shape is moderate and fits reducer patterns well.
- Reducer actions are explicit and easy to reason about for status updates, filters, and presence simulation.
- Keeps bundle size lower and avoids unnecessary abstraction for this scope.

## Three Views (Same Data)

- **Kanban**: 4 status columns with per-column counts, priority badges, due-date edge handling, empty states, and independent overflow scrolling.
- **List**: flat table with clickable single-column sorting (title / priority / due date), inline status updates, and virtual scrolling for 500+ rows.
- **Timeline**: current-month horizontal axis with bars from start date to due date, today marker line, and fallback single-day marker for missing start dates.

## Custom Drag-and-Drop Approach

Implemented with **native pointer events**:
- On pointer down, the card enters drag mode and keeps a placeholder in-place (same dimensions to avoid layout jump).
- A ghost element follows cursor/finger with opacity + shadow styling.
- Columns become highlighted when a draggable hovers over them.
- On drop over a valid column, task status updates in global store.
- On release outside drop zones, drag state clears and card remains in original location.

No drag-and-drop library is used.

## Virtual Scrolling Approach

List rows use a fixed row height strategy:
- Total scrollable height = `rowCount * rowHeight`.
- Start index is derived from `scrollTop / rowHeight`.
- Render window includes visible rows plus a 5-row buffer above and below.
- Only the visible slice is mounted; each row is absolutely positioned via translateY.

This keeps scrolling smooth with large datasets while preserving accurate scroll position and row count.

## Seed Data

The task generator creates **560 tasks** with randomized:
- titles
- assignees (6-user pool)
- status
- priority
- start and due dates

It intentionally includes overdue dates and tasks with missing start dates for edge-case validation.

## Collaboration Simulation

A timed interval simulates 2–4 active collaborators moving between tasks. Presence appears:
- in a top avatar bar (`X people are viewing this board`)
- on cards as stacked avatars (`+N` overflow)

## Lighthouse

Please run Lighthouse locally on the production preview and add a screenshot in this section:

`docs/lighthouse-desktop.png`

![Lighthouse desktop report](docs/lighthouse-desktop.png)

## Explanation (150–250 words)

The hardest UI problem was balancing custom drag-and-drop with a dense Kanban layout while keeping columns responsive and avoiding layout shift. During drag, I retain the source card in-flow as a placeholder rather than removing it from the DOM. That placeholder keeps the original footprint, so surrounding cards don’t collapse upward while the dragged ghost follows the pointer. The drag ghost is rendered in a fixed layer with reduced opacity and shadow so users can track movement without losing context of the original column.

For virtual scrolling, I used fixed-height row math and buffered windows to prevent gaps on fast scroll. Instead of mounting hundreds of rows, the list keeps a full-height container and only renders the visible subset plus safety rows above/below. Positioning via translateY preserves natural scroll behavior and row alignment.

If I had more time, I would refactor drag logic into a reusable hook with dedicated collision detection and keyboard accessibility, then add animation interpolation for collaborator avatar movement between cards to better mimic real-time multi-user transitions.
