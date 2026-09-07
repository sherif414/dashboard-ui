# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Evaluators**: Tech recruiters, engineering hiring managers, frontend leads, and peer engineers assessing architectural patterns, component craftsmanship, state management, and modern Vue 3 / TypeScript capabilities.
- **Subject Persona**: Store managers and e-commerce operators monitoring real-time store metrics, managing inventory catalog, fulfilling orders, and communicating with customers.

## Product Purpose

Metrix exists as a premier frontend engineering portfolio showcase disguised as a fully functional, enterprise-grade e-commerce operations dashboard. Its success is defined by delivering an immediate, zero-friction local onboarding experience (`pnpm install && pnpm dev`) where evaluators can experience realistic, offline-first client-side CRUD, simulated live chat reactivity, and high-craft UI polish without configuring cloud credentials or backend servers.

## Positioning

A 100% client-side, local-first dashboard architecture powered by an in-browser relational mock database engine (`mockDb` backed by `localStorage`) and event-driven simulated real-time communication. Unlike typical portfolio mockups that display static dummy JSON or break without an active backend API, Metrix maintains full relational persistence, interactive data mutation, and instant state restoration ("Reset Data") within an entirely local environment.

## Operating Context

- **Evaluator Environment**: Evaluated in modern desktop and mobile browsers across diverse viewports and operating systems.
- **Evaluation Workflows**: Exploring executive analytics, paginating and updating order lifecycles, searching and managing customer records, publishing products with Base64 image attachments, interacting with live simulated chat replies (~1.2s delay), switching between dark and light themes, and resetting sample data to pristine seed states.
- **Run Constraints**: Zero-credential, zero-remote-dependency execution running on local Vite development server.

## Capabilities and Constraints

- **Confirmed Capabilities**:
  - Executive analytics overview with dynamic line charts (Chart.js) and donut breakdowns.
  - Comprehensive Orders management (filtering, pagination, multi-item creation, order status workflow).
  - Customers management (directory, search, purchase history, creation).
  - Products catalog & inventory management (stock status, publish toggles, Base64 image uploads).
  - Simulated real-time team & customer chat via in-memory pub/sub EventEmitter with automated reply bot.
  - Personalization settings (avatar upload, profile details, theme switching, security toggles).
  - Instant demo data reset to restore pristine seed state at any time.
- **Technical Constraints**:
  - Vue 3 Composition API with `<script setup>`.
  - TypeScript strict typing (zero `vue-tsc` errors).
  - UnoCSS atomic design token styling.
  - No global component registration and no auto-import magic; explicit imports across all components.
  - Client-side persistence strictly contained in `localStorage` (`dashboard_mock_db_v1`).
- **Visual Direction**:
  - Pushing towards a bolder, more avant-garde editorial visual identity while preserving operational clarity and data density.

## Brand Commitments

- **Brand Name**: Metrix
- **Tone & Voice**: Forward-leaning, precise, modern, and confident. Professional store intelligence paired with editorial typography and craft.
- **Visual Identity**: High contrast, crisp surface hierarchies, purposeful motion, and refined dark/light mode parity.

## Evidence on Hand

- Pre-seeded local dataset in `src/services/mock/seedData.ts` (10 customers, 10 products with inventory, 8 multi-item orders, chat threads, admin profile).
- Architectural and operational rules documented in `AGENTS.md` and `README.md`.
- Working relational mock database engine in `src/services/mock/mockDb.ts`.
- *Absence Note*: No remote backend, cloud database, or third-party authentication API exists or should be simulated as external network calls; everything runs strictly local.

## Product Principles

1. **Zero Friction for Evaluators**: Instant, seamless local startup with zero external accounts, `.env` files, or remote dependencies required.
2. **Explicit Architectural Rigor**: Strict separation of concerns (Presentation → Store → Domain Service → Persistence) and 100% explicit imports with zero implicit global state.
3. **Avant-Garde Craft with Operational Scanability**: High visual polish, editorial typographic hierarchy, and tactile micro-interactions without compromising dense, scan-friendly data tables and management workflows.
4. **Deterministic Demonstrability**: Every action produces tangible local persistence, with a one-click reset to return to the baseline showcase state.

## Accessibility & Inclusion

- WCAG 2.1 AA target standards across both dark and light surfaces.
- Accessible color contrast ratios on text and status badges.
- Keyboard navigability for modals, dropdowns, and data table controls.
- Responsive layout resilience across desktop, tablet, and mobile breakpoints.
