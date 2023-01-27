<template>
  <section class="flex flex-col surface-1 rounded-md col-span-2">
    <header class="flex justify-between items-center border-b border-b-gray-2 dark:border-b-dark-3 p-2 typo-sm">
      <div class="flex gap-2">
        <img class="w-14 h-14 rounded-full" src="../../assets/img/profile.jpg" alt="profile image" />
        <div class="flex flex-col gap-2 items-start justify-center">
          <h2>{{ otherMember?.full_name }}</h2>
          <h3>online <span class="typo-clr-muted">10:30 pm</span></h3>
        </div>
      </div>
      <div class="grid grid-cols-[max-content_max-content] grid-rows-2 gap-2 items-center justify-between">
        <Chip status>New Customer</Chip>
        <a class="typo-clr-primary" href="#">view profile</a>
        <span class="flex items-center gap-2 row-start-2 col-start-2"
          ><IShoppingBag width="14" height="14" />0 orders</span
        >
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
          v-if="messages"
          v-for="msg in messages"
          :is-from-me="me?.id === msg.sent_by"
          :time="msg.created_at ?? ''"
          :key="msg.id"
        >
          {{ msg.content }}
        </ConversationMessage>
      </TransitionGroup>
    </div>
    <footer class="p-2">
      <form
        @submit.prevent="handleSend(formData)"
        class="flex items-stretch p1 rounded-lg border border-gray-2 dark:border-dark-3 gap-4"
      >
        <button type="button" class="bg-accent-3 rounded-md grid place-items-center px-4 text-gray-9">
          <IAdd width="16" height="16" />
        </button>
        <input
          v-model="formData"
          type="text"
          placeholder="your message"
          class="grow outline-none! border-none! bg-inherit"
        />
        <button type="submit" class="flex items-center gap-2 p-2 px-3 bg-accent-3 rounded-md text-gray-9">
          <span>Send</span>
          <ISend width="16" height="16" />
        </button>
      </form>
    </footer>
  </section>
</template>

<script setup lang="ts">
import type { Message, ConversationWithProfile } from 'types'

const { data } = defineProps<{
  data: ConversationWithProfile
}>()

const auth = useAuthStore()

const me = $computed(() =>
  data.created_by_profile?.id === auth.profile?.id ? data.created_by_profile : data.other_member_profile
)
const otherMember = $computed(() =>
  data.created_by_profile?.id !== auth.profile?.id ? data.created_by_profile : data.other_member_profile
)

let messages = $ref<Message[] | null>(null)
async function getMessages() {
  const { data: msgs, error } = await supabase
    .from('message')
    .select('*')
    .eq('conversation_id', data.id)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) useMessage('error', error.message ?? 'message failed')
  messages = msgs
}
getMessages()

// realtime
const messagesChannel = supabase.channel(`public:message:conversation_id=eq.${data.id}`)

messagesChannel.on(
  'postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'message', filter: `conversation_id=eq.${data.id}` },
  ({ new: newMessage }) => {
    messages?.unshift(newMessage as Message)
  }
)
messagesChannel.subscribe()

onUnmounted(() => {
  messagesChannel.unsubscribe()
})

// inserting messages
let formData = $ref('')

async function handleSend(content: string) {
  formData = ''
  const { error } = await supabase.from('message').insert({
    content: content,
    conversation_id: data.id,
  })
  if (error) useMessage('error', error.message ?? 'message failed')
}
</script>
