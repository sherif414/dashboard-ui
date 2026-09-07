<template>
  <header class="surface-1 h-58px flex px-4 sm:px-8 items-center justify-between border-b border-gray-2 dark:border-dark-3 shrink-0">
    <div class="p1 grow flex items-center min-w-0">
      <h1 class="text-5 capitalize font-bold truncate">{{ route.matched[0]?.name }}</h1>
    </div>
    <div class="flex items-center gap-3 sm:gap-4 shrink-0">
      <button
        type="button"
        @click="handleResetData"
        class="typo-sm px-2.5 py-1 rounded surface-2 hover:bg-opacity-80 transition flex items-center gap-1.5 typo-clr-muted hover:typo-clr-base cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
        title="Reset mock database to initial seed data"
      >
        <ITrash width="14" height="14" />
        <span class="hidden sm:inline">Reset Data</span>
      </button>

      <button
        type="button"
        @click="toggleDark()"
        aria-label="Toggle dark theme"
        class="p-1 rounded text-gray-4 hover:typo-clr-base cursor-pointer transition focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
      >
        <ISun width="20" height="20" v-if="!isDark" />
        <IDark width="20" height="20" v-else />
      </button>

      <router-link to="/settings/edit-info" class="flex items-center focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5 rounded-full)">
        <img
          :title="auth.profile?.full_name || 'Profile'"
          class="w-8 h-8 rounded-full cursor-pointer object-cover border border-gray-2 dark:border-dark-3"
          :src="profileImg"
          :alt="auth.profile?.full_name ? `${auth.profile.full_name}'s avatar` : 'User profile avatar'"
        />
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { ISun, IDark, ITrash } from '~/components/icons'
import { isDark, toggleDark } from '~/composables/dark'
import { getProfileImageUrl } from '~/services/imageUtils'
import { mockDb } from '~/services/mock/mockDb'
import { useMessage } from '~/composables/message'

const auth = useAuthStore()
const route = useRoute()

auth.getProfile()

const profileImg = computed(() => getProfileImageUrl(auth.profile?.profile_image))

function handleResetData() {
  if (confirm('Reset all demo data back to default initial seed?')) {
    mockDb.resetToSeedData()
    useMessage('success', 'Demo data reset successfully!')
    window.location.reload()
  }
}
</script>
