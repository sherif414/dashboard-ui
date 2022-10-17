<template>
  <box as="div" v-slot="{ open }" class="relative">
    <ComboboxLabel class="" v-if="label">{{ label }}</ComboboxLabel>
    <ComboboxInput
      :placeholder="placeHolder"
      class="surface-1 outline p3 w-full rounded focus:(outline-indigo-4 outline-2 dark:outline-violet-4)"
      :class="{
        'outline-indigo-4 outline-2 dark:outline-violet-4': open,
        'outline-gray-3 outline-1 dark:outline-dark-3': !open,
      }"
    />
    <ComboboxButton class="absolute right-0 flex top-31px pr-2">
      <IChevronUpDown width="20" height="20" />
    </ComboboxButton>
    <ComboboxOptions
      class="absolute z-99 surface-3 w-full top-17 left-0 py-2 shadow rounded-md max-h-45 overflow-y-auto"
    >
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
