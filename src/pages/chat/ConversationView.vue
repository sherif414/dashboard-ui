<template>
  <section class="flex flex-col surface-1 rounded-md border border-gray-2 dark:border-dark-3 h-full overflow-hidden">
    <header class="flex flex-wrap justify-between items-center border-b border-gray-2 dark:border-dark-3 p-3 typo-sm gap-2">
      <div class="flex gap-2.5 items-center">
        <button
          type="button"
          @click="$emit('back')"
          class="md:hidden px-2 py-1 rounded surface-2 typo-clr-base text-sm font-bold cursor-pointer"
          aria-label="Back to contacts"
        >
          ←
        </button>
        <img class="w-10 h-10 rounded-full object-cover border border-gray-2 dark:border-dark-3" :src="getProfileImageUrl(otherMember?.profile_image)" :alt="`${otherMember?.full_name || 'Contact'}'s avatar`" />
        <div class="flex flex-col items-start justify-center">
          <h2 class="font-medium typo-base">{{ otherMember?.full_name ?? 'Contact' }}</h2>
          <span class="text-xs text-success flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-success"></span>online</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Chip :status="true">Active</Chip>
        <span class="typo-clr-muted text-xs hidden sm:inline">{{ otherMember?.city || 'Cairo' }}, {{ otherMember?.country || 'Egypt' }}</span>
      </div>
    </header>
    <div class="grow relative min-h-200px">
      <TransitionGroup
        enter-active-class="transition-all duration-300"
        enter-from-class="translate-y-2rem opacity-0"
        move-class="transition-all duration-300"
        tag="ul"
        class="w-full h-full overflow-y-auto flex flex-col-reverse gap-4 p-4 sm:p-6 absolute py-2"
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
    <footer class="p-3 border-t border-gray-2 dark:border-dark-3">
      <form
        @submit.prevent="handleSend"
        class="flex items-center p-1.5 rounded-lg border border-gray-2 dark:border-dark-3 gap-2 surface-2"
      >
        <button
          type="button"
          aria-label="Add attachment"
          class="p-2 rounded surface-1 typo-clr-muted hover:typo-clr-base cursor-pointer transition focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
        >
          <IAdd width="16" height="16" />
        </button>
        <input
          v-model="formData"
          type="text"
          aria-label="Type your message"
          placeholder="Type your message..."
          class="grow outline-none border-none bg-transparent px-2 typo-sm typo-clr-base"
        />
        <button
          type="submit"
          :disabled="!formData.trim()"
          class="flex items-center gap-1.5 py-1.5 px-3.5 fill-primary-2 typo-clr-on-primary rounded font-medium typo-sm cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed hover:fill-primary-3 focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-indigo-5 dark:ring-violet-5)"
        >
          <span>Send</span>
          <ISend width="14" height="14" />
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
import { IAdd, ISend } from '~/components/icons'

const props = defineProps<{
  data: ConversationWithProfile
}>()

const emit = defineEmits<{
  (e: 'back'): void
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
