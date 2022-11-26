import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { h } from 'vue'

import home from '~/pages/index.vue'

import orders from './orders/index.vue'
import OrderDetails from './orders/details.vue'

import customers from './customers/index.vue'
import AddCustomer from './customers/details.vue'

import products from './products/index.vue'
import AddProduct from './products/add.vue'
import productDetails from './products/details.vue'

import chat from './chat.vue'
import settings from './settings.vue'

import login from './login.vue'
import signup from './signup.vue'
import EmailConfirmation from './EmailConfirmation.vue'
import { useAuthStore } from '~/store/auth'

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
          name: 'orders list',
          path: '',
          component: orders,
        },
        {
          name: 'details',
          path: 'detail',
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
          name: 'add customer',
          path: 'add',
          component: AddCustomer,
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
          name: 'add product',
          path: 'add',
          component: AddProduct,
          meta: { transitionName: 'slide-left' },
        },
        {
          name: 'details',
          path: ':id',
          component: productDetails,
          meta: { transitionName: 'slide-left' },
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
    {
      name: 'login',
      path: '/login',
      component: login,
    },
    {
      name: 'signup',
      path: '/signup',
      component: signup,
    },
    {
      name: 'email confirmation',
      path: '/email-confirmation',
      component: EmailConfirmation,
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const authRequired = !auth.publicPages.includes(to.path)

  if (authRequired && !auth.user) {
    auth.redirectPath = to.fullPath
    return '/login'
  }
  return true
})
