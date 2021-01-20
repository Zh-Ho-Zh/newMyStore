import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../com/Login.vue'
import Index from '../com/Index.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/Login'
}, {
    path: '/Login',
    component: Login
}, {
    path: '/Index',
    component: Index
}
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/Login') {
        return next()
    } else {
        var tokenstr = window.sessionStorage.getItem('token')
        if (!tokenstr) {
            return next('/Login')
        } else {
            next()
        }
    }
})

export default router
