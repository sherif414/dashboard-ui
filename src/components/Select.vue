<template>
  <label ref="menuRef" class="relative flex flex-col gap-1 typo-sm">
    <span v-if="$slots.default">
      <slot />
    </span>
    <div class="relative">
      <div tabindex="0" :style="{ height: `${height}rem` }" :class="classes" @click="isOpen = !isOpen">
        <!-- placeholder -->
        <span v-if="!modelValue.length" class="typo-clr-muted"> {{ placeholder }} </span>
        <template v-else>
          <!-- multiple values -->
          <template v-if="typeof modelValue !== 'string' && true">
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
      </div>
      <!-- menu body -->
      <div
        v-show="isOpen"
        :style="{ top: `${height + 0.4}rem` }"
        class="absolute left-0 w-full max-h-56 overflow-y-auto! truncate rounded-md surface-2 shadow-md py-2 flex flex-col z-99"
      >
        <div
          v-for="option in options"
          :key="option"
          @click="handleEmit(option)"
          class="p2 flex items-center justify-start cursor-pointer hover:(fill-primary-2 typo-clr-on-primary!)"
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
const { modelValue, size = 'md' } = defineProps<{
  modelValue: string | string[]
  options: string[]
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | string[]): void
}>()

function handleEmit(newValue: string) {
  if (typeof modelValue === 'string') {
    isOpen = modelValue === newValue
    emit('update:modelValue', modelValue === newValue ? '' : newValue)
    return
  }

  if (modelValue.includes(newValue))
    emit(
      'update:modelValue',
      modelValue.filter((_value) => _value !== newValue)
    )
  else emit('update:modelValue', [...modelValue, newValue])
}

let isOpen = $ref(false)
let menuRef = ref<HTMLElement>()
onClickOutside(menuRef, () => (isOpen = false))

const height = $computed(() => {
  if (size === 'md') return 3
  if (size === 'lg') return 3.5
  return 2
})

let classes = [
  'rounded-md surface-2 focus:(outline-indigo-4 dark:outline-violet-4) flex items-center justify-start truncate px-4 outline-none outline-offset-0! min-w-10rem w-full cursor-pointer',
  {
    'outline-indigo-4 dark:outline-violet': isOpen,
  },
]
</script>
