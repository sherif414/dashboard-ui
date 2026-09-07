<template>
  <main class="p4 flex flex-col gap-4 overflow-y-auto">
    <!-- delete order dialog -->
    <dialog ref="dialogDelete" class="surface-1 rounded-md p6 shadow-lg border border-gray-2 dark:border-dark-3">
      <div class="grid grid-cols-2 gap-4">
        <h1 class="col-span-2 typo-head">Delete order #{{ order?.id }}?</h1>
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

    <header class="flex flex-wrap gap-4 items-center justify-between surface-1 p4 rounded-md border border-gray-2 dark:border-dark-3">
      <div class="flex flex-wrap gap-4 sm:gap-6 items-center">
        <h2 class="typo-head">
          Order Id: <span class="typo-clr-muted typo-base">#{{ order?.id }}</span>
        </h2>
        <h2 class="typo-head">
          Date:
          <span class="typo-clr-muted typo-base">{{
            order?.created_at ? useDateFormat(order.created_at, 'DD MMM YYYY - hh:mm aa').value : '-'
          }}</span>
        </h2>
        <h2 class="typo-head">
          Total: <span class="typo-clr-primary typo-base font-bold">${{ order?.total_purchases }}</span>
        </h2>
      </div>
      <div class="flex items-center gap-3 ml-auto">
        <Btn
          @click="dialogDelete?.showModal()"
          variant="text"
          class="bg-error bg-opacity-10 text-error hover:bg-error hover:bg-opacity-20 px-4"
        >
          Delete Order
        </Btn>
        <Btn
          :loading="isMarkingComplete"
          @click="handleMarkComplete"
          :class="orderCompleted ? 'bg-black! text-gray-1! dark:bg-gray-1! dark:text-dark!' : ''"
          >mark as {{ orderCompleted ? 'pending' : 'completed' }}</Btn
        >
      </div>
    </header>

    <!-- summary cards grid -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
                customer?.created_at ? useDateFormat(customer.created_at, 'DD MMM YYYY').value : '-'
              }}</span>
            </h3>
          </div>
        </template>
      </SummaryCard>

      <!-- orders by state summary -->
      <SummaryCard
        :filter="false"
        :data="[
          { name: 'home address', value: 'No. 15 Bahri Street' },
          { name: 'billing address', value: 'No. 15 Bahri Street' },
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
          { name: 'payment method', value: 'Credit Card' },
          { name: 'delivery type', value: order?.type || 'delivery' },
        ]"
      >
        <template #icon>
          <ICreditCard width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </section>
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
            <TableBodyCell :value="item.products?.name ?? 'Product #' + item.product_id" variant="link" :to="`/products/${item.product_id}`" />
            <TableBodyCell :value="'$' + (item.products?.sell_price || 0)" />
            <TableBodyCell :value="item.quantity" />
            <TableBodyCell :value="item.discount ? item.discount + '%' : '$0.00'" />
            <TableBodyCell :value="'$' + ((item.quantity || 1) * (item.products?.sell_price || 0))" />
            <TableBodyCell :value="item.status" variant="chip" :chip-status="item.status === 'completed'" />
          </tr>
        </tbody>
      </template>
      <template #pagination> order total: ${{ order?.total_purchases }} </template>
    </BaseTable>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import type { Customer, Order } from 'types'
import { orderService } from '~/services/orderService'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import SummaryCard from '~/components/SummaryCard.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableHeaderCell from '~/components/TableHeaderCell.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import { ICustomers, ILocation, ICreditCard } from '~/components/icons'

const route = useRoute()
const router = useRouter()
const customer = ref<Customer | null | undefined>(null)
const order = ref<Order | null>(null)
const orderItems = ref<any[] | null>(null)
const headers = ['product name', 'unit price', 'quantity', 'discount', 'total price', 'status']

async function getData(orderId: string) {
  try {
    const data = await orderService.getOrderById(+orderId)
    if (!data) {
      useMessage('error', 'Order not found')
      return
    }
    customer.value = data.customers
    orderItems.value = data.order_item
    order.value = {
      id: data.id,
      owner: data.owner,
      type: data.type,
      status: data.status,
      note: data.note,
      total_purchases: data.total_purchases,
      created_at: data.created_at,
    }
  } catch (err: any) {
    useMessage('error', err.message || 'An error has occurred')
  }
}

onMounted(() => {
  if (typeof route.params.id === 'string') getData(route.params.id)
})

// deletion
const isDeleting = ref(false)
const dialogDelete = ref<HTMLDialogElement | null>(null)

async function deleteOrder() {
  if (!order.value?.id) return
  isDeleting.value = true
  const res = await orderService.deleteOrder(order.value.id)
  isDeleting.value = false

  if (res.error) {
    useMessage('error', res.error.message)
    dialogDelete.value?.close()
    return
  }

  useMessage('success', 'Order deleted!')
  router.push('/orders')
}

// mark complete
const isMarkingComplete = ref(false)
const orderCompleted = computed(() => order.value?.status === 'completed')

async function handleMarkComplete() {
  if (!order.value) return
  isMarkingComplete.value = true

  const nextStatus = order.value.status === 'completed' ? 'pending' : 'completed'
  const res = await orderService.updateOrderStatus(order.value.id, nextStatus)

  isMarkingComplete.value = false
  if (res.error) {
    useMessage('error', res.error.message)
    return
  }

  order.value.status = nextStatus
  if (orderItems.value) {
    orderItems.value.forEach((item) => (item.status = nextStatus))
  }
  useMessage('success', `Order marked as ${nextStatus}`)
}
</script>
