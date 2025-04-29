<template>
  <nav class="navbar" :class="{ 'home-navbar': isHomePage }">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/" class="logo-link">
          <img src="/logo.png" alt="Logo" class="logo" />
          <span class="site-title" :class="{ 'home-site-title': isHomePage }">Melbourne Pollen Monitor</span>
        </router-link>
      </div>
      <div class="navbar-right">
        <router-link to="/" class="nav-item" exact-active-class="active">Home</router-link>
        
        <!-- Pollen Tracker Dropdown -->
        <div class="dropdown-container" :class="{ 'active-dropdown': isPollenDropdownOpen }">
          <div 
            class="nav-item dropdown-trigger" 
            :class="{ 'active': isPollenActive }"
            @click="togglePollenDropdown"
          >
            Pollen Tracker
          </div>
          <div class="dropdown-menu">
            <router-link to="/pollentracker" class="dropdown-item" @click="closeAllDropdowns">Realtime Pollen</router-link>
            <router-link to="/forecasting" class="dropdown-item" @click="closeAllDropdowns">Pollen Forecasting</router-link>
          </div>
        </div>
        
        <!-- Education Dropdown -->
        <div class="dropdown-container" :class="{ 'active-dropdown': isEducationDropdownOpen }">
          <div 
            class="nav-item dropdown-trigger" 
            :class="{ 'active': isEducationActive }"
            @click="toggleEducationDropdown"
          >
            Education
          </div>
          <div class="dropdown-menu">
            <router-link to="/personalisation" class="dropdown-item" @click="closeAllDropdowns">Personalization</router-link>
            <router-link to="/polleninfo" class="dropdown-item" @click="closeAllDropdowns">Resources</router-link>
            <router-link to="/game" class="dropdown-item" @click="closeAllDropdowns">Game</router-link>
          </div>
        </div>
        
        <router-link to="/simulator" class="nav-item" active-class="active">Simulator</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
const isPollenActive = computed(() => 
  route.path === '/pollentracker' || route.path === '/forecasting'
)
const isEducationActive = computed(() => 
  route.path === '/personalisation' || 
  route.path === '/polleninfo' || 
  route.path === '/game'
)

// Dropdown state
const isPollenDropdownOpen = ref(false)
const isEducationDropdownOpen = ref(false)

// Toggle dropdown functions
const togglePollenDropdown = () => {
  isPollenDropdownOpen.value = !isPollenDropdownOpen.value
  if (isPollenDropdownOpen.value) {
    isEducationDropdownOpen.value = false
  }
}

const toggleEducationDropdown = () => {
  isEducationDropdownOpen.value = !isEducationDropdownOpen.value
  if (isEducationDropdownOpen.value) {
    isPollenDropdownOpen.value = false
  }
}

const closeAllDropdowns = () => {
  isPollenDropdownOpen.value = false
  isEducationDropdownOpen.value = false
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const pollenDropdown = document.querySelector('.dropdown-container:nth-child(2)')
  const educationDropdown = document.querySelector('.dropdown-container:nth-child(3)')
  
  if (pollenDropdown && !pollenDropdown.contains(event.target)) {
    isPollenDropdownOpen.value = false
  }
  
  if (educationDropdown && !educationDropdown.contains(event.target)) {
    isEducationDropdownOpen.value = false
  }
}

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
}

.navbar:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  height: 120px;
  width: auto;
}

.site-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #034563;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.navbar-right {
  display: flex;
  gap: 1.5rem;
  padding-right: 3rem; 
  align-items: center;
}

.nav-item {
  text-decoration: none;
  padding: 0.5rem 0;
  font-weight: 600;
  font-size: 0.95rem;
  color: #034563;
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
  background-color: #034563;
  transition: width 0.3s ease;
}

.nav-item:hover::after {
  width: 100%;
}

.nav-item:hover {
  color: #000;
  transform: translateY(-2px);
}

.nav-item.active {
  color: #034563;
  font-weight: 700;
}

.nav-item.active::after {
  width: 100%;
  background-color: #034563;
  height: 2px;
}

/* Dropdown styles */
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-container::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: transparent;
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
  transform: translateX(-50%) translateY(-10px);
  width: max-content;
  min-width: 180px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease;
  z-index: 1000;
  pointer-events: none;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
}

.dropdown-container:hover .dropdown-menu,
.active-dropdown .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
  transition-delay: 0s;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #034563;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: center;
}

.dropdown-item:hover {
  background-color: rgba(3, 69, 99, 0.1);
  padding-left: 1.3rem;
}

/* Home page specific styles */
.home-navbar {
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: none;
}

.home-navbar:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.home-navbar .nav-item {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.home-navbar .nav-item::after {
  background-color: rgba(255, 255, 255, 0.9);
}

.home-navbar .nav-item:hover {
  color: white;
}

.home-navbar .nav-item.active {
  color: white;
  font-weight: 700;
}

.home-navbar .nav-item.active::after {
  background-color: white;
}

.home-navbar .dropdown-menu {
  background-color: rgba(30, 30, 30, 0.85);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.home-navbar .dropdown-menu::before {
  background-color: rgba(30, 30, 30, 0.85);
}

.home-navbar .dropdown-item {
  color: rgba(255, 255, 255, 0.9);
}

.home-navbar .dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.home-site-title {
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
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

  
  
  
  
  
  
  
  
  
  
  

  