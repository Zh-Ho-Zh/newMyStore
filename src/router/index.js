import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../com/Login.vue'
import Index from '../com/Index.vue'
import Main from '../com/Main.vue'
import users from '../com/users/Users.vue'
import rights from '../com/rights/Rights.vue'
import roles from '../com/rights/Roles.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/Login'
}, {
    path: '/Login',
    component: Login
}, {
    path: '/Index',
    component: Index,
    redirect: '/Main',
    children: [{
        path: '/Main',
        component: Main
    }, {
        path: '/users',
        component: users
    }, {
        path: '/rights',
        component: rights
    }, {
        path: '/roles',
        component: roles
    }]
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
