<template>
  <!-- dialog header -->
  <div class="my-2">
    <h2 class="text-black dark:text-gray-1 font-medium text-4 mb-4">Create New Order</h2>
  </div>

  <div class="grid grid-cols-2 gap-x-8">
    <!-- dialog left -->
    <form class="grid grid-cols-2 gap-x-2 gap-y-1 text-3 min-w-20rem">
      <div class="flex justify-between col-span-2 items-center mb-3">
        <span class="text-gray-4">order details</span>
        <span class="flex items-center gap-x-2">new customer <Toggle /></span>
      </div>
      <Select title="Select customer" class="col-span-2 mb-3" />
      <Select title="Payment Type" />
      <Select class="mb-3" title="Order Type" />
      <h3 class="col-span-2 mb-1">Order Time & Date</h3>
      <input
        class="p2 dark:(bg-dark-1 text-gray-2) bg-background-light rounded-md focus:outline-none mb-3"
        type="date"
      />
      <input
        class="p2 dark:(bg-dark-1 text-gray-2) bg-background-light rounded-md focus:outline-none mb-3"
        type="time"
      />
      <h3 class="col-span-2">Order Status</h3>
      <Select title="Select Status" class="col-span-2 mb-3" />
      <textarea
        placeholder="order note"
        class="col-span-2 p2 dark:(bg-dark-1 text-gray-2) bg-background-light rounded focus:outline-none resize-none"
        rows="10"
      ></textarea>
    </form>

    <!-- dialog right -->
    <section class="text-3 flex flex-col gap-y-4">
      <h3 class="text-gray-4 text-body">items</h3>
      <div class="p3 border text-3 rounded-md dark:border-line border-gray-3 flex items-center gap-x-2 w-full">
        <Isearch width="16" height="16" class="[&_path]:dark:stroke-gray-1" />
        <input type="search" placeholder="search.." class="focus:outline-none bg-inherit" />
      </div>
      <div class="grid h-full place-content-center gap-8">
        <IShoppingBag
          wdith="56"
          height="56"
          class="fill-gray-4 [&_path]:stroke-gray-4 p-8 box-content rounded-full bg-gray-3 mx-auto"
        />
        <h3 class="text-4 font-bold capitalize text-gray-7 dark:text-gray-1">add products to your order</h3>
      </div>
    </section>

    <!-- dialog submission -->
    <div class="col-span-2 grid grid-cols-4 gap-x-4 mt-4">
      <button class="p2 rounded-md col-start-2" @click="$emit('closeDialog')">cancel</button>
      <button class="p2 rounded-md bg-indigo-5 text-gray-1 dark:bg-violet-6">Create Order</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['closeDialog'])
</script>
