<template>
  <dialog class="open:backdrop:backdrop-blur-4 typo-sm rounded-md p4 sm:p-6 surface-1 typo-clr-base shadow-xl border border-gray-2 dark:border-dark-3 w-full max-w-md" ref="self">
    <!-- modal header -->
    <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-2 dark:border-dark-3">
      <h2 class="typo-head">Add New Customer</h2>
      <button
        type="button"
        aria-label="Close dialog"
        class="typo-clr-muted hover:typo-clr-base text-lg font-bold p-1 leading-none cursor-pointer transition"
        @click="self?.close()"
      >
        ✕
      </button>
    </div>

    <!-- modal body -->
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div v-if="!!errorMsg" class="text-error text-center bg-error bg-opacity-10 p-2 rounded typo-sm">{{ errorMsg }}</div>
      <TextField required v-model="name" placeholder="John Doe" label="Customer Name" />
      <TextField required v-model="email" placeholder="john@example.com" label="Email Address" type="email" />
      <TextField required v-model="phone" placeholder="+1 (555) 000-0000" label="Phone Number" />

      <div class="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-2 dark:border-dark-3">
        <Btn type="button" variant="text" @click="self?.close()">cancel</Btn>
        <Btn :loading="isSubmitting" type="submit">Create Customer</Btn>
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
