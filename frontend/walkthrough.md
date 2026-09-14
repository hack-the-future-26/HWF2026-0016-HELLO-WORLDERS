# Walkthrough: Campus-Thrift Frontend Implementation

Campus-Thrift is a complete, student-focused campus marketplace frontend built for the college hackathon project. It strictly preserves an absolute frontend-only boundary with zero backend servers, databases, or imaginary API endpoints, while establishing clean service abstractions and TypeScript models ready for future backend integration.

---

## 1. Project Identity & Styling

- **Brand Consistency**: The project is titled **Campus-Thrift** across the header, page title, navigation, marketplace, product details, chat, rides, profile, and footer. Verified with zero instances of previous names.
- **Theme Support**: Implemented `ThemeContext` supporting **Light**, **Dark**, and **System** modes.
  - Automatically queries and listens for OS changes via `window.matchMedia('(prefers-color-scheme: dark)')`.
  - Persists preference in `localStorage`.
  - Applied semantic Tailwind tokens (`emerald` student accent, slate dark mode surfaces, high-contrast readable typography).

---

## 2. Public vs. Protected Routes & Authentication Behavior

- **Public Routes (No Login Required)**:
  - `/` — Primary marketplace with live search, category pills, price range/condition filters, explainable recommendation carousel, and safe exchange guide.
  - `/product/:id` — Product detail view with photo gallery, original retail savings, seller profile, and advisory safety notes.
  - `/rides` — Static/demo campus carpool coordination board.
- **Protected Routes (Redirects to `/auth?redirect=...`)**:
  - `/sell` — Listing creation form.
  - `/chat` and `/chat/:id` — Student chat threads.
  - `/profile` — Student profile and saved bookmark list.
  - `/my-listings` — Active & sold listings management.
  - `/notifications` — Student offer and message alerts.
- **Chat Action Guard**:
  - Unauthenticated visitors on `/product/:id` can view all details, but clicking **"Chat with Seller"** safely guides them to `/auth?redirect=/product/:id`.
  - Authenticated students immediately open a dedicated conversation thread.

---

## 3. Frontend Architecture & Service Layer

All mock data is cleanly separated from UI components into domain services with `// TODO: [Backend Integration]` comments:

| Service | Responsibility | Storage / Mock Behavior |
| :--- | :--- | :--- |
| `authService` | Active user session & demo accounts | Frontend local session (`localStorage`), 6 verified student profiles |
| `productService` | Marketplace search, filter, sort, details, create listing | In-memory + `localStorage` for user-created listings & saves |
| `chatService` | Student messaging, offers, thread history | 4 initial threads, local message persistence, simulated seller reply |
| `notificationService` | Student alerts & unread counters | 4 initial alerts, mark as read, mark all as read |
| `rideService` | Campus carpool display | **Strictly static dummy data reader**; no seat booking or state mutation |
| `recommendationService` | Heuristic recommendations with explainability | Client-side interest scoring; explains reason for every pick |
| `scamService` | Advisory student safety heuristics | Detects off-platform payment keywords, external links, extreme low prices |

---

## 4. Key Pages & Features

### Marketplace (`/`)
- Dynamic search filtering by title, description, tags, campus location.
- Category chips: Textbooks, Electronics, Dorm Essentials, Furniture, Bicycles & Transit, Lab & STEM, Clothing & Gear, Other.
- Filter drawer / sidebar: Price range slider, condition, campus area.
- AI Picks Carousel: Explains *why* items were recommended (e.g. "Because you recently browsed textbooks", "Top Student Value: 65% off retail").

### Product Details (`/product/:id`)
- Multi-image gallery preview with thumbnail selection.
- Price savings badge calculating percentage off retail.
- Verified Student Card: Displays graduation year, department, dorm, campus rating, and average response time.
- Advisory Safety Box: Heuristic scan results with safe-zone meeting guidelines.

### Sell Listing (`/sell`)
- Validated form with image preset picker for instant demo listings.
- Live advisory scam checker warning students against posting wire transfer info or external links.
- Interactive Campus Price Guidance modal showing benchmark student prices.
- Publishing creates a local product instantly visible on the marketplace and in `/my-listings`.

### Campus Rides (`/rides`)
- Static prototype carpool board for holiday break airport trips, grocery runs, and transit hubs.
- Informational "Join Ride" and "Offer Ride" modals communicating prototype status without mutating seats or making API calls.

### Chat (`/chat`, `/chat/:id`)
- Split-screen conversation list and active thread on desktop; responsive view on mobile.
- Product snapshot banner inside each thread.
- Quick offer actions and safe meetup prompt shortcuts.

### Profile & My Listings (`/profile`, `/my-listings`)
- Saved products bookmarked from the marketplace.
- Active vs. Sold listings tabs.
- "Mark as Sold" action with confirmation modal.

---

## 5. Verification & Build Results

- **TypeScript Compilation**: Executed `tsc -b` with **0 errors**.
- **Production Bundle**: Built using `vite build` into `dist/` with **0 errors** (HTML, CSS 42.7kB, JS 404.3kB).
- **Naming Check**: Verified zero occurrences of old project names (`CampusLoop`).
