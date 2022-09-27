<template>
  <main class="p4 flex flex-col gap-y-4 pt-4 pl-20 h-full">
    <!-- header -->
    <header class="flex justify-between items-center">
      <!-- Page title -->
      <h1 class="typo-lg">Orders</h1>
      <button
        class="flex items-center gap-x-2 fill-primary-2 rounded-md pl-2 pr-4 py-1 typo-clr-on-primary typo-sm"
        @click="orderDialogRef?.openModal"
      >
        <IAdd />
        new order
      </button>
    </header>

    <!-- summary cards grid -->
    <div class="grid grid-cols-3 gap-x-4 row-span-1">
      <!-- all orders summary -->
      <SummaryCard
        :data="[
          { name: 'all orders', value: '450' },
          { name: 'pending', value: '50' },
          { name: 'completed', value: '400' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- orders by state summary -->
      <SummaryCard
        :data="[
          { name: 'canceled orders', value: '30' },
          { name: 'returned', value: '10' },
          { name: 'damaged', value: '0' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- carts summary -->
      <SummaryCard
        :data="[
          { name: 'abandoned carts', value: '20%' },
          { name: 'customers', value: '30' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>

    <!-- datatable  -->
    <div class="flex flex-col grow overflow-auto p4 gap-y-4 surface-1 rounded-md">
      <caption class="flex items-center gap-x-2 typo-sm">
        <h1 class="typo-head">Customers Orders</h1>

        <!-- search bar  -->
        <div class="p-2 surface-2 rounded-md ml-auto typo-sm flex items-center gap-x-2">
          <Isearch width="16" height="16" />
          <input type="search" placeholder="search.." class="focus:outline-none bg-inherit" />
        </div>
        <FilterMenu />

        <FilterDate />

        <BulkAction />
      </caption>

      <DataTable :data="data" />
      <div class="border-t border-gray-2 dark:border-dark-3 flex items-center pt-2 mt-auto">
        <span>10 items per page</span>
        <span class="ml-8">1 - 10 of 200 items</span>
        <span class="ml-auto">1 of 44 pages</span>
        <ICaretDown wdith="16" height="16" class="rotate-90" />
        <ICaretDown wdith="16" height="16" class="rotate-270" />
      </div>
    </div>

    <!-- create order dialog -->
    <OrderDialog ref="orderDialogRef" />
  </main>
</template>

<script setup lang="ts">
import OrderDialog from '../components/OrderDialog.vue'
const orderDialogRef = $ref<InstanceType<typeof OrderDialog> | null>(null)
const data = [
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
  ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
]
</script>
