<template>
  <main class="p4 flex flex-col gap-4 overflow-y-auto">
    <!-- delete order dialog -->
    <dialog ref="dialogDelete" class="surface-1 rounded-md">
      <div class="grid grid-cols-2 gap-4">
        <h1 class="col-span-2">delete order #{{ order?.id }} ?</h1>
        <Btn class="w-max px-8" variant="text" @click="dialogDelete?.close()">cancel</Btn>
        <Btn
          class="w-max px-8 bg-error bg-opacity-10 text-error hover:bg-error hover:bg-opacity-30"
          :loading="isDeleting"
          @click="deleteOrder"
          variant="text"
          >delete</Btn
        >
      </div>
    </dialog>

    <header class="flex gap-4 2xl:gap-8 items-center justify-start">
      <h2 class="typo-head">
        Order Id: <span class="typo-clr-muted typo-base">#{{ order?.id }}</span>
      </h2>
      <h2 class="typo-head">
        Date:
        <span class="typo-clr-muted typo-base">{{
          order?.created_at ? useDateFormat(order?.created_at, 'DD MMM YYYY - hh:mm aa').value : '-'
        }}</span>
      </h2>
      <h2 class="typo-head">
        Total purchases: <span class="typo-clr-muted typo-base">${{ order?.total_purchases }}</span>
      </h2>
      <Btn
        @click="dialogDelete?.showModal()"
        variant="text"
        class="ml-auto bg-error bg-opacity-10 text-error hover:bg-error hover:bg-opacity-30"
      >
        Delete Order
      </Btn>
      <Btn
        :loading="isMarkingComplete"
        @click="handleMarkComplete"
        :class="orderCompleted ? 'bg-black! text-gray-1! dark:bg-gray-1! dark:text-dark!' : ''"
        >mark as {{ orderCompleted ? 'pending' : 'completed' }}</Btn
      >
    </header>

    <!-- summary cards grid -->
    <div class="grid grid-cols-3 gap-4 2xl:gap-8 row-span-1">
      <!-- all orders summary -->
      <SummaryCard
        :filter="false"
        :data="[
          { name: 'phone', value: customer?.phone },
          { name: 'email', value: customer?.email },
        ]"
      >
        <template #icon>
          <ICustomers width="18" height="18" class="summary-icon" />
          <div class="typo-sm">
            <h3>{{ customer?.name }}</h3>
            <h3>
              customer since
              <span class="typo-clr-muted">{{
                customer?.created_at ? useDateFormat(customer?.created_at, 'DD MMM YYYY').value : '-'
              }}</span>
            </h3>
          </div>
        </template>
      </SummaryCard>

      <!-- orders by state summary -->
      <SummaryCard
        :filter="false"
        :data="[
          { name: 'address', value: 'No. 15 Bahri Street' },
          { name: 'pilling address', value: 'No. 15 Bahri Street' },
        ]"
      >
        <template #icon>
          <ILocation width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- carts summary -->
      <SummaryCard
        :filter="false"
        :data="[
          { name: 'payment method', value: 'master card' },
          { name: 'delivery type', value: order?.type },
        ]"
      >
        <template #icon>
          <ICreditCard width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>
    <BaseTable
      :show-search="false"
      table-name="order_item"
      table-title="order items"
      :items-count="orderItems?.length ?? 0"
      :data="orderItems"
    >
      <template #header="{ orderBy }">
        <TableHeaderCell
          v-for="head in headers"
          :key="head"
          :sort-ascending="orderBy.ascending"
          :order-by="orderBy.column"
          :column="head"
        >
          {{ head }}
        </TableHeaderCell>
      </template>

      <template #body>
        <tbody v-if="orderItems">
          <tr v-for="item in orderItems" :key="item.product_id">
            <TableBodyCell :value="item.products.name" variant="link" :to="`/products/${item.product_id}`" />
            <TableBodyCell :value="'$' + (item.products.sell_price || 0)" />
            <TableBodyCell :value="item.quantity" />
            <TableBodyCell :value="'$00.0'" />
            <TableBodyCell :value="'$' + item.quantity * item.products.sell_price" />
            <TableBodyCell :value="item.status" variant="chip" :chip-status="item.status === 'completed'" />
          </tr>
        </tbody>
      </template>
      <template #pagination> order total: ${{ order?.total_purchases }} </template>
    </BaseTable>
  </main>
</template>

<script setup lang="ts">
import { Customer, Order } from 'types'

const route = useRoute()
const router = useRouter()
let customer = $ref<Customer | null | undefined>(null)
let order = $ref<Order | null>(null)
let orderItems = $ref<any[] | null>(null)
const headers = ['product name', 'unit price', 'quantity', 'discount', 'total price', 'status']

async function getData(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(*), order_item(product_id, products(name, sell_price), quantity, status)')
    .eq('id', orderId)
    .maybeSingle()

  if (error) useMessage('error', error.message || 'an error has occurred')
  if (!data) return
  const { customers, ...orderData } = data
  customer = Array.isArray(data?.customers) ? data?.customers[0] : data?.customers
  orderItems = Array.isArray(data?.order_item) ? data?.order_item : data?.order_item ? [data.order_item] : orderItems
  order = orderData
}

onMounted(() => {
  if (typeof route.params.id === 'string') getData(route.params.id)
})

// deletion
let isDeleting = $ref(false)
const dialogDelete = $ref<HTMLDialogElement | null>(null)

async function deleteOrder() {
  if (!order?.id) return
  isDeleting = true
  const res = await supabase.from('order_item').delete().eq('order_id', order.id)
  if (res.error) {
    useMessage('error', res.error.message || 'an error has occurred')
    isDeleting = false
    dialogDelete?.close()
    return
  }

  const res2 = await supabase.from('orders').delete().eq('id', order.id)
  if (res2.error) {
    useMessage('error', res2.error.message || 'an error has occurred')
    isDeleting = false
    dialogDelete?.close()
    return
  }

  useMessage('success', 'order deleted!')
  isDeleting = false
  router.push('/orders')
}

// mark complete
let isMarkingComplete = $ref(false)
let orderCompleted = $computed(() => order?.status === 'completed')
async function handleMarkComplete() {
  isMarkingComplete = true

  const res = await supabase
    .from('orders')
    .update({ status: order?.status === 'completed' ? 'pending' : 'completed' })
    .eq('id', order?.id)

  if (res.error) {
    useMessage('error', res.error.message || 'an error has occurred')
    isMarkingComplete = false
    return
  }

  if (order?.status) order.status = orderCompleted ? 'pending' : 'completed'

  isMarkingComplete = false
}
</script>
