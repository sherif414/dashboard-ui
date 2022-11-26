<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const auth = useAuthStore()
const router = useRouter()

async function signOut() {
  const signOutError = await auth.signOut()
  if (!signOutError) {
    router.push('/login')
    return
  }
  alert(signOutError.message)
}
</script>

<template>
  <aside
    class="sidebar h-screen fixed top-0 left-0 w-4rem hover:w-12rem transition-width duration-300 flex flex-col py-2 px-3 surface-1 z-100 typo-clr-base"
  >
    <router-link activeClass="" to="/" class="sidebar__link p-0">
      <ILogo width="45" height="45" />
      <span class="sidebar__link__name typo-lg font-normal">Metrix</span>
    </router-link>
    <nav class="flex flex-col w-full grow gap-y-4 text-3 text-gray-500 pt-2rem">
      <router-link class="sidebar__link" to="/">
        <IDashboard />
        <span class="sidebar__link__name">Dashboard</span>
      </router-link>

      <router-link class="sidebar__link" to="/orders">
        <IShoppingBag />
        <span class="sidebar__link__name">Orders</span>
      </router-link>

      <router-link class="sidebar__link" to="/customers">
        <ICustomers />
        <span class="sidebar__link__name">Customers</span>
      </router-link>

      <router-link class="sidebar__link" to="/products">
        <IInventory />
        <span class="sidebar__link__name">products</span>
      </router-link>

      <router-link class="sidebar__link" to="/chat">
        <IMessage />
        <span class="sidebar__link__name">Chat</span>
      </router-link>

      <router-link class="sidebar__link" to="/settings">
        <ISetting />
        <span class="sidebar__link__name">Settings</span>
      </router-link>
    </nav>
    <!-- user control -->
    <div class="flex flex-col justify-end w-full">
      <button @click="signOut" type="button" class="sidebar__link text-error">
        <ILogout class="rotate-180" /> <span class="sidebar__link__name left-3.5rem translate-y--2px">logout</span>
      </button>
    </div>
  </aside>
</template>

<style>
.sidebar__link {
  --at-apply: flex items-center justify-start box-content py-2 pl-8px duration-300 hover:dark:(text-gray-1 fill-gray-1 stroke-none);
}
.router-link-active {
  --at-apply: text-gray-1 fill-primary-2 rounded-12px;
}
.router-link-active svg{
  --at-apply: stroke-none fill-gray-1;
}

.sidebar__link__name {
  --at-apply: absolute left-4rem opacity-0 pointer-events-none;
}

.sidebar:hover .sidebar__link__name {
  transition: opacity 300ms 150ms ease;
  opacity: 1;
}
</style>
