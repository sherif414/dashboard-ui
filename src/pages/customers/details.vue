<template>
  <main class="flex flex-col gap-4 overflow-auto p4">
    <header class="flex gap-4 2xl:gap-8 items-center justify-start">
      <h2 class="typo-head">
        customer Id: <span class="typo-clr-muted typo-base">#{{ customer?.id }}</span>
      </h2>
      <h2 class="typo-head">
        customer since:
        <span class="typo-clr-muted typo-base">{{
          customer?.created_at ? useDateFormat(customer.created_at, 'DD MMM YYYY - hh:mm aa').value : '-'
        }}</span>
      </h2>
      <Btn
        :loading="isSuspending"
        class="ml-auto"
        :class="
          !customer?.status
            ? 'bg-black! text-gray-1! dark:bg-gray-1! dark:text-dark!'
            : 'bg-error! bg-opacity-10! text-error! hover:bg-error! hover:bg-opacity-30!'
        "
        @click="handleSuspend"
        >{{ customer?.status ? 'suspend' : 'unsuspend' }} customer</Btn
      >
    </header>
    <section class="grid grid-cols-3 gap-4">
      <SummaryCard
        :filter="false"
        :data="[
          { name: 'phone', value: customer?.phone },
          { name: 'email', value: customer?.email },
        ]"
        class="relative"
      >
        <template #icon>
          <ICustomers width="18" height="18" class="summary-icon" />
          <div class="typo-base my-auto">
            <h3>{{ customer?.name }}</h3>
          </div>
          <span
            class="bg-opacity-30 absolute right-2 top-2 px2 py1 rounded-md"
            :class="[customer?.status ? 'bg-success text-success' : 'bg-error text-error']"
            >{{ customer?.status ? 'active' : 'inActive' }}</span
          >
        </template>
      </SummaryCard>

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

      <SummaryCard
        :filter="false"
        :data="[
          { name: 'total purchases', value: '$' + totalPurchases },
          { name: 'total orders', value: orders?.length ?? 0 },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </section>
    <BaseTable
      :show-search="false"
      table-name="orders"
      table-title="orders"
      :items-count="orders?.length ?? 0"
      :data="orders"
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
        <tbody v-if="orders">
          <tr v-for="item in orders" :key="item.id">
            <TableBodyCell :value="item.created_at" variant="date" />
            <TableBodyCell :value="item.id" variant="link" :to="`/orders/${item.id}`" />
            <TableBodyCell :value="'$' + (item.total_purchases || 0)" />
            <TableBodyCell :value="item.type" />
            <TableBodyCell :value="item.status" variant="chip" :chip-status="item.status === 'completed'" />
          </tr>
        </tbody>
      </template>
    </BaseTable>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import type { Customer, Order } from 'types'
import { customerService } from '~/services/customerService'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import SummaryCard from '~/components/SummaryCard.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableHeaderCell from '~/components/TableHeaderCell.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import { ICustomers, ILocation, IShoppingBag } from '~/components/icons'

const route = useRoute()
const customer = ref<Customer | null>(null)
const orders = ref<Order[] | null>(null)
const isSuspending = ref(false)
const headers = ['order date', 'Tracking Id', 'total purchases', 'type', 'status']

const totalPurchases = computed(() => {
  if (!orders.value) return 0
  return orders.value.reduce((sum, o) => sum + (o.total_purchases ?? 0), 0)
})

async function getCustomer(id: string): Promise<Customer | null> {
  const data = await customerService.getCustomerById(+id)
  if (!data) useMessage('error', 'Customer not found')
  return data
}

async function handleSuspend() {
  if (!customer.value) return
  isSuspending.value = true
  const res = await customerService.toggleCustomerStatus(customer.value.id)
  isSuspending.value = false
  if (res.error) {
    useMessage('error', res.error.message)
    return
  }
  if (res.data) customer.value = res.data
  useMessage('success', `Customer status updated to ${customer.value.status ? 'active' : 'suspended'}`)
}

async function getOrders(): Promise<Order[] | null> {
  if (!customer.value) return null
  return await customerService.getCustomerOrders(customer.value.id)
}

onMounted(async () => {
  if (Array.isArray(route.params.id)) return
  customer.value = await getCustomer(route.params.id as string)
  orders.value = await getOrders()
})
</script>
