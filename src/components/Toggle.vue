<template>
  <div class="py-16">
    <Switch
      v-model="enabled"
      :class="enabled ? 'dark:bg-violet-600 bg-indigo-600' : 'dark:bg-gray-600 bg-gray-300'"
      class="relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      <span class="sr-only"></span>
      <span
        aria-hidden="true"
        :class="enabled ? 'translate-x-3' : 'translate-x-0'"
        class="pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
      />
    </Switch>
  </div>
</template>

<script setup>
import { Switch } from '@headlessui/vue'

const enabled = ref(false)
</script>
