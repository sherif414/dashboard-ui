import { mockDb } from '~/services/mock/mockDb'
import { authService } from '~/services/authService'
import type { Message } from 'types'

class MockQueryBuilder {
  private tableName: string
  private filters: ((item: any) => boolean)[] = []
  private sortFn: ((a: any, b: any) => number) | null = null
  private rangeFrom: number = 0
  private rangeTo: number = Infinity
  private limitCount: number = Infinity
  private isHead: boolean = false

  constructor(tableName: string) {
    this.tableName = tableName
  }

  private getTableData(): any[] {
    switch (this.tableName) {
      case 'customers':
        return mockDb.customers
      case 'products':
        return mockDb.products
      case 'orders':
        return mockDb.orders
      case 'order_item':
        return mockDb.order_items
      case 'conversation':
        return mockDb.conversations
      case 'conversation_member':
        return mockDb.conversation_members
      case 'message':
        return mockDb.messages
      case 'profiles':
        return mockDb.profiles
      default:
        return []
    }
  }

  select(_columns?: string, options?: { count?: string; head?: boolean }) {
    if (options?.head) this.isHead = true
    return this
  }

  eq(column: string, value: any) {
    this.filters.push((item) => {
      const itemVal = item[column]
      // Handle string vs number comparison
      if (typeof itemVal === 'number' && typeof value === 'string') return itemVal === +value
      if (typeof itemVal === 'string' && typeof value === 'number') return +itemVal === value
      return itemVal === value
    })
    return this
  }

  neq(column: string, value: any) {
    this.filters.push((item) => item[column] !== value)
    return this
  }

  filter(column: string, operator: string, value: any) {
    if (operator === 'eq') return this.eq(column, value)
    if (operator === 'neq') return this.neq(column, value)
    return this
  }

  textSearch(column: string, query: string) {
    const cleanQuery = query.replace(/[:*&]/g, ' ').trim().toLowerCase()
    const tokens = cleanQuery.split(/\s+/).filter(Boolean)
    if (tokens.length) {
      this.filters.push((item) => {
        const val = String(item[column] ?? '').toLowerCase()
        return tokens.every((token) => val.includes(token))
      })
    }
    return this
  }

  order(column: string, options: { ascending?: boolean; foreignTable?: string; nullsFirst?: boolean } = {}) {
    const ascending = options.ascending ?? true
    this.sortFn = (a, b) => {
      const valA = a[column]
      const valB = b[column]
      if (valA === valB) return 0
      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1
      if (typeof valA === 'string' && typeof valB === 'string') {
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
      return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1)
    }
    return this
  }

  range(from: number, to: number) {
    this.rangeFrom = from
    this.rangeTo = to
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  private resolveJoins(item: any): any {
    const cloned = { ...item }
    if (this.tableName === 'orders') {
      const customer = mockDb.getCustomer(cloned.owner)
      cloned.customers = customer ? { ...customer } : null
      cloned.order_item = mockDb.getOrderItems(cloned.id)
    } else if (this.tableName === 'order_item') {
      const product = mockDb.getProduct(cloned.product_id)
      cloned.products = product ? { ...product } : null
    } else if (this.tableName === 'conversation') {
      cloned.created_by_profile = mockDb.getProfile(cloned.created_by)
      cloned.other_member_profile = mockDb.getProfile(cloned.other_member_id)
    }
    return cloned
  }

  private executeQuery(): { data: any[]; count: number } {
    const raw = this.getTableData()
    let filtered = raw.filter((item) => this.filters.every((fn) => fn(item)))

    if (this.sortFn) {
      filtered.sort(this.sortFn)
    }

    const count = filtered.length

    if (this.isHead) {
      return { data: [], count }
    }

    let sliced = filtered.slice(this.rangeFrom, Math.min(this.rangeTo + 1, this.rangeFrom + this.limitCount))
    const withJoins = sliced.map((item) => this.resolveJoins(item))
    return { data: withJoins, count }
  }

  async then(resolve: (result: { data: any; count: number; error: any }) => any, reject?: (err: any) => any) {
    try {
      const { data, count } = this.executeQuery()
      return resolve({ data, count, error: null })
    } catch (e: any) {
      if (reject) return reject(e)
      return resolve({ data: null, count: 0, error: { message: e.message } })
    }
  }

  async single() {
    const { data } = this.executeQuery()
    if (data.length === 0) return { data: null, error: { message: 'Row not found' } }
    return { data: data[0], error: null }
  }

  async maybeSingle() {
    const { data } = this.executeQuery()
    return { data: data.length > 0 ? data[0] : null, error: null }
  }

  async insert(values: any | any[]) {
    const list = Array.isArray(values) ? values : [values]
    const insertedRows: any[] = []

    for (const val of list) {
      let inserted: any
      switch (this.tableName) {
        case 'customers':
          inserted = mockDb.insertCustomer(val)
          break
        case 'products':
          inserted = mockDb.insertProduct(val)
          break
        case 'orders':
          inserted = mockDb.insertOrder(val)
          break
        case 'order_item':
          mockDb.insertOrderItems([val])
          inserted = val
          break
        case 'conversation':
          inserted = mockDb.createConversation('user-demo-admin', val.other_member_id ?? 'user-contact-1', val.name)
          break
        case 'conversation_member':
          mockDb.conversation_members.push(val)
          mockDb.save()
          inserted = val
          break
        case 'message':
          inserted = mockDb.sendMessage(val.conversation_id, val.sent_by || 'user-demo-admin', val.content)
          break
        default:
          inserted = val
      }
      insertedRows.push(inserted)
    }

    return {
      data: Array.isArray(values) ? insertedRows : insertedRows[0],
      error: null,
      select: (_cols?: string) => ({
        single: async () => ({ data: insertedRows[0], error: null }),
        maybeSingle: async () => ({ data: insertedRows[0], error: null }),
        then: (res: any) => res({ data: Array.isArray(values) ? insertedRows : insertedRows[0], error: null }),
      }),
    }
  }

  async update(updates: any) {
    const targets = this.getTableData().filter((item) => this.filters.every((fn) => fn(item)))
    for (const target of targets) {
      Object.assign(target, updates)
    }
    mockDb.save()

    return {
      data: targets,
      error: null,
      eq: (col: string, val: any) => {
        this.eq(col, val)
        return this.update(updates)
      },
      select: (_cols?: string) => ({
        single: async () => ({ data: targets[0] ?? null, error: null }),
        maybeSingle: async () => ({ data: targets[0] ?? null, error: null }),
        then: (res: any) => res({ data: targets, error: null }),
      }),
    }
  }

  async delete() {
    return {
      eq: async (column: string, value: any) => {
        if (this.tableName === 'orders') {
          mockDb.deleteOrder(+value)
        } else if (this.tableName === 'order_item') {
          if (column === 'order_id') {
            const remaining = mockDb.order_items.filter((item) => item.order_id !== +value)
            mockDb.order_items.length = 0
            mockDb.order_items.push(...remaining)
            mockDb.save()
          }
        }
        return { error: null }
      },
    }
  }
}

export const supabase = {
  auth: {
    async signInWithPassword({ email, password }: { email: string; password?: string }) {
      const res = await authService.login(email, password)
      if ('error' in res) return { data: { user: null }, error: res.error }
      return { data: { user: res.user, session: { user: res.user } }, error: null }
    },
    async signUp({ email, password, options }: { email: string; password: string; options?: { data?: { full_name?: string } } }) {
      const fullName = options?.data?.full_name || email.split('@')[0]
      const res = await authService.signUp(email, password, fullName)
      return { data: { user: null }, error: res.error }
    },
    async signOut() {
      await authService.signOut()
      return { error: null }
    },
    async getUser() {
      const user = mockDb.users[0] ?? null
      return { data: { user }, error: null }
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      return authService.onAuthStateChange(callback)
    },
  },

  from(tableName: string) {
    return new MockQueryBuilder(tableName)
  },

  storage: {
    from(_bucketName: string) {
      return {
        upload: async (path: string, file: File) => {
          const dataUrl = await mockDb.fileToBase64(file)
          return { data: { path: dataUrl }, error: null }
        },
      }
    },
  },

  channel(channelName: string) {
    let unsubs: (() => void)[] = []
    return {
      on(_event: string, filter: any, callback: (payload: { new: Message }) => void) {
        // Extract conversation id if present: conversation_id=eq.conv-1
        const match = filter?.filter?.match(/conversation_id=eq\.([^,]+)/)
        const convId = match ? match[1] : null
        if (convId) {
          const unsub = mockDb.on(`message:${convId}`, (newMessage) => {
            callback({ new: newMessage })
          })
          unsubs.push(unsub)
        } else {
          const unsub = mockDb.on('message_any', (newMessage) => {
            callback({ new: newMessage })
          })
          unsubs.push(unsub)
        }
        return this
      },
      subscribe() {
        return this
      },
      unsubscribe() {
        unsubs.forEach((fn) => fn())
        unsubs = []
      },
    }
  },
}
