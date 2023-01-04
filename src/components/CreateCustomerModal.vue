<template>
  <dialog class="open:backdrop:backdrop-blur-4 typo-sm rounded-3 p4 surface-1 typo-clr-base px-6" ref="self">
    <!-- modal header -->
    <h2 class="typo-head mb-4">Add New Customer</h2>

    <!-- modal body -->
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-x-2 gap-y-6">
      <div v-if="!!errorMsg" class="text-error text-center bg-error bg-opacity-10 p-1">{{ errorMsg }}</div>
      <TextField required v-model="name" placeholder="john doe" label="customer name" />
      <TextField required v-model="email" placeholder="example@email.com" label="email" type="email" />
      <TextField required v-model="phone" label="phone number" />

      <div class="grid grid-cols-2 gap-x-4 mt-4">
        <Btn type="button" variant="text" @click="self?.close()"> cancel </Btn>
        <Btn :loading="isSubmitting" type="submit">Create</Btn>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
const self = $ref<HTMLDialogElement | null>(null)
const emits = defineEmits(['success'])
const openModal = () => {
  self?.showModal()
}

let name = $ref('')
let email = $ref('')
let phone = $ref('')

let errorMsg = $ref('')
let isSubmitting = $ref(false)
async function handleSubmit() {
  isSubmitting = true
  errorMsg = ''
  const res = await supabase.from('customers').insert({ email, name, phone })
  isSubmitting = false

  if (res.error) {
    useMessage('error', res.error.message ?? 'an error has occurred')
    errorMsg = res?.error?.message ?? 'unknown error'
    return
  } else {
    useMessage('success', 'customer "' + name + '" added')
    emits('success')
    self?.close()
    name = ''
    email = ''
    phone = ''
  }
}

defineExpose({
  openModal,
})
</script>
