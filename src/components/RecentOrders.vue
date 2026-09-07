<template>
  <section class="flex flex-col surface-1 divide-y dark:divide-dark-300 divide-gray-2 rounded-md p4">
    <h2 class="typo-head mb-2">Recent Orders</h2>
    <div class="relative grow">
      <ul
        class="divide-y dark:divide-dark-300 divide-gray-2 overflow-y-auto z-0 w-full h-full absolute top-0 left-0 pr-1"
        v-if="data"
      >
        <li
          v-for="(item, idx) in data"
          :key="item.products?.id ?? idx"
          class="flex items-center justify-start gap-x-4 py2"
        >
          <div>
            <img width="48" height="48" class="rounded object-cover" :src="getProductImageUrl(item.products?.image)" />
          </div>
          <div class="inline-flex flex-col gap-y-1">
            <h2>{{ item.products?.name }}</h2>
            <h3>{{ item.products?.sell_price ? `$ ${item.products.sell_price}` : '-' }}</h3>
          </div>
          <div class="inline-flex flex-col items-end gap-y-1 ml-auto">
            <span class="typo-clr-muted">{{ item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-' }} </span>
            <Chip :status="item.status === 'completed'">{{ item.status }}</Chip>
          </div>
        </li>
      </ul>
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
