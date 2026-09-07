<template>
  <main class="min-h-screen py-8 px-4 grid place-items-center">
    <form class="flex flex-col gap-8 surface-1 p-6 sm:p-8 py-8 sm:py-11 rounded-md w-full max-w-27rem border border-gray-2 dark:border-dark-3" @submit.prevent="handleSignup">
      <ILogo width="80" height="80" class="mx-auto" />
      <div class="flex flex-col gap-2">
        <h1 class="text-center typo-lg">
          Get started with <span class="typo-clr-primary font-bold">Metrix</span>
        </h1>
        <h2 class="text-center typo-clr-muted typo-sm">create your account</h2>
      </div>
      <div class="flex flex-col">
        <TextField label="Full Name" wrapper-class="mb-4" required v-model="fullName" placeholder="Jane Doe" type="text">
          <template #prepend><ICustomers /></template>
        </TextField>
        <TextField label="Email Address" wrapper-class="mb-4" required v-model="email" placeholder="jane@example.com" type="email">
          <template #prepend><IEmail /></template>
        </TextField>
        <TextField label="Password" minlength="6" required v-model="password" placeholder="••••••••" type="password">
          <template #prepend><ILock /></template>
        </TextField>
      </div>
      <p class="self-center typo-sm text-center">
        already have an account?
        <router-link active-class="" class="typo-clr-primary hover:underline ml-1" to="/login">login</router-link>
      </p>
      <Btn :loading="isSubmitting" type="submit" class="mx-auto"> create account </Btn>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useMessage } from '~/composables/message'
import TextField from '~/components/TextField.vue'
import Btn from '~/components/Btn.vue'
import { ILogo, ICustomers, IEmail, ILock } from '~/components/icons'

const auth = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)
const fullName = ref('')
const email = ref('')
const password = ref('')

async function handleSignup() {
  if (email.value && password.value && fullName.value) {
    isSubmitting.value = true
    const error = await auth.signUp(email.value, password.value, fullName.value)
    isSubmitting.value = false
    if (error) {
      useMessage('error', error.message)
    } else {
      useMessage('success', 'Account created! Welcome.')
      router.push('/')
    }
  }
}
</script>
