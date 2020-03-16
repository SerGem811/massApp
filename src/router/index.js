import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/LoginPage.vue'
import Register from '../views/RegisterPage.vue'
import Chat from '../views/ChatView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home, props: {default: true, mTab: "page-resposta"} },
  { path: '/page-resposta', name: 'page-resposta', component: Home, props: {default: true, mTab: "page-resposta"}},
  { path: '/page-reply', name: 'page-reply', component: Home, props: {default: true, mTab: "page-reply"}},
  { path: '/page-config', name: 'page-config', component: Home, props: {default: true, mTab: "page-config"}},
  { path: '/page-import', name: 'page-import', component: Home, props: {default: true, mTab: "page-import"}},
  { path: '/page-bulksend', name: 'page-bulksend', component: Home, props: {default: true, mTab: "page-bulksend"}},
  { path: '/page-chat', name: 'page-chat', component: Home, props: {default: true, mTab: "page-chat"}},
  { path: '/page-admin', name: 'page-admin', component: Home, props: {default: true, mTab: "page-admin"}},
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/chat', name: 'chat', component: Chat },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {

  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('userMass');
  if (authRequired && (!loggedIn || loggedIn === "none")) {
    next('/login');
  }
  next();
})

export default router
