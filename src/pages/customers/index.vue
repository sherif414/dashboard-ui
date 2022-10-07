<template>
  <main class="p4 flex flex-col gap-y-4 pt-4 pl-20 h-screen">
    <!-- header -->
    <header class="flex justify-between items-center">
      <!-- Page title -->
      <h1 class="typo-lg">Customers</h1>
      <button
        class="flex items-center gap-x-2 fill-primary-2 rounded-md pl-2 pr-4 py-1 typo-clr-on-primary typo-sm"
        @click="ModalRef?.openModal"
      >
        <IAdd />
        new customer
      </button>
    </header>

    <!-- summary cards grid -->
    <div class="grid grid-cols-2 gap-x-4 row-span-1">
      <!-- all customers summary -->
      <SummaryCard
        :data="[
          { name: 'all customers', value: '450' },
          { name: 'pending', value: '50' },
          { name: 'completed', value: '400' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- customers by state summary -->
      <SummaryCard
        :data="[
          { name: 'canceled customers', value: '30' },
          { name: 'returned', value: '10' },
          { name: 'damaged', value: '0' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- carts summary -->
    </div>

    <!-- datatable  -->
    <div class="flex flex-col grow overflow-auto p4 gap-y-4 surface-1 rounded-md">
      <caption class="flex items-center gap-x-2 typo-sm">
        <h1 class="typo-head">Customers customers</h1>

        <!-- search bar  -->
        <div class="p-2 surface-2 rounded-md ml-auto typo-sm flex items-center gap-x-2">
          <Isearch width="16" height="16" />
          <input type="search" placeholder="search.." class="focus:outline-none bg-inherit" />
        </div>
        <FilterMenu />

        <FilterDate />

        <BulkAction />
      </caption>

      <DataTable :rows="store.customersList" />
      <div class="border-t border-gray-2 dark:border-dark-3 flex items-center pt-2 mt-auto">
        <span>10 items per page</span>
        <span class="ml-8">1 - 10 of 200 items</span>
        <span class="ml-auto">1 of 44 pages</span>
        <ICaretDown wdith="16" height="16" class="rotate-90" />
        <ICaretDown wdith="16" height="16" class="rotate-270" />
      </div>
    </div>

    <!-- create order dialog -->
    <CreateCustomerModal ref="ModalRef" />
  </main>
</template>

<script setup lang="ts">
import { useCustomersStore } from '~/store/customers'

import CreateCustomerModal from '~/components/CreateCustomerModal.vue'
const ModalRef = $ref<InstanceType<typeof CreateCustomerModal> | null>(null)

const store = useCustomersStore()
store.getCustomersList()
</script>
