<script setup lang="ts">
let isOpen = $ref(false)
const sidebar = $ref<HTMLElement>()

function expand() {
  animate(sidebar, { width: '12rem' }, { duration: 0.2 }).finished.then(() => {
    isOpen = true
    animate('.nav-link-name', { opacity: 1 }, { duration: 0 })
  })
}
function shrink() {
  isOpen = false
  animate(sidebar, { width: '5.5rem' }, { duration: 0.2 })
  animate('.nav-link-name', { opacity: 0 }, { duration: 0 })
}
</script>

<template>
  <aside ref="sidebar" class="z-10 bg-white fixed top-0 left-0 h-full py4 flex flex-col items-start gap-y-8" @mouseenter="expand" @mouseleave="shrink">
    <!-- logo -->
    <div class="flex items-center mb3">
      <img class="w14 ml4" src="/logo.svg" alt="logo"> <span v-show="isOpen" class="opacity-0 font-bold text-5 ml4 nav-link-name">Matrix</span>
    </div>
    <!-- navigation links -->
    <nav class="flex flex-col justify-start w-full grow gap-y-1 px-4 text-0.875rem font-medium">
      <router-link class="nav-link" to="/">
        <IDashboard />
        <span v-show="isOpen" class="opacity-0 nav-link-name">Dashboard</span>
      </router-link>

      <router-link class="nav-link" to="orders">
        <IShoppingBag />
        <span v-show="isOpen" class="opacity-0 nav-link-name">Orders</span>
      </router-link>

      <router-link class="nav-link" to="customers">
        <ICustomers />
        <span v-show="isOpen" class="opacity-0 nav-link-name">Customers</span>
      </router-link>

      <router-link class="nav-link" to="inventory">
        <IInventory />
        <span v-show="isOpen" class="opacity-0 nav-link-name">Inventory</span>
      </router-link>

      <router-link class="nav-link" to="chat">
        <IMessage />
        <span v-show="isOpen" class="opacity-0 nav-link-name">Chat</span>
      </router-link>

      <router-link class="nav-link" to="settings">
        <ISetting />
        <span v-show="isOpen" class="opacity-0 nav-link-name">Settings</span>
      </router-link>
    </nav>
    <!-- user control -->
    <div class="flex justify-center w-full">
      <ILogout />
    </div>
  </aside>
</template>

<style>
.router-link-active,
.nav-link:hover{
  background-color: #4461f1;
  transition: all ease 0.3s;
  color: white;
}

.nav-link svg path{
  fill: white;
  stroke: #53545C;
}

.router-link-active svg path,
.nav-link:hover svg path{
  stroke: white;
}
</style>

