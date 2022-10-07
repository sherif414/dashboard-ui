import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { h } from 'vue'

import home from '~/pages/index.vue'

import orders from './orders/index.vue'
import OrderDetails from './orders/details.vue'

import customers from './customers/index.vue'
import CustomerDetails from './customers/details.vue'

import products from './products/index.vue'
import ProductDetails from './products/details.vue'

import chat from './chat.vue'
import settings from './settings.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'dashboard',
      path: '/',
      component: home,
    },
    {
      name: 'orders',
      path: '/orders',
      component: { render: () => h(RouterView) },
      children: [
        {
          name: 'orders',
          path: '',
          component: orders,
        },
        {
          name: 'orders details',
          path: 'details',
          component: OrderDetails,
        },
      ],
    },
    {
      name: 'customers',
      path: '/customers',
      component: { render: () => h(RouterView) },
      children: [
        {
          name: 'customers list',
          path: '',
          component: customers,
        },
        {
          name: 'customer details',
          path: 'details',
          component: CustomerDetails,
        },
      ],
    },
    {
      name: 'products',
      path: '/products',
      component: { render: () => h(RouterView) },
      children: [
        {
          name: 'products list',
          path: '',
          component: products,
        },
        {
          name: 'product details',
          path: 'details',
          component: ProductDetails,
        },
      ],
    },
    {
      name: 'chat',
      path: '/chat',
      component: chat,
    },
    {
      name: 'settings',
      path: '/settings',
      component: settings,
    },
  ],
})
