<template>
  <RouterLink
    exact-active-class=" border-l-4 surface-2! border-l-indigo-5! dark:border-l-violet-5!"
    :to="`/chat/${conversationId}`"
    class="transition-all duration-300 grid grid-cols-[max-content_1fr] p2 px-4 gap-x-2"
  >
    <img
      class="w-10 self-center h-10 rounded-full overflow-hidden"
      :src="
        avatar ? avatarLink : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
      "
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
const { avatar = '' } = defineProps<{
  conversationId: string
  title?: string | null
  avatar?: string | null
  lastMessageDate?: string | null
}>()

let avatarLink = $computed(
  () => 'https://mcvcidxgqdmfkoctzgbl.supabase.co/storage/v1/object/public/profile-image/' + avatar
)
</script>
