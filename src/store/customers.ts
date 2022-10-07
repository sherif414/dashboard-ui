import { defineStore } from 'pinia'
import { definitions } from 'types/supabase'
import { supabase } from '~/api'

export const useCustomersStore = defineStore('customers', () => {
  const customersList = ref<definitions['customers'][]>()

  async function getCustomersList() {
    if (customersList.value === undefined) {
      const { data } = await supabase.from('customers').select('*')
      customersList.value = data
    }
  }
  getCustomersList()

  return {
    customersList,
    getCustomersList,
  }
})
