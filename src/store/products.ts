import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { getTableDataParams, ProductTable } from 'types'
import { productService } from '~/services/productService'
import { useMessage } from '~/composables/message'

export const useProductsStore = defineStore('products', () => {
  const products = ref<ProductTable[] | null>(null)
  const countAll = ref<number | null>(null)
  const countPublished = ref<number | null>(null)
  const metrics = ref<{
    all: number
    published: number
    unpublished: number
    outOfStock: number
    lowStock: number
    inStock: number
  } | null>(null)
  const isLoading = ref(false)

  async function getProducts(params: getTableDataParams) {
    isLoading.value = true
    try {
      const { data, count } = await productService.getProducts(params)
      products.value = data
      countAll.value = count
    } catch (e: any) {
      useMessage('error', e.message || 'an error has occurred')
    } finally {
      isLoading.value = false
    }
  }

  async function getCount() {
    countPublished.value = await productService.getPublishedCount()
    countAll.value = await productService.getAllCount()
    try {
      metrics.value = await productService.getProductMetrics()
    } catch (e: any) {
      // silently handle
    }
  }

  async function getMetrics() {
    try {
      metrics.value = await productService.getProductMetrics()
    } catch (e: any) {
      // silently handle
    }
  }

  async function insertImage(image: File, fileName: string) {
    return await productService.insertImage(image, fileName)
  }

  async function insertProduct(product: any) {
    const { error } = await productService.createProduct(product)
    return error
  }

  async function togglePublishStatus(id: number) {
    try {
      const { data, error } = await productService.togglePublishStatus(id)
      if (error || !data) {
        useMessage('error', error?.message ?? 'Failed to update publication status')
        return false
      }
      if (products.value) {
        const found = products.value.find((p) => p.id === id)
        if (found) found.published = data.published
      }
      useMessage('success', `Product #${id} is now ${data.published ? 'Published' : 'Unpublished'}`)
      await getCount()
      return true
    } catch (e: any) {
      useMessage('error', e.message ?? 'Failed to update publication status')
      return false
    }
  }

  return {
    products,
    countAll,
    countPublished,
    metrics,
    isLoading,
    getProducts,
    getCount,
    getMetrics,
    insertProduct,
    insertImage,
    togglePublishStatus,
  }
})
