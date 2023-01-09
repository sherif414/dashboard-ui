import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { h } from 'vue'

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
      component: { render: () => h(RouterView) },
      children: [
        { name: 'orders list', path: '', component: orders },
        { name: 'order details', path: ':id', component: OrderDetails },
      ],
    },

    // customers
    {
      name: 'customers',
      path: '/customers',
      component: { render: () => h(RouterView) },
      children: [
        { name: 'customers list', path: '', component: customers },
        { name: 'customer add', path: ':id', component: customerDetails },
      ],
    },

    // products
    {
      name: 'products',
      path: '/products',
      component: { render: () => h(RouterView) },
      children: [
        { name: 'products list', path: '', component: products },
        { name: 'product add', path: 'add', component: productAdd },
        { name: 'product details', path: ':id', component: productDetails },
      ],
    },

    // conversations
    {
      name: 'chat',
      path: '/chat',
      component: chat,
      children: [{ name: 'conversation view', path: ':id', component: ConversationView }],
    },

    // settings
    {
      name: 'settings',
      path: '/settings',
      component: settings,
      redirect: '/settings/personalize',
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
