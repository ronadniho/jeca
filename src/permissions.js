import router from './router/index'//路由
import store from './store/index'//路由
router.beforeEach((to, from, next) => {
    let user = localStorage.getItem('sessionKey');//登录标示
    let perms = store.state.perms.perms;//登录状态
    if (user == null && to.path != '/login') {
        next('/login');
    } else {
        if (to.path == '/login') {
            next();
        } else {
            if (perms) {
                next();
            } else {
                store.dispatch('setRouters').then(() => {
                    router.addRoutes(store.state.perms.addRouters);
                    next({ ...to }) // hack方法 确保addRoutes已完成
                })
            }
        }
    }
})