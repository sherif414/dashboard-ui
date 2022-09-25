<template>
  <main class="grid grid-cols-3 grid-rows-1 gap-x-6 p4 pl-20 h-full">
    <section class="col-span-2 grid grid-cols-2 pr-2 gap-4 overflow-y-auto">
      <!-- sales summary -->
      <SummaryCard
        :data="[
          { name: 'sales', value: '400,000,00', growth: '+ 125%' },
          { name: 'volume', value: 450, growth: '+20' },
        ]"
      >
        <template #icon>
          <IChart width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- customers summary -->
      <SummaryCard
        :data="[
          { name: 'cusomters', value: '1,250', growth: '+100' },
          { name: 'active', value: '1,050', growth: '+80' },
        ]"
      >
        <template #icon>
          <ICustomers width="18" height="18" class="summary-icon" />
        </template>
      </SummaryCard>

      <!-- orders summary -->
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

      <!-- products summary -->
      <SummaryCard
        :data="[
          { name: 'all products', value: '90' },
          { name: 'active', value: '50', growth: '+20%' },
        ]"
        fill="fill-primary-2 typo-clr-on-primary"
      >
        <template #icon>
          <IInventory width="18" height="18" class="summary-icon fill-primary-3" />
        </template>
      </SummaryCard>

      <!-- data visualization -->
      <GraphBar type="line" chart-id="chart1" class="col-span-2" />
      <GraphBar type="bar" chart-id="chart2" class="col-span-2" />
    </section>
    <RecentOrders />
  </main>
</template>
