<template>
  <label class="flex flex-col gap-y-1 relative">
    <div>
      {{ label }}
    </div>
    <div
      class="px-3 py-1 rounded flex items-center gap-x-3 outline surface-1"
      :class="[
        {
          'outline-indigo-4 dark:outline-violet-4 outline-2': isFocused,
          'outline-gray-3 dark:outline-dark-3 outline-1': !isFocused && !isInvalid,
          'outline-error outline-1 text-error': isInvalid && !isFocused,
        },
        classes,
      ]"
    >
      <div class="w-4 h-4 flex justify-center items-center" v-if="$slots.prepend">
        <slot name="prepend" />
      </div>
      <input
        ref="el"
        class="h-2rem focus:outline-none active:outline-none grow bg-inherit w-full resize-none border-none"
        @focus="handleFocus"
        @blur="handleBlur"
        @[eventType]="handleEmit"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :type="type"
      />
      <div v-if="$slots.append">
        <slot name="append" />
      </div>
    </div>
    <span
      class="duration-300 transition-opacity text-error absolute bottom--5 left-0 text-10px"
      :class="[isInvalid && !isFocused ? 'opacity-100' : 'opacity-0 pointer-events-none']"
      >{{ errorMsg ?? 'this field is required' }}</span
    >
  </label>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel' | 'time' | 'url' | 'search'
  disabled?: boolean
  modelValue?: string | number | null
  modelModifiers?: { noTrim?: boolean; noLazy?: boolean; isNumber?: boolean }
  placeholder?: string
  required?: boolean
  classes?: string
  invalid?: boolean
  errorMsg?: string
}

const { type = 'text', modelValue, required, invalid, modelModifiers } = defineProps<Props>()

let eventType = $computed(() => {
  return modelModifiers?.noLazy ? 'input' : 'change'
})
const el = $ref<HTMLInputElement | null>(null)
const emits = defineEmits(['update:modelValue'])

function handleEmit(e: Event) {
  let value: string | number | undefined = (e.target as HTMLInputElement)?.value

  if (!modelModifiers?.noTrim) {
    value = value.trim()
  }

  if (type === 'number' || modelModifiers?.isNumber) {
    value = isNaN(parseFloat(value)) ? undefined : parseFloat(value)
  }

  emits('update:modelValue', value)
}

let isFocused = $ref(false)
let _invalid = $ref(false)
let isInvalid = $computed(() => invalid || _invalid)

function handleBlur() {
  isFocused = false
  if (required && !modelValue) {
    _invalid = true
  }
}

function handleFocus() {
  isFocused = true
  _invalid = false
}
</script>
