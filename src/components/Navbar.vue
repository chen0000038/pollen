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
        <router-link to="/" class="nav-btn" exact-active-class="active">Home</router-link>
        <router-link to="/pollentracker" class="nav-btn" active-class="active">Pollen Tracker</router-link>
        <router-link to="/personalisation" class="nav-btn" active-class="active">Personalisation</router-link>
        <router-link to="/polleninfo" class="nav-btn" active-class="active">Education Resources</router-link>
        <router-link to="/game" class="nav-btn" active-class="active">Game</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  align-items: center;
  padding: 0 1rem;
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
  color: #000;
}

.navbar-right {
  display: flex;
  gap: 0.5rem;
  padding-right: 3rem; 
}

.nav-btn {
  text-decoration: none;
  padding: 0.3rem 0.6rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #034563;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-btn:hover {
  color: #4c4b4b;
  background-color: rgba(255, 255, 255, 0.7);
}

.nav-btn.active {
  background-color: #034563;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Home page specific styles */
.home-navbar {
  background-color: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;
}

.home-site-title {
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5),
               0 0 10px rgba(0, 0, 0, 0.3);
}

.home-navbar .nav-btn {
  color: rgba(255, 255, 255, 0.7);
  background-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5),
               0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  border: none;
  padding: 0.3rem 0.8rem;
}

.home-navbar .nav-btn:hover {
  color: rgba(255, 255, 255, 0.85);
  background-color: transparent;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7),
               0 0 12px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: calc(0.3rem - 1px) calc(0.8rem - 1px);
}

.home-navbar .nav-btn.active {
  color: rgba(255, 255, 255, 0.9);
  background-color: transparent;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6),
               0 0 12px rgba(0, 0, 0, 0.4);
  font-weight: 700;
  position: relative;
}

.home-navbar .nav-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}
</style>

  
  
  
  
  
  
  
  
  
  
  

  