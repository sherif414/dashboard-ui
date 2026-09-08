import { createRouter, createWebHistory } from 'vue-router'

import home from '~/pages/home/index.vue'

import orders from './orders/index.vue'
import OrderDetails from './orders/details.vue'

import customers from './customers/index.vue'
import customerDetails from './customers/details.vue'

import products from './products/index.vue'
import productAdd from './products/add.vue'
import productDetails from './products/details.vue'

import chat from './chat/index.vue'
import ConversationView from './chat/ConversationView.vue'

import settings from './settings/index.vue'
import SettingsSecurity from './settings/security.vue'
import SettingsEditInfo from './settings/EditInfo.vue'
import SettingsPersonalize from './settings/personalize.vue'

import login from './login.vue'
import signup from './signup.vue'
import EmailConfirmation from './EmailConfirmation.vue'
import { useAuthStore } from '~/store/auth'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // dashboard
    {
      name: 'dashboard',
      path: '/',
      component: home,
    },

    // orders
    {
      name: 'orders',
      path: '/orders',
      component: orders,
    },
    {
      name: 'order details',
      path: '/orders/:id',
      component: OrderDetails,
    },

    // customers
    {
      name: 'customers',
      path: '/customers',
      component: customers,
    },
    {
      name: 'customer details',
      path: '/customers/:id',
      component: customerDetails,
    },

    // products
    {
      name: 'products',
      path: '/products',
      component: products,
    },
    {
      name: 'product add',
      path: '/products/add',
      component: productAdd,
    },
    {
      name: 'product details',
      path: '/products/:id',
      component: productDetails,
    },

    // conversations
    {
      name: 'chat',
      path: '/chat',
      component: chat,
      meta: { pageKey: 'chat' },
      children: [{ name: 'conversation view', path: ':id', component: ConversationView }],
    },

    // settings
    {
      name: 'settings',
      path: '/settings',
      component: settings,
      redirect: '/settings/edit-info',
      meta: { pageKey: 'settings' },
      children: [
        { name: 'edit info', path: 'edit-info', component: SettingsEditInfo },
        { name: 'personalize', path: 'personalize', component: SettingsPersonalize },
        { name: 'security', path: 'security', component: SettingsSecurity },
      ],
    },

    // authentication
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

router.beforeEach((to) => {
  const auth = useAuthStore()
  const authRequired = !auth.publicPages.includes(to.path)

  if (authRequired && !auth.user) {
    auth.redirectPath = to.fullPath
    return '/login'
  }
  return true
})
