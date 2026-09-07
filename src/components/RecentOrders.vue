<template>
  <section class="flex flex-col surface-1 divide-y dark:divide-dark-3 divide-gray-2 rounded-md p4 border border-gray-2 dark:border-dark-3">
    <div class="flex items-center justify-between pb-3">
      <h2 class="typo-head">Recent Orders</h2>
      <router-link to="/orders" class="typo-sm typo-clr-primary hover:underline flex items-center gap-1">
        View all
      </router-link>
    </div>
    <div class="relative grow overflow-hidden pt-2 min-h-300px max-h-480px">
      <ul
        class="divide-y dark:divide-dark-3 divide-gray-2 overflow-y-auto w-full h-full pr-1"
        v-if="data && data.length"
      >
        <li
          v-for="(item, idx) in data"
          :key="item.products?.id ?? idx"
          class="flex items-center justify-start gap-x-3 py-2.5"
        >
          <img
            width="40"
            height="40"
            class="rounded object-cover shrink-0 border border-gray-2 dark:border-dark-3"
            :src="getProductImageUrl(item.products?.image)"
            :alt="item.products?.name || 'Product'"
          />
          <div class="inline-flex flex-col gap-y-0.5 min-w-0">
            <h3 class="typo-sm font-medium truncate typo-clr-base">{{ item.products?.name ?? 'Product' }}</h3>
            <span class="typo-sm typo-clr-muted">{{ item.products?.sell_price ? `$${item.products.sell_price.toFixed(2)}` : '-' }}</span>
          </div>
          <div class="inline-flex flex-col items-end gap-y-1 ml-auto shrink-0">
            <span class="typo-sm typo-clr-muted text-11px">{{ item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-' }}</span>
            <Chip :status="item.status === 'completed'">{{ item.status }}</Chip>
          </div>
        </li>
      </ul>
      <div v-else-if="data && !data.length" class="p-8 text-center typo-clr-muted typo-sm">
        No recent orders recorded.
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

onMounted(() => {
  getData()
})
</script>
