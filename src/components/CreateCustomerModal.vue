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
import { ref } from 'vue'
import TextField from '~/components/TextField.vue'
import Btn from '~/components/Btn.vue'
import { customerService } from '~/services/customerService'
import { useMessage } from '~/composables/message'

const self = ref<HTMLDialogElement | null>(null)
const emits = defineEmits(['success'])
const openModal = () => {
  self.value?.showModal()
}

const name = ref('')
const email = ref('')
const phone = ref('')

const errorMsg = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  errorMsg.value = ''
  const res = await customerService.createCustomer({ email: email.value, name: name.value, phone: phone.value })
  isSubmitting.value = false

  if (res.error) {
    useMessage('error', res.error.message ?? 'an error has occurred')
    errorMsg.value = res?.error?.message ?? 'unknown error'
    return
  } else {
    useMessage('success', 'customer "' + name.value + '" added')
    emits('success')
    self.value?.close()
    name.value = ''
    email.value = ''
    phone.value = ''
  }
}

defineExpose({
  openModal,
})
</script>
