import type { Database } from './supabase'

export type MaybeArray<T> = T | T[]
export type ConversationWithProfile = Conversation & {
  created_by_profile: Profile | null
  other_member_profile: Profile | null
}

export type Order = Database['public']['Tables']['orders']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Customer = Database['public']['Tables']['customers']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Conversation = Database['public']['Tables']['conversation']['Row']
export type Message = Database['public']['Tables']['message']['Row']
export type ConversationMember = Database['public']['Tables']['conversation_member']['Row']
export type OrderItem = Database['public']['Tables']['order_item']['Row']

export interface ProductTable {
  id: number
  name: string | null
  created_at: string | null
  category: string | null
  stock: number | null
  sell_price: number | null
  delivery_type: string[] | null
  published: boolean | null
}

export interface OrderTable {
  id: number
  owner: number
  created_at: string | null
  type: string
  status: boolean | null
  purchases: number[]
}

export interface CustomerTable {
  id: number
  name: string | null
  email: string | null
  created_at: string | null
  phone: string | null
  status: boolean | null
}

export interface getTableDataParams {
  itemsPerPage: number
  page: number
  orderOptions: { column: string; foreignTable: string; ascending: boolean }
}
