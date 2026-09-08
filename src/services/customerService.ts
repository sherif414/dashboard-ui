import type { Customer, CustomerTable, getTableDataParams, Order } from 'types'
import { mockDb } from './mock/mockDb'
import { simulateLatency } from './delay'

export const customerService = {
  async getCustomers({ orderOptions, itemsPerPage, page, filter }: getTableDataParams): Promise<{ data: CustomerTable[]; count: number }> {
    await simulateLatency(650, 950)
    let list = [...mockDb.customers]

    // Filtering
    if (filter) {
      if (filter.status !== undefined && filter.status !== 'all') {
        const targetStatus = filter.status === 'active' || filter.status === true
        list = list.filter((c) => c.status === targetStatus)
      }
      if (filter.query) {
        const q = filter.query.toLowerCase().trim()
        list = list.filter((c) => {
          return (
            String(c.id).includes(q) ||
            (c.name && c.name.toLowerCase().includes(q)) ||
            (c.email && c.email.toLowerCase().includes(q)) ||
            (c.phone && c.phone.toLowerCase().includes(q))
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
    const paginated = list.slice(from, from + itemsPerPage).map((c) => {
      const customerOrders = mockDb.orders.filter((o) => o.owner === c.id)
      const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total_purchases || 0), 0)
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        created_at: c.created_at,
        phone: c.phone,
        status: c.status,
        ordersCount: customerOrders.length,
        totalSpent,
      }
    })

    return { data: paginated, count }
  },

  async getCount(): Promise<number> {
    return mockDb.customers.length
  },

  async getCustomerMetrics(): Promise<{
    total: number
    active: number
    suspended: number
    purchasing: number
    newCustomers: number
  }> {
    await simulateLatency(500, 750)
    const total = mockDb.customers.length
    const active = mockDb.customers.filter((c) => c.status).length
    const suspended = mockDb.customers.filter((c) => !c.status).length
    const purchasing = new Set(mockDb.orders.map((o) => o.owner)).size
    // customers created in last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const newCustomers = mockDb.customers.filter((c) => c.created_at ? new Date(c.created_at).getTime() > thirtyDaysAgo : false).length
    return { total, active, suspended, purchasing, newCustomers }
  },

  async getCustomerById(id: number): Promise<Customer | null> {
    await simulateLatency(500, 800)
    return mockDb.getCustomer(id)
  },

  async createCustomer(data: { name: string; email: string; phone: string; address?: string }): Promise<{ data: Customer | null; error: null | { message: string } }> {
    await simulateLatency(850, 1300)
    try {
      const created = mockDb.insertCustomer({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || null,
        status: true,
      })
      return { data: created, error: null }
    } catch (e: any) {
      return { data: null, error: { message: e.message || 'Failed to create customer' } }
    }
  },

  async toggleCustomerStatus(id: number): Promise<{ data: Customer | null; error: null | { message: string } }> {
    await simulateLatency(700, 1050)
    const customer = mockDb.getCustomer(id)
    if (!customer) return { data: null, error: { message: 'Customer not found' } }
    const updated = mockDb.updateCustomer(id, { status: !customer.status })
    return { data: updated, error: null }
  },

  async getCustomerOrders(customerId: number): Promise<Order[]> {
    await simulateLatency(500, 750)
    return mockDb.orders.filter((o) => o.owner === customerId)
  },

  async searchCustomers(searchTerm: string): Promise<{ id: number; name: string }[]> {
    await simulateLatency(450, 700)
    const term = searchTerm.toLowerCase().trim()
    if (!term) return []
    return mockDb.customers
      .filter((c) => c.name?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term))
      .slice(0, 10)
      .map((c) => ({ id: c.id, name: c.name || 'Unnamed Customer' }))
  },
}
