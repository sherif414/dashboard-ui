<template>
  <main class="p-4 lg:p-6 flex flex-col gap-6 w-full max-w-7xl mx-auto">
    <!-- Header with primary action -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-2 dark:border-dark-3 pb-5">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-1.5rem font-bold typo-clr-base tracking-tight font-sans">Products Catalog</h1>
          <span class="px-2.5 py-0.5 text-11px font-mono uppercase tracking-wider rounded-full surface-2 border border-gray-2 dark:border-dark-3 typo-clr-muted">
            Inventory Console
          </span>
        </div>
        <p class="typo-sm typo-clr-muted mt-1">Merchandise stock management, pricing, categorization, and live publication</p>
      </div>
      <RouterLink
        to="/products/add"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md fill-primary-2 typo-clr-on-primary font-medium typo-sm hover:fill-primary-3 active:scale-97 transition shadow-xs focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
      >
        <IAdd width="16" height="16" />
        <span>Add Product</span>
      </RouterLink>
    </header>

    <!-- Stock & Catalog Health Ribbon (Not generic cards) -->
    <section class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
      <!-- Stock Filter Tabs -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="selectStockFilter('all')"
          :class="[
            selectedStockFilter === 'all'
              ? 'fill-primary-2 typo-clr-on-primary font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-gray-3 dark:hover:border-dark-2'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span>All Stock</span>
          <span
            :class="selectedStockFilter === 'all' ? 'bg-white/20 text-white' : 'surface-1 typo-clr-muted'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums"
          >
            {{ allProductsCount }}
          </span>
        </button>

        <button
          type="button"
          @click="selectStockFilter('in')"
          :class="[
            selectedStockFilter === 'in'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-emerald-4 dark:hover:border-emerald-6'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400" />
          <span>In Stock (≥20)</span>
          <span
            :class="selectedStockFilter === 'in' ? 'bg-white/20 text-white' : 'surface-1 text-emerald-600 dark:text-emerald-400'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums"
          >
            {{ inStockCount }}
          </span>
        </button>

        <button
          type="button"
          @click="selectStockFilter('low')"
          :class="[
            selectedStockFilter === 'low'
              ? 'bg-amber-600 text-white font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-amber-4 dark:hover:border-amber-6'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Low Stock (&lt;20)</span>
          <span
            :class="selectedStockFilter === 'low' ? 'bg-white/20 text-white' : 'surface-1 text-amber-600 dark:text-amber-400'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums font-semibold"
          >
            {{ lowStockCount }}
          </span>
        </button>

        <button
          type="button"
          @click="selectStockFilter('out')"
          :class="[
            selectedStockFilter === 'out'
              ? 'bg-rose-600 text-white font-semibold shadow-xs'
              : 'surface-2 typo-clr-base hover:border-rose-4 dark:hover:border-rose-6'
          ]"
          class="px-3.5 py-1.5 rounded-md text-xs transition flex items-center gap-2 cursor-pointer border border-transparent"
        >
          <span>Out of Stock</span>
          <span
            :class="selectedStockFilter === 'out' ? 'bg-white/20 text-white' : 'surface-1 text-rose-500'"
            class="px-1.5 py-0.5 rounded text-10px font-mono tabular-nums font-semibold"
          >
            {{ outOfStockCount }}
          </span>
        </button>
      </div>

      <!-- Catalog Valuation Signals -->
      <div class="flex items-center gap-6 lg:border-l lg:border-gray-2 dark:lg:border-dark-3 lg:pl-6">
        <div>
          <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">Catalog Valuation</span>
          <span class="text-base sm:text-lg font-bold font-mono tracking-tight typo-clr-base tabular-nums">
            {{ formattedCatalogValuation }}
          </span>
        </div>

        <div>
          <div class="flex items-center justify-between gap-3 mb-1">
            <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">Published</span>
            <span class="text-xs font-mono font-bold text-indigo-600 dark:text-violet-400 tabular-nums">
              {{ publishedRatioPct }}%
            </span>
          </div>
          <div class="w-24 sm:w-28 h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
            <div
              class="h-full rounded-full fill-primary-2 transition-all duration-500"
              :style="{ width: `${publishedRatioPct}%` }"
            />
          </div>
        </div>

        <div class="hidden sm:block">
          <span class="text-11px font-mono uppercase tracking-wider typo-clr-muted block">Active SKUs</span>
          <span class="text-base sm:text-lg font-bold font-mono tracking-tight typo-clr-base tabular-nums">
            {{ allProductsCount }} items
          </span>
        </div>
      </div>
    </section>

    <!-- Category Filter Pills & Search & View Switcher Bar -->
    <div class="flex flex-col gap-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none typo-clr-muted">
            <ISearch width="15" height="15" />
          </div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by product name, SKU #, or category..."
            class="w-full pl-9 pr-8 py-2 text-xs sm:text-sm surface-1 border border-gray-2 dark:border-dark-3 rounded-md typo-clr-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-indigo-5 dark:focus:border-violet-5 transition"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-2.5 flex items-center typo-clr-muted hover:typo-clr-base text-xs"
          >
            ✕
          </button>
        </div>

        <!-- Publication Status & View Switcher Controls -->
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <!-- Published filter -->
          <div class="surface-1 p-1 rounded-md border border-gray-2 dark:border-dark-3 flex items-center text-xs">
            <button
              type="button"
              @click="selectedPubStatus = 'all'"
              :class="selectedPubStatus === 'all' ? 'surface-2 typo-clr-base font-medium shadow-xs' : 'typo-clr-muted hover:typo-clr-base'"
              class="px-2.5 py-1 rounded transition cursor-pointer"
            >
              All
            </button>
            <button
              type="button"
              @click="selectedPubStatus = 'published'"
              :class="selectedPubStatus === 'published' ? 'surface-2 text-emerald-600 dark:text-emerald-400 font-medium shadow-xs' : 'typo-clr-muted hover:typo-clr-base'"
              class="px-2.5 py-1 rounded transition cursor-pointer"
            >
              Published
            </button>
            <button
              type="button"
              @click="selectedPubStatus = 'unpublished'"
              :class="selectedPubStatus === 'unpublished' ? 'surface-2 text-amber-600 dark:text-amber-400 font-medium shadow-xs' : 'typo-clr-muted hover:typo-clr-base'"
              class="px-2.5 py-1 rounded transition cursor-pointer"
            >
              Drafts
            </button>
          </div>

          <!-- View Mode Switcher (Table vs Grid) -->
          <div class="surface-1 p-1 rounded-md border border-gray-2 dark:border-dark-3 flex items-center">
            <button
              type="button"
              @click="viewMode = 'table'"
              :class="viewMode === 'table' ? 'surface-2 text-indigo-600 dark:text-violet-400 font-medium shadow-xs' : 'typo-clr-muted hover:typo-clr-base'"
              class="p-1.5 rounded text-xs transition cursor-pointer"
              title="Table View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <button
              type="button"
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'surface-2 text-indigo-600 dark:text-violet-400 font-medium shadow-xs' : 'typo-clr-muted hover:typo-clr-base'"
              class="p-1.5 rounded text-xs transition cursor-pointer"
              title="Grid Showcase View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Horizontal Category Chips -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectCategory(cat)"
          :class="[
            selectedCategory === cat
              ? 'fill-primary-2 typo-clr-on-primary font-medium shadow-xs'
              : 'surface-1 border border-gray-2 dark:border-dark-3 typo-clr-muted hover:typo-clr-base hover:surface-2'
          ]"
          class="px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
        >
          {{ cat === 'all' ? 'All Categories' : cat }}
        </button>
      </div>
    </div>

    <!-- View Mode Container with Crossfade Transition -->
    <transition name="view-crossfade" mode="out-in">
      <!-- View Mode 1: Table View -->
      <div v-if="viewMode === 'table'" key="table-view" class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 overflow-hidden shadow-xs flex flex-col min-h-340px">
      <div class="overflow-x-auto overflow-y-hidden grow">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="surface-2 border-b border-gray-2 dark:border-dark-3 text-11px font-mono uppercase tracking-wider typo-clr-muted select-none">
              <th scope="col" class="py-3 px-4 font-medium">Product Item</th>
              <th scope="col" class="py-3 px-4 font-medium">Category</th>
              <th scope="col" class="py-3 px-4 font-medium">Inventory Health</th>
              <th scope="col" class="py-3 px-4 font-medium text-right">Selling Price</th>
              <th scope="col" class="py-3 px-4 font-medium">Fulfillment</th>
              <th scope="col" class="py-3 px-4 font-medium text-center">Live Publication</th>
              <th scope="col" class="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody v-if="store.isLoading" class="divide-y divide-gray-2 dark:divide-dark-3">
            <tr v-for="n in 8" :key="n" class="animate-pulse">
              <td class="py-3 px-4"><div class="h-4 w-44 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-20 max-w-full bg-gray-2 dark:bg-dark-3 rounded-full" /></td>
              <td class="py-3 px-4"><div class="h-4 w-24 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-16 max-w-full bg-gray-2 dark:bg-dark-3 rounded ml-auto" /></td>
              <td class="py-3 px-4"><div class="h-4 w-20 max-w-full bg-gray-2 dark:bg-dark-3 rounded" /></td>
              <td class="py-3 px-4"><div class="h-4 w-12 max-w-full bg-gray-2 dark:bg-dark-3 rounded mx-auto" /></td>
              <td class="py-3 px-4"><div class="h-4 w-12 max-w-full bg-gray-2 dark:bg-dark-3 rounded ml-auto" /></td>
            </tr>
          </tbody>

          <tbody v-else-if="store.products && store.products.length > 0" class="divide-y divide-gray-2 dark:divide-dark-3 text-xs sm:text-sm">
            <tr
              v-for="(row, idx) in store.products"
              :key="row.id"
              class="hover:surface-2 transition-colors duration-150 group animate-row-in"
              :style="{ animationDelay: `${Math.min(idx * 25, 200)}ms` }"
            >
              <!-- Product Item & Visual Thumbnail -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-md surface-2 border border-gray-2 dark:border-dark-3 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      v-if="row.image"
                      :src="row.image"
                      :alt="row.name || 'Product'"
                      class="w-full h-full object-cover"
                    />
                    <IInventory v-else width="18" height="18" class="typo-clr-muted opacity-60" />
                  </div>
                  <div class="min-w-0">
                    <RouterLink
                      :to="`/products/${row.id}`"
                      class="font-bold typo-clr-base hover:text-indigo-600 dark:hover:text-violet-400 truncate transition block"
                    >
                      {{ row.name }}
                    </RouterLink>
                    <span class="text-10px font-mono typo-clr-muted">
                      SKU #{{ row.id }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-11px font-mono surface-2 border border-gray-2 dark:border-dark-3 typo-clr-muted">
                  {{ row.category || 'General' }}
                </span>
              </td>

              <!-- Stock Health -->
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-11px font-mono font-medium border"
                    :class="getStockBadgeClass(row.stock)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStockDotClass(row.stock)" />
                    <span>{{ row.stock === 0 ? 'Out of stock' : `${row.stock} in stock` }}</span>
                  </span>
                </div>
              </td>

              <!-- Selling Price -->
              <td class="py-3 px-4 text-right font-mono font-bold typo-clr-base tabular-nums whitespace-nowrap">
                ${{ Number(row.sell_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>

              <!-- Fulfillment -->
              <td class="py-3 px-4 whitespace-nowrap text-11px font-mono typo-clr-muted">
                {{ Array.isArray(row.delivery_type) ? (row.delivery_type.join(', ') || '-') : (row.delivery_type || '-') }}
              </td>

              <!-- Live Publication Switch Toggle -->
              <td class="py-3 px-4 text-center whitespace-nowrap">
                <button
                  type="button"
                  @click="togglePublish(row.id)"
                  :aria-checked="row.published ?? false"
                  role="switch"
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  :class="row.published ? 'fill-primary-2' : 'bg-gray-3 dark:bg-dark-3'"
                  :title="row.published ? 'Click to unpublish' : 'Click to publish'"
                >
                  <span
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="row.published ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <RouterLink
                  :to="`/products/${row.id}`"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded surface-2 hover:bg-indigo-50 dark:hover:bg-violet-950/30 text-indigo-600 dark:text-violet-400 text-xs font-medium transition"
                  title="View full product details"
                >
                  <IEye width="13" height="13" />
                  <span>Inspect</span>
                </RouterLink>
              </td>
            </tr>
          </tbody>

          <!-- Empty State -->
          <tbody v-else>
            <tr>
              <td colspan="7" class="py-14 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-12 h-12 rounded-full surface-2 flex items-center justify-center typo-clr-muted mb-3">
                    <IInventory width="22" height="22" />
                  </div>
                  <h3 class="text-base font-bold typo-clr-base">No products found</h3>
                  <p class="typo-sm typo-clr-muted mt-1 mb-4">
                    {{ searchQuery || selectedCategory !== 'all' || selectedStockFilter !== 'all' || selectedPubStatus !== 'all'
                      ? 'No items match your active filters.'
                      : 'Your merchandise catalog is currently empty.' }}
                  </p>
                  <button
                    v-if="searchQuery || selectedCategory !== 'all' || selectedStockFilter !== 'all' || selectedPubStatus !== 'all'"
                    type="button"
                    @click="resetFilters"
                    class="px-3 py-1.5 rounded-md surface-2 typo-clr-base text-xs font-medium hover:surface-3 transition border border-gray-2 dark:border-dark-3 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <footer class="border-t border-gray-2 dark:border-dark-3 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs typo-clr-muted surface-2/50 mt-auto">
        <div class="flex items-center gap-2">
          <span>Showing</span>
          <span class="font-mono font-bold typo-clr-base tabular-nums">
            {{ store.products?.length ?? 0 }}
          </span>
          <span>of</span>
          <span class="font-mono font-bold typo-clr-base tabular-nums">
            {{ store.countAll ?? 0 }}
          </span>
          <span>products</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
            class="px-2.5 py-1 rounded surface-1 border border-gray-2 dark:border-dark-3 typo-clr-base disabled:opacity-30 disabled:pointer-events-none hover:surface-2 transition cursor-pointer"
          >
            Previous
          </button>
          <span class="font-mono tabular-nums px-1">
            Page {{ currentPage }} of {{ maxPages }}
          </span>
          <button
            type="button"
            :disabled="currentPage >= maxPages"
            @click="changePage(currentPage + 1)"
            class="px-2.5 py-1 rounded surface-1 border border-gray-2 dark:border-dark-3 typo-clr-base disabled:opacity-30 disabled:pointer-events-none hover:surface-2 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      </footer>
    </div>

    <!-- View Mode 2: Visual Grid Showcase -->
    <div v-else key="grid-view" class="flex flex-col gap-4">
      <div v-if="store.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="n in 8" :key="n" class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 p-4 animate-pulse flex flex-col gap-3">
          <div class="h-36 surface-2 rounded-md" />
          <div class="h-4 w-3/4 bg-gray-2 dark:bg-dark-3 rounded" />
          <div class="h-4 w-1/2 bg-gray-2 dark:bg-dark-3 rounded" />
        </div>
      </div>

      <div v-else-if="store.products && store.products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <article
          v-for="(row, idx) in store.products"
          :key="row.id"
          class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 p-4 flex flex-col justify-between gap-4 shadow-xs hover:border-gray-3 dark:hover:border-dark-2 transition-all duration-200 group animate-row-in"
          :style="{ animationDelay: `${Math.min(idx * 30, 240)}ms` }"
        >
          <div>
            <!-- Image / Media Container -->
            <div class="w-full h-36 rounded-md surface-2 border border-gray-2 dark:border-dark-3 flex items-center justify-center overflow-hidden mb-3 relative">
              <img
                v-if="row.image"
                :src="row.image"
                :alt="row.name || 'Product'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <IInventory v-else width="32" height="32" class="typo-clr-muted opacity-50" />

              <span
                class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-10px font-mono font-medium border"
                :class="getStockBadgeClass(row.stock)"
              >
                {{ row.stock === 0 ? 'Out of stock' : `${row.stock} in stock` }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-10px font-mono uppercase tracking-wider surface-2 px-2 py-0.5 rounded border border-gray-2 dark:border-dark-3 typo-clr-muted">
                {{ row.category || 'General' }}
              </span>
              <span class="text-10px font-mono typo-clr-muted">
                #{{ row.id }}
              </span>
            </div>

            <RouterLink
              :to="`/products/${row.id}`"
              class="font-bold text-sm typo-clr-base hover:text-indigo-600 dark:hover:text-violet-400 block line-clamp-1 transition-colors"
            >
              {{ row.name }}
            </RouterLink>
          </div>

          <!-- Footer with price & toggle -->
          <div class="pt-3 border-t border-gray-2 dark:border-dark-3 flex items-center justify-between gap-2">
            <div>
              <span class="text-10px font-mono typo-clr-muted block">Price</span>
              <span class="font-mono font-bold text-base typo-clr-base tabular-nums">
                ${{ Number(row.sell_price || 0).toFixed(2) }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="togglePublish(row.id)"
                :aria-checked="row.published ?? false"
                role="switch"
                class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out active:scale-95 focus:outline-none"
                :class="row.published ? 'fill-primary-2' : 'bg-gray-3 dark:bg-dark-3'"
                :title="row.published ? 'Click to unpublish' : 'Click to publish'"
              >
                <span
                  class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="row.published ? 'translate-x-4' : 'translate-x-0'"
                />
              </button>

              <RouterLink
                :to="`/products/${row.id}`"
                class="p-1.5 rounded surface-2 hover:bg-indigo-50 dark:hover:bg-violet-950/30 text-indigo-600 dark:text-violet-400 transition-all duration-150 active:scale-95"
                title="Inspect product"
              >
                <IEye width="14" height="14" />
              </RouterLink>
            </div>
          </div>
        </article>
      </div>

      <!-- Grid Pagination -->
      <footer class="surface-1 rounded-lg border border-gray-2 dark:border-dark-3 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs typo-clr-muted mt-2 shadow-xs">
        <div class="flex items-center gap-2">
          <span>Showing</span>
          <span class="font-mono font-bold typo-clr-base tabular-nums">
            {{ store.products?.length ?? 0 }}
          </span>
          <span>of</span>
          <span class="font-mono font-bold typo-clr-base tabular-nums">
            {{ store.countAll ?? 0 }}
          </span>
          <span>products</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
            class="px-2.5 py-1 rounded surface-1 border border-gray-2 dark:border-dark-3 typo-clr-base disabled:opacity-30 disabled:pointer-events-none hover:surface-2 transition cursor-pointer"
          >
            Previous
          </button>
          <span class="font-mono tabular-nums px-1">
            Page {{ currentPage }} of {{ maxPages }}
          </span>
          <button
            type="button"
            :disabled="currentPage >= maxPages"
            @click="changePage(currentPage + 1)"
            class="px-2.5 py-1 rounded surface-1 border border-gray-2 dark:border-dark-3 typo-clr-base disabled:opacity-30 disabled:pointer-events-none hover:surface-2 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductsStore } from '~/store/products'
import { IAdd, IInventory, ISearch, IEye } from '~/components/icons'

const store = useProductsStore()

const categories = ['all', 'Gadgets', 'Laptops', 'Audio', 'Wearables', 'Tablets', 'Displays', 'Accessories']
const selectedCategory = ref('all')
const selectedStockFilter = ref<'all' | 'in' | 'low' | 'out'>('all')
const selectedPubStatus = ref<'all' | 'published' | 'unpublished'>('all')
const searchQuery = ref('')
const viewMode = ref<'table' | 'grid'>('table')
const currentPage = ref(1)
const itemsPerPage = 10

const allProductsCount = computed(() => store.metrics?.all ?? store.countAll ?? store.products?.length ?? 0)
const inStockCount = computed(() => store.metrics?.inStock ?? 0)
const lowStockCount = computed(() => store.metrics?.lowStock ?? 0)
const outOfStockCount = computed(() => store.metrics?.outOfStock ?? 0)
const publishedCount = computed(() => store.metrics?.published ?? store.countPublished ?? 0)

const publishedRatioPct = computed(() => {
  const total = allProductsCount.value
  if (!total) return 0
  return Math.round((publishedCount.value / total) * 100)
})

const formattedCatalogValuation = computed(() => {
  // Approximate active valuation from seed products
  if (!store.products) return '$0.00'
  const val = store.products.reduce((sum, p) => sum + (p.stock || 0) * (p.sell_price || 0), 0)
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
})

const maxPages = computed(() => Math.max(1, Math.ceil((store.countAll ?? 0) / itemsPerPage)))

async function fetchProducts() {
  await store.getProducts({
    orderOptions: { column: 'id', ascending: false, foreignTable: '' },
    page: currentPage.value,
    itemsPerPage,
    filter: {
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      published: selectedPubStatus.value === 'all' ? undefined : selectedPubStatus.value === 'published',
      stockStatus: selectedStockFilter.value === 'all' ? undefined : selectedStockFilter.value,
      query: searchQuery.value,
    },
  })
}

function selectCategory(cat: string) {
  selectedCategory.value = cat
  currentPage.value = 1
  fetchProducts()
}

function selectStockFilter(filter: 'all' | 'in' | 'low' | 'out') {
  selectedStockFilter.value = filter
  currentPage.value = 1
  fetchProducts()
}

watch([selectedPubStatus, searchQuery], () => {
  currentPage.value = 1
  fetchProducts()
})

function changePage(page: number) {
  if (page < 1 || page > maxPages.value) return
  currentPage.value = page
  fetchProducts()
}

function resetFilters() {
  selectedCategory.value = 'all'
  selectedStockFilter.value = 'all'
  selectedPubStatus.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
  fetchProducts()
}

async function togglePublish(id: number) {
  await store.togglePublishStatus(id)
}

function getStockBadgeClass(stock?: number | null) {
  const count = stock ?? 0
  if (count === 0) {
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  }
  if (count < 20) {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  }
  return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
}

function getStockDotClass(stock?: number | null) {
  const count = stock ?? 0
  if (count === 0) return 'bg-rose-500'
  if (count < 20) return 'bg-amber-500 animate-pulse-subtle'
  return 'bg-emerald-500'
}

onMounted(() => {
  store.getCount()
  fetchProducts()
})
</script>
