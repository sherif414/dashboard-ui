<template>
  <div class="flex flex-col gap-4 typo-sm text-center">
    <label
      ref="dropzoneEl"
      v-if="!imgSrc && !modelValue"
      :class="{ 'border-accent-9!': isOverDropZone }"
      class="border-dashed border border-gray-3 cursor-pointer surface-2 h-250px hover:dark:border-gray-3 hover:border-gray-9 dark:border-gray-6 p8 rounded-md grid gap-2 place-items-center"
    >
      <slot>
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
    <div v-if="imgSrc && modelValue" class="relative border">
      <div @click="removePreviewImg" class="p2 bg-accent-6 rounded-md absolute top-3 right-3 shadow-md text-dark">
        <ITrash width="14" height="14" />
      </div>
      <img class="w-full h-250px overflow-hidden mx-auto rounded-md object-cover" :src="imgSrc" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { accept = 'image/*', modelValue } = defineProps<{
  accept?: string
  modelValue: File | undefined
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: File | undefined): void
}>()

let imgSrc = $ref<string | null>(null)

function removePreviewImg(): void {
  if (imgSrc) {
    emit('update:modelValue', undefined)
    URL.revokeObjectURL(imgSrc)
    imgSrc = null
  }
}

function handleChange(e: Event): void {
  if (e.target instanceof HTMLInputElement && e.target.files) {
    emit('update:modelValue', e.target.files.item(0)!)
    imgSrc = URL.createObjectURL(e.target.files.item(0)!)
  }
}

// dropzone
function handleDrop(files: File[] | null): void {
  if (files && files[0].type.startsWith('image')) {
    emit('update:modelValue', files[0])
    imgSrc = URL.createObjectURL(files[0])
  }
}

const dropzoneEl = $ref<HTMLDivElement | null>(null)
let { isOverDropZone } = useDropZone($$(dropzoneEl), handleDrop)
</script>
