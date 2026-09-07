<template>
  <main class="min-h-screen py-8 px-4 grid place-items-center">
    <form class="flex flex-col gap-8 surface-1 p-6 sm:p-8 py-8 sm:py-11 rounded-md w-full max-w-27rem border border-gray-2 dark:border-dark-3" @submit.prevent="handleLogin">
      <!-- header -->
      <ILogo class="self-center" />
      <div class="flex flex-col gap-2">
        <h1 class="text-center typo-lg">welcome back!</h1>
        <h2 class="text-center typo-clr-muted typo-sm">login to your account</h2>
      </div>

      <!-- form -->
      <div class="flex flex-col">
        <TextField label="Email Address" wrapper-class="mb-4" required v-model="email" placeholder="admin@admin.com" type="email">
          <template #prepend><IEmail /></template>
        </TextField>
        <TextField label="Password" required v-model="password" placeholder="••••••••" type="password">
          <template #prepend><ILock /></template>
        </TextField>
        <button
          type="button"
          @click="fillDemoCredentials"
          class="self-end text-12px typo-clr-muted hover:typo-clr-primary flex items-center gap-1.5 mt-2 cursor-pointer transition focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-indigo-5 dark:ring-violet-5 rounded)"
          title="Click to auto-fill demo credentials"
        >
          <span>Demo: <strong class="font-medium typo-clr-primary">admin@admin.com / password</strong></span>
          <span class="text-10px px-1.5 py-0.5 rounded surface-2 font-mono ml-0.5 border border-gray-2 dark:border-dark-3">Auto-fill</span>
        </button>
      </div>

      <!-- footer -->
      <p class="self-center typo-sm text-center">
        don't have an account?
        <router-link active-class="" class="typo-clr-primary hover:underline ml-1" to="/signup">signup</router-link>
      </p>
      <Btn type="submit" class="mx-auto" :loading="isSubmitting">login</Btn>
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
import { ILogo, IEmail, ILock } from '~/components/icons'

const auth = useAuthStore()
const router = useRouter()

const email = ref('admin@admin.com')
const password = ref('password')
const isSubmitting = ref(false)

function fillDemoCredentials() {
  email.value = 'admin@admin.com'
  password.value = 'password'
  useMessage('info', 'Demo credentials filled!')
}

async function handleLogin() {
  if (email.value && password.value) {
    isSubmitting.value = true
    const error = await auth.login(email.value, password.value)
    isSubmitting.value = false

    if (!error) {
      email.value = ''
      password.value = ''
      useMessage('success', 'You are logged in!')
      router.push(auth.redirectPath ? auth.redirectPath : '/')
    } else {
      useMessage('error', error.message || 'Login failed')
    }
  }
}
</script>
