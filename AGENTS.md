# AGENTS.md — AI Agent Operating Manual & Architecture Guidelines

This file is the single source of truth for AI agents (Claude, Copilot, Cursor, Antigravity, etc.) working on the **Metrix Dashboard UI** repository. Always read and adhere to the conventions and architectural boundaries documented below before writing or modifying code.

---

## 1. Project Overview & Purpose

- **Role**: This is a **frontend portfolio showcase project** built to highlight clean code, responsive design, state management, and modern component architecture to recruiters, hiring managers, and prospective employers.
- **Nature**: It is **not** a real-world enterprise app connected to a cloud database. It is designed to run **100% locally and offline**.
- **Supabase is EXCISED**: The original Supabase backend has been completely removed. Do **NOT** install `@supabase/supabase-js`, do not configure remote database URLs, and do not connect to external APIs.

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
- **Never** use magic auto-import plugins (`unplugin-auto-import`, `unplugin-vue-components`).
- **Every** Vue component must explicitly import its dependencies within `<script setup>`:
  - Child components (e.g., `import Btn from '~/components/Btn.vue'`)
  - Icons (e.g., `import { ICart, ISearch } from '~/components/icons'`)
  - Vue Composition APIs (e.g., `import { ref, computed, onMounted } from 'vue'`)
  - Composables and stores (e.g., `import { useAuthStore } from '~/store/auth'`)

### B. No Reactivity Transform ($ref, $computed)
- Vue's experimental Reactivity Transform has been removed and is deprecated in Vue 3.4+.
- Do **NOT** use `$ref`, `$computed`, or `$$()`.
- Always use standard Vue Composition API: `ref()`, `computed()`, `watch()`, `reactive()`, with `.value` access in script.

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
├── api/             # Legacy query builder shim routing to mockDb (if needed)
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

1. [ ] **No Blind Dependency Installs**: Never reinstall removed packages without explicit user instruction.
2. [ ] **Explicit Imports**: Check that every `.vue` file imports all components, icons, and composables used in its template.
3. [ ] **Type Correctness**: All new functions and services must have explicit TypeScript types defined in `types/index.ts`.
4. [ ] **No Dead Code**: Remove unused imports, variables, and placeholder files.
5. [ ] **Verify Compilation**:
   - `pnpm typecheck` must report **0 errors**.
   - `pnpm build` must complete cleanly with **0 errors**.
