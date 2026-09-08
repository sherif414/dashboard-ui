<template>
  <div class="h-screen w-screen overflow-hidden surface-2 font-sans typo-clr-base">
    <transition name="portal-unlock" mode="out-in">
      <!-- Public Auth Layout (Login, Signup, Email Confirmation) -->
      <div
        v-if="isAuthRoute"
        key="auth-shell"
        class="h-full w-full overflow-y-auto flex items-center justify-center p-4 relative"
      >
        <!-- Subtle Ambient Lighting Mesh (Non-intrusive backdrop) -->
        <div class="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div
            class="absolute -top-35% -left-20% w-75vw h-75vw max-w-650px max-h-650px rounded-full bg-indigo-5/6 dark:bg-violet-6/10 blur-100px animate-ambient-drift-1"
          />
          <div
            class="absolute -bottom-35% -right-20% w-75vw h-75vw max-w-650px max-h-650px rounded-full bg-accent-9/8 dark:bg-violet-9/8 blur-120px animate-ambient-drift-2"
          />
          <div
            class="absolute inset-0 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:24px_24px] opacity-20 dark:opacity-8"
          />
        </div>

        <div class="w-full relative z-1 flex items-center justify-center">
          <router-view v-slot="{ Component, route: currentRoute }">
            <transition :name="authTransitionName" mode="out-in">
              <component :is="Component" :key="currentRoute.path" />
            </transition>
          </router-view>
        </div>
      </div>

      <!-- Authenticated Dashboard Layout (App Shell) -->
      <div
        v-else
        key="app-shell"
        class="h-full w-full flex overflow-hidden"
      >
        <transition name="sidebar-slide" appear>
          <SideBar />
        </transition>
        <div class="grow flex flex-col min-w-0 h-full overflow-hidden">
          <transition name="header-slide" appear>
            <TheHeader />
          </transition>
          <div class="grow overflow-y-auto relative">
            <router-view v-slot="{ Component, route: currentRoute }">
              <transition name="page-fade" mode="out-in">
                <component :is="Component" :key="currentRoute.path" />
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import SideBar from '~/components/SideBar.vue'
import TheHeader from '~/components/TheHeader.vue'

const auth = useAuthStore()
const route = useRoute()

// Prevent initial sidebar flash by checking both route.path and window.location.pathname
const isAuthRoute = computed(() => {
  const currentPath = route.path || (typeof window !== 'undefined' ? window.location.pathname : '')
  return auth.publicPages.includes(currentPath)
})

// Track directional slide between auth pages (Login <-> Signup)
const authRouteOrder: Record<string, number> = {
  '/login': 0,
  '/signup': 1,
  '/email-confirmation': 2,
}

const authTransitionName = ref('auth-forward')

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath && oldPath && auth.publicPages.includes(newPath) && auth.publicPages.includes(oldPath)) {
      const newIdx = authRouteOrder[newPath] ?? 0
      const oldIdx = authRouteOrder[oldPath] ?? 0
      authTransitionName.value = newIdx >= oldIdx ? 'auth-forward' : 'auth-backward'
    }
  }
)
</script>
