import type { Customer, CustomerTable, getTableDataParams, Order } from 'types'
import { mockDb } from './mock/mockDb'
import { simulateLatency } from './delay'

export const customerService = {
  async getCustomers({ orderOptions, itemsPerPage, page }: getTableDataParams): Promise<{ data: CustomerTable[]; count: number }> {
    await simulateLatency(180, 300)
    let list = [...mockDb.customers]

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
    const paginated = list.slice(from, from + itemsPerPage).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      created_at: c.created_at,
      phone: c.phone,
      status: c.status,
    }))

    return { data: paginated, count }
  },

  async getCount(): Promise<number> {
    return mockDb.customers.length
  },

  async getCustomerById(id: number): Promise<Customer | null> {
    await simulateLatency(120, 220)
    return mockDb.getCustomer(id)
  },

  async createCustomer(data: { name: string; email: string; phone: string }): Promise<{ data: Customer | null; error: null | { message: string } }> {
    await simulateLatency(450, 650)
    try {
      const created = mockDb.insertCustomer({
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: true,
      })
      return { data: created, error: null }
    } catch (e: any) {
      return { data: null, error: { message: e.message || 'Failed to create customer' } }
    }
  },

  async toggleCustomerStatus(id: number): Promise<{ data: Customer | null; error: null | { message: string } }> {
    await simulateLatency(300, 450)
    const customer = mockDb.getCustomer(id)
    if (!customer) return { data: null, error: { message: 'Customer not found' } }
    const updated = mockDb.updateCustomer(id, { status: !customer.status })
    return { data: updated, error: null }
  },

  async getCustomerOrders(customerId: number): Promise<Order[]> {
    await simulateLatency(150, 250)
    return mockDb.orders.filter((o) => o.owner === customerId)
  },

  async searchCustomers(searchTerm: string): Promise<{ id: number; name: string }[]> {
    await simulateLatency(150, 250)
    const term = searchTerm.toLowerCase().trim()
    if (!term) return []
    return mockDb.customers
      .filter((c) => c.name?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term))
      .slice(0, 10)
      .map((c) => ({ id: c.id, name: c.name || 'Unnamed Customer' }))
  },
}
