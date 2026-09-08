<template>
  <section class="flex flex-col surface-1 divide-y dark:divide-dark-3 divide-gray-2 rounded-md p4 sm:p5 border border-gray-2 dark:border-dark-3 shadow-sm h-full">
    <div class="flex items-center justify-between pb-3">
      <div class="flex items-center gap-2">
        <h2 class="typo-head typo-clr-base">Recent Orders</h2>
        <span v-if="data?.length" class="text-11px font-mono typo-clr-muted px-1.5 py-0.5 rounded surface-2">
          {{ data.length }} items
        </span>
      </div>
      <router-link
        to="/orders"
        class="typo-sm typo-clr-primary hover:underline flex items-center gap-1 focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5 rounded px-1)"
      >
        View all orders →
      </router-link>
    </div>
    <div class="relative grow overflow-hidden pt-2 min-h-300px max-h-520px">
      <!-- Skeleton Loading State -->
      <div v-if="!data" class="flex flex-col divide-y dark:divide-dark-3 divide-gray-2 py-1 animate-pulse" aria-hidden="true">
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
          <router-link
            :to="`/orders/${item.order_id}`"
            class="flex items-center justify-start gap-x-3 py-2.5 px-2 rounded hover:surface-2 transition group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
            :aria-label="`View details for order #${item.order_id}`"
          >
            <img
              width="42"
              height="42"
              class="rounded-md object-cover shrink-0 border border-gray-2 dark:border-dark-3 group-hover:scale-105 transition"
              :src="getProductImageUrl(item.products?.image)"
              :alt="item.products?.name || 'Product'"
            />
            <div class="inline-flex flex-col gap-y-0.5 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-11px font-mono typo-clr-muted font-bold">#{{ item.order_id }}</span>
                <h3 class="typo-sm font-medium truncate typo-clr-base group-hover:typo-clr-primary transition">
                  {{ item.products?.name ?? 'Product Item' }}
                </h3>
              </div>
              <span class="typo-sm font-mono font-bold typo-clr-base">
                {{ item.products?.sell_price ? `$${item.products.sell_price.toFixed(2)}` : '-' }}
              </span>
            </div>
            <div class="inline-flex flex-col items-end gap-y-1 ml-auto shrink-0 pl-2">
              <span class="typo-sm typo-clr-muted text-11px font-mono">
                {{ formatOrderTime(item.created_at) }}
              </span>
              <Chip :status="item.status">{{ item.status }}</Chip>
            </div>
          </router-link>
        </li>
      </ul>
      <div v-else-if="data && !data.length" class="p-8 text-center typo-clr-muted typo-sm flex flex-col items-center gap-2">
        <p>No recent orders recorded.</p>
        <router-link to="/orders" class="typo-clr-primary hover:underline text-12px">Create an order</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chip from '~/components/Chip.vue'
import { orderService, type RecentOrderItem } from '~/services/orderService'
import { getProductImageUrl } from '~/services/imageUtils'
import { useMessage } from '~/composables/message'

const data = ref<RecentOrderItem[] | null>(null)

async function getData() {
  try {
    data.value = await orderService.getRecentOrders(20)
  } catch (err: any) {
    useMessage('error', err.message || 'Failed loading recent orders')
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
