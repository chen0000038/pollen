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
  gap: 0.5rem;
  padding-right: 3rem; 
}

.nav-btn {
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #034563;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.nav-btn:hover::before {
  transform: translateX(0);
}

.nav-btn:hover {
  color: #000;
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-btn.active {
  background-color: rgba(3, 69, 99, 0.9);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

.home-navbar .nav-btn {
  color: rgba(255, 255, 255, 0.9);
  background-color: rgba(255, 255, 255, 0.1);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.home-navbar .nav-btn:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.home-navbar .nav-btn.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  font-weight: 700;
}

.home-site-title {
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}
</style>

  
  
  
  
  
  
  
  
  
  
  

  