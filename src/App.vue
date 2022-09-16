<script setup lang="ts"></script>

<template>
  <div class="pl-5.5rem text-black-50 bg-#F4F5FA">
    <SideBar />
    <div class="min-h-screen grid grid-rows-[max-content_1fr]">
      <Header />
      <router-view />
    </div>
  </div>
</template>
