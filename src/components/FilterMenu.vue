<template>
  <div class="relative">
    <button class="border border-black-10 px2 py1 text-3 rounded flex items-center gap-x-2">
      <IFilter width="14" height="14" /> filter
    </button>
    <menu class="grid items-start text-left gap-y-4 p4 text-3 absolute bg-white rounded-3 font-light w-16rem shadow-lg">
      <h2 class="text-0.875rem font-semibold">Filter</h2>
      <h3 class="font-semibold">Order Type</h3>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
          <input type="checkbox" />
          <label for="">Home Delivary</label>
        </div>
        <div class="flex items-center gap-x-2">
          <input type="checkbox" />
          <label for="">Pick Up</label>
        </div>
      </div>
      <div class="grid gap-y-2">
        <label class="font-semibold" for="">Status</label>
        <select class="border border-line focus:outline-none rounded-1 px2 py1" name="" id="">
          <option value="">completed</option>
          <option value="">in progress</option>
        </select>
      </div>
      <div class="grid gap-y-2">
        <label class="font-semibold" for="">Customer</label>
        <select class="border border-line focus:outline-none rounded-1 px2 py1" name="" id="">
          <option value="">All</option>
          <option value="">sherif hassan</option>
        </select>
      </div>
      <div>
        <h3 class="mb-2 font-semibold">Amount</h3>
        <div class="grid grid-cols-2 gap-x-4 items-center">
          <div>
            <label for="">from</label>
            <input class="px2 py1 rounded focus:outline-none border border-line w-full" type="number" name="" id="" />
          </div>
          <div>
            <label for="">to</label>
            <input class="px2 py1 rounded focus:outline-none border border-line w-full" type="number" name="" id="" />
          </div>
        </div>
      </div>
      <button class="px2 py-6px rounded-2 bg-primary-90 text-white">Filter</button>
    </menu>
  </div>
</template>
