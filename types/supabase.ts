export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: number
          created_at: string | null
          name: string | null
          email: string | null
          phone: string | null
          status: boolean | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          status?: boolean | null
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          status?: boolean | null
        }
      }
      orders: {
        Row: {
          id: number
          created_at: string | null
          owner: number
          type: string
          status: boolean | null
          purchases: number[]
        }
        Insert: {
          id?: number
          created_at?: string | null
          owner: number
          type: string
          status?: boolean | null
          purchases: number[]
        }
        Update: {
          id?: number
          created_at?: string | null
          owner?: number
          type?: string
          status?: boolean | null
          purchases?: number[]
        }
      }
      products: {
        Row: {
          id: number
          created_at: string | null
          name: string
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
          name: string
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
          name?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      products_published_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
    }
  }
}
