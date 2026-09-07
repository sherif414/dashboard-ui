<template>
  <RouterLink
    exact-active-class="surface-2! font-medium shadow-xs"
    :to="`/chat/${conversationId}`"
    class="transition-colors duration-150 grid grid-cols-[max-content_1fr] p2 px-4 gap-x-3 rounded-md mx-2 hover:surface-2"
  >
    <img
      class="w-10 self-center h-10 rounded-full overflow-hidden object-cover"
      :src="avatarLink"
      alt="avatar"
    />
    <div class="flex flex-col gap-2 justify-center typo-sm min-w-0">
      <h3 class="truncate">{{ title ?? 'user name' }}</h3>
      <div class="typo-clr-muted flex justify-between gap-4 min-w-0">
        <span class="truncate">
          <slot></slot>
        </span>
        <span class="shrink-0" v-if="lastMessageDate">
          {{ useTimeAgo(new Date(lastMessageDate)).value }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { getProfileImageUrl } from '~/services/imageUtils'

const { avatar = '' } = defineProps<{
  conversationId: string
  title?: string | null
  avatar?: string | null
  lastMessageDate?: string | null
}>()

const avatarLink = computed(() => getProfileImageUrl(avatar))
</script>
