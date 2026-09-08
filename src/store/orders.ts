import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { getTableDataParams } from 'types'
import { orderService, type OrderWithCustomer, type DashboardMetrics } from '~/services/orderService'
import { useMessage } from '~/composables/message'

export const useOrderStore = defineStore('order', () => {
  const orderList = ref<OrderWithCustomer[] | null>(null)
  const countAll = ref<number | null>(null)
  const metrics = ref<DashboardMetrics | null>(null)
  const isLoadingMetrics = ref(false)
  const isLoadingOrders = ref(false)

  async function getOrders(params: getTableDataParams) {
    isLoadingOrders.value = true
    try {
      const { data, count } = await orderService.getOrders(params)
      orderList.value = data
      countAll.value = count
    } catch (e: any) {
      useMessage('error', e.message ?? 'an error has occurred')
    } finally {
      isLoadingOrders.value = false
    }
  }

  async function loadMetrics(period: 'day' | 'week' | 'month' | 'all' = 'all') {
    isLoadingMetrics.value = true
    try {
      metrics.value = await orderService.getDashboardMetrics(period)
      countAll.value = metrics.value.allOrdersCount
    } catch (e: any) {
      useMessage('error', e.message ?? 'Failed to load dashboard metrics')
    } finally {
      isLoadingMetrics.value = false
    }
  }

  return {
    orderList,
    countAll,
    metrics,
    isLoadingMetrics,
    isLoadingOrders,
    getOrders,
    loadMetrics,
  }
})
