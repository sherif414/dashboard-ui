<template>
  <label class="flex flex-col gap-y-1 relative">
    <div>
      {{ label }}
    </div>
    <div
      class="px-3 py-1 rounded flex items-center gap-x-3 outline surface-1 transition duration-300"
      :class="{
        'outline-indigo-4 dark:outline-violet-4 outline-2': isFocused,
        'outline-gray-3 dark:outline-dark-3 outline-1': !isFocused && !isInvalid,
        'outline-error outline-1 text-red': isInvalid && !isFocused,
      }"
    >
      <div class="[&>svg]:(w-18px h-18px)" v-if="$slots.prepend">
        <slot name="prepend" />
      </div>
      <input
        class="h-2rem focus-outline-none grow bg-inherit w-full resize-none"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="handleFocus"
        @blur="handleBlur"
        :value="modelValue"
        :required="false"
        :disabled="disabled"
        :type="type"
      />
    </div>
    <span
      class="duration-300 transition-all opacity-0 text-error absolute bottom--5 left-0 text-10px"
      :class="{ 'opacity-100': isInvalid && !isFocused }"
      >{{ errorMessage }}</span
    >
  </label>
</template>

<script setup lang="ts">
const {
  type = 'text',
  modelValue,
  required,
} = defineProps<{
  label?: string
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel' | 'time' | 'url'
  disabled?: boolean
  modelValue?: string | number | Date
  placeholder?: string
  required?: boolean
}>()

let isFocused = $ref(false)
let isInvalid = $ref(false)
let errorMessage = $ref('invalid input')

function handleBlur(e: Event) {
  isFocused = false
  if (!required) return
  if (!modelValue) {
    isInvalid = true
    errorMessage = 'this Field is required'
  }
}

function handleFocus() {
  isFocused = true
  isInvalid = false
}
</script>
