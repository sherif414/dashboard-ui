<template>
  <header class="surface-1 h-58px flex px-4 sm:px-8 items-center justify-between border-b border-gray-2 dark:border-dark-3 shrink-0">
    <div class="p1 grow flex items-center min-w-0">
      <span class="text-5 capitalize font-bold truncate typo-clr-base tracking-tight" role="heading" aria-level="2">{{ route.matched[0]?.name }}</span>
    </div>
    <div class="flex items-center gap-3 sm:gap-4 shrink-0">
      <button
        type="button"
        @click="handleResetData"
        class="typo-sm px-2.5 py-1 rounded-md surface-2 hover:surface-3 active:scale-95 transition-all duration-150 flex items-center gap-1.5 typo-clr-muted hover:typo-clr-base cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
        title="Reset mock database to initial seed data"
      >
        <ITrash width="14" height="14" />
        <span class="hidden sm:inline font-medium">Reset Data</span>
      </button>

      <button
        type="button"
        @click="toggleDark()"
        aria-label="Toggle dark theme"
        class="w-8 h-8 rounded-md flex items-center justify-center text-gray-5 dark:text-gray-3 hover:typo-clr-base hover:surface-2 active:scale-90 cursor-pointer transition-all duration-150 focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
      >
        <Transition name="icon-spin" mode="out-in">
          <ISun width="19" height="19" v-if="!isDark" key="sun" />
          <IDark width="19" height="19" v-else key="dark" />
        </Transition>
      </button>

      <router-link to="/settings/edit-info" class="flex items-center group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5 rounded-full)">
        <img
          :title="auth.profile?.full_name || 'Profile'"
          class="w-8 h-8 rounded-full cursor-pointer object-cover border border-gray-2 dark:border-dark-3 group-hover:scale-105 group-active:scale-95 transition-transform duration-150"
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
