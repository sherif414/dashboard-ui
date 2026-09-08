<template>
  <dialog
    ref="self"
    role="dialog"
    aria-modal="true"
    aria-labelledby="create-customer-title"
    class="open:backdrop:backdrop-blur-4 typo-sm rounded-lg p5 sm:p6 surface-1 typo-clr-base shadow-2xl border border-gray-2 dark:border-dark-3 w-full max-w-md mx-auto"
  >
    <!-- modal header -->
    <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-2 dark:border-dark-3">
      <h2 id="create-customer-title" class="typo-head font-bold">Add New Customer</h2>
      <button
        type="button"
        aria-label="Close dialog"
        class="typo-clr-muted hover:typo-clr-base text-lg font-bold p-1 leading-none cursor-pointer transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-5"
        @click="self?.close()"
      >
        ✕
      </button>
    </div>

    <!-- modal body -->
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div v-if="!!errorMsg" role="alert" class="text-rose-600 dark:text-rose-400 text-center bg-rose-500/10 p-2.5 rounded border border-rose-500/20 typo-sm">
        {{ errorMsg }}
      </div>
      <TextField required v-model="name" placeholder="John Doe" label="Customer Name" />
      <TextField required v-model="email" placeholder="john@example.com" label="Email Address" type="email" />
      <TextField required v-model="phone" placeholder="+1 (555) 000-0000" label="Phone Number" type="tel" />
      <TextField v-model="address" placeholder="123 Market Street, Apt 4B" label="Address (Optional)" />

      <div class="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-2 dark:border-dark-3">
        <Btn type="button" variant="text" @click="self?.close()">Cancel</Btn>
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
  errorMsg.value = ''
  self.value?.showModal()
}

const name = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')

const errorMsg = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  errorMsg.value = ''
  const res = await customerService.createCustomer({
    email: email.value,
    name: name.value,
    phone: phone.value,
    address: address.value || undefined,
  })
  isSubmitting.value = false

  if (res.error) {
    useMessage('error', res.error.message ?? 'An error has occurred')
    errorMsg.value = res?.error?.message ?? 'Unknown error'
    return
  } else {
    useMessage('success', `Customer "${name.value}" created successfully`)
    emits('success')
    self.value?.close()
    name.value = ''
    email.value = ''
    phone.value = ''
    address.value = ''
  }
}

defineExpose({
  openModal,
})
</script>
