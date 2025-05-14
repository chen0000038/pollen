import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Views/Home.vue'
import PollenInfo from '../Views/PollenInfo.vue'
import Personalisation from '../Views/Personalisation.vue'
import PollenTracker from '../Views/PollenTracker.vue'
import Game from '../Views/Game.vue'
import Forecasting from '../Views/Forecasting.vue'
import Simulator from '../Views/Simulator.vue'
import AllergyTracker from '../Views/AllergyTracker.vue'
import PlantAdvisor from '../Views/PlantAdvisor.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/polleninfo', name: 'PollenInfo', component: PollenInfo },
  { path: '/personalisation', name: 'Personalisation', component: Personalisation},
  { path: '/pollentracker', name: 'PollenTracker', component: PollenTracker},
  { path: '/game', name: 'Game', component: Game},
  { path: '/forecasting', name: 'Forecasting', component: Forecasting},
  { path: '/simulator', name: 'Simulator', component: Simulator},
  { path: '/allergytracker', name: 'AllergyTracker', component: AllergyTracker},
  { path: '/plantadvisor', name: 'PlantAdvisor', component: PlantAdvisor}

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes,
})


router.beforeEach((to, from, next) => {

  window.scrollTo(0, 0)
  next()
})

export default router

