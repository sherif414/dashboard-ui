<template>
  <header class="surface-1 fixed w-screen z-99 top-0 left-0 pl-4rem h-58px flex pr-8 items-center">
    <div class="p1 pl-4 grow flex items-center">
      <h1 class="text-5 capitalize font-bold">{{ $route.matched[0]?.name }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <div>
        <ISun class="cursor-pointer" width="20" height="20" v-if="!isDark" @click="toggleDark()" />
        <IDark class="cursor-pointer" width="20" height="20" v-else @click="toggleDark()" />
      </div>
      <IBell class="typo-clr-primary cursor-pointer" width="24" height="24" />
      <div>
        <div class="w-8 h-8 rounded-50% overflow-hidden cursor-pointer">
          <img src="../assets/img/profile.jpg" alt="profile image" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts"></script>
