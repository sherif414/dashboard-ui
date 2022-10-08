<script setup lang="ts"></script>

<template>
  <header class="surface-1 fixed w-screen z-10 top-0 left-0 flex items-center h-4rem px-20">
    <h1 class="text-6 capitalize">matrix dashboard</h1>
    <button @click="toggleDark()" class="ml-auto mr-4">
      {{ isDark }}
    </button>
  </header>
</template>
