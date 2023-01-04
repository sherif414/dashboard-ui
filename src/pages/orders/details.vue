<template>
  <main class="p4 flex flex-col gap-4">
    <header class="flex gap-4 2xl:gap-8 items-center justify-start">
      <h2 class="typo-head">Order Id: <span class="typo-clr-muted typo-base">#218083</span></h2>
      <h2 class="typo-head">Date: <span class="typo-clr-muted typo-base">20 sep 2022 - 12:55 pm</span></h2>
      <h2 class="typo-head">Total purchases: <span class="typo-clr-muted typo-base">$500.00</span></h2>
      <button type="button" class="ml-auto py-2 px-4 rounded-xl bg-dark-6 dark:bg-dark-3 text-white">
        Cancel Order
      </button>
      <button type="button" class="py-2 px-4 fill-primary-2 typo-clr-on-primary rounded-xl">Mark as Complete</button>
    </header>
    <!-- summary cards grid -->
    <div class="grid grid-cols-3 gap-4 2xl:gap-8 row-span-1">
      <!-- all orders summary -->
      <SummaryCard
        :filter="false"
        :data="[
          { name: 'phone', value: '+249-9920736198' },
          { name: 'email', value: 'example@email.com' },
        ]"
      >
        <template #icon>
          <ICustomers width="18" height="18" class="summary-icon" />
          <div class="typo-sm">
            <h3>Jane Doe</h3>
            <h3>customer since <span class="typo-clr-muted">20 jan 2010</span></h3>
          </div>
        </template>
      </SummaryCard>

      <!-- orders by state summary -->
      <SummaryCard
        :filter="false"
        :data="[
          { name: 'address', value: 'No. 15 Bahri Street,  Sudan' },
          { name: 'pilling address', value: 'No. 15 Bahri Street,  Sudan' },
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
          { name: 'delivery type', value: 'home delivery' },
        ]"
      >
        <template #icon>
          <ICreditCard width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>
    </div>
    <BaseTable />
  </main>
</template>
