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
          <label class="flex flex-col w-full gap-y-1">
            product name
            <input type="text" placeholder="muse be at least 3 characters" class="form-input" required />
          </label>
          <label class="flex flex-col w-full gap-y-1">
            category
            <ComboBox :options="categorys" />
          </label>
          <div class="grid grid-cols-2 gap-4">
            <input type="number" placeholder="selling price" class="form-input" />
            <input type="number" placeholder="cost price" class="form-input" />
          </div>
          <label class="flex flex-col w-full gap-y-1">
            quantity
            <input type="number" placeholder="in stock" class="form-input" />
          </label>
          <Select title="order type" :options="['delivary', 'pick up', 'all']" />

          <div>
            <div class="mb-1">discount</div>
            <div class="grid grid-cols-2 gap-4">
              <Select title="type" :options="['coupon', 'time limited', 'offer']" />
              <input class="form-input" type="number" placeholder="value" />
            </div>
          </div>
        </div>

        <!-- right side -->
        <div class="flex flex-col w-full gap-y-4">
          <label class="flex flex-col w-full gap-y-1">
            description
            <textarea rows="10" class="form-input resize-none w-full" placeholder="short description" />
          </label>
          <label class="flex flex-col w-full gap-y-1">
            expiration date
            <div class="grid grid-cols-2 gap-x-6">
              <input type="date" class="form-input" />
              <input type="time" class="form-input" />
            </div>
          </label>
        </div>
      </div>

      <!-- picture form  -->
      <div class="p4 rounded-md surface-1 flex flex-col gap-y-4">
        <div
          class="rounded-3 border dark:border-dark-3 surface-2 grid place-items-center gap-4 py-12 px-4 text-center typo-sm"
        >
          <div class="bg-violet-1 rounded-3 p-1 box-content">
            <IImg width="32" stroke="none" height="32" class="fill-indigo-6 dark:fill-violet-6" />
          </div>
          <div class="flex flex-col typo-clr-muted">
            <span class="text-indigo dark-text-violet typo-base mb-3 flex mx-auto"
              ><IUpload width="16" height="16" class="mr-2" /> Upload Image</span
            >
            <span>Upload a cover image for your product.</span>
            <span>File Format jpeg, png Recommened Size 600x600 (1:1)</span>
          </div>
        </div>

        <span class="mt-2">additional images</span>
        <div class="grid grid-cols-2 gap-x-4 typo-sm">
          <div class="px6 py8 grid place-items-center gap2 border dark-border-dark-3 rounded-3 surface-2">
            <div class="bg-violet-1 rounded-3 p-1 box-content">
              <IImg width="32" stroke="none" height="32" class="fill-indigo-6 dark:fill-violet-6" />
            </div>
            <span class="text-indigo dark-text-violet mb-3 flex mx-auto"
              ><IUpload width="16" height="16" class="mr-2" /> Upload Image</span
            >
          </div>
          <div class="border border-dashed dark-border-dark-3 rounded-3"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const categorys = ['phone', 'computer', 'laptop', 'clothes', 'shoes', 'accessory', 'gadget']
</script>
