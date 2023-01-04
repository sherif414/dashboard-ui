<template>
  <SideBar v-if="publicPage" />

  <div class="grow grid grid-rows-[max-content_1fr]">
    <TheHeader v-if="publicPage" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './store/auth'

const auth = useAuthStore()
const route = useRoute()

let publicPage = $computed(() => !auth.publicPages.includes(route.fullPath))
</script>
