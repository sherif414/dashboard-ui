import type { ConversationWithProfile, Message, Profile } from 'types'
import { mockDb } from './mock/mockDb'

export const chatService = {
  async getConversations(currentUserId: string): Promise<ConversationWithProfile[]> {
    return mockDb.getConversationsWithProfiles(currentUserId)
  },

  async getConversationById(id: string, currentUserId: string): Promise<ConversationWithProfile | null> {
    const all = mockDb.getConversationsWithProfiles(currentUserId)
    return all.find((c) => c.id === id) ?? null
  },

  async findExistingConversation(otherUserId: string, currentUserId: string): Promise<ConversationWithProfile | null> {
    const all = mockDb.getConversationsWithProfiles(currentUserId)
    const existing = all.find(
      (c) =>
        (c.created_by === currentUserId && c.other_member_id === otherUserId) ||
        (c.created_by === otherUserId && c.other_member_id === currentUserId)
    )
    return existing ?? null
  },

  async createConversation(currentUserId: string, otherUserId: string): Promise<ConversationWithProfile> {
    return mockDb.createConversation(currentUserId, otherUserId)
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return mockDb.getMessages(conversationId)
  },

  async sendMessage(conversationId: string, sentBy: string, content: string): Promise<Message> {
    return mockDb.sendMessage(conversationId, sentBy, content)
  },

  subscribeToMessages(conversationId: string, callback: (msg: Message) => void): () => void {
    return mockDb.on(`message:${conversationId}`, callback)
  },

  async searchProfiles(searchTerm: string, excludeUserId?: string): Promise<Profile[]> {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return []
    return mockDb.profiles
      .filter((p) => {
        if (excludeUserId && p.id === excludeUserId) return false
        return p.full_name?.toLowerCase().includes(term) || p.email?.toLowerCase().includes(term)
      })
      .slice(0, 10)
  },
}
