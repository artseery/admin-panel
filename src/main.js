import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Auth from './Auth.vue'
import Home from './home'

Vue.use(Router)

const router = new Router({
  routes:[
    {
      path: '', component: App,
      children:[
        {
          path:'',
          component: Auth
        },
        {
          path: 'home',
          component: Home
        }
      ]
    }
  ]
})
new Vue({
  el: '#app',
  render: h => h(App),
  router
})

