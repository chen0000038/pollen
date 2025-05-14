<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/" class="logo-link">
          <img src="/logo.png" alt="Logo" class="logo" />
          <span class="site-title">
            Melbourne Pollen Monitor
          </span>
        </router-link>
      </div>
      <div class="navbar-right">
        <router-link to="/" class="nav-item" exact-active-class="active">Home</router-link>
        
        <!-- Pollen Tracker Dropdown -->
        <div class="dropdown-container">
          <div 
            class="nav-item dropdown-trigger" 
            :class="{ 'active': isPollenActive }"
          >
            Pollen Tracker
          </div>
          <div class="dropdown-menu">
            <router-link to="/pollentracker" class="dropdown-item">Realtime Pollen</router-link>
            <router-link to="/forecasting" class="dropdown-item">Pollen Forecasting</router-link>
          </div>
        </div>
        
        <!-- Education Dropdown -->
        <div class="dropdown-container">
          <div 
            class="nav-item dropdown-trigger" 
            :class="{ 'active': isEducationActive }"
          >
            Education
          </div>
          <div class="dropdown-menu">
            <router-link to="/personalisation" class="dropdown-item">Personalization</router-link>
            <router-link to="/polleninfo" class="dropdown-item">Resources</router-link>
            <router-link to="/game" class="dropdown-item">Game</router-link>
          </div>
        </div>
        
        <!-- Protection Dropdown -->
        <div class="dropdown-container">
          <div 
            class="nav-item dropdown-trigger" 
            :class="{ 'active': isProtectionActive }"
          >
            Protection
          </div>
          <div class="dropdown-menu">
            <router-link to="/allergytracker" class="dropdown-item">Allergy Tracker</router-link>
            <router-link to="/plantadvisor" class="dropdown-item">Plant Advisor</router-link>
          </div>
        </div>
        
        <router-link to="/simulator" class="nav-item" active-class="active">Simulator</router-link>
        <router-link to="/allergyTracker" class="nav-item" active-class="active">Allergy Tracker</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isPollenActive = computed(() => 
  route.path === '/pollentracker' || route.path === '/forecasting'
)
const isEducationActive = computed(() => 
  route.path === '/personalisation' || 
  route.path === '/polleninfo' || 
  route.path === '/game'
)
const isProtectionActive = computed(() => 
  route.path === '/allergytracker' || route.path === '/plantadvisor'
)
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 60px;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 1px 15px rgba(0,0,0,0.1);
  z-index: 999;
  display: flex; align-items: center;
  padding: 0 1rem;
  transition: background-color .3s, backdrop-filter .3s;
}

.navbar:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.navbar-container {
  display: flex; justify-content: space-between; align-items: center;
  width: 100%;
}
.navbar-left {
  display: flex; align-items: center; gap: .5rem; padding-left: 1rem;
}
.logo-link { display: flex; align-items: center; text-decoration: none; }
.logo { height: 120px; width: auto; }
.site-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
.navbar-right {
  display: flex; gap: 1.5rem; padding-right: 3rem; align-items: center;
}
.nav-item {
  text-decoration: none;
  padding: 0.5rem 0;
  font-weight: 600;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: width 0.3s ease;
}

.nav-item:hover {
  color: white;
  transform: translateY(-2px);
}

.nav-item.active {
  color: white;
  font-weight: 700;
}

.nav-item.active::after {
  width: 100%;
  background-color: white;
}

/* Dropdown styles */
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  min-width: 180px;
  background-color: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 0.5rem 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background-color: rgba(30, 30, 30, 0.85);
  border-radius: 2px;
}

.dropdown-container:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: center;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 1.3rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .navbar-right {
    padding-right: 1rem;
    gap: 1rem;
  }
  
  .nav-item {
    padding: 0.4rem 0;
    font-size: 0.85rem;
  }
  
  .site-title {
    font-size: 1.1rem;
  }
  
  .logo {
    height: 100px;
  }
}

@media (max-width: 576px) {
  .site-title {
    display: none;
  }
  
  .logo {
    height: 80px;
  }
}
</style>








  
  
  
  
  
  
  
  
  
  
  

  