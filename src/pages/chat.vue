<script setup lang="ts">
let searchValue = $ref<string>('')
</script>

<template>
  <main class="grid grid-rows-[max-content_1fr] grid-cols-3 gap-4 h-screen p4 pl-5rem pt-5rem">
    <header class="flex items-center gap-4 justify-start col-span-full">
      <h1 class="typo-head">Conversations with Customers</h1>
      <button
        class="ml-auto py-2 px-4 fill-primary-2 typo-clr-on-primary hover:fill-primary-3 rounded-md"
        type="button"
      >
        New Message
      </button>
    </header>

    <!-- conversations -->
    <section class="surface-1 rounded-md p4 flex flex-col gap-4 overflow-y-auto">
      <h2 class="typo-head">contacts</h2>
      <TextField placeholder="search" type="search">
        <template #prepend>
          <ISearch v-model="searchValue" width="18" height="18" />
        </template>
      </TextField>
      <div class="flex flex-col overflow-y-auto gap-4">
        <article :key="x" v-for="x in 10" class="grid grid-cols-[max-content_1fr]">
          <div class="w-12">
            <img src="../assets/img/iphone14.png" alt="user image" />
          </div>
          <div class="flex flex-col gap-2 typo-sm p1 min-w-0">
            <h3>Jane Doe</h3>
            <p class="truncate">Lorem ipsum jioajsd oaishd iasd iahds isad ihaod ihado isad oihdas oiasd oih</p>
          </div>
        </article>
      </div>
    </section>

    <!-- messages -->
    <section class="flex flex-col surface-1 rounded-md col-span-2">
      <header class="flex justify-between items-center border-b border-b-gray-2 dark:border-b-dark-3 p-2 typo-sm">
        <div class="flex">
          <div class="w-14 h-14"><img src="../assets/img/iphone14.png" alt="profile image" /></div>
          <div class="flex flex-col gap-2 items-start justify-center">
            <h2>Jane Doe</h2>
            <h3>online <span class="typo-clr-muted">10:30 pm</span></h3>
          </div>
        </div>
        <div class="grid grid-cols-[max-content_max-content] grid-rows-2 gap-2 items-center justify-between">
          <Chip :status="true">New Customer</Chip>
          <a class="typo-clr-primary" href="#">view profile</a>
          <span class="flex items-center gap-2 row-start-2 col-start-2"
            ><IShoppingBag width="14" height="14" />0 orders</span
          >
        </div>
      </header>

      <section class="grow p-2 overflow-y-auto"></section>

      <footer class="p-2">
        <TextField placeholder="your message" classes="rounded-lg px-1!">
          <template #prepend>
            <IAdd width="12" height="12" class="summary-icon p-6px" />
          </template>
          <template #append>
            <button type="button" class="flex items-center gap-2 p-2 px-3 bg-accent-3 rounded-md text-gray-9">
              <span>Send</span>
              <ISend width="16" height="16" />
            </button>
          </template>
        </TextField>
      </footer>
    </section>
  </main>
</template>

<style></style>
