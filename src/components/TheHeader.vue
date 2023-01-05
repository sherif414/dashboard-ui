<template>
  <header class="surface-1 h-58px flex px-8 items-center">
    <div class="p1 grow flex items-center">
      <h1 class="text-5 capitalize font-bold">{{ $route.matched[0]?.name }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <div>
        <ISun class="cursor-pointer" width="20" height="20" v-if="!isDark" @click="toggleDark()" />
        <IDark class="cursor-pointer" width="20" height="20" v-else @click="toggleDark()" />
      </div>
      <div>
        <img
          :title="auth.profile?.full_name || ''"
          class="w-8 h-8 rounded-50% cursor-pointer"
          :src="profileImg || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'"
          alt="avatar"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const auth = useAuthStore()
auth.getProfile()
let profileImg = $ref('')

if (auth.profile?.profile_image) {
  profileImg =
    'https://mcvcidxgqdmfkoctzgbl.supabase.co/storage/v1/object/public/profile-image/' + auth.profile.profile_image
}
</script>
