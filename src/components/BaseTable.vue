<template>
  <div class="flex flex-col grow p4 px-8 gap-y-4 surface-1 rounded-md">
    <!-- header  -->
    <caption class="flex items-center gap-x-2 typo-sm">
      <h1 class="typo-head">products table</h1>
      <div class="p-2 surface-2 rounded-md ml-auto typo-sm flex items-center gap-x-2">
        <ISearch width="16" height="16" />
        <input type="search" placeholder="search.." class="focus:outline-none bg-inherit" />
      </div>
      <FilterMenu />
      <FilterDate />
      <BulkAction />
    </caption>

    <!-- table -->
    <div class="overflow-auto flex flex-col">
      <table class="typo-base">
        <thead class="border-y border-gray-2 dark:border-dark-3 surface-1 capitalize">
          <tr class="text-left">
            <slot name="headings" />
          </tr>
        </thead>
        <tbody class="typo-sm">
          <slot name="body" />
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <div class="border-t border-gray-2 dark:border-dark-3 flex items-center pt-2 mt-auto">
      <span>10 items per page</span>
      <span class="ml-8">1 - 10 of 200 items</span>
      <span class="ml-auto">1 of 44 pages</span>
      <ICaretDown width="16" height="16" class="rotate-90" />
      <ICaretDown width="16" height="16" class="rotate-270" />
    </div>
  </div>
</template>
