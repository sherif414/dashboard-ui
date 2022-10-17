<template>
  <Listbox :multiple="multiple" v-slot="{ open }" as="div" v-model="selectedOption">
    <div
      class="relative"
      :class="{
        'py-2': compact,
      }"
    >
      <ListboxButton
        :class="{
          'typo-clr-muted': !selectedOption,
          'outline-indigo-4 outline-2 dark:outline-violet-4': open,
          'outline-gray-3 outline-1 dark:outline-dark-3': !open,
        }"
        class="w-full flex items-center text-left truncate p3 outline rounded w-full surface-1 focus:(outline-indigo-4 outline-2 dark:outline-violet-4)"
      >
        <template v-if="selectedOption && selectedOption[0]">
          <template v-if="multiple">
            <template v-for="opt in selectedOption"> {{ opt }}, </template>
          </template>
          <template v-else>
            {{ selectedOption }}
          </template>
        </template>
        <template v-else>
          <span class="typo-clr-muted">{{ title }}</span>
        </template>
        <ICaretDown class="ml-auto" width="16" height="16" />
      </ListboxButton>
      <ListboxOptions
        :class="{ 'top-9': compact }"
        class="absolute top-12 left-0 shadow-md w-full z-99 rounded-md surface-3 py-1 text-left overflow-auto max-h-40"
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

defineProps<{ title: string; compact?: boolean; options: string[]; multiple?: boolean }>()

const selectedOption = $ref<string | string[]>()
</script>
