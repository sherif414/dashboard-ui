<template>
  <main class="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden w-full">
    <!-- 1. Hero Command & Store Overview Header -->
    <header class="surface-1 rounded-lg p-5 sm:p-6 border border-gray-2 dark:border-dark-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
      <div class="flex flex-col gap-1.5 z-1">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-1.5rem sm:text-1.75rem font-bold typo-clr-base tracking-tight font-sans">
            Store Operations Hub
          </h1>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-11px font-mono font-medium surface-2 border border-gray-2 dark:border-dark-3 typo-clr-base">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none"></span>
            <span>Live System</span>
            <span class="text-gray-4 dark:text-dark-3">·</span>
            <span class="typo-clr-muted">{{ activePeriodLabel }}</span>
          </span>
        </div>
        <p class="typo-sm typo-clr-muted max-w-xl">
          Real-time sales performance, fulfillment throughput, and live catalog inventory joined in-browser.
        </p>
      </div>

      <!-- Controls & Primary Action -->
      <div class="flex items-center gap-3 flex-wrap z-1">
        <!-- Period Segmented Switcher -->
        <div
          role="tablist"
          aria-label="Timeline interval selector"
          class="inline-flex p-1 rounded-md surface-2 border border-gray-2 dark:border-dark-3 typo-sm font-medium"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="selectedPeriod === period"
            v-for="period in (['all', 'month', 'week', 'day'] as const)"
            :key="period"
            @click="handlePeriodChange(period)"
            :class="[
              selectedPeriod === period
                ? 'surface-1 shadow-xs typo-clr-base font-semibold'
                : 'typo-clr-muted hover:typo-clr-base',
              'px-3 py-1.5 rounded-md transition-all duration-150 cursor-pointer text-12px font-medium tracking-normal active:scale-95 focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5) inline-flex items-center gap-1.5',
            ]"
          >
            <span
              v-if="selectedPeriod === period && orderStore.isLoadingMetrics"
              class="w-1.5 h-1.5 rounded-full bg-indigo-6 dark:bg-violet-4 animate-ping motion-reduce:animate-none shrink-0"
              aria-hidden="true"
            />
            <span>{{ periodOptionsMap[period] }}</span>
          </button>
        </div>

        <button
          type="button"
          @click="openOrderDialog"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md fill-primary-2 typo-clr-on-primary font-medium typo-sm hover:fill-primary-3 active:fill-primary-1 active:scale-95 transition-all duration-150 shadow-xs cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
        >
          <IAdd width="16" height="16" />
          <span>New Order</span>
        </button>
      </div>
    </header>

    <!-- 2. Visual KPI Matrix (Tabular Monospace Stat Tiles with Mini-Metrics) -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Gross Revenue (Anchor Metric Card) -->
      <div class="surface-1 rounded-lg p-5 border border-indigo-5/30 dark:border-violet-5/30 shadow-xs flex flex-col justify-between min-h-[190px] transition-colors duration-150 hover:border-indigo-5/60 dark:hover:border-violet-5/60">
        <div class="flex items-center justify-between">
          <span class="text-11px font-mono font-bold uppercase tracking-wider typo-clr-primary">Total Revenue</span>
          <div class="w-8 h-8 rounded-md bg-indigo-6 dark:bg-violet-6 text-white flex items-center justify-center shadow-xs">
            <IMoney width="18" height="18" />
          </div>
        </div>
        <div class="h-[62px] flex flex-col justify-between my-1">
          <template v-if="orderStore.isLoadingMetrics">
            <div class="h-7 w-36 rounded bg-gray-2 dark:bg-dark-3 animate-pulse motion-reduce:animate-none" />
            <div class="h-3.5 w-28 rounded bg-gray-2 dark:bg-dark-3 animate-pulse motion-reduce:animate-none" />
          </template>
          <template v-else>
            <div class="text-1.75rem sm:text-2rem font-bold font-mono tracking-tight typo-clr-base leading-none">
              {{ formattedRevenue }}
            </div>
            <div class="flex items-center gap-1.5 text-12px leading-none">
              <span
                :class="orderStore.metrics?.revenueDelta?.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                class="font-semibold inline-flex items-center gap-0.5 tabular-nums"
              >
                {{ orderStore.metrics?.revenueDelta?.isPositive ? '↑' : '↓' }} {{ orderStore.metrics?.revenueDelta?.formatted ?? '+0%' }}
              </span>
              <span class="typo-clr-muted">vs prior period</span>
            </div>
          </template>
        </div>
        <div class="pt-2 border-t border-gray-2 dark:border-dark-3 flex justify-between text-11px font-mono typo-clr-muted">
          <span>Avg Order Value</span>
          <span class="typo-clr-base font-bold tabular-nums">${{ avgOrderValue }}</span>
        </div>
      </div>

      <!-- Sales Volume & Order Units -->
      <div class="surface-1 rounded-lg p-5 border border-gray-2 dark:border-dark-3 shadow-xs flex flex-col justify-between min-h-[190px] transition-colors duration-150 hover:border-gray-4 dark:hover:border-dark-1">
        <div class="flex items-center justify-between">
          <span class="text-11px font-mono font-bold uppercase tracking-wider typo-clr-muted">Units Sold</span>
          <div class="w-8 h-8 rounded-md bg-amber-5/10 dark:bg-amber-5/15 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <ICart width="18" height="18" />
          </div>
        </div>
        <div class="h-[62px] flex flex-col justify-between my-1">
          <template v-if="orderStore.isLoadingMetrics">
            <div class="h-7 w-24 rounded bg-gray-2 dark:bg-dark-3 animate-pulse motion-reduce:animate-none" />
            <div class="h-3.5 w-28 rounded bg-gray-2 dark:bg-dark-3 animate-pulse motion-reduce:animate-none" />
          </template>
          <template v-else>
            <div class="text-1.75rem sm:text-2rem font-bold font-mono tracking-tight typo-clr-base leading-none">
              {{ orderStore.metrics?.salesVolume ?? 0 }}
            </div>
            <div class="flex items-center gap-1.5 text-12px leading-none">
              <span
                :class="orderStore.metrics?.unitsDelta?.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                class="font-semibold inline-flex items-center gap-0.5 tabular-nums"
              >
                {{ orderStore.metrics?.unitsDelta?.isPositive ? '↑' : '↓' }} {{ orderStore.metrics?.unitsDelta?.formatted ?? '+0%' }}
              </span>
              <span class="typo-clr-muted">vs prior period</span>
            </div>
          </template>
        </div>
        <div class="pt-2 border-t border-gray-2 dark:border-dark-3 flex justify-between text-11px font-mono typo-clr-muted">
          <span>Total Orders</span>
          <span class="typo-clr-base font-bold tabular-nums">{{ orderStore.metrics?.allOrdersCount ?? 0 }} records</span>
        </div>
      </div>

      <!-- Order Fulfillment Velocity -->
      <div class="surface-1 rounded-lg p-5 border border-gray-2 dark:border-dark-3 shadow-xs flex flex-col justify-between min-h-[190px] transition-colors duration-150 hover:border-gray-4 dark:hover:border-dark-1">
        <div class="flex items-center justify-between">
          <span class="text-11px font-mono font-bold uppercase tracking-wider typo-clr-muted">Fulfillment Rate</span>
          <div class="w-8 h-8 rounded-md bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <ICheckCircle width="18" height="18" />
          </div>
        </div>
        <div class="h-[62px] flex flex-col justify-between my-1">
          <template v-if="orderStore.isLoadingMetrics">
            <div class="h-7 w-20 rounded bg-gray-2 dark:bg-dark-3 animate-pulse motion-reduce:animate-none" />
            <div class="h-3.5 w-32 rounded bg-gray-2 dark:bg-dark-3 animate-pulse motion-reduce:animate-none" />
          </template>
          <template v-else>
            <div class="text-1.75rem sm:text-2rem font-bold font-mono tracking-tight typo-clr-base leading-none">
              {{ fulfillmentRatePct }}%
            </div>
            <div class="flex items-center gap-1.5 text-12px leading-none">
              <span class="text-emerald-700 dark:text-emerald-400 font-semibold">{{ orderStore.metrics?.completedCount ?? 0 }} fulfilled</span>
              <span class="typo-clr-muted">· {{ orderStore.metrics?.pendingCount ?? 0 }} pending</span>
            </div>
          </template>
        </div>
        <div class="pt-2 border-t border-gray-2 dark:border-dark-3 flex justify-between text-11px font-mono typo-clr-muted">
          <span>Cancellation Rate</span>
          <span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums">{{ cancelledRatePct }}%</span>
        </div>
      </div>

      <!-- Active Catalog Inventory -->
      <div class="surface-1 rounded-lg p-5 border border-gray-2 dark:border-dark-3 shadow-xs flex flex-col justify-between min-h-[190px] transition-colors duration-150 hover:border-gray-4 dark:hover:border-dark-1">
        <div class="flex items-center justify-between">
          <span class="text-11px font-mono font-bold uppercase tracking-wider typo-clr-muted">Active Catalog</span>
          <div class="w-8 h-8 rounded-md bg-indigo-5/10 dark:bg-violet-5/15 flex items-center justify-center typo-clr-primary">
            <IInventory width="18" height="18" />
          </div>
        </div>
        <div class="h-[62px] flex flex-col justify-between my-1">
          <template v-if="orderStore.isLoadingMetrics">
            <div class="h-7 w-28 rounded bg-gray-2 dark:bg-dark-3 animate-pulse motion-reduce:animate-none" />
            <div class="h-3.5 w-30 rounded bg-gray-2 dark:bg-dark-3 animate-pulse motion-reduce:animate-none" />
          </template>
          <template v-else>
            <div class="text-1.75rem sm:text-2rem font-bold font-mono tracking-tight typo-clr-base leading-none">
              {{ productStore.countPublished ?? 0 }}
              <span class="text-1rem font-normal typo-clr-muted">/ {{ productStore.countAll ?? 0 }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-12px leading-none">
              <span class="text-emerald-700 dark:text-emerald-400 font-semibold">{{ orderStore.metrics?.inStockPct ?? 100 }}% In-Stock</span>
              <span class="typo-clr-muted">active in store</span>
            </div>
          </template>
        </div>
        <div class="pt-2 border-t border-gray-2 dark:border-dark-3 flex justify-between text-11px font-mono typo-clr-muted">
          <span>Catalog Health</span>
          <span class="typo-clr-base font-bold tabular-nums">{{ orderStore.metrics?.inStockPct ?? 100 }}% optimal</span>
        </div>
      </div>
    </section>

    <!-- 3. Primary Data Graphic: Interactive Revenue Velocity Spline & Fulfillment Pipeline -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      <!-- Interactive SVG Velocity Spline (2 Cols) -->
      <article class="lg:col-span-2 surface-1 rounded-lg p-5 sm:p-6 border border-gray-2 dark:border-dark-3 shadow-sm flex flex-col justify-between gap-5 h-full">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-2">
              <h2 class="typo-head typo-clr-base text-1.15rem">Revenue Performance</h2>
              <span
                v-if="orderStore.isLoadingMetrics"
                class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-10px font-mono bg-indigo-5/10 text-indigo-6 dark:bg-violet-5/15 dark:text-violet-4"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-5 dark:bg-violet-4 animate-pulse"></span>
                <span>Updating...</span>
              </span>
            </div>
            <p class="typo-sm typo-clr-muted">Sales timeline with hover inspection and order volume</p>
          </div>

          <!-- Scrub Highlight Box -->
          <div
            aria-live="polite"
            class="flex items-center gap-2 px-3 py-1.5 rounded surface-2 border border-gray-2 dark:border-dark-3 font-mono text-12px"
          >
            <span class="typo-clr-muted text-11px uppercase">Inspector:</span>
            <span v-if="hoveredPoint" class="font-bold typo-clr-primary tabular-nums">
              Order #{{ hoveredPoint.orderId }} · ${{ hoveredPoint.amount.toFixed(2) }}
            </span>
            <span v-else class="font-bold typo-clr-base tabular-nums">
              ${{ activeLatestAmount }}
            </span>
            <span class="typo-clr-muted text-11px">({{ hoveredPoint ? hoveredPoint.time : 'Latest Order' }})</span>
          </div>
        </div>

        <!-- Cartesian Visual Chart Container -->
        <div class="flex flex-col gap-1.5">
          <div class="flex gap-2 items-stretch h-220px sm:h-260px pt-2">
            <!-- Y-Axis Currency Scale Ticks -->
            <div class="flex flex-col justify-between items-end text-11px font-mono typo-clr-muted select-none pr-1.5 py-1 w-14 shrink-0" aria-hidden="true">
              <span v-for="(tick, idx) in yAxisTicks" :key="idx" class="tabular-nums font-medium leading-none">{{ tick }}</span>
            </div>

            <!-- Custom Visual SVG Spline Canvas -->
            <div class="relative flex-1 h-full min-w-0 overflow-hidden">
              <!-- Background Horizontal Grid Lines -->
              <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25 dark:opacity-15 py-1" aria-hidden="true">
                <div class="border-b border-dashed border-gray-4 dark:border-gray-2 w-full h-0"></div>
                <div class="border-b border-dashed border-gray-4 dark:border-gray-2 w-full h-0"></div>
                <div class="border-b border-dashed border-gray-4 dark:border-gray-2 w-full h-0"></div>
                <div class="border-b border-dashed border-gray-4 dark:border-gray-2 w-full h-0"></div>
              </div>

              <!-- Empty State (if no orders in selected period and not loading) -->
              <div
                v-if="!orderStore.isLoadingMetrics && !normalizedPoints.length"
                key="chart-empty"
                class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 gap-1.5"
              >
                <p class="typo-sm font-semibold typo-clr-base">No transactions in this period</p>
                <p class="typo-xs typo-clr-muted max-w-sm">No recorded orders match the selected {{ activePeriodLabel.toLowerCase() }}. Select another window or create a new order.</p>
              </div>

              <!-- Fluid Morphing SVG Spline Canvas -->
              <svg
                v-if="activeSamples.length && (incomingDots.length || outgoingDots.length)"
                class="w-full h-full overflow-visible absolute inset-0"
                :class="{ 'opacity-65 transition-opacity duration-200': orderStore.isLoadingMetrics }"
                viewBox="0 0 700 220"
                preserveAspectRatio="none"
                role="img"
                aria-label="Revenue velocity interactive graph"
              >
                <defs>
                  <linearGradient id="splineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.35" class="dark:stop-color-violet-5" />
                    <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.0" class="dark:stop-color-violet-5" />
                  </linearGradient>
                </defs>

                <!-- Vertical Guideline: Hover crosshair -->
                <line
                  v-if="hoveredNormalizedPoint"
                  :x1="hoveredNormalizedPoint.x"
                  :y1="0"
                  :x2="hoveredNormalizedPoint.x"
                  :y2="220"
                  stroke="currentColor"
                  stroke-dasharray="3 3"
                  stroke-width="1.5"
                  class="text-indigo-4 dark:text-violet-4 opacity-75 pointer-events-none"
                />

                <!-- Single-point Anchor Guideline -->
                <line
                  v-else-if="incomingDots.length === 1 && morphProgress > 0.3"
                  :x1="incomingDots[0].x"
                  :y1="incomingDots[0].y"
                  :x2="incomingDots[0].x"
                  :y2="220"
                  stroke="currentColor"
                  stroke-dasharray="3 3"
                  stroke-width="1.5"
                  :opacity="morphProgress"
                  class="text-indigo-4 dark:text-violet-4 pointer-events-none transition-opacity duration-150"
                />

                <!-- Filled Area Under Morphing Curve -->
                <path
                  :d="splineAreaPath"
                  fill="url(#splineGradient)"
                />

                <!-- Morphing Stroke Path -->
                <path
                  :d="splineStrokePath"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-indigo-6 dark:text-violet-5"
                />

                <!-- Outgoing Data Points (Dissolving & Shrinking in Place) -->
                <g v-if="morphProgress < 1">
                  <circle
                    v-for="(pt, idx) in outgoingDots"
                    :key="`out-${idx}-${pt.raw.orderId}`"
                    :cx="pt.x"
                    :cy="pt.y"
                    :r="Math.max(0, 5 * (1 - morphProgress))"
                    :opacity="Math.max(0, 1 - morphProgress)"
                    class="fill-white dark:fill-dark-4 stroke-indigo-6 dark:stroke-violet-4 pointer-events-none"
                    stroke-width="3"
                  />
                </g>

                <!-- Incoming / Active Data Points (Blooming into Place) -->
                <g v-for="(pt, idx) in incomingDots" :key="`in-${idx}-${pt.raw.orderId}`">
                  <circle
                    :ref="(el) => setDotRef(el, idx)"
                    role="button"
                    tabindex="0"
                    :aria-label="`Order #${pt.raw.orderId}, $${pt.raw.amount.toFixed(2)} at ${pt.raw.time}`"
                    :cx="pt.x"
                    :cy="pt.y"
                    :r="hoveredPoint?.orderId === pt.raw.orderId ? 7 : Math.max(0, 5 * morphProgress)"
                    :opacity="morphProgress"
                    class="chart-dot fill-white dark:fill-dark-4 stroke-indigo-6 dark:stroke-violet-4 cursor-pointer focus:outline-none focus-visible:(stroke-indigo-4 dark:stroke-violet-3 stroke-5)"
                    :stroke-width="hoveredPoint?.orderId === pt.raw.orderId ? 4 : 3"
                    @mouseenter="hoveredPoint = pt.raw"
                    @mouseleave="hoveredPoint = null"
                    @focus="hoveredPoint = pt.raw"
                    @blur="hoveredPoint = null"
                    @keydown.left.prevent="focusNeighborDot(idx - 1)"
                    @keydown.right.prevent="focusNeighborDot(idx + 1)"
                  />
                </g>
                <!-- Floating Anchored Tooltip over active data point -->
                <g
                  v-if="hoveredNormalizedPoint"
                  class="pointer-events-none transition-transform duration-100 ease-out"
                  :transform="`translate(${Math.min(Math.max(hoveredNormalizedPoint.x, 75), 625)}, ${hoveredNormalizedPoint.y < 45 ? hoveredNormalizedPoint.y + 40 : hoveredNormalizedPoint.y - 30})`"
                >
                  <rect
                    x="-70"
                    y="-15"
                    width="140"
                    height="30"
                    rx="6"
                    class="fill-white dark:fill-dark-2 stroke-gray-3 dark:stroke-dark-3"
                    stroke-width="1"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  />
                  <text
                    x="0"
                    y="4"
                    text-anchor="middle"
                    class="font-mono text-11px font-bold fill-gray-9 dark:fill-gray-1"
                  >
                    Order #{{ hoveredNormalizedPoint.raw.orderId }} · ${{ hoveredNormalizedPoint.raw.amount.toFixed(2) }}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <!-- X-Axis Timeline Baseline -->
          <div
            class="flex items-center text-11px font-mono typo-clr-muted pl-16 pr-2 pt-0.5 select-none"
            :class="xAxisLabels.length === 1 ? 'justify-center' : 'justify-between'"
            aria-hidden="true"
          >
            <span v-for="(label, idx) in xAxisLabels" :key="idx" class="tabular-nums">{{ label }}</span>
          </div>
        </div>

        <!-- Metric Footer Ticker -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-2 dark:border-dark-3 text-12px font-mono">
          <div class="flex flex-col">
            <span class="typo-clr-muted text-11px uppercase">Peak Order</span>
            <span class="font-bold typo-clr-base tabular-nums">${{ peakTransactionAmount }}</span>
          </div>
          <div class="flex flex-col">
            <span class="typo-clr-muted text-11px uppercase">Median Order</span>
            <span class="font-bold typo-clr-base tabular-nums">${{ medianTicketAmount }}</span>
          </div>
          <div class="flex flex-col">
            <span class="typo-clr-muted text-11px uppercase">Fulfillment Rate</span>
            <span class="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{{ fulfillmentRatePct }}%</span>
          </div>
          <div class="flex flex-col">
            <span class="typo-clr-muted text-11px uppercase">Avg Items / Order</span>
            <span class="font-bold typo-clr-primary tabular-nums">{{ avgItemsPerOrder }} units</span>
          </div>
        </div>
      </article>

      <!-- Fulfillment Pipeline Flow (1 Col) -->
      <article class="surface-1 rounded-lg p-5 sm:p-6 border border-gray-2 dark:border-dark-3 shadow-sm flex flex-col justify-between gap-5 h-full">
        <div>
          <div class="flex items-center justify-between">
            <h2 class="typo-head typo-clr-base text-1.15rem">Fulfillment Throughput</h2>
            <span class="text-11px font-mono px-2 py-0.5 rounded surface-2 border border-gray-2 dark:border-dark-3 typo-clr-muted">
              Pipeline Status
            </span>
          </div>
          <p class="typo-sm typo-clr-muted mt-1">Lifecycle distribution across orders in selected window</p>
        </div>

        <!-- Proportional Pipeline Progress Rail -->
        <div
          role="progressbar"
          aria-label="Order fulfillment pipeline ratio"
          :aria-valuenow="fulfillmentRatio.completed"
          aria-valuemin="0"
          aria-valuemax="100"
          class="flex flex-col gap-2"
        >
          <div class="w-full h-4 rounded-full overflow-hidden flex bg-gray-2 dark:bg-dark-3 border border-gray-2 dark:border-dark-3">
            <div
              class="h-full bg-emerald-500 transition-all duration-500"
              :style="{ width: `${fulfillmentRatio.completed}%` }"
              :title="`Fulfilled: ${fulfillmentRatio.completed}%`"
            />
            <div
              class="h-full bg-amber-500 transition-all duration-500"
              :style="{ width: `${fulfillmentRatio.pending}%` }"
              :title="`Pending: ${fulfillmentRatio.pending}%`"
            />
            <div
              class="h-full bg-rose-500 transition-all duration-500"
              :style="{ width: `${fulfillmentRatio.cancelled}%` }"
              :title="`Cancelled: ${fulfillmentRatio.cancelled}%`"
            />
          </div>
          <div class="flex justify-between text-11px font-mono typo-clr-muted">
            <span>0%</span>
            <span>50%</span>
            <span>100% Target</span>
          </div>
        </div>

        <!-- Detailed Status Breakdown Cards -->
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center justify-between p-2.5 rounded-md surface-2 border border-gray-2 dark:border-dark-3">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span class="typo-sm font-medium typo-clr-base">Fulfilled Orders</span>
            </div>
            <div class="flex items-center gap-2 font-mono text-12px">
              <span class="font-bold typo-clr-base tabular-nums">{{ orderStore.metrics?.completedCount ?? 0 }}</span>
              <span class="typo-clr-muted tabular-nums">({{ fulfillmentRatio.completed }}%)</span>
            </div>
          </div>

          <div class="flex items-center justify-between p-2.5 rounded-md surface-2 border border-gray-2 dark:border-dark-3">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-amber-500"></span>
              <span class="typo-sm font-medium typo-clr-base">Pending Fulfillment</span>
            </div>
            <div class="flex items-center gap-2 font-mono text-12px">
              <span class="font-bold typo-clr-base tabular-nums">{{ orderStore.metrics?.pendingCount ?? 0 }}</span>
              <span class="typo-clr-muted tabular-nums">({{ fulfillmentRatio.pending }}%)</span>
            </div>
          </div>

          <div class="flex items-center justify-between p-2.5 rounded-md surface-2 border border-gray-2 dark:border-dark-3">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-rose-500"></span>
              <span class="typo-sm font-medium typo-clr-base">Cancelled Orders</span>
            </div>
            <div class="flex items-center gap-2 font-mono text-12px">
              <span class="font-bold typo-clr-base tabular-nums">{{ orderStore.metrics?.cancelledCount ?? 0 }}</span>
              <span class="typo-clr-muted tabular-nums">({{ fulfillmentRatio.cancelled }}%)</span>
            </div>
          </div>
        </div>

        <!-- Quick Route to Fulfillment Queue -->
        <RouterLink
          to="/orders"
          class="w-full py-2 px-3 text-center rounded-md surface-2 hover:surface-3 border border-gray-2 dark:border-dark-3 typo-sm font-medium typo-clr-primary transition flex items-center justify-center gap-1.5 focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
        >
          <span>Open Orders Manager</span>
          <IExternalLink width="14" height="14" />
        </RouterLink>
      </article>
    </section>

    <!-- 4. Operational Canvas Lower Tier: Top Performing Products & Live Order Stream -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      <!-- Top Revenue Driver Products (1 Col) -->
      <article class="surface-1 rounded-lg p-5 sm:p-6 border border-gray-2 dark:border-dark-3 shadow-sm flex flex-col justify-between gap-4 h-full">
        <div>
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-0.5">
              <h2 class="typo-head typo-clr-base text-1.15rem">Top Selling Products</h2>
              <p class="typo-sm typo-clr-muted">Ranked by sales revenue</p>
            </div>
            <RouterLink to="/products" class="typo-sm typo-clr-primary hover:underline text-12px">
              Catalog →
            </RouterLink>
          </div>

          <div v-if="topProductsList.length" class="flex flex-col divide-y dark:divide-dark-3 divide-gray-2 mt-2">
            <div
              v-for="prod in topProductsList"
              :key="prod.id"
              class="py-2.5 px-2 -mx-2 rounded-md hover:surface-2 transition-colors flex items-center justify-between gap-3 group"
            >
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="getProductImageUrl(prod.image)"
                  :alt="prod.name ?? 'Product'"
                  class="w-10 h-10 rounded-md object-cover border border-gray-2 dark:border-dark-3 group-hover:scale-105 transition shrink-0"
                />
                <div class="flex flex-col min-w-0">
                  <RouterLink
                    :to="`/products/${prod.id}`"
                    class="typo-sm font-medium typo-clr-base group-hover:typo-clr-primary truncate transition"
                  >
                    {{ prod.name }}
                  </RouterLink>
                  <div class="flex items-center gap-2 text-11px typo-clr-muted font-mono">
                    <span>{{ prod.category }}</span>
                    <span>·</span>
                    <span>{{ prod.stock }} in stock</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-end shrink-0 font-mono">
                <span class="typo-sm font-bold typo-clr-base tabular-nums">
                  ${{ prod.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                </span>
                <span class="text-11px text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                  {{ prod.ordersCount }} orders
                </span>
              </div>
            </div>
          </div>
          <div v-else class="py-8 text-center typo-clr-muted typo-sm flex flex-col items-center justify-center gap-1.5">
            <p class="font-medium typo-clr-base">No product sales in this period</p>
            <p class="text-11px typo-clr-muted">Top products appear dynamically as store transactions occur.</p>
            <RouterLink to="/products" class="typo-clr-primary hover:underline text-12px mt-1">Browse Catalog →</RouterLink>
          </div>
        </div>

        <!-- Catalog Health Summary Footer -->
        <div class="pt-3 border-t border-gray-2 dark:border-dark-3 flex justify-between items-center text-11px font-mono typo-clr-muted">
          <span>Catalog Health</span>
          <span class="text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">{{ orderStore.metrics?.inStockPct ?? 100 }}% in stock</span>
        </div>
      </article>

      <!-- Live Order Feed & Dispatch Desk (2 Cols) -->
      <div class="lg:col-span-2 h-full flex flex-col">
        <RecentOrders ref="recentOrdersRef" class="h-full" />
      </div>
    </section>

    <!-- Modal Order Dialog -->
    <OrderDialog ref="orderDialogRef" @success="handleOrderCreated" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductsStore } from '~/store/products'
import { useCustomersStore } from '~/store/customers'
import { useOrderStore } from '~/store/orders'
import RecentOrders from '~/components/RecentOrders.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import { getProductImageUrl } from '~/services/imageUtils'
import {
  IAdd,
  IMoney,
  ICart,
  ICheckCircle,
  IInventory,
  IExternalLink,
} from '~/components/icons'

const productStore = useProductsStore()
const customerStore = useCustomersStore()
const orderStore = useOrderStore()

const orderDialogRef = ref<InstanceType<typeof OrderDialog> | null>(null)
const recentOrdersRef = ref<InstanceType<typeof RecentOrders> | null>(null)
const selectedPeriod = ref<'day' | 'week' | 'month' | 'all'>('all')
const hoveredPoint = ref<{ time: string; amount: number; orderId: number } | null>(null)

const periodOptionsMap: Record<'all' | 'month' | 'week' | 'day', string> = {
  all: 'All Time',
  month: 'Month',
  week: 'Week',
  day: 'Day',
}

const activePeriodLabel = computed(() => {
  switch (selectedPeriod.value) {
    case 'day': return 'Today / 24h Window'
    case 'week': return 'Current Week'
    case 'month': return 'Current Month'
    default: return 'All System Records'
  }
})

const formattedRevenue = computed(() => {
  const rev = orderStore.metrics?.totalRevenue ?? 0
  return `$${rev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
})

const avgOrderValue = computed(() => {
  const count = orderStore.metrics?.allOrdersCount || 0
  const rev = orderStore.metrics?.totalRevenue || 0
  if (!count) return '0.00'
  return (rev / count).toFixed(2)
})

const avgItemsPerOrder = computed(() => {
  const count = orderStore.metrics?.allOrdersCount || 0
  const units = orderStore.metrics?.salesVolume || 0
  if (!count) return '0.0'
  return (units / count).toFixed(1)
})

const fulfillmentRatePct = computed(() => {
  const total = orderStore.metrics?.allOrdersCount || 1
  const completed = orderStore.metrics?.completedCount || 0
  return Math.round((completed / total) * 100)
})

const cancelledRatePct = computed(() => {
  const total = orderStore.metrics?.allOrdersCount || 1
  const cancelled = orderStore.metrics?.cancelledCount || 0
  return Math.round((cancelled / total) * 100)
})

const fulfillmentRatio = computed(() => {
  const total = orderStore.metrics?.allOrdersCount || 1
  const comp = orderStore.metrics?.completedCount || 0
  const pend = orderStore.metrics?.pendingCount || 0
  const canc = orderStore.metrics?.cancelledCount || 0

  const compPct = Math.round((comp / total) * 100)
  const pendPct = Math.round((pend / total) * 100)
  const cancPct = Math.min(100 - compPct - pendPct, Math.round((canc / total) * 100))

  return {
    completed: compPct,
    pending: pendPct,
    cancelled: Math.max(0, cancPct),
  }
})

// Top products
const topProductsList = computed(() => {
  return orderStore.metrics?.topProducts || []
})

// SVG Velocity Spline Generation
const rawPoints = computed(() => {
  return orderStore.metrics?.velocityPoints || []
})

const peakTransactionAmount = computed(() => {
  const amounts = rawPoints.value.map((p) => p.amount)
  if (!amounts.length) return '0.00'
  return Math.max(...amounts, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
})

const medianTicketAmount = computed(() => {
  const sorted = [...rawPoints.value.map((p) => p.amount)].sort((a, b) => a - b)
  if (!sorted.length) return '0.00'
  const mid = Math.floor(sorted.length / 2)
  return sorted[mid].toLocaleString('en-US', { minimumFractionDigits: 2 })
})

const activeLatestAmount = computed(() => {
  const pts = rawPoints.value
  if (!pts.length) return '0.00'
  return pts[pts.length - 1].amount.toFixed(2)
})

const normalizedPoints = computed(() => {
  const pts = rawPoints.value
  if (!pts.length) return []
  const maxVal = Math.max(...pts.map((p) => p.amount), 100)
  const width = 700
  const height = 200
  const step = pts.length > 1 ? width / (pts.length - 1) : width

  return pts.map((p, idx) => {
    const x = pts.length === 1 ? Math.round(width / 2) : Math.round(idx * step)
    const y = Math.round(height - (p.amount / maxVal) * 160) - 20 // 20px padding
    return { x, y, raw: p }
  })
})

const hoveredNormalizedPoint = computed(() => {
  if (!hoveredPoint.value) return null
  return incomingDots.value.find((p) => p.raw.orderId === hoveredPoint.value?.orderId) || null
})

const yAxisTicks = computed(() => {
  const pts = rawPoints.value
  const maxVal = pts.length ? Math.max(...pts.map((p) => p.amount), 100) : 100
  return [
    `$${Math.round(maxVal).toLocaleString()}`,
    `$${Math.round((maxVal * 2) / 3).toLocaleString()}`,
    `$${Math.round(maxVal / 3).toLocaleString()}`,
    '$0',
  ]
})

const xAxisLabels = computed(() => {
  const pts = rawPoints.value
  if (!pts.length) return []
  if (pts.length <= 4) return pts.map((p) => p.time)
  const indices = [
    0,
    Math.floor(pts.length * 0.33),
    Math.floor(pts.length * 0.67),
    pts.length - 1,
  ]
  return indices.map((idx) => pts[idx]?.time || '')
})

interface NormalizedPoint {
  x: number
  y: number
  raw: {
    time: string
    amount: number
    orderId: number
  }
}

const SAMPLE_COUNT = 36
const activeSamples = ref<number[]>([])
const incomingDots = ref<NormalizedPoint[]>([])
const outgoingDots = ref<NormalizedPoint[]>([])
const morphProgress = ref(1)
let morphAnimId: number | null = null

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4)
}

function getSamplesForPoints(pts: NormalizedPoint[]): number[] {
  if (!pts.length) {
    return new Array(SAMPLE_COUNT).fill(220)
  }
  if (pts.length === 1) {
    return new Array(SAMPLE_COUNT).fill(pts[0].y)
  }

  const stepX = 700 / (SAMPLE_COUNT - 1)
  const samples: number[] = []

  for (let k = 0; k < SAMPLE_COUNT; k++) {
    const x = k * stepX
    if (x <= pts[0].x) {
      samples.push(pts[0].y)
      continue
    }
    if (x >= pts[pts.length - 1].x) {
      samples.push(pts[pts.length - 1].y)
      continue
    }

    let found = false
    for (let i = 0; i < pts.length - 1; i++) {
      if (x >= pts[i].x && x <= pts[i + 1].x) {
        const dx = pts[i + 1].x - pts[i].x
        const t = dx === 0 ? 0 : (x - pts[i].x) / dx
        const s = t * t * (3 - 2 * t) // Hermite smoothstep matching SVG cubic Bezier
        const y = pts[i].y + (pts[i + 1].y - pts[i].y) * s
        samples.push(Math.round(y * 100) / 100)
        found = true
        break
      }
    }
    if (!found) {
      samples.push(pts[pts.length - 1].y)
    }
  }

  return samples
}

function buildPathFromSamples(samples: number[]): string {
  if (!samples.length) return ''
  const stepX = 700 / (samples.length - 1)
  let path = `M 0 ${samples[0].toFixed(1)}`

  for (let i = 0; i < samples.length - 1; i++) {
    const x1 = (i + 1) * stepX
    const y0 = samples[i]
    const y1 = samples[i + 1]
    const mx = (i * stepX + x1) / 2
    path += ` C ${mx.toFixed(1)} ${y0.toFixed(1)}, ${mx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`
  }

  return path
}

const dotRefs = ref<(SVGCircleElement | null)[]>([])
function setDotRef(el: any, idx: number) {
  if (el) dotRefs.value[idx] = el as SVGCircleElement
}

function focusNeighborDot(targetIdx: number) {
  if (!incomingDots.value.length) return
  const clamped = Math.max(0, Math.min(targetIdx, incomingDots.value.length - 1))
  const targetEl = dotRefs.value[clamped]
  if (targetEl && typeof targetEl.focus === 'function') {
    targetEl.focus()
    hoveredPoint.value = incomingDots.value[clamped]?.raw || null
  }
}

function animateMorph(fromSamples: number[], toSamples: number[], duration = 380) {
  if (morphAnimId !== null) {
    cancelAnimationFrame(morphAnimId)
    morphAnimId = null
  }

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    activeSamples.value = [...toSamples]
    morphProgress.value = 1
    outgoingDots.value = []
    return
  }

  const startTime = performance.now()

  function frame(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / duration)
    const eased = easeOutQuart(progress)

    const interpolated = new Array(SAMPLE_COUNT)
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      interpolated[i] = fromSamples[i] + (toSamples[i] - fromSamples[i]) * eased
    }

    activeSamples.value = interpolated
    morphProgress.value = eased

    if (progress < 1) {
      morphAnimId = requestAnimationFrame(frame)
    } else {
      morphAnimId = null
      morphProgress.value = 1
      activeSamples.value = [...toSamples]
      outgoingDots.value = []
    }
  }

  morphAnimId = requestAnimationFrame(frame)
}

function applyNewPoints(animate = true) {
  const newPts = normalizedPoints.value
  const targetSamples = getSamplesForPoints(newPts)

  if (!animate || activeSamples.value.length === 0) {
    activeSamples.value = targetSamples
    incomingDots.value = [...newPts]
    outgoingDots.value = []
    morphProgress.value = 1
    return
  }

  outgoingDots.value = [...incomingDots.value]
  incomingDots.value = [...newPts]
  animateMorph(activeSamples.value, targetSamples, 380)
}

const splineStrokePath = computed(() => {
  if (!activeSamples.value.length) return ''
  return buildPathFromSamples(activeSamples.value)
})

const splineAreaPath = computed(() => {
  const stroke = splineStrokePath.value
  if (!stroke) return ''
  return `${stroke} L 700 220 L 0 220 Z`
})

function openOrderDialog() {
  orderDialogRef.value?.openModal()
}

async function refreshAll() {
  await Promise.all([
    orderStore.loadMetrics(selectedPeriod.value),
    productStore.getCount(),
    customerStore.getCount(),
  ])
  applyNewPoints(false)
  recentOrdersRef.value?.getData()
}

async function handlePeriodChange(period: 'day' | 'week' | 'month' | 'all') {
  if (selectedPeriod.value === period && !orderStore.isLoadingMetrics) return
  hoveredPoint.value = null
  selectedPeriod.value = period
  await orderStore.loadMetrics(period)
  applyNewPoints(true)
}

function handleOrderCreated() {
  refreshAll()
}

onMounted(() => {
  refreshAll()
})

onBeforeUnmount(() => {
  if (morphAnimId !== null) {
    cancelAnimationFrame(morphAnimId)
  }
})
</script>

<style scoped>
.chart-crossfade-enter-active {
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.chart-crossfade-leave-active {
  transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.chart-crossfade-enter-from,
.chart-crossfade-leave-to {
  opacity: 0;
}

.chart-dot {
  transition-property: r, fill !important;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
