<template>
  <RouterLink
    exact-active-class="surface-2! font-medium shadow-xs ring-1 ring-indigo-5/30 dark:ring-violet-5/30 text-indigo-600 dark:text-violet-400"
    :to="`/chat/${conversationId}`"
    class="transition-all duration-150 grid grid-cols-[max-content_1fr] p2 px-3 gap-x-3 rounded-md mx-2 hover:surface-2 group focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
    :aria-label="`Chat with ${title ?? 'Contact'}`"
  >
    <img
      class="w-10 self-center h-10 rounded-full overflow-hidden object-cover border border-gray-2 dark:border-dark-3 shrink-0"
      :src="avatarLink"
      :alt="title ? `${title}'s avatar` : ''"
    />
    <div class="flex flex-col gap-1 justify-center typo-sm min-w-0">
      <div class="flex justify-between items-center gap-2 min-w-0">
        <h3 class="truncate font-medium typo-clr-base">{{ title ?? 'User' }}</h3>
        <span class="shrink-0 text-11px typo-clr-muted tabular-nums" v-if="relativeTime">
          {{ relativeTime }}
        </span>
      </div>
      <div class="typo-clr-muted text-xs truncate">
        <slot></slot>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getProfileImageUrl } from '~/services/imageUtils'

const props = defineProps<{
  conversationId: string
  title?: string | null
  avatar?: string | null
  lastMessageDate?: string | null
}>()

const avatarLink = computed(() => getProfileImageUrl(props.avatar))

const relativeTime = computed(() => {
  if (!props.lastMessageDate) return ''
  try {
    const d = new Date(props.lastMessageDate)
    if (isNaN(d.getTime())) return ''
    const now = Date.now()
    const diffMs = now - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
})
</script>
