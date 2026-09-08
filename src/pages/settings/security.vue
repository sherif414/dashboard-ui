<template>
  <div class="flex flex-col gap-6 overflow-y-auto px-4 max-w-700px">
    <header class="flex justify-between items-center gap-4">
      <div>
        <h1 class="typo-lg">Security & Authentication</h1>
        <p class="typo-clr-muted text-sm mt-1">Manage your account credentials, security preferences, and active sessions.</p>
      </div>
    </header>

    <!-- Change Password Card -->
    <form @submit.prevent="handleChangePassword" class="surface-2 rounded-md border border-gray-2 dark:border-dark-3 p-5 flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-lg bg-indigo-1 dark:bg-dark-2 typo-clr-primary">
          <ILock class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-medium typo-sm typo-clr-base">Change Password</h3>
          <p class="text-xs typo-clr-muted">Ensure your account is using a long, random password to stay secure.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <TextField
          label="Current Password"
          :type="showCurrentPassword ? 'text' : 'password'"
          placeholder="••••••••"
          v-model="currentPassword"
          wrapper-class="col-span-1 md:col-span-2"
          :disabled="isLoading"
          autocomplete="current-password"
          required
        >
          <template #append>
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="p-1.5 text-gray-500 hover:text-gray-9 dark:hover:text-gray-1 transition cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
              :aria-label="showCurrentPassword ? 'Hide current password' : 'Show current password'"
            >
              <IEyeSlash v-if="showCurrentPassword" class="w-4 h-4" />
              <IEye v-else class="w-4 h-4" />
            </button>
          </template>
        </TextField>
        <TextField
          label="New Password"
          :type="showNewPassword ? 'text' : 'password'"
          placeholder="••••••••"
          v-model="newPassword"
          :disabled="isLoading"
          autocomplete="new-password"
          required
        >
          <template #append>
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="p-1.5 text-gray-500 hover:text-gray-9 dark:hover:text-gray-1 transition cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
              :aria-label="showNewPassword ? 'Hide new password' : 'Show new password'"
            >
              <IEyeSlash v-if="showNewPassword" class="w-4 h-4" />
              <IEye v-else class="w-4 h-4" />
            </button>
          </template>
        </TextField>
        <TextField
          label="Confirm Password"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="••••••••"
          v-model="confirmPassword"
          :disabled="isLoading"
          autocomplete="new-password"
          required
        >
          <template #append>
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="p-1.5 text-gray-500 hover:text-gray-9 dark:hover:text-gray-1 transition cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
              :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
            >
              <IEyeSlash v-if="showConfirmPassword" class="w-4 h-4" />
              <IEye v-else class="w-4 h-4" />
            </button>
          </template>
        </TextField>
      </div>

      <!-- Password Requirements Feedback -->
      <div v-if="newPassword || confirmPassword" class="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-1">
        <span
          class="flex items-center gap-1 transition-colors"
          :class="hasMinLength ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'typo-clr-muted'"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="hasMinLength ? 'bg-emerald-500' : 'bg-gray-4 dark:bg-dark-3'"></span>
          At least 6 characters
        </span>
        <span
          class="flex items-center gap-1 transition-colors"
          :class="passwordsMatch ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'typo-clr-muted'"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="passwordsMatch ? 'bg-emerald-500' : 'bg-gray-4 dark:bg-dark-3'"></span>
          Passwords match
        </span>
      </div>

      <div class="flex justify-end mt-2">
        <Btn :loading="isLoading" :disabled="!isPasswordValid" type="submit">
          Update Password
        </Btn>
      </div>
    </form>

    <!-- Two-Factor Authentication Card -->
    <div class="surface-2 rounded-md border border-gray-2 dark:border-dark-3 p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-lg bg-indigo-1 dark:bg-dark-2 typo-clr-primary">
          <ICheckCircle class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-medium typo-sm typo-clr-base">Two-Factor Authentication (2FA)</h3>
          <p class="text-xs typo-clr-muted">Add an extra layer of security to your showcase account</p>
        </div>
      </div>
      <Toggle
        :model-value="twoFactorEnabled"
        @update:model-value="handleToggle2FA"
        aria-label="Toggle Two-Factor Authentication (2FA)"
      />
    </div>

    <!-- Active Sessions -->
    <div class="surface-2 rounded-md border border-gray-2 dark:border-dark-3 p-5 flex flex-col gap-3">
      <h3 class="font-medium typo-sm typo-clr-base">Active Device Sessions</h3>
      <div class="flex items-center justify-between text-xs py-2">
        <div>
          <p class="font-semibold typo-clr-base">Chrome on Windows (Current Session)</p>
          <p class="typo-clr-muted">Active right now • Local Host</p>
        </div>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Active
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useAuthStore } from '~/store/auth'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import TextField from '~/components/TextField.vue'
import Toggle from '~/components/Toggle.vue'
import { ILock, ICheckCircle, IEye, IEyeSlash } from '~/components/icons'

const auth = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const isLoading = ref(false)
const twoFactorEnabled = useLocalStorage('settings_2fa_enabled', false)

const hasMinLength = computed(() => newPassword.value.length >= 6)
const passwordsMatch = computed(() => !!confirmPassword.value && newPassword.value === confirmPassword.value)
const isPasswordValid = computed(() => {
  return currentPassword.value.trim().length > 0 && hasMinLength.value && passwordsMatch.value
})

function handleToggle2FA(val: boolean) {
  twoFactorEnabled.value = val
  useMessage('info', val ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled')
}

async function handleChangePassword() {
  if (!currentPassword.value) {
    useMessage('warn', 'Please enter your current password')
    return
  }
  if (!newPassword.value || !confirmPassword.value) {
    useMessage('warn', 'Please enter and confirm a new password')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    useMessage('error', 'New passwords do not match')
    return
  }
  if (newPassword.value.length < 6) {
    useMessage('warn', 'Password must be at least 6 characters')
    return
  }

  isLoading.value = true
  const error = await auth.changePassword(currentPassword.value, newPassword.value)
  isLoading.value = false

  if (error) {
    useMessage('error', error.message || 'Failed to update password')
    return
  }

  useMessage('success', 'Password updated successfully!')
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>
