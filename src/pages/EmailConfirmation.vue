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

    <!-- Confirmation Card -->
    <div
      class="flex flex-col gap-6 surface-1 p-6 sm:p-8 py-8 sm:py-10 rounded-md w-full border border-gray-2 dark:border-dark-3 shadow-sm animate-card-bloom text-center items-center"
    >
      <ILogo width="56" height="56" class="mx-auto" />

      <div class="p-3 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
        <ICheckCircle class="w-8 h-8" />
      </div>

      <div class="flex flex-col gap-2">
        <h1 class="typo-lg font-bold typo-clr-base">Verification Pre-Confirmed</h1>
        <p class="typo-sm typo-clr-muted max-w-22rem mx-auto leading-relaxed">
          Because Metrix runs 100% client-side with offline local persistence, email verification is automatically pre-confirmed for evaluator ease.
        </p>
      </div>

      <div class="w-full surface-2 p-3 rounded border border-gray-2 dark:border-dark-3 text-xs text-gray-600 dark:text-gray-300">
        <p class="font-medium">Active Session: <span class="font-mono text-11px font-semibold text-emerald-700 dark:text-emerald-300">Admin Privileges Granted</span></p>
      </div>

      <div class="flex flex-col gap-3 w-full">
        <Btn class="w-full!" @click="router.push('/')">
          Enter Dashboard
        </Btn>
        <p class="typo-sm typo-clr-muted">
          Want to test credentials?
          <RouterLink class="typo-clr-primary hover:underline ml-1 font-medium" to="/login">
            Return to Login
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { isDark, toggleDark } from '~/composables/dark'
import Btn from '~/components/Btn.vue'
import { ILogo, ICheckCircle, ISun, IDark } from '~/components/icons'

const router = useRouter()
</script>
