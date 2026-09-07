import type { Customer, getTableDataParams, Order, OrderItem, Product } from 'types'
import { mockDb } from './mock/mockDb'

export interface OrderWithCustomer extends Order {
  customers: { name: string | null } | null
}

export interface OrderDetailsResponse extends Order {
  customers: Customer | null
  order_item: (OrderItem & { products: Product })[]
}

export interface RecentOrderItem {
  products: { id: number; name: string | null; sell_price: number | null; image: string | null } | null
  status: string | null
  created_at: string | null
}

export const orderService = {
  async getOrders({ orderOptions, itemsPerPage, page }: getTableDataParams): Promise<{ data: OrderWithCustomer[]; count: number }> {
    let list = [...mockDb.orders]

    // Sorting
    const { column, ascending } = orderOptions
    if (column) {
      list.sort((a: any, b: any) => {
        const valA = a[column]
        const valB = b[column]
        if (valA === valB) return 0
        if (valA === null || valA === undefined) return 1
        if (valB === null || valB === undefined) return -1
        if (typeof valA === 'string' && typeof valB === 'string') {
          return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1)
      })
    }

    const count = list.length
    const from = (page - 1) * itemsPerPage
    const paginated = list.slice(from, from + itemsPerPage).map((order) => {
      const customer = mockDb.getCustomer(order.owner)
      return {
        ...order,
        customers: customer ? { name: customer.name } : null,
      }
    })

    return { data: paginated, count }
  },

  async getOrderById(id: number): Promise<OrderDetailsResponse | null> {
    const order = mockDb.getOrder(id)
    if (!order) return null

    const customer = mockDb.getCustomer(order.owner)
    const order_item = mockDb.getOrderItems(order.id)

    return {
      ...order,
      customers: customer,
      order_item,
    }
  },

  async createOrder(
    orderData: {
      owner: number
      type: string
      status: string
      note?: string | null
      created_at?: string
      total_purchases: number
    },
    items: Omit<OrderItem, 'order_id' | 'created_at'>[]
  ): Promise<{ data: Order | null; error: null | { message: string } }> {
    try {
      const newOrder = mockDb.insertOrder({
        owner: orderData.owner,
        type: orderData.type,
        status: orderData.status,
        note: orderData.note ?? null,
        created_at: orderData.created_at || new Date().toISOString(),
        total_purchases: orderData.total_purchases,
      })

      const orderItems: OrderItem[] = items.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        discount: item.discount ?? null,
        status: item.status ?? newOrder.status,
        created_at: newOrder.created_at,
      }))

      mockDb.insertOrderItems(orderItems)

      return { data: newOrder, error: null }
    } catch (e: any) {
      return { data: null, error: { message: e.message || 'Failed to create order' } }
    }
  },

  async updateOrderStatus(id: number, status: string): Promise<{ data: Order | null; error: null | { message: string } }> {
    const order = mockDb.getOrder(id)
    if (!order) return { data: null, error: { message: 'Order not found' } }

    const updated = mockDb.updateOrder(id, { status })
    // Also update order items status
    mockDb.order_items.forEach((item) => {
      if (item.order_id === id) item.status = status
    })
    mockDb.save()

    return { data: updated, error: null }
  },

  async deleteOrder(id: number): Promise<{ success: boolean; error: null | { message: string } }> {
    const success = mockDb.deleteOrder(id)
    if (!success) return { success: false, error: { message: 'Order could not be found or deleted' } }
    return { success: true, error: null }
  },

  async getRecentOrders(limit: number = 20): Promise<RecentOrderItem[]> {
    const sortedItems = [...mockDb.order_items].sort(
      (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    )

    return sortedItems.slice(0, limit).map((item) => {
      const product = mockDb.getProduct(item.product_id)
      return {
        products: product
          ? {
              id: product.id,
              name: product.name,
              sell_price: product.sell_price,
              image: product.image,
            }
          : null,
        status: item.status,
        created_at: item.created_at,
      }
    })
  },
}
