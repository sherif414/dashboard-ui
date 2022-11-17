import { defineStore } from 'pinia'
import { getTableDataParams, OrderTable } from 'types'
import { supabase } from '~/api'

export const useOrderStore = defineStore('order', () => {
  const orderList = ref<OrderTable[] | null>(null)
  const countAll = ref<number | null>(null)

  async function getOrders({ ascending, itemsPerPage, orderBy, page }: getTableDataParams) {
    const from = (page - 1) * itemsPerPage
    const to = page * itemsPerPage

    const { data, count } = await supabase
      .from('orders')
      .select('id, owner, created_at, type, status, purchases', { count: 'estimated' })
      .order(orderBy, { ascending })
      .range(from, to - 1)
    orderList.value = data
    countAll.value = count
  }

  return {
    orderList,
    countAll,
    getOrders,
  }
})
