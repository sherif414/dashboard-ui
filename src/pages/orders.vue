<template>
  <main class="p4 flex flex-col gap-y-4 pt-4 pl-20 h-full">
    <!-- header -->
    <header class="flex justify-between items-center">
      <!-- Page title -->
      <h1 class="typo-lg">Orders</h1>
      <button
        class="flex items-center gap-x-2 fill-primary-2 rounded-md pl-2 pr-4 py-1 typo-clr-on-primary typo-sm"
        @click="orderDialog.showModal()"
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
    </div>

    <!-- create order dialog -->
    <dialog
      class="open:backdrop:backdrop-blur-4 text-body rounded-3 dark:(bg-dark-300 text-gray-3) bg-white"
      ref="orderDialog"
    >
      <OrderDialog @close-dialog="orderDialog.close()" />
    </dialog>
  </main>
</template>

<script setup lang="ts">
const orderDialog = $ref<HTMLDialogElement>()
const data = {
  headings: ['customer name', 'order date', 'order type', 'tracking ID', 'order total', 'action', 'status'],
  rows: ['sherif hassan idris', '12 Aug 2022 - 12:25 am', 'home delivary', '9348fjr73', '₦25,000.00'],
}
</script>
