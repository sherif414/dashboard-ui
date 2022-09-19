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
  accent-color: blue;
}
::-webkit-scrollbar {
  display: none;
  width: 0; /* Remove scrollbar space */
}
</style>
