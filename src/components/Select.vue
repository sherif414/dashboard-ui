<template>
  <Listbox as="div" v-model="selectedOption">
    <div class="relative">
      <ListboxButton
        :class="{ 'py-2': compact, 'typo-clr-muted': !selectedOption }"
        class="rounded-md w-full border surface-1 dark:border-dark-3 flex items-center p3 text-left truncate"
        >{{ selectedOption ? selectedOption : title }}
        <ICaretDown class="ml-auto" width="16" height="16" />
      </ListboxButton>
      <ListboxOptions
        :class="{ 'top-9': compact }"
        class="absolute top-12 shadow-md w-full z-99 rounded-md surface-3 py-1 text-left overflow-auto max-h-40"
      >
        <ListboxOption
          class="px-3 py1 dark:hover:(bg-dark-6) hover:(bg-indigo-6 text-gray-1) truncate cursor-pointer"
          v-for="option in options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

defineProps<{ title: string; compact?: boolean; options: string[] }>()

const selectedOption = $ref()
</script>
