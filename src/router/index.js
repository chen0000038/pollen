import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Views/Home.vue'
import PollenInfo from '../Views/PollenInfo.vue'
import Personalisation from '../Views/Personalisation.vue'
import PollenTracker from '../Views/PollenTracker.vue'
import Game from '../Views/Game.vue'
<<<<<<< HEAD
=======
import Forecasting from '../Views/Forecasting.vue'
>>>>>>> main
import Simulator from '../Views/Simulator.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/polleninfo', name: 'PollenInfo', component: PollenInfo },
  { path: '/personalisation', name: 'Personalisation', component: Personalisation},
  { path: '/pollentracker', name: 'PollenTracker', component: PollenTracker},
  { path: '/game', name: 'Game', component: Game},
<<<<<<< HEAD
=======
  { path: '/forecasting', name: 'Forecasting', component: Forecasting},
>>>>>>> main
  { path: '/simulator', name: 'Simulator', component: Simulator}
  // ...
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes,
})

export default router

