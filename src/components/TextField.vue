<template>
  <label :class="wrapperClass" class="flex flex-col gap-1 relative">
    <div class="capitalize typo-sm">
      {{ label }}
    </div>
    <div :class="{ 'text-error': isInvalid }" class="relative w-full">
      <input
        ref="inputEl"
        :class="[
          $slots.prepend ? 'pl-11' : 'pl-4',
          $slots.append ? 'pr-11' : 'pr-4',
          isInvalid ? 'bg-opacity-10! bg-error!' : 'surface-2',
        ]"
        class="rounded-md outline-none outline-offset-0! focus:(dark:outline-violet outline-indigo-4) w-full resize-none"
        :style="{ height: `${height}rem` }"
        @[eventType]="handleEmit"
        @invalid="isInvalid = true"
        @focus="isInvalid = false"
        @blur="validate"
        :type="type"
        :value="modelValue"
        v-bind="$attrs"
      />
      <div
        class="absolute h-full w-12 grid place-items-center left-0 top-0 pointer-events-none [&_svg]:(w-5 h-5)"
        v-if="$slots.prepend"
      >
        <slot name="prepend" />
      </div>
      <div
        class="absolute h-full w-12 grid place-items-center right-0 top-0 pointer-events-none [&_svg]:(w-5 h-5)"
        v-if="$slots.append"
      >
        <slot name="append" />
      </div>
      <div v-show="isInvalid" class="text-error absolute top-110% left-0 text-10px">
        {{ _errorMsg ?? 'invalid input' }}
      </div>
      <slot name="dropdown"></slot>
    </div>
  </label>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel' | 'time' | 'url' | 'search'
  modelValue?: string | number | null
  modelModifiers?: { noTrim?: boolean; noLazy?: boolean; isNumber?: boolean }
  wrapperClass?: string
  size?: 'sm' | 'md' | 'lg'
}

const { type = 'text', modelValue, modelModifiers = {}, size = 'md' } = defineProps<Props>()
const emits = defineEmits(['update:modelValue'])
const inputEl = $ref<HTMLInputElement | null>(null)

let height = $computed(() => {
  if (size === 'md') return 3
  if (size === 'lg') return 3.5
  return 2
})
let eventType = $computed(() => (modelModifiers?.noLazy ? 'input' : 'change'))
let isInvalid = $ref(false)

function handleEmit(e: Event) {
  let value: string | number | undefined = (e.target as HTMLInputElement)?.value

  if (!modelModifiers?.noTrim) {
    value = value.trim()
  }

  if (type === 'number' || modelModifiers?.isNumber) {
    value = parseFloat(value) || undefined
  }

  emits('update:modelValue', value)
}

let _errorMsg = $ref<string>()
function validate() {
  _errorMsg = inputEl?.validationMessage
  inputEl?.checkValidity()
}
</script>
