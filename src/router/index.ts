import { createRouter, createWebHistory } from 'vue-router'
import OfficeVeiw from '../views/OfficeVeiw.vue'
import ConstructorView from '@/views/ConstructorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: OfficeVeiw,
    },
    {
      path: '/office/create',
      name: '/office/create',
      component: ConstructorView,
    },
  ],
})

export default router
