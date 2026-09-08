<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { getProfileImageUrl } from '~/services/imageUtils'
import {
  ILogo,
  IDashboard,
  IShoppingBag,
  ICustomers,
  IInventory,
  IMessage,
  ISetting,
  ILogout,
} from '~/components/icons'

const auth = useAuthStore()
const router = useRouter()

// Ensure profile data is loaded for the user card
if (!auth.profile) {
  auth.getProfile()
}

const profileImg = computed(() => getProfileImageUrl(auth.profile?.profile_image))

async function signOut() {
  await auth.signOut()
  router.push('/login')
}
</script>

<template>
  <aside
    class="sidebar h-full w-60 min-w-60 max-w-60 flex flex-col surface-1 typo-clr-base border-r border-gray-2 dark:border-dark-3 shrink-0 select-none"
    aria-label="Main navigation"
  >
    <!-- Brand Header: 58px fixed height perfectly aligned with TheHeader -->
    <div class="h-58px px-4 flex items-center border-b border-gray-2 dark:border-dark-3 shrink-0">
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5 rounded-md p-1)"
        aria-label="Metrix Dashboard Home"
      >
        <ILogo width="30" height="30" class="shrink-0 transition group-hover:scale-105" />
        <div class="flex flex-col">
          <span class="font-bold text-1.125rem typo-clr-base tracking-tight leading-none">Metrix</span>
          <span class="text-10px font-mono typo-clr-muted uppercase tracking-wider mt-0.5">Operations</span>
        </div>
      </RouterLink>
    </div>

    <!-- Main Navigation Sections -->
    <nav class="flex flex-col w-full grow p-3 gap-y-5 overflow-y-auto" aria-label="Site navigation">
      <!-- Section: Store Operations -->
      <div class="flex flex-col gap-y-1" role="group" aria-labelledby="nav-section-ops">
        <span
          id="nav-section-ops"
          class="px-3 text-10px font-mono font-semibold uppercase tracking-wider typo-clr-muted mb-1"
        >
          Store Operations
        </span>

        <RouterLink
          to="/"
          class="sidebar__link"
          active-class="sidebar__link--active"
          :aria-current="$route.path === '/' ? 'page' : undefined"
        >
          <IDashboard width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/orders"
          class="sidebar__link"
          active-class="sidebar__link--active"
          :aria-current="$route.path.startsWith('/orders') ? 'page' : undefined"
        >
          <IShoppingBag width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Orders</span>
        </RouterLink>

        <RouterLink
          to="/customers"
          class="sidebar__link"
          active-class="sidebar__link--active"
          :aria-current="$route.path.startsWith('/customers') ? 'page' : undefined"
        >
          <ICustomers width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Customers</span>
        </RouterLink>

        <RouterLink
          to="/products"
          class="sidebar__link"
          active-class="sidebar__link--active"
          :aria-current="$route.path.startsWith('/products') ? 'page' : undefined"
        >
          <IInventory width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Products</span>
        </RouterLink>
      </div>

      <!-- Section: Support & Configuration -->
      <div class="flex flex-col gap-y-1" role="group" aria-labelledby="nav-section-sys">
        <span
          id="nav-section-sys"
          class="px-3 text-10px font-mono font-semibold uppercase tracking-wider typo-clr-muted mb-1"
        >
          System &amp; Support
        </span>

        <RouterLink
          to="/chat"
          class="sidebar__link"
          active-class="sidebar__link--active"
          :aria-current="$route.path.startsWith('/chat') ? 'page' : undefined"
        >
          <IMessage width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Live Chat</span>
        </RouterLink>

        <RouterLink
          to="/settings"
          class="sidebar__link"
          active-class="sidebar__link--active"
          :aria-current="$route.path.startsWith('/settings') ? 'page' : undefined"
        >
          <ISetting width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Settings</span>
        </RouterLink>
      </div>
    </nav>

    <!-- User Profile Card & Sign Out Footer -->
    <div class="p-3 border-t border-gray-2 dark:border-dark-3 mt-auto shrink-0">
      <div class="flex items-center gap-2.5 p-2 rounded-lg surface-2 border border-gray-2 dark:border-dark-3">
        <img
          :src="profileImg"
          :alt="auth.profile?.full_name ? `${auth.profile.full_name}'s avatar` : 'User profile avatar'"
          class="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-2 dark:border-dark-3"
        />
        <div class="flex flex-col min-w-0 grow">
          <span class="text-12px font-semibold truncate typo-clr-base leading-tight">
            {{ auth.profile?.full_name || 'Store Admin' }}
          </span>
          <span class="text-10px font-mono typo-clr-muted truncate">
            {{ auth.profile?.email || 'admin@metrix.store' }}
          </span>
        </div>
        <button
          type="button"
          @click="signOut"
          class="p-1.5 rounded-md typo-clr-muted hover:text-red-5 dark:hover:text-red-4 hover:surface-1 transition cursor-pointer shrink-0 focus:outline-none focus-visible:(ring-2 ring-red-5)"
          title="Sign out of Metrix"
          aria-label="Sign out"
        >
          <ILogout class="rotate-180 w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar__link {
  --at-apply: flex items-center gap-3 px-3 py-2 rounded-lg text-14px font-medium typo-clr-muted hover:typo-clr-base hover:surface-2 transition-all duration-150 active:scale-98 group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5);
}

.sidebar__link :deep(svg) {
  --at-apply: transition-transform duration-150 group-hover:scale-108;
}

.sidebar__link--active {
  --at-apply: fill-primary-2 typo-clr-on-primary font-semibold shadow-xs;
}

.sidebar__link--active :deep(svg) {
  --at-apply: text-white stroke-white scale-100;
}
</style>
