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
          <div><img width="48" heigh="48" src="../assets/img/iphone14.png" /></div>
          <div class="inline-flex flex-col gap-y-1">
            <h2>{{ item.products?.name }}</h2>
            <h3>{{ item.products?.sell_price ? `$ ${item.products.sell_price}` : '-' }}</h3>
          </div>
          <div class="inline-flex flex-col items-end items-start gap-y-1 ml-auto">
            <span class="typo-clr-muted">{{ new Date(item.created_at!).toLocaleTimeString() }} </span>
            <Chip :status="item.status === 'completed'">{{ item.status }}</Chip>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
interface RecentOrders {
  products: { id: number; name: string | null; sell_price: number | null; image: string | null } | null
  status: string | null
  created_at: string | null
}

let data = $ref<RecentOrders[] | null>(null)

async function getData() {
  const res = await supabase
    .from('order_item')
    .select('products(id, name, sell_price, image), status, created_at')
    .order('created_at', { ascending: false })

  if (res.error) useMessage('error', res.error.message || 'failed loading recent orders')

  data = res.data as RecentOrders[]
}

onMounted(() => {
  getData()
})
</script>
