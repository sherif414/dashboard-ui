<template>
  <!-- header -->
  <div class="my-2">
    <h2 class="text-black dark:text-gray-1 font-medium text-4">Create New Order</h2>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <!-- create order form -->
    <form class="grid grid-cols-2 gap-x-2 gap-y-4 text-3">
      <span>order details</span>
      <span>new customer</span>
      <!-- <Toggle labelText="new customer" /> -->
      <Select class="col-span-2" />
      <Select />
      <Select />
      <h3 class="col-span-2">Order Time & Date</h3>
      <Select />
      <h3 class="col-span-2">Order Status</h3>
      <Select class="col-span-2" />
      <textarea class="col-span-2 focus:outline-none bg-background-light rounded-md p4" rows="10"></textarea>
    </form>

    <!-- product search -->
    <section class=""></section>

    <!-- form submission -->
    <div class="col-span-2 flex justify-center">
      <button class="p2 rounded" @click="$emit('closeDialog')">cancel</button>
      <button class="p2 rounded bg-indigo-5 text-gray-1 dark:bg-violet-6">Create Order</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['closeDialog'])
</script>
