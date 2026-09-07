<template>
  <cb v-model="value" as="div" class="relative flex flex-col gap-1">
    <ComboboxLabel>{{ label }}</ComboboxLabel>
    <div class="relative">
      <!-- input -->
      <ComboboxInput
        autocomplete="none"
        class="surface-2 h-10 p2 rounded-md outline-none outline-offset-0! focus:(dark:outline-violet outline-indigo-4) w-full resize-none"
        :placeholder="placeholder"
        :display-value="(option: any) => option?.name || ''"
        @input="searchValue = ($event.target as HTMLInputElement).value"
      ></ComboboxInput>
      <ComboboxButton class="absolute right-2 inset-y-0% z-1">
        <IChevronUpDown width="20" height="20" />
      </ComboboxButton>

      <!-- dropdown -->
      <ComboboxOptions
        class="surface-2 rounded-md flex flex-col absolute w-full overflow-y-auto top-110% left-0 shadow-md z-1"
      >
        <ComboboxOption
          v-for="option in options"
          :key="option.id"
          :value="option"
          as="template"
          v-slot="{ active, selected }"
        >
          <li
            class="py-2 px-4 hover:(fill-primary-2 typo-clr-on-primary) grow truncate cursor-pointer flex justify-between items-center gap-2"
            :class="{ 'fill-primary-2 typo-clr-on-primary': active, 'typo-clr-primary': selected && !active }"
          >
            {{ option.name }}
            <ICheckCircle v-if="selected" class="w-12px h-12px" />
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </cb>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import {
  Combobox as cb,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/vue'
import { supabase } from '../api'
import { useMessage } from '~/composables/message'
import { IChevronUpDown, ICheckCircle } from '~/components/icons'

interface Props {
  label?: string
  placeholder?: string
  tableName?: string
  modelValue?: any
}
const { tableName, modelValue } = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const value = ref(modelValue || null)
const searchValue = ref('')
const options = ref<{ id: string | number; name: string }[] | null>([])

watchDebounced(
  value,
  (newVal) => {
    emit('update:modelValue', newVal)
  }
)

async function getOptions(table: string, searchTerm: string) {
  const res = await supabase
    .from(table)
    .select('id, name')
    .textSearch('name', searchTerm.split(' ').join(':*&') + ':*')
    .limit(5)
  if (res.error) useMessage('error', res.error.message ?? 'an error has occurred')
  return res.data
}

watchDebounced(
  searchValue,
  async () => {
    if (tableName) options.value = await getOptions(tableName, searchValue.value)
  },
  { debounce: 500 }
)
</script>
