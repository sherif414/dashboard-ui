<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
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
  >
    <!-- Brand Header: 58px fixed height perfectly aligned with TheHeader -->
    <div class="h-58px px-4 flex items-center border-b border-gray-2 dark:border-dark-3 shrink-0">
      <router-link
        to="/"
        class="flex items-center gap-2.5 group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5 rounded-md p-1)"
        aria-label="Metrix Dashboard Home"
      >
        <ILogo width="30" height="30" class="shrink-0 transition group-hover:scale-105" />
        <div class="flex flex-col">
          <span class="font-bold text-1.125rem typo-clr-base tracking-tight leading-none">Metrix</span>
          <span class="text-10px font-mono typo-clr-muted uppercase tracking-wider mt-0.5">Operations</span>
        </div>
      </router-link>
    </div>

    <!-- Main Navigation Sections -->
    <nav class="flex flex-col w-full grow p-3 gap-y-5 overflow-y-auto">
      <!-- Section: Store Operations -->
      <div class="flex flex-col gap-y-1">
        <span class="px-3 text-10px font-mono font-semibold uppercase tracking-wider typo-clr-muted mb-1">
          Store Operations
        </span>

        <router-link
          to="/"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          <IDashboard width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Dashboard</span>
        </router-link>

        <router-link
          to="/orders"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          <IShoppingBag width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Orders</span>
        </router-link>

        <router-link
          to="/customers"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          <ICustomers width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Customers</span>
        </router-link>

        <router-link
          to="/products"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          <IInventory width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Products</span>
        </router-link>
      </div>

      <!-- Section: Support & Configuration -->
      <div class="flex flex-col gap-y-1">
        <span class="px-3 text-10px font-mono font-semibold uppercase tracking-wider typo-clr-muted mb-1">
          System & Support
        </span>

        <router-link
          to="/chat"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          <IMessage width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Live Chat</span>
        </router-link>

        <router-link
          to="/settings"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          <ISetting width="20" height="20" class="shrink-0" />
          <span class="font-medium text-14px">Settings</span>
        </router-link>
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
          class="p-1.5 rounded-md typo-clr-muted hover:text-error hover:surface-1 transition cursor-pointer shrink-0 focus:outline-none focus-visible:(ring-2 ring-red-5)"
          title="Sign out of Metrix"
          aria-label="Sign out"
        >
          <ILogout class="rotate-180 w-4 h-4 text-error" />
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar__link {
  --at-apply: flex items-center gap-3 px-3 py-2 rounded-lg text-14px font-medium typo-clr-muted hover:typo-clr-base hover:surface-2 transition group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5);
}

.sidebar__link--active {
  --at-apply: fill-primary-2 typo-clr-on-primary font-semibold shadow-xs;
}

.sidebar__link--active :deep(svg) {
  --at-apply: text-white stroke-white;
}
</style>
