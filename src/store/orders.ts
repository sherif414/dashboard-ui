import { defineStore } from 'pinia'
import { definitions } from 'types/supabase'
import { supabase } from '~/api'

export const useOrderStore = defineStore('order', () => {
  const orderList = ref<definitions['orders'][]>()

  async function getOrderList() {
    if (orderList.value === undefined) {
      const { data } = await supabase.from('orders').select('*')
      if (data) orderList.value = data
    }
  }

  return {
    orderList,
    getOrderList,
  }
})
