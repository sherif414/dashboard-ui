import { defineStore } from 'pinia'
import { CustomerTable, getTableDataParams } from 'types'
import { supabase } from '~/api'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<CustomerTable[] | null>(null)
  const countAll = ref<number | null>(null)

  async function getCustomers({ ascending, itemsPerPage, orderBy, page }: getTableDataParams) {
    const from = (page - 1) * itemsPerPage
    const to = page * itemsPerPage

    const { data, count } = await supabase
      .from('customers')
      .select('id, name, email, created_at, phone, status', { count: 'estimated' })
      .order(orderBy, { ascending })
      .range(from, to - 1)

    customers.value = data
    countAll.value = count
  }

  async function getCount() {
    const { count } = await supabase.from('customers').select(undefined, { count: 'estimated', head: true })
    countAll.value = count
  }

  return {
    customers,
    countAll,
    getCount,
    getCustomers,
  }
})
