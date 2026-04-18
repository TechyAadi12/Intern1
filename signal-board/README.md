# Signal Board

A production-quality "Signal Board" frontend application, simulating a review queue for an AI-assisted product team. Built with React, TypeScript, Zustand, and Tailwind CSS.

## Project Overview

Signal Board is designed to give product teams a quick, scannable, and actionable interface for handling various "signals" (incidents, churn risks, product feedback, metrics changes, etc.). The design emphasizes clean architecture, accessibility, state separation, and a high-end internal tool aesthetic similar to Linear or Vercel.

## Setup Instructions

1. Ensure you have Node.js installed (v18+ recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (typically `http://localhost:5173`).

## Architecture Decisions

- **State Management (Zustand):** Used Zustand for global state management to separate UI state (filters, sorting, density mode) from data state (signals, loading, error). Zustand provides a boilerplate-free, hook-based approach that avoids React Context prop drilling and excess re-renders.
- **Persistence:** Zustand's `persist` middleware is used to save UI preferences (density mode, sort order, filters) and client-side notes to `localStorage`.
- **Keyboard Navigation Hook (`useKeyboardNavigation`):** A custom hook implemented to centralize keyboard handler logic, ensuring users can use `Cmd+K` to search, arrow keys to navigate the queue list, and `Enter/Escape` to handle the detail drawer seamlessly.
- **Debounced Search:** Uses a custom `useDebounce` hook for the search input to delay filtering logic until the user stops typing, minimizing unnecessary re-renders.
- **Component Design:** Adopted a scalable feature-based folder structure. Generic UI elements (Input, Button, Badge) are isolated in `src/components/ui/`, whereas feature-specific code is grouped in `src/features/reviewQueue/`.

## Trade-offs

- **Fake API Latency:** Since there is no actual backend, an artificial delay (600ms) with a 5% failure rate is introduced in `src/lib/api.ts` to simulate real-world loading and error states. In production, this would be swapped with a real API call (e.g., React Query).
- **Client-Side Filtering & Sorting:** Given the small dataset (mock data of ~25 items), filtering and sorting algorithms are run on the client side during render. For a production scale with thousands of rows, these operations would ideally be paginated and handled server-side.
- **Local Storage for Notes:** "Add note" logic is maintained fully client-side using local storage to fulfill instructions without building a complex backend.

## Features Implemented

- **Data Layer:** Interacts with a mock API containing diverse edge cases (missing fields, long titles, duplicates).
- **Queue View:** Clean, scannable list view with color-coded priority and status indicators.
- **Search & Filtering:** Real-time debounced title/summary/tag search with highlighted matched text. Sort options for Date, Score, Priority. Filter options for Status, Priority.
- **Detail View:** Slide-in drawer showing full context, score, metadata, and functionality to mark as reviewed/escalated.
- **Accessibility:** Fully keyboard navigable. Use Up/Down arrows to navigate the queue, Enter to open, Esc to close. Semantic HTML structure and screen reader friendly ARIA labels applied.
- **Density Toggle:** View the list in comfortable or compact mode (persisted to local storage).
- **Graceful States:** Skeleton loading state, graceful error state handling, and empty results state.

## What Was Intentionally Not Implemented

- **Real Backend / Database:** The dataset is entirely predefined, and mutation actions (Snooze, Escalate) simulate an optimistic update before reverting or resolving via the artificial layer.
- **Complex Auth:** No authentication or user switching implemented; the tool acts as if a default admin is logged in.
- **Pagination:** Chose a continuous vertical scroll (rendering all filtered items) instead of pagination to keep the initial feature set robust and performant within the 50-item mock limits.
