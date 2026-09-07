<template>
  <div class="flex flex-col gap-6 overflow-y-auto px-4 max-w-700px">
    <header class="flex justify-between items-center gap-4">
      <div>
        <h1 class="typo-lg">Security & Authentication</h1>
        <p class="typo-clr-muted text-sm mt-1">Manage your account credentials, security preferences, and active sessions.</p>
      </div>
    </header>

    <!-- Change Password Card -->
    <form @submit.prevent="handleChangePassword" class="surface-2 rounded-xl p-5 flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-lg bg-indigo-1 dark:bg-dark-2 typo-clr-primary">
          <ILock class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-medium text-sm typo-clr-base">Change Password</h3>
          <p class="text-xs typo-clr-muted">Ensure your account is using a long, random password to stay secure.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <TextField
          label="Current Password"
          type="password"
          placeholder="••••••••"
          v-model="currentPassword"
          wrapper-class="col-span-2"
        />
        <TextField
          label="New Password"
          type="password"
          placeholder="••••••••"
          v-model="newPassword"
        />
        <TextField
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          v-model="confirmPassword"
        />
      </div>

      <div class="flex justify-end mt-2">
        <Btn :loading="isLoading" type="submit">Update Password</Btn>
      </div>
    </form>

    <!-- Two-Factor Authentication Card -->
    <div class="surface-2 rounded-xl p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-lg bg-indigo-1 dark:bg-dark-2 typo-clr-primary">
          <ICheckCircle class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-medium text-sm typo-clr-base">Two-Factor Authentication (2FA)</h3>
          <p class="text-xs typo-clr-muted">Add an extra layer of security to your showcase account</p>
        </div>
      </div>
      <Toggle v-model="twoFactorEnabled" />
    </div>

    <!-- Active Sessions -->
    <div class="surface-2 rounded-xl p-5 flex flex-col gap-3">
      <h3 class="font-medium text-sm typo-clr-base">Active Device Sessions</h3>
      <div class="flex items-center justify-between text-xs py-2">
        <div>
          <p class="font-semibold typo-clr-base">Chrome on Windows (Current Session)</p>
          <p class="typo-clr-muted">Active right now • Local Host</p>
        </div>
        <span class="text-emerald-500 font-medium">Active</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useMessage } from '~/composables/message'
import Btn from '~/components/Btn.vue'
import TextField from '~/components/TextField.vue'
import Toggle from '~/components/Toggle.vue'
import { ILock, ICheckCircle } from '~/components/icons'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const twoFactorEnabled = useLocalStorage('settings_2fa_enabled', false)

async function handleChangePassword() {
  if (!newPassword.value || !confirmPassword.value) {
    useMessage('warn', 'Please enter a new password')
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
  await new Promise((resolve) => setTimeout(resolve, 600))
  useMessage('success', 'Password updated successfully!')
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  isLoading.value = false
}
</script>
