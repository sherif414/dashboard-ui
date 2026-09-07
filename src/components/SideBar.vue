<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'
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

const isExpanded = ref(false)
const linkNameOpacity = computed(() => (isExpanded.value ? '1' : '0'))

async function signOut() {
  await auth.signOut()
  router.push('/login')
}
</script>

<template>
  <aside
    :class="isExpanded ? 'w-12rem' : 'w-4rem'"
    class="sidebar h-screen transition-width duration-300 ease flex flex-col py-2 px-3 surface-1 typo-clr-base border-r border-gray-2 dark:border-dark-3 shrink-0"
  >
    <router-link activeClass="" to="/" class="sidebar__link p-0">
      <ILogo width="45" height="45" />
      <span class="sidebar__link__name typo-lg font-normal">Metrix</span>
    </router-link>
    <nav class="flex flex-col w-full grow gap-y-4 typo-sm pt-2rem">
      <button
        type="button"
        :aria-label="isExpanded ? 'Collapse sidebar' : 'Expand sidebar'"
        class="ml-2 self-start cursor-pointer bg-transparent border-none p-1 rounded focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
        @click="isExpanded = !isExpanded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
        </svg>
      </button>
      <router-link class="sidebar__link" active-class="sidebar__link--active" to="/">
        <IDashboard />
        <span class="sidebar__link__name">Dashboard</span>
      </router-link>

      <router-link class="sidebar__link" active-class="sidebar__link--active" to="/orders">
        <IShoppingBag />
        <span class="sidebar__link__name">Orders</span>
      </router-link>

      <router-link class="sidebar__link" active-class="sidebar__link--active" to="/customers">
        <ICustomers />
        <span class="sidebar__link__name">Customers</span>
      </router-link>

      <router-link class="sidebar__link" active-class="sidebar__link--active" to="/products">
        <IInventory />
        <span class="sidebar__link__name">products</span>
      </router-link>

      <router-link class="sidebar__link" active-class="sidebar__link--active" to="/chat">
        <IMessage />
        <span class="sidebar__link__name">Chat</span>
      </router-link>

      <router-link class="sidebar__link" active-class="sidebar__link--active" to="/settings">
        <ISetting />
        <span class="sidebar__link__name">Settings</span>
      </router-link>
    </nav>
    <!-- user control -->
    <div class="flex flex-col justify-end w-full">
      <button @click="signOut" type="button" class="sidebar__link text-error">
        <ILogout class="rotate-180 text-error!" />
        <span class="sidebar__link__name left-3.5rem translate-y--2px">logout</span>
      </button>
    </div>
  </aside>
</template>

<style>
.sidebar__link {
  --at-apply: flex items-center justify-start box-content py-2 pl-8px duration-300;
}
.sidebar__link svg {
  --at-apply: typo-clr-muted;
}
.dark .sidebar__link:hover svg {
  --at-apply: fill-gray-1 typo-clr-base;
}
.sidebar__link--active {
  --at-apply: fill-primary-2 rounded-12px typo-clr-on-primary;
}
.sidebar__link--active svg {
  --at-apply: stroke-none fill-gray-1;
}

.sidebar__link__name {
  --at-apply: absolute left-4rem opacity-0 pointer-events-none;
}

.sidebar__link__name {
  transition: opacity 0ms 150ms;
  opacity: v-bind('linkNameOpacity');
}
</style>
