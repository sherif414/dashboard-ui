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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import SideBar from '~/components/SideBar.vue'
import TheHeader from '~/components/TheHeader.vue'

const auth = useAuthStore()
const route = useRoute()

const publicPage = computed(() => !auth.publicPages.includes(route.fullPath))
</script>
