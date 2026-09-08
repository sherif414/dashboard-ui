<template>
  <div class="w-full max-w-27rem my-auto flex flex-col items-center relative typo-clr-base">
    <!-- Theme Toggle (top right) -->
    <button
      type="button"
      @click="toggleDark()"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      aria-label="Toggle color theme"
      class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-md surface-1 border border-gray-2 dark:border-dark-3 typo-clr-muted hover:typo-clr-base transition cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5) z-20"
    >
      <ISun width="18" height="18" v-if="!isDark" />
      <IDark width="18" height="18" v-else />
    </button>

    <!-- Auth Card -->
    <form
      class="flex flex-col gap-6 surface-1 p-6 sm:p-8 py-8 sm:py-10 rounded-md w-full border border-gray-2 dark:border-dark-3 shadow-sm animate-card-bloom"
      @submit.prevent="handleLogin"
    >
      <!-- Logo & Heading -->
      <div class="flex flex-col items-center gap-3">
        <ILogo width="56" height="56" class="mx-auto" />
        <div class="flex flex-col gap-1 text-center">
          <h1 class="typo-lg capitalize font-bold typo-clr-base">Welcome Back</h1>
          <h2 class="typo-clr-muted typo-sm">Login to your demo account</h2>
        </div>
      </div>

      <!-- Demo Credentials Helper -->
      <div class="flex items-center justify-between text-xs px-3 py-2 rounded surface-2 border border-gray-2 dark:border-dark-3">
        <span class="typo-clr-muted text-xs">
          Demo: <strong class="font-medium typo-clr-base font-mono text-11px">admin@admin.com / password</strong>
        </span>
        <button
          type="button"
          @click="fillDemoCredentials"
          class="text-11px font-medium px-2 py-0.5 rounded surface-1 border border-gray-2 dark:border-dark-3 typo-clr-primary hover:underline cursor-pointer transition focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
        >
          Auto-fill
        </button>
      </div>

      <!-- Form Inputs -->
      <div class="flex flex-col gap-4">
        <TextField
          label="Email Address"
          required
          v-model="email"
          placeholder="admin@admin.com"
          type="email"
          autocomplete="email"
        >
          <template #prepend>
            <IEmail class="typo-clr-muted" width="18" height="18" />
          </template>
        </TextField>

        <TextField
          label="Password"
          required
          v-model="password"
          placeholder="••••••••"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
        >
          <template #prepend>
            <ILock class="typo-clr-muted" width="18" height="18" />
          </template>
          <template #append>
            <button
              type="button"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="typo-clr-muted hover:typo-clr-base transition focus:outline-none cursor-pointer p-1 rounded"
            >
              <IEyeSlash v-if="showPassword" width="18" height="18" />
              <IEye v-else width="18" height="18" />
            </button>
          </template>
        </TextField>
      </div>

      <!-- Footer & Submit -->
      <p class="self-center typo-sm text-center typo-clr-muted">
        Don't have an account?
        <router-link class="typo-clr-primary hover:underline ml-1 font-medium" to="/signup">
          Sign up
        </router-link>
      </p>

      <Btn type="submit" class="mx-auto" :loading="isSubmitting">
        Login
      </Btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useMessage } from '~/composables/message'
import { isDark, toggleDark } from '~/composables/dark'
import TextField from '~/components/TextField.vue'
import Btn from '~/components/Btn.vue'
import {
  ILogo,
  IEmail,
  ILock,
  IEye,
  IEyeSlash,
  ISun,
  IDark,
} from '~/components/icons'

const auth = useAuthStore()
const router = useRouter()

const email = ref('admin@admin.com')
const password = ref('password')
const showPassword = ref(false)
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
      useMessage('success', 'Logged in successfully!')
      router.push(auth.redirectPath ? auth.redirectPath : '/')
    } else {
      useMessage('error', error.message || 'Invalid email or password')
    }
  }
}
</script>

