import { defineStore } from 'pinia'
import { getTableDataParams } from 'types'
import { supabase } from '~/api'

export const useOrderStore = defineStore('order', () => {
  const orderList = ref<any[] | null>(null)
  const countAll = ref<number | null>(null)

  async function getOrders({ orderOptions, itemsPerPage, page }: getTableDataParams) {
    const from = (page - 1) * itemsPerPage
    const to = page * itemsPerPage - 1
    const { ascending, column, foreignTable } = orderOptions

    const { data, count, error } = await supabase
      .from('orders')
      .select('id, customers(name), created_at, type, status, total_purchases', { count: 'estimated' })
      .order(column, { ascending, foreignTable, nullsFirst: false })
      .range(from, to)

    if (error) useMessage('error', error.message ?? 'an error has occurred')
    orderList.value = data
    countAll.value = count
  }

  return {
    orderList,
    countAll,
    getOrders,
  }
})
