<template>
  <div class="w-full max-w-27rem my-auto flex flex-col items-center relative typo-clr-base">
    <!-- Theme Toggle (top right) -->
    <button
      type="button"
      @click="toggleDark()"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      aria-label="Toggle color theme"
      class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-md surface-1 border border-gray-2 dark:border-dark-3 typo-clr-muted hover:typo-clr-base transition cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5) z-20 min-w-44px min-h-44px flex items-center justify-center"
    >
      <ISun width="18" height="18" v-if="!isDark" />
      <IDark width="18" height="18" v-else />
    </button>

    <!-- Auth Card -->
    <form
      class="flex flex-col gap-6 surface-1 p-6 sm:p-8 py-8 sm:py-10 rounded-md w-full border border-gray-2 dark:border-dark-3 shadow-sm animate-card-bloom"
      @submit.prevent="handleSignup"
    >
      <!-- Logo & Heading -->
      <div class="flex flex-col items-center gap-3">
        <ILogo width="56" height="56" class="mx-auto" />
        <div class="flex flex-col gap-1 text-center">
          <h1 class="typo-lg capitalize font-bold typo-clr-base">Create Account</h1>
          <h2 class="typo-clr-muted typo-sm">Register a local demo account</h2>
        </div>
      </div>

      <!-- Form Inputs -->
      <div class="flex flex-col gap-4">
        <TextField
          label="Full Name"
          required
          v-model="fullName"
          placeholder="Jane Doe"
          type="text"
          autocomplete="name"
          :disabled="isSubmitting"
        >
          <template #prepend>
            <ICustomers class="typo-clr-muted" width="18" height="18" />
          </template>
        </TextField>

        <TextField
          label="Email Address"
          required
          v-model="email"
          placeholder="jane@example.com"
          type="email"
          autocomplete="email"
          :disabled="isSubmitting"
        >
          <template #prepend>
            <IEmail class="typo-clr-muted" width="18" height="18" />
          </template>
        </TextField>

        <TextField
          label="Password"
          minlength="6"
          required
          v-model="password"
          placeholder="••••••••"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          :disabled="isSubmitting"
        >
          <template #prepend>
            <ILock class="typo-clr-muted" width="18" height="18" />
          </template>
          <template #append>
            <button
              type="button"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="typo-clr-muted hover:typo-clr-base transition focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5) cursor-pointer p-1.5 rounded"
            >
              <IEyeSlash v-if="showPassword" width="18" height="18" />
              <IEye v-else width="18" height="18" />
            </button>
          </template>
        </TextField>

        <!-- Reactive Password Requirement Indicator -->
        <div class="flex items-center gap-1.5 text-xs transition-colors" :class="hasMinLength ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-gray-500 dark:text-gray-400'">
          <span class="w-1.5 h-1.5 rounded-full transition-colors" :class="hasMinLength ? 'bg-emerald-500' : 'bg-gray-4 dark:bg-dark-3'"></span>
          Password must be at least 6 characters
        </div>
      </div>

      <!-- Local storage notice -->
      <p class="text-11px text-gray-700 dark:text-gray-300 text-center surface-2 p-2.5 rounded border border-gray-3 dark:border-dark-3">
        Data is saved locally in your browser's localStorage.
      </p>

      <!-- Submit & Footer -->
      <div class="flex flex-col gap-3">
        <Btn type="submit" class="w-full!" :loading="isSubmitting" :disabled="!isFormValid">
          Create Account
        </Btn>
        <p class="self-center typo-sm text-center typo-clr-muted">
          Already have an account?
          <RouterLink class="typo-clr-primary hover:underline ml-1 font-medium" to="/login">
            Login
          </RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useMessage } from '~/composables/message'
import { isDark, toggleDark } from '~/composables/dark'
import TextField from '~/components/TextField.vue'
import Btn from '~/components/Btn.vue'
import {
  ILogo,
  ICustomers,
  IEmail,
  ILock,
  IEye,
  IEyeSlash,
  ISun,
  IDark,
} from '~/components/icons'

const auth = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)
const fullName = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const hasMinLength = computed(() => password.value.length >= 6)
const isFormValid = computed(() => {
  return fullName.value.trim().length > 0 && email.value.trim().length > 0 && hasMinLength.value
})

async function handleSignup() {
  if (!fullName.value.trim() || !email.value.trim() || !password.value.trim()) {
    useMessage('warn', 'Please fill in all required fields')
    return
  }

  if (password.value.length < 6) {
    useMessage('warn', 'Password must be at least 6 characters')
    return
  }

  isSubmitting.value = true
  const error = await auth.signUp(email.value.trim(), password.value, fullName.value.trim())
  isSubmitting.value = false

  if (error) {
    useMessage('error', error.message || 'Failed to create account')
  } else {
    useMessage('success', 'Account created! Welcome.')
    router.push('/')
  }
}
</script>

