# AGENTS.md — AI Agent Operating Manual & Architecture Guidelines

This file is the single source of truth for AI agents (Claude, Copilot, Cursor, Antigravity, etc.) working on the **Metrix Dashboard UI** repository. Always read and adhere to the conventions and architectural boundaries documented below before writing or modifying code.

---

## 1. Project Overview & Showcase Philosophy

### Purpose & Target Audience
- **Frontend Portfolio Showcase**: This project is built specifically as a **portfolio showcase application** to demonstrate advanced frontend engineering capabilities, clean architectural design, scalable state management, and component craftsmanship to **recruiters, hiring managers, and prospective employers**.
- **Not a Production Cloud Application**: It is **not** a real-world enterprise app connected to a cloud database or remote infrastructure. It is intentionally designed to run **100% locally, client-side, and offline**.

### Why It Is Local-First (Zero Friction for Evaluators)
- **Frictionless Onboarding**: Anyone reviewing this project (an interviewer, recruiter, or peer) must be able to run `pnpm install && pnpm dev` and immediately experience every single feature—with **zero** requirement to create accounts, configure `.env` secrets, seed remote databases, or install Docker containers.
- **Zero Remote Dependencies / Fully Offline**: The application operates 100% in-browser without connecting to external APIs or remote databases. Do not introduce remote database clients, external backend connectors, or cloud credentials.
- **Self-Contained Mock Database Engine (`mockDb`)**: All persistence runs directly in the browser via `localStorage` (`dashboard_mock_db_v1`) featuring realistic pre-seeded data, relational foreign key joins, full client-side CRUD (orders, customers, products), and Base64 image conversions.
- **Simulated Real-Time Dynamics**:
  - The live chat feature uses an in-memory event emitter pub/sub system with an automated reply bot that simulates realistic customer responses after ~1.2 seconds.
  - A prominent **"Reset Data"** button in the header allows evaluators to reset mock data to its pristine seed state with a single click at any time.

### Guiding Principles for AI Agents
When modifying or extending this codebase, keep the showcase nature at the forefront:
1. **Code Cleanliness is Paramount**: Prospective employers review this code directly. Prioritize readability, clear domain naming, explicit typing, and zero tech debt over quick hacks.
2. **Explicit Contracts**: Keep components modular, self-contained, and explicit. Avoid hidden magic, auto-import trickery, or implicit global state.
3. **UX Polish**: Ensure fluid dark/light transitions, responsive table layouts, informative empty states, and descriptive user feedback via toast messages (`useMessage`).


---

## 2. Essential Commands

Package manager: **pnpm** (version `11.5.2+`). Node: **v18+** (verified up to Node **24**).

```bash
pnpm install       # Install dependencies
pnpm dev           # Start Vite dev server (binds to 127.0.0.1:3000)
pnpm typecheck     # Typecheck codebase (vue-tsc --noEmit)
pnpm build         # Build production bundle with Vite & Rolldown
pnpm preview       # Preview production build locally
```

> [!IMPORTANT]
> Always ensure both `pnpm typecheck` and `pnpm build` pass with **0 errors and 0 warnings** before concluding any task.

---

## 3. Strict Non-Negotiable Rules

### A. Strictly No Global Component Registration
- **Never** register components globally via `app.component(...)` in `main.ts` or plugins.
- **No auto-import plugins**: All imports must be explicitly declared in code.
- **Every** Vue component must explicitly import its dependencies within `<script setup>`:
  - Child components (e.g., `import Btn from '~/components/Btn.vue'`)
  - Icons (e.g., `import { ICart, ISearch } from '~/components/icons'`)
  - Vue Composition APIs (e.g., `import { ref, computed, onMounted } from 'vue'`)
  - Composables and stores (e.g., `import { useAuthStore } from '~/store/auth'`)

### B. Standard Vue Composition API
- Always use standard Vue Composition API: `ref()`, `computed()`, `watch()`, `reactive()`, with `.value` access in script.
- Do **NOT** use `$ref`, `$computed`, or `$$()`.

### C. Local Mock Database (`mockDb`) as the Backend
- All data persistence runs in the browser through `src/services/mock/mockDb.ts` backed by `localStorage` (`dashboard_mock_db_v1`).
- Domain logic must be encapsulated within domain service files in `src/services/`:
  - `authService.ts`: Authentication, user profiles, session simulation.
  - `customerService.ts`: Customer CRUD, pagination, status toggling.
  - `productService.ts`: Product catalog, inventory, publish toggling, Base64 image conversion.
  - `orderService.ts`: Orders & order items, lifecycle progression, deletions.
  - `chatService.ts`: Real-time chat subscriptions, thread history, automated replies.
- Use `mockDb.resetDb()` to restore default seed data if testing requires a clean slate.

---

## 4. Architecture & Directory Layout

```
src/
├── api/             # Local query builder shim routing to mockDb
├── assets/          # Static bundled assets (images, logos)
├── components/      # Reusable UI component library
│   ├── icons/       # SVG icons with typed barrel export (src/components/icons/index.ts)
│   ├── BaseTable.vue
│   ├── Btn.vue
│   ├── ComboBox.vue
│   ├── OrderDialog.vue
│   ├── TheHeader.vue
│   └── ...
├── composables/     # Shared Vue composables
│   ├── dark.ts      # Dark mode state & toggling (isDark, toggleDark)
│   ├── message.ts   # Toast notifications (useMessage)
│   └── LoadingOverlay.ts
├── pages/           # Vue Router page components
│   ├── home/        # Dashboard executive overview
│   ├── orders/      # Orders listing and order details
│   ├── customers/   # Customers listing and customer details
│   ├── products/    # Product catalog, add product, and details
│   ├── chat/        # Real-time chat threads and messaging
│   ├── settings/    # Profile edit, personalization, and security
│   ├── login.vue    # Login page
│   ├── signup.vue   # Signup page
│   └── router.ts    # Route definitions and auth guards
├── services/        # Service layer & local database
│   ├── mock/
│   │   ├── mockDb.ts    # LocalStorage CRUD, foreign key joins, pub/sub emitter
│   │   └── seedData.ts  # Default sample data (customers, products, orders, chat)
│   ├── authService.ts
│   ├── customerService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   ├── chatService.ts
│   └── imageUtils.ts    # Fallback asset and Base64 resolver
├── store/           # Pinia stores consuming the service layer
│   ├── auth.ts
│   ├── customers.ts
│   ├── orders.ts
│   └── products.ts
├── styles/          # UnoCSS and global style definitions
├── App.vue          # Root shell with layout and sidebar
└── main.ts          # Application bootstrap
types/
└── index.ts         # Central domain TypeScript interfaces (User, Order, Customer, etc.)
```

---

## 5. UI & Styling Guidelines

- **Styling Engine**: [UnoCSS](https://unocss.dev/) with atomic utility classes and custom theme tokens.
- **Design Tokens & Shortcuts** (defined in `uno.config.ts`):
  - **Surfaces**: `surface-1` (card background), `surface-2` (nested background), `surface-3`.
  - **Typography Colors**: `typo-clr-base`, `typo-clr-muted`, `typo-clr-primary`, `typo-clr-on-primary`.
  - **Typography Sizes**: `typo-sm`, `typo-base`, `typo-head`, `typo-lg`.
  - **Primary Colors**: `fill-primary-1`, `fill-primary-2`, `fill-primary-3`.
- **Dark Mode**: Supports both dark and light modes cleanly. Use `dark:` variant classes (e.g. `dark:bg-dark-1`, `dark:text-gray-1`).

---

## 6. Icons Guide

All icons are Vue components located in `src/components/icons/`.
Always import them from the typed barrel file `~/components/icons`:

```ts
import { 
  ICart, 
  ICustomers, 
  IDashboard, 
  IDark, 
  ISun, 
  ISend, 
  ISearch, 
  IAdd, 
  ITrash 
} from '~/components/icons'
```

---

## 7. Quality Checklist for Agents

When implementing features, fixing bugs, or refactoring:

1. [ ] **No Unnecessary Dependency Installs**: Do not install external packages without explicit user instruction.
2. [ ] **Explicit Imports**: Check that every `.vue` file imports all components, icons, and composables used in its template.
3. [ ] **Type Correctness**: All new functions and services must have explicit TypeScript types defined in `types/index.ts`.
4. [ ] **No Dead Code**: Remove unused imports, variables, and placeholder files.
5. [ ] **Verify Compilation**:
   - `pnpm typecheck` must report **0 errors**.
   - `pnpm build` must complete cleanly with **0 errors**.
