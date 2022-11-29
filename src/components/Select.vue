<template>
  <label ref="menuRef" class="relative flex flex-col gap-2">
    <span v-if="$slots.default" class="typo-sm">
      <slot />
    </span>
    <div class="relative">
      <div tabindex="0" :style="{ height: `${sizes}rem` }" :class="classes" @click="isOpen = !isOpen">
        <!-- placeholder -->
        <span v-if="!modelValue.length" class="typo-clr-muted"> {{ placeholder }} </span>
        <template v-else>
          <template v-if="typeof modelValue !== 'string' && true">
            <span class="p4 py-1 rounded-full surface-2" v-for="value in modelValue" :key="value">
              {{ value }}
            </span>
          </template>
          <span v-else>{{ modelValue }}</span>
        </template>
        <ICaretDown :class="[isOpen ? 'rotate-x-180' : '']" width="12" height="12" class="ml-auto" />
      </div>
      <!-- menu body -->
      <Transition name="select">
        <div
          v-if="isOpen"
          :style="{ top: `${sizes + 0.3}rem` }"
          class="absolute left-0 w-full max-h-56 overflow-y-auto! truncate rounded surface-2 py-2 flex flex-col shadow z-99"
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
      </Transition>
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
onMounted(() => {
  onClickOutside(menuRef, () => {
    isOpen = false
  })
})

const sizes = $computed(() => {
  if (size === 'lg') return 3.5
  if (size === 'md') return 2.6
  return 2
})

let classes = $computed(() => [
  'rounded-md surface-1 focus:(outline-indigo-4 dark:outline-violet-4 outline-2) flex items-center justify-start truncate px-4 outline min-w-10rem w-full cursor-pointer',
  {
    'outline-indigo-4 dark:outline-violet-4 outline-2': isOpen,
    'outline-gray-3 dark:outline-dark-3 outline-1': !isOpen,
  },
])
</script>

<style>
.select-enter-active,
.select-leave-active {
  transition: transform 100ms linear;
  pointer-events: none;
}

.select-leave-to,
.select-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
