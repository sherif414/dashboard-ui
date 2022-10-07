import { defineStore } from 'pinia'
import { definitions } from 'types/supabase'
import { supabase } from '~/api'

export const useProductsStore = defineStore('products', () => {
  const productsList = ref<definitions['products'][]>()
  const productsCount = ref<number>()

  async function getProdcutList() {
    if (productsList.value === undefined) {
      const { data, count } = await supabase.from('products').select('*', { count: 'exact' })
      productsList.value = data
      productsCount.value = count
    }
  }

  async function postProduct(product: definitions['products']) {
    supabase.from('products').insert(product, { count: 'exact' })
  }

  getProdcutList()

  return {
    productsList,
    productsCount,
    getProdcutList,
    postProduct,
  }
})
