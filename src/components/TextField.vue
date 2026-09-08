<template>
  <label :class="wrapperClass" class="flex flex-col gap-1 relative">
    <div v-if="label" class="capitalize typo-sm font-medium typo-clr-base">
      {{ label }}
    </div>
    <div :class="{ 'text-error': isInvalid }" class="relative w-full">
      <input
        ref="inputEl"
        :aria-label="!label ? ($attrs['aria-label'] as string || $attrs['placeholder'] as string) : undefined"
        :class="[
          $slots.prepend ? 'pl-11' : 'pl-4',
          $slots.append ? 'pr-11' : 'pr-4',
          isInvalid ? 'bg-opacity-10! bg-error!' : 'surface-2',
        ]"
        class="rounded-md outline-none outline-offset-0! focus:(dark:outline-violet outline-indigo-4) w-full resize-none typo-clr-base placeholder:text-gray-4 dark:placeholder:text-gray-5 transition-colors"
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
        class="absolute h-full w-12 grid place-items-center right-0 top-0 pointer-events-none [&_svg]:(w-5 h-5) [&_button]:pointer-events-auto"
        v-if="$slots.append"
      >
        <slot name="append" />
      </div>
      <slot name="dropdown"></slot>
    </div>
    <div v-show="isInvalid" class="text-error text-11px mt-0.5 leading-tight">
      {{ _errorMsg ?? 'invalid input' }}
    </div>
  </label>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
const inputEl = ref<HTMLInputElement | null>(null)

const height = computed(() => {
  if (size === 'md') return 3
  if (size === 'lg') return 3.5
  return 2
})
const eventType = computed(() => (modelModifiers?.noLazy ? 'input' : 'change'))
const isInvalid = ref(false)

function handleEmit(e: Event) {
  let value: string | number | undefined = (e.target as HTMLInputElement)?.value

  if (!modelModifiers?.noTrim) {
    value = value?.trim()
  }

  if (type === 'number' || modelModifiers?.isNumber) {
    value = parseFloat(value as string) || undefined
  }

  emits('update:modelValue', value)
}

const _errorMsg = ref<string>()
function validate() {
  _errorMsg.value = inputEl.value?.validationMessage
  inputEl.value?.checkValidity()
}
</script>
