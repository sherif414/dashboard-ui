import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CustomerTable, getTableDataParams } from 'types'
import { customerService } from '~/services/customerService'
import { useMessage } from '~/composables/message'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<CustomerTable[] | null>(null)
  const countAll = ref<number | null>(null)
  const isLoading = ref(false)
  const metrics = ref<{
    total: number
    active: number
    suspended: number
    purchasing: number
    newCustomers: number
  } | null>(null)

  async function getCustomers(params: getTableDataParams) {
    isLoading.value = true
    try {
      const { data, count } = await customerService.getCustomers(params)
      customers.value = data
      countAll.value = count
    } catch (e: any) {
      useMessage('error', e.message || 'an error has occurred')
    } finally {
      isLoading.value = false
    }
  }

  async function getCount() {
    const count = await customerService.getCount()
    countAll.value = count
  }

  async function getMetrics() {
    try {
      metrics.value = await customerService.getCustomerMetrics()
    } catch (e: any) {
      // silently handle
    }
  }

  async function toggleCustomerStatus(id: number) {
    try {
      const { data, error } = await customerService.toggleCustomerStatus(id)
      if (error || !data) {
        useMessage('error', error?.message ?? 'Failed to update customer status')
        return false
      }
      if (customers.value) {
        const found = customers.value.find((c) => c.id === id)
        if (found) found.status = data.status
      }
      useMessage('success', `Customer #${id} status changed to ${data.status ? 'Active' : 'Suspended'}`)
      await getMetrics()
      return true
    } catch (e: any) {
      useMessage('error', e.message ?? 'Failed to update customer status')
      return false
    }
  }

  return {
    customers,
    countAll,
    metrics,
    isLoading,
    getCount,
    getMetrics,
    getCustomers,
    toggleCustomerStatus,
  }
})
