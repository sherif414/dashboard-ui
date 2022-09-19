<script setup lang="ts"></script>

<template>
  <aside class="sidebar fixed left-0 top-0 h-screen bg-dark-700 border-r border-dark-600">
    <nav class="flex flex-col w-full grow gap-y-4 text-3 text-gray-500 font-600">
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
      <ILogout />
    </div>
  </aside>
</template>

<style>
.sidebar {
  width: 4rem;
  transition: width 300ms ease;
  display: flex;
  flex-direction: column;
  padding: 6.25rem 0.6rem;
}
.sidebar:hover {
  width: 12rem;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 1rem;
  box-sizing: content-box;
  padding: 12px 0;
}
.router-link-active {
  --at-apply: text-white bg-violet-600 rounded-3;
}
.sidebar__link:hover {
  --at-apply: text-white transition-all duration-300;
}

.sidebar__link svg {
  margin-left: 0.8rem;
}
.sidebar__link svg path {
  --at-apply: fill-gray-500 stroke-gray-500;
}
.router-link-active svg path,
.sidebar__link:hover svg path {
  --at-apply: fill-white stroke-none transition-all duration-300;
}

.sidebar__link__name {
  position: absolute;
  left: 4rem;
  opacity: 0;
  pointer-events: none;
}
.sidebar:hover .sidebar__link__name {
  transition: opacity 300ms 150ms ease;
  opacity: 1;
}
.sidebar svg {
  width: 20px;
  height: 20px;
}
</style>
