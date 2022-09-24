<script setup lang="ts"></script>

<template>
  <div class="h-screen">
    <!-- <Header /> -->
    <SideBar />
    <router-view />
  </div>
</template>

<style>
body{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  --at-apply: dark:bg-dark-50 bg-gray-3 rounded-full;
}
</style>
