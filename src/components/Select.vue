<template>
  <Listbox as="div" v-model="selectedPerson">
    <div class="relative">
      <ListboxButton
        :class="{ 'py-2': compact }"
        class="rounded-md w-full bg-background-light flex items-center dark:(bg-dark-1 text-gray-2) p3 text-gray-5 text-left text-3 truncate"
        >{{ selectedPerson ? selectedPerson.name : title }}
        <IChevronUpDown class="ml-auto" width="16" />
      </ListboxButton>
      <ListboxOptions
        :class="{ 'top-9': compact }"
        class="absolute top-12 shadow-md w-full z-99 rounded-md bg-background-light dark:(bg-dark-1 text-gray-2) py-1 text-gray-5 text-3 text-left overflow-auto max-h-40"
      >
        <ListboxOption
          class="px-3 py1 dark:hover:(bg-dark-3) hover:(bg-indigo-6 text-gray-1) truncate cursor-pointer"
          v-for="person in people"
          :key="person.id"
          :value="person"
          :disabled="person.unavailable"
        >
          {{ person.name }}
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

defineProps<{ title: string; compact?: boolean }>()

interface Person {
  id: number
  name: string
  unavailable: boolean
}
const people: Person[] = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: false },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
]
const selectedPerson = $ref<Person>()
</script>
