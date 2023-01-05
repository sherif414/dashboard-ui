export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      conversation: {
        Row: {
          id: string
          created_at: string | null
          name: string | null
          created_by: string | null
          other_member_id: string | null
          last_message_content: string | null
          last_message_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          name?: string | null
          created_by?: string | null
          other_member_id?: string | null
          last_message_content?: string | null
          last_message_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string | null
          created_by?: string | null
          other_member_id?: string | null
          last_message_content?: string | null
          last_message_at?: string | null
        }
      }
      conversation_member: {
        Row: {
          user_id: string
          joined_at: string | null
          conversation_id: string
          left_at: string | null
        }
        Insert: {
          user_id: string
          joined_at?: string | null
          conversation_id: string
          left_at?: string | null
        }
        Update: {
          user_id?: string
          joined_at?: string | null
          conversation_id?: string
          left_at?: string | null
        }
      }
      customers: {
        Row: {
          id: number
          created_at: string | null
          name: string | null
          phone: string | null
          status: boolean | null
          email: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          name?: string | null
          phone?: string | null
          status?: boolean | null
          email?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string | null
          phone?: string | null
          status?: boolean | null
          email?: string | null
        }
      }
      message: {
        Row: {
          created_at: string | null
          sent_by: string | null
          content: string
          conversation_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          sent_by?: string | null
          content: string
          conversation_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          sent_by?: string | null
          content?: string
          conversation_id?: string
          id?: string
        }
      }
      order_item: {
        Row: {
          order_id: number
          product_id: number
          quantity: number | null
          discount: number | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          order_id?: number
          product_id: number
          quantity?: number | null
          discount?: number | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          order_id?: number
          product_id?: number
          quantity?: number | null
          discount?: number | null
          status?: string | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: number
          owner: number
          type: string | null
          status: string | null
          note: string | null
          total_purchases: number | null
          created_at: string | null
        }
        Insert: {
          id?: number
          owner: number
          type?: string | null
          status?: string | null
          note?: string | null
          total_purchases?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          owner?: number
          type?: string | null
          status?: string | null
          note?: string | null
          total_purchases?: number | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
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
        Insert: {
          id?: number
          created_at?: string | null
          name?: string | null
          stock?: number | null
          published?: boolean
          category?: string | null
          sell_price?: number | null
          cost_price?: number | null
          discount_type?: string | null
          discount_value?: number | null
          description?: string | null
          expiration_date?: string | null
          image?: string | null
          additional_images?: string[] | null
          delivery_type?: string[] | null
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string | null
          stock?: number | null
          published?: boolean
          category?: string | null
          sell_price?: number | null
          cost_price?: number | null
          discount_type?: string | null
          discount_value?: number | null
          description?: string | null
          expiration_date?: string | null
          image?: string | null
          additional_images?: string[] | null
          delivery_type?: string[] | null
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          profile_image: string | null
          email: string | null
          phone_number: number | null
          address: string | null
          city: string | null
          country: string | null
          state: string | null
        }
        Insert: {
          id: string
          full_name: string
          profile_image?: string | null
          email?: string | null
          phone_number?: number | null
          address?: string | null
          city?: string | null
          country?: string | null
          state?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          profile_image?: string | null
          email?: string | null
          phone_number?: number | null
          address?: string | null
          city?: string | null
          country?: string | null
          state?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_conversation_member: {
        Args: { user_id: string; conversation_id: string }
        Returns: boolean
      }
      products_published_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      continents: 'Africa' | 'Antarctica' | 'Asia' | 'Europe' | 'Oceania' | 'North America' | 'South America'
    }
  }
}
