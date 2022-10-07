<template>
  <div class="flex flex-col p4 gap-4 min-h-screen">
    <!-- title  -->
    <header class="flex items-center gap-4">
      <h1 class="typo-lg">create a product</h1>
      <button class="ml-auto">save as draft</button>
      <button class="fill-primary-2 typo-clr-on-primary px-4 py-2 rounded-md">save & publish</button>
    </header>
    <main class="grow grid grid-cols-3 gap-x-4">
      <!-- main form -->
      <div class="p8 grid grid-cols-2 gap-x-16 col-span-2 rounded-md surface-1 typo-sm">
        <!-- left side -->
        <div class="flex flex-col gap-6">
          <NInput class="" type="text" placeholder="product name" />
          <input type="text" placeholder="product name" class="form-input" required />
          <ComboBox :options="categorys" />
          <div class="grid grid-cols-2 gap-4">
            <input type="number" placeholder="selling price" class="form-input" />
            <input type="number" placeholder="cost price" class="form-input" />
          </div>
          <input type="number" placeholder="in stock" class="form-input" />
          <Select title="order type" :options="['delivary', 'pick up', 'all']" />

          <div>
            <span class="mb-2 ml-2 typo-base">discount</span>
            <div class="grid grid-cols-2 gap-4">
              <Select title="type" :options="['coupon', 'time limited', 'offer']" />
              <input class="form-input" type="number" placeholder="value" />
            </div>
          </div>
        </div>

        <!-- right side -->
        <div>
          <textarea rows="10" class="form-input resize-none w-full" placeholder="product desciption"></textarea>
        </div>
      </div>

      <!-- picture form  -->
      <div class="p4 rounded-md surface-1">hi</div>
    </main>
  </div>
</template>

<script setup lang="ts">
const categorys = ['phone', 'computer', 'laptop', 'clothes', 'shoes', 'accessory', 'gadget']
</script>
