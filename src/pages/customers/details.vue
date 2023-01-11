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
            :class="[customer?.status ? 'bg-success text-success' : 'bg-error  text-error']"
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
          { name: 'total purchases', value: '$250,000' },
          { name: 'total orders', value: '120' },
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
import { Customer, Order } from 'types'

let customer = $ref<Customer | null>(null)
async function getCustomer(id: string): Promise<Customer | null> {
  const res = await supabase.from('customers').select('*').eq('id', +id).single()
  if (res.error) useMessage('error', res.error.message)
  return res.data
}

const route = useRoute()

let isSuspending = $ref(false)
async function handleSuspend() {
  isSuspending = true
  if (!customer) return
  const res = await supabase.from('customers').update({ status: !customer.status })
  if (res.error) useMessage('error', res.error.message)
  customer.status = !customer.status
  isSuspending = false
}

let orders = $ref<Order[] | null>(null)
async function getOrders(): Promise<Order[] | null> {
  if (!customer) return null
  const res = await supabase.from('orders').select('*').eq('owner', customer?.id)
  if (res.error) useMessage('error', res.error.message)
  return res.data
}

onMounted(async () => {
  if (Array.isArray(route.params.id)) return

  customer = await getCustomer(route.params.id)
  orders = await getOrders()
})

const headers = ['order date', 'Tracking Id', 'total purchases', 'type', 'status']
</script>
