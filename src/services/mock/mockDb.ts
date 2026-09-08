import type {
  Customer,
  Order,
  OrderItem,
  Product,
  Profile,
  User,
  Conversation,
  ConversationMember,
  Message,
  ConversationWithProfile,
} from 'types'
import {
  defaultUser,
  seedProfiles,
  seedCustomers,
  seedProducts,
  seedOrders,
  seedOrderItems,
  seedConversations,
  seedConversationMembers,
  seedMessages,
} from './seedData'

interface DbSchema {
  version: number
  users: User[]
  profiles: Profile[]
  customers: Customer[]
  products: Product[]
  orders: Order[]
  order_items: OrderItem[]
  conversations: Conversation[]
  conversation_members: ConversationMember[]
  messages: Message[]
}

const DB_STORAGE_KEY = 'dashboard_mock_db_v1'

class MockDatabase {
  private data: DbSchema
  private listeners: Map<string, Set<(payload: any) => void>> = new Map()

  constructor() {
    this.data = this.loadFromStorage()
  }

  private loadFromStorage(): DbSchema {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY)
      if (stored) {
        const parsed: DbSchema = JSON.parse(stored)
        if (Array.isArray(parsed.users)) {
          parsed.users.forEach((u) => {
            if (!u.password && u.email?.toLowerCase() === 'admin@admin.com') {
              u.password = 'password'
            }
          })
        }
        return parsed
      }
    } catch (e) {
      console.warn('Failed to load mock DB from localStorage, using initial seeds:', e)
    }
    return this.initSeedData()
  }

  private initSeedData(): DbSchema {
    const initial: DbSchema = {
      version: 1,
      users: [defaultUser],
      profiles: [...seedProfiles],
      customers: [...seedCustomers],
      products: [...seedProducts],
      orders: [...seedOrders],
      order_items: [...seedOrderItems],
      conversations: [...seedConversations],
      conversation_members: [...seedConversationMembers],
      messages: [...seedMessages],
    }
    this.persist(initial)
    return initial
  }

  private persist(data: DbSchema = this.data) {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to persist mock DB to localStorage:', e)
    }
  }

  public resetToSeedData(): DbSchema {
    this.data = this.initSeedData()
    this.emit('db_reset', {})
    return this.data
  }

  // Event bus for pub/sub (used by realtime chat)
  public on(event: string, callback: (payload: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  public emit(event: string, payload: any) {
    const set = this.listeners.get(event)
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload)
        } catch (err) {
          console.error(`Error in listener for event ${event}:`, err)
        }
      })
    }
  }

  // --- Image / File Storage Mock ---
  public async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  // --- Tables access ---
  public get users(): User[] {
    return this.data.users
  }
  public get profiles(): Profile[] {
    return this.data.profiles
  }
  public get customers(): Customer[] {
    return this.data.customers
  }
  public get products(): Product[] {
    return this.data.products
  }
  public get orders(): Order[] {
    return this.data.orders
  }
  public get order_items(): OrderItem[] {
    return this.data.order_items
  }
  public get conversations(): Conversation[] {
    return this.data.conversations
  }
  public get conversation_members(): ConversationMember[] {
    return this.data.conversation_members
  }
  public get messages(): Message[] {
    return this.data.messages
  }

  public save() {
    this.persist()
  }

  // --- Customers ---
  public getCustomer(id: number): Customer | null {
    return this.data.customers.find((c) => c.id === id) ?? null
  }

  public insertCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Customer {
    const maxId = this.data.customers.reduce((max, c) => Math.max(max, c.id), 0)
    const newCustomer: Customer = {
      ...customer,
      id: maxId + 1,
      created_at: new Date().toISOString(),
      status: customer.status ?? true,
    }
    this.data.customers.unshift(newCustomer)
    this.save()
    return newCustomer
  }

  public updateCustomer(id: number, updates: Partial<Customer>): Customer | null {
    const customer = this.getCustomer(id)
    if (!customer) return null
    Object.assign(customer, updates)
    this.save()
    return customer
  }

  // --- Products ---
  public getProduct(id: number): Product | null {
    return this.data.products.find((p) => p.id === id) ?? null
  }

  public insertProduct(product: Omit<Product, 'id' | 'created_at'>): Product {
    const maxId = this.data.products.reduce((max, p) => Math.max(max, p.id), 0)
    const newProduct: Product = {
      ...product,
      id: maxId + 1,
      created_at: new Date().toISOString(),
      published: product.published ?? true,
    }
    this.data.products.unshift(newProduct)
    this.save()
    return newProduct
  }

  public updateProduct(id: number, updates: Partial<Product>): Product | null {
    const product = this.getProduct(id)
    if (!product) return null
    Object.assign(product, updates)
    this.save()
    return product
  }

  // --- Orders & Items ---
  public getOrder(id: number): Order | null {
    return this.data.orders.find((o) => o.id === id) ?? null
  }

  public insertOrder(order: Omit<Order, 'id' | 'created_at'> & { created_at?: string | null }): Order {
    const maxId = this.data.orders.reduce((max, o) => Math.max(max, o.id), 1000)
    const newOrder: Order = {
      ...order,
      id: maxId + 1,
      created_at: order.created_at || new Date().toISOString(),
    }
    this.data.orders.unshift(newOrder)
    this.save()
    return newOrder
  }

  public updateOrder(id: number, updates: Partial<Order>): Order | null {
    const order = this.getOrder(id)
    if (!order) return null
    Object.assign(order, updates)
    this.save()
    return order
  }

  public deleteOrder(id: number): boolean {
    const orderIndex = this.data.orders.findIndex((o) => o.id === id)
    if (orderIndex === -1) return false
    this.data.orders.splice(orderIndex, 1)
    // Cascade delete order items
    this.data.order_items = this.data.order_items.filter((item) => item.order_id !== id)
    this.save()
    return true
  }

  public insertOrderItems(items: OrderItem[]) {
    this.data.order_items.push(...items)
    this.save()
  }

  public getOrderItems(orderId: number): (OrderItem & { products: Product })[] {
    return this.data.order_items
      .filter((item) => item.order_id === orderId)
      .map((item) => {
        const product = this.getProduct(item.product_id) || {
          id: item.product_id,
          name: 'Unknown Product',
          sell_price: 0,
          cost_price: 0,
          stock: 0,
          published: false,
          created_at: null,
          category: null,
          discount_type: null,
          discount_value: null,
          description: null,
          expiration_date: null,
          image: null,
          additional_images: null,
          delivery_type: null,
        }
        return {
          ...item,
          products: product,
        }
      })
  }

  // --- Conversations & Messages ---
  public getConversationsWithProfiles(currentUserId: string): ConversationWithProfile[] {
    return this.data.conversations.map((conv) => {
      const created_by_profile = this.data.profiles.find((p) => p.id === conv.created_by) ?? null
      const other_member_profile = this.data.profiles.find((p) => p.id === conv.other_member_id) ?? null
      return {
        ...conv,
        created_by_profile,
        other_member_profile,
      }
    })
  }

  public getConversation(id: string): Conversation | null {
    return this.data.conversations.find((c) => c.id === id) ?? null
  }

  public createConversation(createdBy: string, otherMemberId: string, name: string = 'Conversation'): ConversationWithProfile {
    const newConv: Conversation = {
      id: 'conv-' + Date.now(),
      name,
      created_by: createdBy,
      other_member_id: otherMemberId,
      created_at: new Date().toISOString(),
      last_message_content: null,
      last_message_at: new Date().toISOString(),
    }
    this.data.conversations.unshift(newConv)
    this.data.conversation_members.push(
      { user_id: createdBy, conversation_id: newConv.id, joined_at: new Date().toISOString(), left_at: null },
      { user_id: otherMemberId, conversation_id: newConv.id, joined_at: new Date().toISOString(), left_at: null }
    )
    this.save()

    const created_by_profile = this.data.profiles.find((p) => p.id === createdBy) ?? null
    const other_member_profile = this.data.profiles.find((p) => p.id === otherMemberId) ?? null
    return {
      ...newConv,
      created_by_profile,
      other_member_profile,
    }
  }

  public getMessages(conversationId: string): Message[] {
    return this.data.messages
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
  }

  public sendMessage(conversationId: string, sentBy: string, content: string): Message {
    const newMessage: Message = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      conversation_id: conversationId,
      sent_by: sentBy,
      content,
      created_at: new Date().toISOString(),
    }
    this.data.messages.push(newMessage)

    // Update conversation last message
    const conv = this.getConversation(conversationId)
    if (conv) {
      conv.last_message_content = content
      conv.last_message_at = newMessage.created_at
    }
    this.save()

    // Emit live message event
    this.emit(`message:${conversationId}`, newMessage)
    this.emit('message_any', newMessage)

    // Interactive Demo feature: Trigger simulated auto-reply from contact after 1.2 seconds
    if (conv && sentBy === conv.created_by) {
      const contactId = conv.other_member_id
      if (contactId && contactId !== sentBy) {
        this.scheduleSimulatedReply(conversationId, contactId, content)
      }
    }

    return newMessage
  }

  private scheduleSimulatedReply(conversationId: string, responderId: string, userMessage: string) {
    setTimeout(() => {
      this.emit(`typing:${conversationId}`, true)
    }, 350)

    setTimeout(() => {
      this.emit(`typing:${conversationId}`, false)
      const replies = [
        'Thanks for reaching out! I will check this right away.',
        'Got it. Everything looks good on our end!',
        'Understood! I will update the order details accordingly.',
        'Perfect, thank you for following up!',
        'I am on it. Will let you know once it is processed.',
      ]
      const randomReply = replies[Math.floor(Math.random() * replies.length)]
      const replyMsg: Message = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        conversation_id: conversationId,
        sent_by: responderId,
        content: randomReply,
        created_at: new Date().toISOString(),
      }
      this.data.messages.push(replyMsg)

      const conv = this.getConversation(conversationId)
      if (conv) {
        conv.last_message_content = randomReply
        conv.last_message_at = replyMsg.created_at
      }
      this.save()

      this.emit(`message:${conversationId}`, replyMsg)
      this.emit('message_any', replyMsg)
    }, 1550)
  }

  // --- Auth & Profiles ---
  public getProfile(userId: string): Profile | null {
    return this.data.profiles.find((p) => p.id === userId) ?? null
  }

  public updateProfile(userId: string, updates: Partial<Profile>): Profile | null {
    let profile = this.getProfile(userId)
    if (!profile) {
      profile = {
        id: userId,
        full_name: 'Demo User',
        profile_image: null,
        email: null,
        phone_number: null,
        address: null,
        city: null,
        country: null,
        state: null,
      }
      this.data.profiles.push(profile)
    }
    Object.assign(profile, updates)
    this.save()
    return profile
  }

  public updateUserPassword(userId: string, newPassword: string): boolean {
    const user = this.data.users.find((u) => u.id === userId)
    if (!user) return false
    user.password = newPassword
    this.save()
    return true
  }
}

export const mockDb = new MockDatabase()
