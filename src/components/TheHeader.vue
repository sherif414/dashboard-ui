<script setup lang="ts"></script>

<template>
  <header class="surface-1 fixed w-screen z-99 top-0 left-0 pl-4rem h-58px flex flex-col shadow">
    <div class="p1 pl-4 grow flex items-center">
      <h1 class="text-5 capitalize font-bold">{{ $route.matched[0]?.name }}</h1>
    </div>
  </header>
</template>
