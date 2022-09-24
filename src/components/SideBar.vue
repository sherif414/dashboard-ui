<script setup lang="ts"></script>

<template>
  <aside
    class="sidebar h-screen fixed top-0 left-0 w-4rem hover:w-12rem duration-300 flex flex-col py-6rem px-3 surface-1 z-20 typo-clr-base"
  >
    <nav class="flex flex-col w-full grow gap-y-4 text-3 text-gray-500">
      <router-link class="sidebar__link" to="/">
        <IDashboard />
        <span class="sidebar__link__name">Dashboard</span>
      </router-link>

      <router-link class="sidebar__link" to="orders">
        <IShoppingBag />
        <span class="sidebar__link__name">Orders</span>
      </router-link>

      <router-link class="sidebar__link" to="customers">
        <ICustomers />
        <span class="sidebar__link__name">Customers</span>
      </router-link>

      <router-link class="sidebar__link" to="inventory">
        <IInventory />
        <span class="sidebar__link__name">Inventory</span>
      </router-link>

      <router-link class="sidebar__link" to="chat">
        <IMessage />
        <span class="sidebar__link__name">Chat</span>
      </router-link>

      <router-link class="sidebar__link" to="settings">
        <ISetting />
        <span class="sidebar__link__name">Settings</span>
      </router-link>
    </nav>
    <!-- user control -->
    <div class="flex justify-center w-full">
      <ILogout @click="toggleDark()" />
    </div>
  </aside>
</template>

<style>
.sidebar__link {
  --at-apply: flex items-center box-content p-2 duration-300 hover:dark:(text-gray-1 fill-gray-1 stroke-none);
}
.router-link-active {
  --at-apply: text-gray-1 fill-primary-2 rounded-3;
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
