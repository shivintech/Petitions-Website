import Vue from 'vue'
import App from './App.vue'
import Login from './Login.vue';
import Profile from './Profile.vue';
import NavBar from "./NavBar";
import SignUp from "./SignUp";
import VueResource from 'vue-resource';
import Petitions from "./Petitions";
import VueSocialSharing from 'vue-social-sharing'
import MyPetitions from "./MyPetitions";
Vue.use(SocialSharing);


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueResource);

Vue.http.options.emulateJSON = true;
// const token = localStorage.getItem('token');
import VueRouter from 'vue-router';
import imageUpload from "./imageUpload";
import stringifyRecordValues from "bootstrap-vue/esm/components/table/helpers/stringify-record-values";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Petitions
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp
  },
  {
    path: "/image",
    name: "image",
    component: imageUpload
  },
  {
    path: "/myPetitions",
    name: "myPetitions",
    component: MyPetitions
  },
  {
    path: '/profile',
    name: "profile",
    component: Profile,
    meta: {
      requiresAuth: true
    }
  }

];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const strictNoAuth = to.matched.some(record => record.meta.loggedIn);
    const hasToken = localStorage.getItem('token') != null;
    if (requiresAuth  && !hasToken) {
      next({name: "login"});
      return;
    } else if (strictNoAuth && hasToken){
      next({name: "profile"});
      return;
    }
    next();
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
