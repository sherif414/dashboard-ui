<template>
  <section class="flex flex-col surface-1 divide-y dark:divide-dark-3 divide-gray-2 rounded-md p4 sm:p5 border border-gray-2 dark:border-dark-3 shadow-sm h-full">
    <div class="flex items-center justify-between pb-3">
      <div class="flex items-center gap-2">
        <h2 class="typo-head typo-clr-base">Recent Orders</h2>
        <span v-if="data?.length" class="text-11px font-mono typo-clr-muted px-1.5 py-0.5 rounded surface-2">
          {{ data.length }} items
        </span>
      </div>
      <RouterLink
        to="/orders"
        class="typo-sm typo-clr-primary hover:underline flex items-center gap-1 focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5 rounded px-1)"
      >
        View all orders →
      </RouterLink>
    </div>
    <div class="relative grow overflow-hidden pt-2 min-h-300px max-h-520px">
      <!-- Error State with Inline Retry -->
      <div v-if="hasError" class="p-8 text-center typo-clr-muted typo-sm flex flex-col items-center justify-center gap-3 h-full">
        <div class="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center font-bold">
          !
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-medium typo-clr-base">Unable to load recent orders</p>
          <p class="text-11px typo-clr-muted max-w-xs">{{ errorMessage || 'A database or connection error occurred.' }}</p>
        </div>
        <button
          type="button"
          @click="getData"
          class="px-3 py-1.5 rounded-md surface-2 hover:surface-3 border border-gray-2 dark:border-dark-3 text-12px font-medium typo-clr-base transition cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
        >
          Try Again
        </button>
      </div>

      <!-- Skeleton Loading State -->
      <div v-else-if="!data" class="flex flex-col divide-y dark:divide-dark-3 divide-gray-2 py-1 animate-pulse motion-reduce:animate-none" aria-hidden="true">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3 py-2.5 px-2">
          <div class="w-10 h-10 rounded-md surface-2 shrink-0"></div>
          <div class="flex flex-col gap-1.5 grow">
            <div class="h-3.5 w-2/5 rounded surface-2"></div>
            <div class="h-3 w-1/4 rounded surface-2"></div>
          </div>
          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <div class="h-3 w-12 rounded surface-2"></div>
            <div class="h-5 w-16 rounded-full surface-2"></div>
          </div>
        </div>
      </div>

      <ul
        class="divide-y dark:divide-dark-3 divide-gray-2 overflow-y-auto w-full h-full pr-1"
        v-else-if="data && data.length"
      >
        <li
          v-for="(item, idx) in data"
          :key="item.order_id ? `${item.order_id}-${idx}` : idx"
          class="transition"
        >
          <RouterLink
            :to="`/orders/${item.order_id}`"
            class="flex items-center justify-start gap-x-3 py-2.5 px-2 rounded hover:surface-2 transition group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
            :aria-label="`View details for order #${item.order_id}, ${item.products?.name ?? 'Item'}, status ${item.status}`"
          >
            <img
              width="42"
              height="42"
              class="rounded-md object-cover shrink-0 border border-gray-2 dark:border-dark-3 group-hover:scale-105 transition"
              :src="getProductImageUrl(item.products?.image)"
              :alt="item.products?.name || 'Product thumbnail'"
            />
            <div class="inline-flex flex-col gap-y-0.5 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-11px font-mono typo-clr-muted font-bold">#{{ item.order_id }}</span>
                <h3 class="typo-sm font-medium truncate typo-clr-base group-hover:typo-clr-primary transition">
                  {{ item.products?.name ?? 'Product Item' }}
                </h3>
              </div>
              <span class="typo-sm font-mono font-bold typo-clr-base tabular-nums">
                {{ item.products?.sell_price ? `$${item.products.sell_price.toFixed(2)}` : '-' }}
              </span>
            </div>
            <div class="inline-flex flex-col items-end gap-y-1 ml-auto shrink-0 pl-2">
              <span class="typo-sm typo-clr-muted text-11px font-mono tabular-nums">
                {{ formatOrderTime(item.created_at) }}
              </span>
              <Chip :status="item.status">{{ item.status }}</Chip>
            </div>
          </RouterLink>
        </li>
      </ul>
      <div v-else-if="data && !data.length" class="p-8 text-center typo-clr-muted typo-sm flex flex-col items-center justify-center gap-2 h-full">
        <p class="font-medium typo-clr-base">No recent orders recorded</p>
        <p class="text-11px typo-clr-muted">New store purchases will appear here in real time.</p>
        <RouterLink to="/orders" class="typo-clr-primary hover:underline text-12px mt-1">Open Orders Manager →</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Chip from '~/components/Chip.vue'
import { orderService, type RecentOrderItem } from '~/services/orderService'
import { getProductImageUrl } from '~/services/imageUtils'
import { useMessage } from '~/composables/message'

const data = ref<RecentOrderItem[] | null>(null)
const hasError = ref(false)
const errorMessage = ref('')

async function getData() {
  data.value = null
  hasError.value = false
  errorMessage.value = ''
  try {
    data.value = await orderService.getRecentOrders(20)
  } catch (err: any) {
    hasError.value = true
    errorMessage.value = err.message || 'Failed loading recent orders'
    useMessage('error', errorMessage.value)
  }
}

function formatOrderTime(dateStr: string | null) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return '-'
  }
}

onMounted(() => {
  getData()
})

defineExpose({
  getData,
})
</script>
