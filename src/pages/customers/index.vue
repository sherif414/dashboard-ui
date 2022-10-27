<template>
  <main class="p4 pt-20 pl-20 2xl:(p8 pt-20 pl-24 gap-8) flex flex-col gap-4 h-full w-full">
    <button
      class="fixed right-20 bottom-24 fill-primary-2 rounded-full p-3 typo-clr-on-primary"
      @click="ModalRef?.openModal"
    >
      <IAdd />
    </button>

    <!-- summary cards grid -->
    <div class="grid grid-cols-2 gap-x-4 row-span-1">
      <!-- all customers summary -->
      <SummaryCard
        :data="[
          { name: 'all customers', value: '450' },
          { name: 'active', value: '100', growth: '+20' },
          { name: 'inactive', value: '30' },
        ]"
      >
        <template #icon>
          <ICustomers width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- customers by state summary -->
      <SummaryCard
        :data="[
          { name: 'new customers', value: '50', growth: '+10%' },
          { name: 'purchasing', value: '200', growth: '+20' },
          { name: 'canceled', value: '5' },
        ]"
      >
        <template #icon>
          <IShoppingBag width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- carts summary -->
    </div>

    <!-- data-table  -->
    <BaseTable />

    <!-- create order dialog -->
    <CreateCustomerModal ref="ModalRef" />
  </main>
</template>

<script setup lang="ts">
//import { useCustomersStore } from '~/store/customers'

import CreateCustomerModal from '~/components/CreateCustomerModal.vue'
const ModalRef = $ref<InstanceType<typeof CreateCustomerModal> | null>(null)

//const store = useCustomersStore()
//store.getCustomersList()
</script>
