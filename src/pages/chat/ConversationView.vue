<template>
  <section
    class="flex flex-col surface-1 rounded-md border border-gray-2 dark:border-dark-3 h-full overflow-hidden"
    aria-label="Active conversation"
  >
    <header class="flex flex-wrap justify-between items-center border-b border-gray-2 dark:border-dark-3 p-3 typo-sm gap-2">
      <div class="flex gap-2.5 items-center">
        <button
          type="button"
          @click="$emit('back')"
          class="md:hidden px-2 py-1 rounded surface-2 typo-clr-base text-sm font-bold cursor-pointer hover:surface-3 focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
          aria-label="Back to contacts list"
        >
          ←
        </button>
        <img
          class="w-10 h-10 rounded-full object-cover border border-gray-2 dark:border-dark-3 shrink-0"
          :src="getProfileImageUrl(otherMember?.profile_image)"
          :alt="otherMember?.full_name ? `${otherMember.full_name}'s avatar` : ''"
        />
        <div class="flex flex-col items-start justify-center">
          <h2 class="font-medium typo-base typo-clr-base">{{ otherMember?.full_name ?? 'Contact' }}</h2>
          <span class="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>online
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Chip :status="true">Active</Chip>
        <span class="typo-clr-muted text-xs hidden sm:inline">{{ otherMember?.city || 'Cairo' }}, {{ otherMember?.country || 'Egypt' }}</span>
      </div>
    </header>

    <div class="grow relative min-h-200px">
      <!-- Loading skeleton -->
      <div
        v-if="isLoadingMessages"
        class="w-full h-full overflow-hidden flex flex-col-reverse gap-4 p-4 sm:p-6 absolute py-2 animate-pulse"
        aria-hidden="true"
      >
        <div class="max-w-[70%] self-start p-3 rounded-2xl rounded-bl-xs surface-2 h-11 w-48 opacity-75"></div>
        <div class="max-w-[70%] self-end p-3 rounded-2xl rounded-br-xs fill-primary-2 opacity-35 h-14 w-60"></div>
        <div class="max-w-[70%] self-start p-3 rounded-2xl rounded-bl-xs surface-2 h-10 w-40 opacity-60"></div>
      </div>

      <!-- Empty message state -->
      <div
        v-else-if="messages.length === 0"
        class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none"
      >
        <div class="w-12 h-12 rounded-full surface-2 border border-gray-2 dark:border-dark-3 flex items-center justify-center mb-3 typo-clr-muted">
          <ISend width="20" height="20" />
        </div>
        <p class="typo-head mb-1">No messages yet</p>
        <p class="typo-sm typo-clr-muted max-w-sm">
          Start the conversation with {{ otherMember?.full_name || 'this contact' }} by sending a message below.
        </p>
      </div>

      <TransitionGroup
        v-else
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        move-class="transition-all duration-200"
        tag="ul"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Conversation message history"
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

      <!-- Simulated Typing Indicator Bubble -->
      <Transition name="fade">
        <div
          v-if="isTyping"
          role="status"
          aria-live="polite"
          class="absolute bottom-3 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full surface-2 border border-gray-2 dark:border-dark-3 shadow-xs text-12px typo-clr-muted"
        >
          <span class="font-medium text-11px">{{ otherMember?.full_name || 'Contact' }} is typing</span>
          <span class="inline-flex gap-1.5 items-center" aria-hidden="true">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-5 dark:bg-violet-4 animate-typing-1"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-5 dark:bg-violet-4 animate-typing-2"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-5 dark:bg-violet-4 animate-typing-3"></span>
          </span>
        </div>
      </Transition>
    </div>

    <footer class="p-3 border-t border-gray-2 dark:border-dark-3">
      <form
        @submit.prevent="handleSend"
        class="flex items-center p-1.5 rounded-lg border border-gray-2 dark:border-dark-3 gap-2 surface-2 focus-within:(ring-2 ring-indigo-5 dark:ring-violet-5 border-transparent)"
      >
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          @change="handleFileChange"
          aria-hidden="true"
        />
        <button
          type="button"
          @click="triggerAttachment"
          aria-label="Add attachment"
          class="p-2 rounded surface-1 typo-clr-muted hover:typo-clr-base cursor-pointer transition focus:outline-none focus-visible:(ring-2 ring-indigo-5 dark:ring-violet-5)"
          title="Attach file (mock)"
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
          class="flex items-center gap-1.5 py-1.5 px-3.5 fill-primary-2 typo-clr-on-primary rounded-md font-medium typo-sm cursor-pointer transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:fill-primary-3 focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-indigo-5 dark:ring-violet-5)"
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
const isLoadingMessages = ref(true)
const isTyping = ref(false)
let unsubLive: (() => void) | null = null
let unsubTyping: (() => void) | null = null

async function loadMessages(conversationId: string) {
  isLoadingMessages.value = true
  try {
    messages.value = await chatService.getMessages(conversationId)
  } catch (err: any) {
    useMessage('error', err.message || 'Failed loading messages')
  } finally {
    isLoadingMessages.value = false
  }

  // Subscribe to realtime updates
  if (unsubLive) unsubLive()
  unsubLive = chatService.subscribeToMessages(conversationId, (newMsg) => {
    // Only add if not already in list
    if (!messages.value.some((m) => m.id === newMsg.id)) {
      messages.value.unshift(newMsg)
    }
  })

  // Subscribe to typing indicator
  if (unsubTyping) unsubTyping()
  unsubTyping = chatService.subscribeToTyping(conversationId, (status) => {
    isTyping.value = status
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
  if (unsubTyping) unsubTyping()
})

const formData = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerAttachment() {
  fileInputRef.value?.click()
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (file) {
    formData.value = `${formData.value ? formData.value + ' ' : ''}[Attachment: ${file.name}]`
    useMessage('info', `Attached "${file.name}"`)
  }
}

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
