<template>
  <header class="surface-1 h-58px flex px-8 items-center border-b border-gray-2 dark:border-dark-3">
    <div class="p1 grow flex items-center">
      <h1 class="text-5 capitalize font-bold">{{ route.matched[0]?.name }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <button
        type="button"
        @click="handleResetData"
        class="typo-sm px-3 py-1 rounded surface-2 hover:bg-opacity-80 transition flex items-center gap-1.5 typo-clr-muted hover:typo-clr-base"
        title="Reset mock database to initial seed data"
      >
        <ITrash width="14" height="14" />
        <span>Reset Data</span>
      </button>

      <div>
        <ISun class="cursor-pointer" width="20" height="20" v-if="!isDark" @click="toggleDark()" />
        <IDark class="cursor-pointer" width="20" height="20" v-else @click="toggleDark()" />
      </div>
      <router-link to="/settings/edit-info" class="flex items-center">
        <img
          :title="auth.profile?.full_name || 'Profile'"
          class="w-8 h-8 rounded-50% cursor-pointer object-cover"
          :src="profileImg"
          alt="avatar"
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
