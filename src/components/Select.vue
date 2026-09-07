<template>
  <label ref="menuRef" class="relative flex flex-col gap-1 typo-sm">
    <span v-if="$slots.default">
      <slot />
    </span>
    <div class="relative">
      <button
        type="button"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :style="{ height: `${height}rem` }"
        :class="classes"
        @click="isOpen = !isOpen"
        @keydown.escape="isOpen = false"
      >
        <!-- placeholder -->
        <span v-if="!modelValue || !modelValue.length" class="typo-clr-muted"> {{ placeholder }} </span>
        <template v-else>
          <!-- multiple values -->
          <template v-if="typeof modelValue !== 'string'">
            <span class="px4 h-60% my-auto flex items-center rounded-md surface-1 mr-1">
              {{ modelValue[0] }}
            </span>
            <span class="px2 h-60% my-auto flex items-center rounded-md surface-1" v-if="modelValue.length > 1">
              {{ modelValue.length - 1 }} +
            </span>
          </template>
          <!-- single value -->
          <span v-else>{{ modelValue }}</span>
        </template>
        <ICaretDown :class="[isOpen ? 'rotate-180' : '']" width="12" height="12" class="ml-auto transition-transform" />
      </button>
      <!-- menu body -->
      <div
        v-show="isOpen"
        role="listbox"
        :style="{ top: `${height + 0.4}rem` }"
        class="absolute left-0 w-full max-h-56 overflow-y-auto! truncate rounded-md surface-2 border border-gray-2 dark:border-dark-3 shadow-md py-2 flex flex-col z-99"
      >
        <div
          v-for="option in options"
          :key="option"
          role="option"
          :aria-selected="(typeof modelValue === 'string' && modelValue === option) || (Array.isArray(modelValue) && modelValue.includes(option))"
          tabindex="0"
          @click="handleEmit(option)"
          @keydown.enter.prevent="handleEmit(option)"
          @keydown.space.prevent="handleEmit(option)"
          class="p2 flex items-center justify-start cursor-pointer hover:(fill-primary-2 typo-clr-on-primary!) focus:(fill-primary-2 typo-clr-on-primary! outline-none)"
          :class="{
            'typo-clr-primary [&_svg]:inline':
              (typeof modelValue === 'string' && modelValue === option) ||
              (Array.isArray(modelValue) && modelValue.includes(option)),
          }"
        >
          {{ option }}
          <ICheckCircle width="12" height="12" class="ml-auto hidden" />
        </div>
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ICaretDown, ICheckCircle } from '~/components/icons'

const { modelValue, size = 'md', options, placeholder = '' } = defineProps<{
  modelValue: string | string[]
  options: string[]
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | string[]): void
}>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement>()
onClickOutside(menuRef, () => (isOpen.value = false))

function handleEmit(newValue: string) {
  if (typeof modelValue === 'string') {
    isOpen.value = false
    emit('update:modelValue', modelValue === newValue ? '' : newValue)
    return
  }

  if (modelValue.includes(newValue)) {
    emit(
      'update:modelValue',
      modelValue.filter((_value) => _value !== newValue)
    )
  } else {
    emit('update:modelValue', [...modelValue, newValue])
  }
}

const height = computed(() => {
  if (size === 'md') return 3
  if (size === 'lg') return 3.5
  return 2
})

const classes = computed(() => [
  'rounded-md surface-2 focus:(outline-indigo-4 dark:outline-violet-4) flex items-center justify-start truncate px-4 outline-none outline-offset-0! min-w-10rem w-full cursor-pointer',
  {
    'outline-indigo-4 dark:outline-violet': isOpen.value,
  },
])
</script>
