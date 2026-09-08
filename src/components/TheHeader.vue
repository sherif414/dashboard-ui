<template>
  <header class="surface-1 h-58px flex px-4 sm:px-8 items-center justify-between border-b border-gray-2 dark:border-dark-3 shrink-0">
    <!-- Skip-to-content link (screen readers + keyboard) -->
    <a
      href="#main-content"
      class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:surface-1 focus:rounded-md focus:ring-2 focus:ring-indigo-5 dark:focus:ring-violet-5 focus:typo-clr-base"
    >
      Skip to content
    </a>

    <div class="p1 grow flex items-center min-w-0">
      <h2 class="text-5 capitalize font-bold truncate typo-clr-base tracking-tight leading-none m-0">
        {{ pageTitle }}
      </h2>
    </div>

    <div class="flex items-center gap-3 sm:gap-4 shrink-0">
      <!-- Reset Data with inline confirmation overlay -->
      <div class="relative" ref="resetContainerRef">
        <button
          v-if="!confirmingReset"
          type="button"
          @click="confirmingReset = true"
          class="typo-sm px-2.5 py-1 rounded-md surface-2 hover:surface-3 active:scale-95 transition-all duration-150 flex items-center gap-1.5 typo-clr-muted hover:typo-clr-base cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
          title="Reset mock database to initial seed data"
          aria-label="Reset demo data"
        >
          <ITrash width="14" height="14" />
          <span class="hidden sm:inline font-medium">Reset Data</span>
        </button>

        <!-- Inline confirmation popover (replaces window.confirm) -->
        <Transition name="confirm-pop">
          <div
            v-if="confirmingReset"
            class="absolute right-0 top-full mt-1.5 z-30 surface-1 border border-gray-2 dark:border-dark-3 rounded-lg shadow-lg p-3 w-56 flex flex-col gap-2.5"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm data reset"
          >
            <p class="text-xs typo-clr-base font-medium leading-snug">
              Reset all demo data to the default seed state?
            </p>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="executeReset"
                class="flex-1 text-xs py-1.5 rounded-md bg-red-5 hover:bg-red-6 text-white font-semibold transition cursor-pointer focus:outline-none focus-visible:(ring-2 ring-red-5)"
                autofocus
              >
                Reset
              </button>
              <button
                type="button"
                @click="confirmingReset = false"
                class="flex-1 text-xs py-1.5 rounded-md surface-2 hover:surface-3 typo-clr-muted hover:typo-clr-base font-medium transition cursor-pointer focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
              >
                Cancel
              </button>
            </div>
          </div>
        </Transition>
      </div>

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

      <RouterLink
        to="/settings/edit-info"
        aria-label="Open profile settings"
        class="flex items-center group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5 rounded-full)"
      >
        <img
          :title="auth.profile?.full_name || 'Profile'"
          class="w-8 h-8 rounded-full cursor-pointer object-cover border border-gray-2 dark:border-dark-3 group-hover:scale-105 group-active:scale-95 transition-transform duration-150"
          :src="profileImg"
          :alt="auth.profile?.full_name ? `${auth.profile.full_name}'s avatar` : 'User profile avatar'"
        />
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
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
const confirmingReset = ref(false)
const resetContainerRef = ref<HTMLElement | null>(null)

// Format route name into a readable page title (use route.name for accuracy on nested routes)
const pageTitle = computed(() => {
  const name = route.name
  if (!name) return 'Dashboard'
  return String(name)
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
})

function executeReset() {
  confirmingReset.value = false
  mockDb.resetToSeedData()
  useMessage('success', 'Demo data reset to default seed state.')
  // Soft reset: navigate to home instead of hard reload
  window.location.href = '/'
}

// Close confirmation on outside click
function handleOutsideClick(e: MouseEvent) {
  if (confirmingReset.value && resetContainerRef.value && !resetContainerRef.value.contains(e.target as Node)) {
    confirmingReset.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>
