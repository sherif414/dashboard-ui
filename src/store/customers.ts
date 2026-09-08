import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CustomerTable, getTableDataParams } from 'types'
import { customerService } from '~/services/customerService'
import { useMessage } from '~/composables/message'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<CustomerTable[] | null>(null)
  const countAll = ref<number | null>(null)
  const isLoading = ref(false)

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

  return {
    customers,
    countAll,
    isLoading,
    getCount,
    getCustomers,
  }
})
