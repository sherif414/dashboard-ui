<script setup lang="ts"></script>

<template>
  <div class="h-screen">
    <Header />
    <SideBar />
    <router-view />
  </div>
</template>

<style>
input[type='checkbox'] {
  accent-color: theme('colors.violet.600');
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  --at-apply: dark:bg-dark-50 bg-gray-3 rounded-full;
}
</style>
