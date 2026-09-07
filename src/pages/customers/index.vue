<template>
  <main class="p4 flex flex-col gap-4 overflow-y-auto">
    <button
      class="fixed right-20 bottom-24 fill-primary-2 rounded-full p-3 typo-clr-on-primary cursor-pointer shadow-lg hover:scale-105 transition-transform"
      @click="ModalRef?.openModal"
    >
      <IAdd />
    </button>

    <!-- summary cards grid -->
    <div class="grid grid-cols-2 gap-x-4 row-span-1">
      <!-- all customers summary -->
      <SummaryCard
        :data="[
          { name: 'all customers', value: store.countAll ?? '10' },
          { name: 'active', value: '8', growth: '+20%' },
          { name: 'suspended', value: '2' },
        ]"
      >
        <template #icon>
          <ICustomers width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- customers by state summary -->
      <SummaryCard
        :data="[
          { name: 'new customers', value: '4', growth: '+15%' },
          { name: 'purchasing', value: '8', growth: '+25%' },
          { name: 'canceled', value: '0' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>

    <!-- data-table  -->
    <BaseTable
      :items-count="store.countAll"
      :data="store.customers"
      :headers="headers"
      :get-data="store.getCustomers"
      table-name="customers"
    >
      <template #body>
        <tbody v-if="store.customers">
          <tr v-for="customer in store.customers" :key="customer.id">
            <TableBodyCell :value="customer.id" />
            <TableBodyCell :value="customer.name" variant="link" :to="`/customers/${customer.id}`" />
            <TableBodyCell :value="customer.email" />
            <TableBodyCell :value="customer.created_at" variant="date" />
            <TableBodyCell :value="customer.phone" />
            <TableBodyCell
              :value="customer.status ? 'active' : 'suspended'"
              variant="chip"
              :chip-status="customer.status"
            />
          </tr>
        </tbody>
      </template>
    </BaseTable>

    <!-- create order dialog -->
    <CreateCustomerModal @success="getCustomers" ref="ModalRef" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCustomersStore } from '~/store/customers'
import SummaryCard from '~/components/SummaryCard.vue'
import BaseTable from '~/components/BaseTable.vue'
import TableBodyCell from '~/components/TableBodyCell.vue'
import CreateCustomerModal from '~/components/CreateCustomerModal.vue'
import { IAdd, ICustomers, IShoppingBag } from '~/components/icons'

const ModalRef = ref<InstanceType<typeof CreateCustomerModal> | null>(null)
const headers = ['id', 'name', 'email', 'created_at', 'phone', 'status']

const store = useCustomersStore()

function getCustomers() {
  store.getCustomers({ orderOptions: { column: 'id', ascending: false, foreignTable: '' }, page: 1, itemsPerPage: 10 })
}
onMounted(() => {
  getCustomers()
})
</script>
