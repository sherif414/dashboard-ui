<template>
  <label ref="menuRef" class="relative">
    <div
      :style="{ height: `${sizes}rem` }"
      :class="{
        'outline-indigo-4 dark:outline-violet-4 outline-2': isOpen,
        'outline-gray-3 dark:outline-dark-3 outline-1': !isOpen,
      }"
      class="rounded-md surface-1 flex items-center justify-start truncate px-4 outline w-full cursor-pointer"
      @click="handleOpen"
    >
      <span v-if="modelValue.length === 0" class="typo-clr-muted"> <slot></slot> </span>
      <template v-else>
        <template v-if="multiple">
          <span v-for="(v, idx) in modelValue" key="idx"> {{ v }} {{ idx === modelValue.length - 1 ? '' : ',' }} </span>
        </template>
        <span v-else>{{ modelValue }}</span>
      </template>
      <ICaretDown :class="[isOpen ? 'rotate-x-180' : '']" width="12" height="12" class="ml-auto" />
    </div>
    <Transition name="select">
      <div
        v-if="isOpen"
        :style="{ top: `${sizes + 0.3}rem` }"
        class="absolute left-0 w-full max-h-56 overflow-y-auto! truncate rounded surface-2 py-2 flex flex-col shadow z-99"
      >
        <div
          @click="handleClick(option)"
          class="p2 flex items-center justify-start cursor-pointer hover:(fill-primary-2 typo-clr-on-primary!)"
          :class="{
            'typo-clr-primary':
              (typeof modelValue === 'string' && modelValue === option) ||
              (Array.isArray(modelValue) && modelValue.includes(option)),
          }"
          v-for="(option, idx) in options"
          :key="idx"
        >
          {{ option }}
          <svg
            v-if="
              (typeof modelValue === 'string' && modelValue === option) ||
              (Array.isArray(modelValue) && modelValue.includes(option))
            "
            class="ml-auto"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm4.78 7.7-5.67 5.67a.75.75 0 0 1-1.06 0l-2.83-2.83a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
    </Transition>
  </label>
</template>

<script setup lang="ts">
const {
  multiple = false,
  modelValue,
  size = 'md',
} = defineProps<{
  modelValue: string | string[]
  options: string[]
  multiple?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const sizes = $computed(() => {
  if (size === 'lg') return 3.5
  if (size === 'md') return 2.6
  return 2
})

const emit = defineEmits(['update:modelValue'])
function handleClick(newValue: string) {
  if (!multiple) {
    if (modelValue === newValue) {
      emit('update:modelValue', '')
      return
    }
    emit('update:modelValue', newValue)
    isOpen = false
  }

  //
  else if (typeof modelValue === 'string') {
    emit('update:modelValue', [modelValue, newValue])
  }

  //
  else {
    if (modelValue.includes(newValue)) {
      emit(
        'update:modelValue',
        modelValue.filter((_value) => _value !== newValue)
      )
      return
    }
    emit('update:modelValue', [...modelValue, newValue])
  }
}

let isOpen = $ref(false)
function handleOpen() {
  isOpen = !isOpen
}

let menuRef = ref<HTMLElement>()
onMounted(() => {
  onClickOutside(menuRef, () => {
    isOpen = false
  })
})
</script>

<style>
.select-enter-active,
.select-leave-active {
  transition: all 100ms linear;
  pointer-events: none;
}

.select-leave-to,
.select-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
