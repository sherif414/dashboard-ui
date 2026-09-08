export type MaybeArray<T> = T | T[]

export interface User {
  id: string
  email?: string
  password?: string
  user_metadata?: {
    full_name?: string
    [key: string]: any
  }
  created_at?: string
}

export interface Profile {
  id: string
  full_name: string
  profile_image: string | null
  email: string | null
  phone_number: number | string | null
  address: string | null
  city: string | null
  country: string | null
  state: string | null
}

export interface Customer {
  id: number
  created_at: string | null
  name: string | null
  phone: string | null
  status: boolean | null
  email: string | null
}

export interface CustomerTable {
  id: number
  name: string | null
  email: string | null
  created_at: string | null
  phone: string | null
  status: boolean | null
}

export interface Product {
  id: number
  created_at: string | null
  name: string | null
  stock: number | null
  published: boolean
  category: string | null
  sell_price: number | null
  cost_price: number | null
  discount_type: string | null
  discount_value: number | null
  description: string | null
  expiration_date: string | null
  image: string | null
  additional_images: string[] | null
  delivery_type: string[] | null
}

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

export interface Order {
  id: number
  owner: number
  type: string | null
  status: string | null
  note: string | null
  total_purchases: number | null
  created_at: string | null
}

export interface OrderTable {
  id: number
  owner: number
  created_at: string | null
  type: string
  status: boolean | null
  purchases: number[]
}

export interface OrderItem {
  order_id: number
  product_id: number
  quantity: number | null
  discount: number | null
  status: string | null
  created_at: string | null
  products?: Product
}

export interface Conversation {
  id: string
  created_at: string | null
  name: string | null
  created_by: string | null
  other_member_id: string | null
  last_message_content: string | null
  last_message_at: string | null
}

export interface ConversationMember {
  user_id: string
  joined_at: string | null
  conversation_id: string
  left_at: string | null
}

export interface Message {
  id: string
  conversation_id: string
  sent_by: string | null
  content: string
  created_at: string | null
}

export type ConversationWithProfile = Conversation & {
  created_by_profile: Profile | null
  other_member_profile: Profile | null
}

export interface getTableDataParams {
  itemsPerPage: number
  page: number
  orderOptions: { column: string; foreignTable: string; ascending: boolean }
}
