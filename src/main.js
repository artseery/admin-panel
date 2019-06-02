import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Auth from './Auth.vue'
import MenuTables from './menu_tables_component'
import Table from './table_component'
import axios from 'axios';
import {url} from './http-common.js';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/auth',
    },
    {
      path: '/auth',
      component: Auth,
    },
    {
      path: '/tables',
      name: 'table_menu',
      component: MenuTables,
      children: [

        {
          path: '/tables/:table_name',
          name: 'table',
          component: Table,
          props: true
        },
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  axios.get(url + 'checksession', {withCredentials: true}).then(response => {
    if (response.data) {
      if (to.path === '/auth' && from.path !== '/auth' && from.path !== '/') {
        next(false);
      }
      else if ((to.path === '/auth' && from.path === '/auth') || (from.path === '/' && to.path === '/auth'))
        next({path: '/tables', replace: true});
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

