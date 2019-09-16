import Vue from 'vue'
import Router from 'vue-router'
import Vision from './views/Vision.vue'
import Face from './views/Face.vue'
import Label from './views/Label.vue'
import Objectvue from './views/Object.vue'

import BootstrapVue from 'bootstrap-vue' // added
import 'bootstrap/dist/css/bootstrap.css' // added
import 'bootstrap-vue/dist/bootstrap-vue.css' // added

Vue.use(Router)
Vue.use(BootstrapVue)


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'vision',
      component: Vision,
      children: [
        {path: 'face', component: Face},
        {path: 'label', component: Label},
        {path: 'object', component: Objectvue}
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
