<template>
  <section class="flex flex-col surface-1 rounded-md col-span-2">
    <header class="flex justify-between items-center border-b border-b-gray-2 dark:border-b-dark-3 p-2 typo-sm">
      <div class="flex gap-2 items-center">
        <img class="w-12 h-12 rounded-full object-cover" :src="getProfileImageUrl(otherMember?.profile_image)" alt="profile image" />
        <div class="flex flex-col gap-1 items-start justify-center">
          <h2 class="font-medium typo-base">{{ otherMember?.full_name ?? 'Contact' }}</h2>
          <h3 class="text-xs text-success">online <span class="typo-clr-muted text-xs">now</span></h3>
        </div>
      </div>
      <div class="grid grid-cols-[max-content_max-content] grid-rows-2 gap-2 items-center justify-between">
        <Chip :status="true">Active Contact</Chip>
        <span class="typo-clr-muted text-xs">{{ otherMember?.city || 'Cairo' }}, {{ otherMember?.country || 'Egypt' }}</span>
        <span class="flex items-center gap-2 row-start-2 col-start-2 typo-clr-muted text-xs">
          <IShoppingBag width="14" height="14" /> {{ otherMember?.phone_number ? '+' + otherMember.phone_number : 'Direct message' }}
        </span>
      </div>
    </header>
    <div class="grow relative">
      <TransitionGroup
        enter-active-class="transition-all duration-300"
        enter-from-class="translate-y-2rem opacity-0"
        move-class="transition-all duration-300"
        tag="ul"
        class="w-full h-full overflow-y-auto flex flex-col-reverse gap-6 p-8 absolute py-2"
      >
        <ConversationMessage
          v-for="msg in messages"
          :is-from-me="auth.profile?.id === msg.sent_by"
          :time="msg.created_at ?? ''"
          :key="msg.id"
        >
          {{ msg.content }}
        </ConversationMessage>
      </TransitionGroup>
    </div>
    <footer class="p-2">
      <form
        @submit.prevent="handleSend"
        class="flex items-stretch p1 rounded-lg border border-gray-2 dark:border-dark-3 gap-4"
      >
        <button type="button" class="bg-accent-3 rounded-md grid place-items-center px-4 text-gray-9">
          <IAdd width="16" height="16" />
        </button>
        <input
          v-model="formData"
          type="text"
          placeholder="Type your message..."
          class="grow outline-none! border-none! bg-inherit px-2"
        />
        <button type="submit" class="flex items-center gap-2 p-2 px-3 bg-accent-3 rounded-md text-gray-9 cursor-pointer hover:opacity-90">
          <span>Send</span>
          <ISend width="16" height="16" />
        </button>
      </form>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { Message, ConversationWithProfile } from 'types'
import { useAuthStore } from '~/store/auth'
import { chatService } from '~/services/chatService'
import { getProfileImageUrl } from '~/services/imageUtils'
import { useMessage } from '~/composables/message'
import Chip from '~/components/Chip.vue'
import ConversationMessage from '~/components/ConversationMessage.vue'
import { IShoppingBag, IAdd, ISend } from '~/components/icons'

const props = defineProps<{
  data: ConversationWithProfile
}>()

const auth = useAuthStore()

const otherMember = computed(() =>
  props.data.created_by_profile?.id !== auth.profile?.id ? props.data.created_by_profile : props.data.other_member_profile
)

const messages = ref<Message[]>([])
let unsubLive: (() => void) | null = null

async function loadMessages(conversationId: string) {
  try {
    messages.value = await chatService.getMessages(conversationId)
  } catch (err: any) {
    useMessage('error', err.message || 'Failed loading messages')
  }

  // Subscribe to realtime updates
  if (unsubLive) unsubLive()
  unsubLive = chatService.subscribeToMessages(conversationId, (newMsg) => {
    // Only add if not already in list
    if (!messages.value.some((m) => m.id === newMsg.id)) {
      messages.value.unshift(newMsg)
    }
  })
}

watch(
  () => props.data.id,
  (newId) => {
    if (newId) loadMessages(newId)
  },
  { immediate: true }
)

onUnmounted(() => {
  if (unsubLive) unsubLive()
})

const formData = ref('')

async function handleSend() {
  const content = formData.value.trim()
  if (!content) return
  formData.value = ''

  const sentBy = auth.profile?.id || 'user-demo-admin'
  const newMsg = await chatService.sendMessage(props.data.id, sentBy, content)
  if (!messages.value.some((m) => m.id === newMsg.id)) {
    messages.value.unshift(newMsg)
  }
}
</script>
