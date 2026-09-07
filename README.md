# Metrix — Modern Store Dashboard (Frontend Showcase)

An enterprise-grade, responsive e-commerce store management dashboard built with **Vue 3**, **Vite**, **TypeScript**, **Pinia**, and **UnoCSS**.

Designed as a frontend portfolio showcase demonstrating clean architectural patterns, robust state management, explicit component composition, and a fully self-contained, offline-first mock backend with reactive real-time capabilities.

---

## 🌟 Key Highlights & Architecture

### 1. Clean Layered Architecture
The codebase strictly adheres to modular separation of concerns:
```
Presentation Layer (Vue Components & Views)
        ↓
State Management (Pinia Stores with Composition API)
        ↓
Domain Service Layer (authService, customerService, productService, orderService, chatService)
        ↓
Persistence & Mock DB Engine (LocalStorage, In-memory pub/sub EventEmitter)
```

### 2. 100% Local / Zero Remote Dependencies
- Replaced third-party cloud backends with an in-browser local storage engine (`dashboard_mock_db_v1`).
- Seeded with realistic e-commerce data: 10 customers, 10 products with inventory, 8 multi-item orders, chat conversations, and an admin user profile.
- Supports full client-side CRUD: creating orders, toggling customer status, publishing products, uploading images (Base64 encoding), and updating user settings.
- Features a **"Reset Data"** button in the header to effortlessly restore sample demo data at any time.

### 3. Interactive Real-Time Demo Chat
- Built-in pub/sub event system simulating real-time conversations.
- Automated simulated response engine: sending a message triggers a contextual simulated reply after ~1.2s to demonstrate live chat dynamics offline.

### 4. Strict Explicit Imports
- Eliminates magic auto-imports and implicit globals.
- Every Vue component explicitly imports its child components, Vue Composition APIs, composables, and typed icon components (`~/components/icons`).

---

## 🚀 Features

- **Executive Analytics Dashboard**: Summary cards, revenue line charts, order distribution donut charts, and recent activity tables.
- **Orders Management**: Paginated table, status filtering, order details with items breakdown, order lifecycle progression, and interactive order creation modal.
- **Customers Directory**: Paginated customer list, customer search, details view with purchase history, and new customer modal.
- **Products & Inventory**: Catalog management, stock tracking, publish status toggle, image uploads, and product creation.
- **Live Team & Customer Messaging**: Real-time conversation threads with simulated responses and search.
- **Account & Personalization Settings**:
  - Profile info editing with avatar image upload.
  - Dark / Light mode toggle with responsive UI transitions.
  - Security & 2FA toggles and password change simulation.

---

## 🛠 Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [UnoCSS](https://unocss.dev/) (On-demand atomic CSS engine)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [Chartist](https://gionkunz.github.io/chartist-js/)
- **Utilities**: [@vueuse/core](https://vueuse.org/), [dayjs](https://day.js.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ (tested up to Node.js 24)
- pnpm 9+ / 11+

### Installation

```bash
# Clone the repository
git clone https://github.com/sherif414/dashboard-ui.git
cd dashboard-ui

# Install dependencies
pnpm install
```

### Development

```bash
# Start local development server (http://127.0.0.1:3000)
pnpm dev
```

### Build & Typecheck

```bash
# Run TypeScript typecheck
pnpm typecheck

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

---

## 📁 Project Structure

```
src/
├── api/             # Local API client shim
├── assets/          # Static assets and images
├── components/      # Reusable UI components (Buttons, Inputs, Tables, Charts, Modals)
│   └── icons/       # Typed SVG icon components with barrel export
├── composables/     # Composition utilities (theme, messages, loaders)
├── pages/           # Route views (dashboard, orders, customers, products, chat, settings)
├── services/        # Business logic services & mock database engine
│   ├── mock/        # mockDb.ts, seedData.ts
│   ├── authService.ts
│   ├── customerService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── chatService.ts
├── store/           # Pinia stores (auth, customers, orders, products)
├── styles/          # Global styles and resets
├── App.vue          # Root application shell
└── main.ts          # Application entrypoint
```

---

## 📄 License
MIT
