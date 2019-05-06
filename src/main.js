import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Auth from './Auth.vue'
import Home from './home.vue'
import axios from 'axios';
import {url} from './http-common.js';

Vue.use(Router);


const router = new Router({
  routes: [
    {
      path: '/',
      component: App,
      redirect: '/auth',
      children: [
        {
          path: '/auth',
          component: Auth,
        },
        {
          path: '/home',
          component: Home
        }
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  axios.get(url + 'checksession', {withCredentials:true}).then(response => {
    if (response.data) {
      if (to.path === '/auth' && from.path !== '/auth' && from.path !== '/') {
        next(false);
      }
      else if ((to.path === '/auth' && from.path === '/auth') || (from.path === '/' && to.path === '/auth'))
        next({path: '/home', replace: true});
      else
        next();
    }
    else {
      if (to.path !== '/auth')
        next({path: '/auth', replace: true});
      else
        next();
    }
  });
});

new Vue({
  el: '#app',
  render: h => h(App),
  router
});


export default router;

