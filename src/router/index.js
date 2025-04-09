import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Views/Home.vue'
import PollenInfo from '../Views/PollenInfo.vue'
import Personalisation from '../Views/Personalisation.vue'
import PollenTracker from '../Views/PollenTracker.vue'
import Game from '../Views/Game.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/polleninfo', name: 'PollenInfo', component: PollenInfo },
  { path: '/personalisation', name: 'Personalisation', component: Personalisation},
  { path: '/pollentracker', name: 'PollenTracker', component: PollenTracker},
  { path: '/game', name: 'Game', component: Game}
  // ...
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

