<template>
  <box as="div" class="relative">
    <ComboboxLabel class="pb-1" v-if="label">{{ label }}</ComboboxLabel>
    <ComboboxInput
      :placeholder="placeHolder"
      class="border surface-1 dark:border-dark-3 focus:outline-none p3 w-full rounded-md"
    />
    <ComboboxButton class="absolute right-0 flex top-31px pr-2">
      <IChevronUpDown width="20" height="20" />
    </ComboboxButton>
    <ComboboxOptions class="absolute z-99 surface-3 w-full top-17 py-2 shadow rounded-md max-h-45 overflow-y-auto">
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
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'

defineProps<{
  options: string[]
  label?: string
  placeHolder?: string
}>()
</script>
