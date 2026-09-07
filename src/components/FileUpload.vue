<template>
  <div class="flex flex-col gap-4 typo-sm text-center">
    <label
      ref="dropzoneEl"
      v-if="!imgSrc && !modelValue"
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
      <input class="hidden w-1px h-1px" @change="handleChange" type="file" :value="modelValue" :accept="accept" />
    </label>
    <div v-else class="relative">
      <div @click="removePreviewImg" class="p2 bg-accent-6 rounded-md absolute top-3 right-3 shadow-md text-dark cursor-pointer">
        <ITrash width="14" height="14" />
      </div>
      <img class="overflow-hidden rounded-md max-h-48 mx-auto" :src="imgSrc || ''" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDropZone } from '@vueuse/core'
import { IImg, ITrash } from '~/components/icons'

const { accept = 'image/*', modelValue } = defineProps<{
  accept?: string
  modelValue?: File
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value?: File): void
}>()

const imgSrc = ref<string | null>(null)

function removePreviewImg(): void {
  if (imgSrc.value) {
    emit('update:modelValue', undefined)
    URL.revokeObjectURL(imgSrc.value)
    imgSrc.value = null
  }
}

function handleChange(e: Event): void {
  if (e.target instanceof HTMLInputElement && e.target.files) {
    const file = e.target.files.item(0)
    if (file) {
      emit('update:modelValue', file)
      imgSrc.value = URL.createObjectURL(file)
    }
  }
}

// dropzone
function handleDrop(files: File[] | null): void {
  if (files && files[0].type.startsWith('image')) {
    emit('update:modelValue', files[0])
    imgSrc.value = URL.createObjectURL(files[0])
  }
}

const dropzoneEl = ref<HTMLDivElement | null>(null)
const { isOverDropZone } = useDropZone(dropzoneEl, handleDrop)
</script>
