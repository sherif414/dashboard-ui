import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { getTableDataParams } from 'types'
import { orderService, type OrderWithCustomer } from '~/services/orderService'
import { useMessage } from '~/composables/message'

export const useOrderStore = defineStore('order', () => {
  const orderList = ref<OrderWithCustomer[] | null>(null)
  const countAll = ref<number | null>(null)

  async function getOrders(params: getTableDataParams) {
    try {
      const { data, count } = await orderService.getOrders(params)
      orderList.value = data
      countAll.value = count
    } catch (e: any) {
      useMessage('error', e.message ?? 'an error has occurred')
    }
  }

  return {
    orderList,
    countAll,
    getOrders,
  }
})
