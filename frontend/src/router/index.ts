import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/',
            redirect: '/dashboard', // Redirection automatique vers '/dashboard'
            meta: {
            requiresAuth: true
    }
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/tasks',
            name: 'Tasks',
            component: () => import('../views/TasksView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/projects',
            name: 'Projects',
            component: () => import('../views/ProjectsView.vue'),
            meta: {
                requiresAuth: true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if(to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router