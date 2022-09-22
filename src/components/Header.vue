<script setup lang="ts"></script>

<template>
  <header class="surface fixed w-screen z-12 top-0 left-0 flex items-center h-3rem pl-20">
    <h1 class="text-6 capitalize">dashboard</h1>
    <button @click="toggleDark()" class="ml-auto mr-4">
      {{ isDark }}
    </button>
  </header>
</template>
