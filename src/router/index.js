import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/LoginPage.vue'
import Register from '../views/RegisterPage.vue'
import Chat from '../views/ChatView.vue'


Vue.use(VueRouter)


const routes = [
  { path: '/', name: 'home', component: Home, props: {default: true, mainTab: "1"} },
  { path: '/response', name: 'configuration', component: Home, props: {default: true, mainTab: "1"}},
  { path: '/configuration', name: 'configuration', component: Home, props: {default: true, mainTab: "3"}},
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
