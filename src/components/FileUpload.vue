<template>
  <div class="flex flex-col gap-4 typo-sm text-center">
    <label
      ref="dropzoneEl"
      v-if="!displayUrl && !modelValue"
      :class="{ 'border-accent-9!': isOverDropZone }"
      class="border-dashed border grow border-gray-3 cursor-pointer surface-2 hover:dark:border-gray-3 hover:border-gray-9 dark:border-gray-6 p8 rounded-md grid gap-2 place-items-center"
    >
      <div v-if="isOverDropZone" class="m-auto typo-head">drop image here</div>
      <slot v-else>
        <div class="bg-indigo-1 dark:bg-inherit rounded-md w-max p-4px">
          <IImg height="48" width="48" class="typo-clr-primary" />
        </div>
        <div>
          <p class="typo-base typo-clr-primary">Upload Image</p>
          <p class="typo-clr-muted">Upload a cover image for your product.</p>
          <p class="typo-clr-muted">
            File Format <i class="typo-clr-base">jpeg, png, jpg</i> Recommended Size
            <i class="typo-clr-base">600x600 (1:1)</i>
          </p>
        </div>
      </slot>
      <input class="sr-only" @change="handleChange" type="file" :accept="accept" />
    </label>
    <div v-else class="relative group flex flex-col items-center justify-center">
      <img
        class="overflow-hidden rounded-md max-h-48 mx-auto object-cover border border-gray-2 dark:border-dark-3"
        :src="displayUrl || ''"
        :alt="alt || 'Image preview'"
      />
      <div class="absolute top-2 right-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm p-1 rounded-md">
        <label
          class="p-1.5 bg-indigo-6 hover:bg-indigo-7 text-white rounded cursor-pointer transition focus-within:(ring-2 ring-indigo-4)"
          title="Change image"
          aria-label="Change image"
        >
          <IUpload width="14" height="14" />
          <input class="sr-only" @change="handleChange" type="file" :accept="accept" />
        </label>
        <button
          type="button"
          aria-label="Remove image"
          title="Remove image"
          @click="removePreviewImg"
          class="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer transition focus:outline-none focus-visible:(ring-2 ring-rose-4)"
        >
          <ITrash width="14" height="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDropZone } from '@vueuse/core'
import { IImg, ITrash, IUpload } from '~/components/icons'

const props = withDefaults(
  defineProps<{
    accept?: string
    modelValue?: File
    initialUrl?: string | null
    alt?: string
  }>(),
  {
    accept: 'image/*',
    alt: 'Image preview',
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value?: File): void
  (event: 'remove'): void
}>()

const imgSrc = ref<string | null>(null)
const isRemoved = ref(false)

watch(
  () => props.initialUrl,
  () => {
    isRemoved.value = false
  }
)

const displayUrl = computed(() => {
  if (imgSrc.value) return imgSrc.value
  if (!isRemoved.value && props.initialUrl) return props.initialUrl
  return null
})

function removePreviewImg(): void {
  if (imgSrc.value) {
    URL.revokeObjectURL(imgSrc.value)
    imgSrc.value = null
  }
  isRemoved.value = true
  emit('update:modelValue', undefined)
  emit('remove')
}

function handleChange(e: Event): void {
  if (e.target instanceof HTMLInputElement && e.target.files) {
    const file = e.target.files.item(0)
    if (file) {
      isRemoved.value = false
      emit('update:modelValue', file)
      imgSrc.value = URL.createObjectURL(file)
    }
  }
}

// dropzone
function handleDrop(files: File[] | null): void {
  if (files && files[0].type.startsWith('image')) {
    isRemoved.value = false
    emit('update:modelValue', files[0])
    imgSrc.value = URL.createObjectURL(files[0])
  }
}

const dropzoneEl = ref<HTMLDivElement | null>(null)
const { isOverDropZone } = useDropZone(dropzoneEl, handleDrop)
</script>
