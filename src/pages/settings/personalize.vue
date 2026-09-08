<template>
  <div class="flex flex-col gap-6 overflow-y-auto px-4 max-w-700px">
    <header class="flex justify-between items-center gap-4">
      <div>
        <h1 class="typo-lg">Personalization & Preferences</h1>
        <p class="typo-clr-muted text-sm mt-1">Customize your workspace appearance and demo experience.</p>
      </div>
    </header>

    <div class="flex flex-col gap-4">
      <!-- Appearance Card -->
      <div class="surface-2 rounded-md border border-gray-2 dark:border-dark-3 p-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-indigo-1 dark:bg-dark-2 typo-clr-primary">
            <IDark v-if="isDark" class="w-5 h-5" />
            <ISun v-else class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-medium typo-sm typo-clr-base">Dark Theme</h3>
            <p class="text-xs typo-clr-muted">Switch between dark and light color themes</p>
          </div>
        </div>
        <Toggle
          :model-value="isDark"
          @update:model-value="handleToggleDark"
          aria-label="Toggle Dark Theme"
        />
      </div>

      <!-- Demo Chat Bot Card -->
      <div class="surface-2 rounded-md border border-gray-2 dark:border-dark-3 p-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-indigo-1 dark:bg-dark-2 typo-clr-primary">
            <ISend class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-medium typo-sm typo-clr-base">Simulated Chat Responses</h3>
            <p class="text-xs typo-clr-muted">Automatically simulate realistic customer and team replies in Demo Chat</p>
          </div>
        </div>
        <Toggle
          :model-value="autoReply"
          @update:model-value="handleToggleAutoReply"
          aria-label="Toggle Simulated Chat Responses"
        />
      </div>

      <!-- Sound Notifications Card -->
      <div class="surface-2 rounded-md border border-gray-2 dark:border-dark-3 p-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-indigo-1 dark:bg-dark-2 typo-clr-primary">
            <IBell class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-medium typo-sm typo-clr-base">Audible Alerts</h3>
            <p class="text-xs typo-clr-muted">Play a subtle notification chime when new demo events occur</p>
          </div>
        </div>
        <Toggle
          :model-value="soundAlerts"
          @update:model-value="handleToggleSoundAlerts"
          aria-label="Toggle Audible Alerts"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { isDark, toggleDark } from '~/composables/dark'
import { useMessage } from '~/composables/message'
import Toggle from '~/components/Toggle.vue'
import { IDark, ISun, ISend, IBell } from '~/components/icons'

const autoReply = useLocalStorage('settings_auto_reply', true)
const soundAlerts = useLocalStorage('settings_sound_alerts', false)

function handleToggleDark(val: boolean) {
  toggleDark()
  useMessage('info', val ? 'Dark theme enabled' : 'Light theme enabled')
}

function handleToggleAutoReply(val: boolean) {
  autoReply.value = val
  useMessage('info', val ? 'Simulated chat auto-replies enabled' : 'Simulated chat auto-replies disabled')
}

function handleToggleSoundAlerts(val: boolean) {
  soundAlerts.value = val
  useMessage('info', val ? 'Audible alerts enabled' : 'Audible alerts disabled')
}
</script>
