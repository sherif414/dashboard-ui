<template>
  <box as="div" v-model="selectedOption" class="relative">
    <ComboboxInput
      placeholder="select a category"
      class="border surface-1 dark:border-dark-3 focus:outline-none p3 w-full rounded-md"
    />
    <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
      <IChevronUpDown width="20" height="20" />
    </ComboboxButton>
    <ComboboxOptions class="absolute z-99 surface-3 w-full top-12 py-2 shadow rounded-md">
      <ComboboxOption
        v-slot="{ selected }"
        class="p2 hover:fill-primary-2 hover:typo-clr-on-primary"
        v-for="option in options"
        :key="option"
        :value="option"
        ><span :class="{ 'font-bold': selected }">{{ option }}</span></ComboboxOption
      >
    </ComboboxOptions>
  </box>
</template>

<script setup lang="ts">
import {
  Combobox as box,
  ComboboxButton,
  ComboboxInput,
  // ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'

let selectedOption = $ref('selected')

defineProps<{
  options: string[]
}>()
</script>
