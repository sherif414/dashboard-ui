import type { Customer, getTableDataParams, Order, OrderItem, Product } from 'types'
import { mockDb } from './mock/mockDb'
import { simulateLatency } from './delay'

export interface OrderWithCustomer extends Order {
  customers: { name: string | null; email?: string | null; phone?: string | null } | null
  itemsCount?: number
}

export interface OrderDetailsResponse extends Order {
  customers: Customer | null
  order_item: (OrderItem & { products: Product })[]
}

export interface RecentOrderItem {
  order_id: number
  products: { id: number; name: string | null; sell_price: number | null; image: string | null } | null
  status: string | null
  created_at: string | null
}

export interface DashboardMetrics {
  totalRevenue: number
  salesVolume: number
  allOrdersCount: number
  pendingCount: number
  completedCount: number
  cancelledCount: number
  revenueDelta: {
    percentage: number
    isPositive: boolean
    formatted: string
  }
  unitsDelta: {
    percentage: number
    isPositive: boolean
    formatted: string
  }
  inStockPct: number
  velocityPoints: { time: string; amount: number; orderId: number }[]
  topProducts: {
    id: number
    name: string | null
    category: string | null
    sellPrice: number
    stock: number
    ordersCount: number
    revenue: number
    image: string | null
    published: boolean
  }[]
  weeklyFlow: {
    labels: string[]
    series: number[][]
  }
  fulfillmentRatio: {
    completed: number
    pending: number
    cancelled: number
    percentages: { completed: number; pending: number; cancelled: number }
  }
}

export const orderService = {
  async getOrders({ orderOptions, itemsPerPage, page, filter }: getTableDataParams): Promise<{ data: OrderWithCustomer[]; count: number }> {
    await simulateLatency(650, 950)
    let list = [...mockDb.orders]

    // Filtering
    if (filter) {
      if (filter.status && filter.status !== 'all') {
        list = list.filter((o) => o.status === filter.status)
      }
      if (filter.type && filter.type !== 'all') {
        list = list.filter((o) => o.type?.toLowerCase() === filter.type?.toLowerCase())
      }
      if (filter.query) {
        const q = filter.query.toLowerCase().trim()
        list = list.filter((o) => {
          const customer = mockDb.getCustomer(o.owner)
          return (
            String(o.id).includes(q) ||
            (customer?.name && customer.name.toLowerCase().includes(q)) ||
            (customer?.email && customer.email.toLowerCase().includes(q)) ||
            (o.note && o.note.toLowerCase().includes(q)) ||
            (o.type && o.type.toLowerCase().includes(q)) ||
            (o.status && o.status.toLowerCase().includes(q))
          )
        })
      }
    }

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
      const items = mockDb.order_items.filter((item) => item.order_id === order.id)
      return {
        ...order,
        customers: customer ? { name: customer.name, email: customer.email, phone: customer.phone } : null,
        itemsCount: items.length,
      }
    })

    return { data: paginated, count }
  },

  async getOrderById(id: number): Promise<OrderDetailsResponse | null> {
    await simulateLatency(500, 800)
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
    await simulateLatency(850, 1300)
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
    await simulateLatency(700, 1050)
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
    await simulateLatency(750, 1100)
    const success = mockDb.deleteOrder(id)
    if (!success) return { success: false, error: { message: 'Order could not be found or deleted' } }
    return { success: true, error: null }
  },

  async getRecentOrders(limit: number = 20): Promise<RecentOrderItem[]> {
    await simulateLatency(600, 900)
    const sortedItems = [...mockDb.order_items].sort(
      (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    )

    return sortedItems.slice(0, limit).map((item) => {
      const product = mockDb.getProduct(item.product_id)
      return {
        order_id: item.order_id,
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

  async getDashboardMetrics(period: 'day' | 'week' | 'month' | 'all' = 'all'): Promise<DashboardMetrics> {
    await simulateLatency(700, 1050)
    const allOrders = [...mockDb.orders]
    const allItems = [...mockDb.order_items]

    // Determine reference anchor time (latest order timestamp in DB, or current time)
    const orderTimes = allOrders
      .map((o) => (o.created_at ? new Date(o.created_at).getTime() : 0))
      .filter((t) => !isNaN(t) && t > 0)
    const anchorTime = orderTimes.length > 0 ? Math.max(...orderTimes) : Date.now()

    let filteredOrders = allOrders
    if (period === 'day') {
      const cutoff = anchorTime - 24 * 60 * 60 * 1000
      filteredOrders = allOrders.filter((o) => o.created_at && new Date(o.created_at).getTime() >= cutoff)
      if (filteredOrders.length === 0 && allOrders.length > 0) {
        const latestDateStr = new Date(anchorTime).toISOString().slice(0, 10)
        filteredOrders = allOrders.filter((o) => o.created_at && o.created_at.startsWith(latestDateStr))
      }
    } else if (period === 'week') {
      const cutoff = anchorTime - 7 * 24 * 60 * 60 * 1000
      filteredOrders = allOrders.filter((o) => o.created_at && new Date(o.created_at).getTime() >= cutoff)
    } else if (period === 'month') {
      const cutoff = anchorTime - 30 * 24 * 60 * 60 * 1000
      filteredOrders = allOrders.filter((o) => o.created_at && new Date(o.created_at).getTime() >= cutoff)
    }

    const filteredOrderIds = new Set(filteredOrders.map((o) => o.id))
    const filteredItems = allItems.filter((item) => filteredOrderIds.has(item.order_id))

    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total_purchases || 0), 0)
    const salesVolume = filteredItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    const allOrdersCount = filteredOrders.length

    const pendingCount = filteredOrders.filter((o) => (o.status || '').toLowerCase() === 'pending').length
    const completedCount = filteredOrders.filter((o) => (o.status || '').toLowerCase() === 'completed').length
    const cancelledCount = filteredOrders.filter((o) => {
      const s = (o.status || '').toLowerCase()
      return s === 'cancelled' || s === 'canceled'
    }).length

    const totalFulfillment = allOrdersCount || 1
    const completedPct = Math.round((completedCount / totalFulfillment) * 100)
    const pendingPct = Math.round((pendingCount / totalFulfillment) * 100)
    const cancelledPct = Math.max(0, 100 - completedPct - pendingPct)

    // Compute 7-day revenue distribution for Bar chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayTotals = [0, 0, 0, 0, 0, 0, 0]
    filteredOrders.forEach((o) => {
      if (o.created_at) {
        const d = new Date(o.created_at)
        const dayIdx = (d.getDay() + 6) % 7 // Monday = 0
        dayTotals[dayIdx] += o.total_purchases || 0
      }
    })

    // Velocity points (filtered order transaction points for visual curve)
    const sortedChronological = [...filteredOrders].sort(
      (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
    )
    const velocityPoints = sortedChronological.map((o) => {
      let time = '-'
      if (o.created_at) {
        const d = new Date(o.created_at)
        if (period === 'day') {
          time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (period === 'week') {
          time = d.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
        } else {
          time = d.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
      }
      return {
        time,
        amount: o.total_purchases || 0,
        orderId: o.id,
      }
    })

    // Product performance cards
    const productStats = new Map<number, { count: number; rev: number }>()
    filteredItems.forEach((it) => {
      const existing = productStats.get(it.product_id) || { count: 0, rev: 0 }
      const prod = mockDb.getProduct(it.product_id)
      const price = prod?.sell_price || 0
      productStats.set(it.product_id, {
        count: existing.count + (it.quantity || 1),
        rev: existing.rev + (it.quantity || 1) * price,
      })
    })

    // Fallback to all items if filtered items is empty to avoid blank product catalog
    const targetStats = productStats.size > 0 ? productStats : (() => {
      const fallback = new Map<number, { count: number; rev: number }>()
      allItems.forEach((it) => {
        const existing = fallback.get(it.product_id) || { count: 0, rev: 0 }
        const prod = mockDb.getProduct(it.product_id)
        const price = prod?.sell_price || 0
        fallback.set(it.product_id, {
          count: existing.count + (it.quantity || 1),
          rev: existing.rev + (it.quantity || 1) * price,
        })
      })
      return fallback
    })()

    const topProducts = mockDb.products
      .map((p) => {
        const stats = targetStats.get(p.id) || { count: 0, rev: 0 }
        return {
          id: p.id,
          name: p.name,
          category: p.category,
          sellPrice: p.sell_price || 0,
          stock: p.stock || 0,
          ordersCount: stats.count,
          revenue: stats.rev,
          image: p.image,
          published: p.published ?? true,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)

    const maxVal = Math.max(...dayTotals, 100)
    const normalizedSeries = dayTotals.map((t) => Math.min(100, Math.max(15, Math.round((t / maxVal) * 100))))
    const baselineSeries = [100, 100, 100, 100, 100, 100, 100]

    // Calculate comparison with previous equivalent period
    let priorOrders: typeof allOrders = []
    if (period === 'day') {
      const priorCutoff = anchorTime - 48 * 60 * 60 * 1000
      const currentCutoff = anchorTime - 24 * 60 * 60 * 1000
      priorOrders = allOrders.filter((o) => {
        if (!o.created_at) return false
        const t = new Date(o.created_at).getTime()
        return t >= priorCutoff && t < currentCutoff
      })
    } else if (period === 'week') {
      const priorCutoff = anchorTime - 14 * 24 * 60 * 60 * 1000
      const currentCutoff = anchorTime - 7 * 24 * 60 * 60 * 1000
      priorOrders = allOrders.filter((o) => {
        if (!o.created_at) return false
        const t = new Date(o.created_at).getTime()
        return t >= priorCutoff && t < currentCutoff
      })
    } else if (period === 'month') {
      const priorCutoff = anchorTime - 60 * 24 * 60 * 60 * 1000
      const currentCutoff = anchorTime - 30 * 24 * 60 * 60 * 1000
      priorOrders = allOrders.filter((o) => {
        if (!o.created_at) return false
        const t = new Date(o.created_at).getTime()
        return t >= priorCutoff && t < currentCutoff
      })
    } else {
      // For 'all', compare the second half chronologically with the first half
      const sorted = [...allOrders].sort(
        (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
      )
      const mid = Math.floor(sorted.length / 2)
      priorOrders = sorted.slice(0, mid)
    }

    const priorOrderIds = new Set(priorOrders.map((o) => o.id))
    const priorItems = allItems.filter((item) => priorOrderIds.has(item.order_id))

    const priorRevenue = priorOrders.reduce((sum, o) => sum + (o.total_purchases || 0), 0)
    const priorVolume = priorItems.reduce((sum, item) => sum + (item.quantity || 1), 0)

    const computeDelta = (current: number, prior: number) => {
      if (prior === 0) {
        const pct = current > 0 ? 100 : 0
        return { percentage: pct, isPositive: true, formatted: `+${pct}%` }
      }
      const pct = Math.round(((current - prior) / prior) * 100)
      const isPositive = pct >= 0
      const formatted = `${isPositive ? '+' : ''}${pct}%`
      return { percentage: pct, isPositive, formatted }
    }

    const revenueDelta = computeDelta(totalRevenue, priorRevenue)
    const unitsDelta = computeDelta(salesVolume, priorVolume)

    const inStockCount = mockDb.products.filter((p) => (p.stock || 0) > 0).length
    const inStockPct = mockDb.products.length ? Math.round((inStockCount / mockDb.products.length) * 100) : 100

    return {
      totalRevenue,
      salesVolume,
      allOrdersCount,
      pendingCount,
      completedCount,
      cancelledCount,
      revenueDelta,
      unitsDelta,
      inStockPct,
      velocityPoints,
      topProducts,
      weeklyFlow: {
        labels: days,
        series: [baselineSeries, normalizedSeries],
      },
      fulfillmentRatio: {
        completed: completedCount,
        pending: pendingCount,
        cancelled: cancelledCount,
        percentages: {
          completed: completedPct,
          pending: pendingPct,
          cancelled: cancelledPct,
        },
      },
    }
  },
}
