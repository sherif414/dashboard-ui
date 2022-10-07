<template>
  <dialog class="open:backdrop:backdrop-blur-4 typo-sm rounded-3 p4 surface-2 typo-clr-base" ref="target">
    <!-- modal header -->
    <h2 class="typo-head mb-4">Add New Customer</h2>

    <!-- modal body -->
    <form class="flex flex-col gap-x-2 gap-y-4">
      <span class="typo-clr-muted">customer information</span>
      <input
        class="p3 dark:(bg-dark-1 text-gray-2) bg-background-light rounded-md"
        type="text"
        placeholder="customer's name"
      />
      <input
        class="p3 dark:(bg-dark-1 text-gray-2) bg-background-light rounded-md"
        type="email"
        placeholder="customer's email"
      />
      <!-- modal submission -->
      <div class="grid grid-cols-2 gap-x-4 mt-4">
        <button
          type="button"
          class="p2-y px-8 rounded-md border border-gray-3 dark:border-dark-2"
          @click="target?.close()"
        >
          cancel
        </button>
        <button type="submit" class="py-2 px-8 rounded-md fill-primary-2 typo-clr-on-primary">Create</button>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
const target = $ref<HTMLDialogElement | null>(null)
const openModal = () => {
  target?.showModal()
}

defineExpose({
  openModal,
})
</script>
