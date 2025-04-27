<template>
  <nav class="navbar" :class="{ 'home-navbar': isHomePage }">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/" class="logo-link">
          <img src="/logo.png" alt="Logo" class="logo" />
          <span class="site-title" :class="{ 'home-site-title': isHomePage }">
            Melbourne Pollen Monitor
          </span>
        </router-link>
      </div>
      <div class="navbar-right">
        <router-link to="/" class="nav-btn" exact-active-class="active">
          Home
        </router-link>
        <router-link to="/pollentracker" class="nav-btn" active-class="active">
          Pollen Tracker
        </router-link>

        <!-- 下拉菜单容器 -->
        <div class="nav-dropdown">
          <button class="nav-btn" type="button">
            Education Resources
          </button>
          <div class="dropdown-menu">
            <router-link to="/personalisation" class="nav-btn" active-class="active">
              Personalisation
            </router-link>
            <router-link to="/polleninfo" class="nav-btn" active-class="active">
              Education Resources
            </router-link>
            <router-link to="/game" class="nav-btn" active-class="active">
              Game
            </router-link>
          </div>
        </div>

        <router-link to="/simulator" class="nav-btn" active-class="active">
          Simulator
        </router-link>
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
/* ———————— 主导航样式 ———————— */
.navbar {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 60px;
  background-color: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 15px rgba(0,0,0,0.1);
  z-index: 999;
  display: flex; align-items: center;
  padding: 0 1rem;
  transition: background-color .3s, backdrop-filter .3s;
}
.navbar:hover {
  background-color: rgba(255,255,255,0.25);
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
  font-size: 1.3rem; font-weight: bold; color: #034563;
  text-shadow: 0 1px 2px rgba(255,255,255,0.5);
}
.navbar-right {
  display: flex; gap: .5rem; padding-right: 3rem;
}
.nav-btn {
  text-decoration: none; padding: .5rem 1rem;
  font-weight: 600; font-size: .95rem;
  color: #034563; background-color: rgba(255,255,255,0.2);
  border-radius: 6px; border: none; cursor: pointer;
  transition: all .3s; position: relative; overflow: hidden;
}
.nav-btn::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(255,255,255,0.1);
  transform: translateX(-100%); transition: transform .3s;
}
.nav-btn:hover::before { transform: translateX(0); }
.nav-btn:hover {
  color: #000; background-color: rgba(255,255,255,0.3);
  transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.nav-btn.active {
  background-color: rgba(3,69,99,0.9); color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Home 页面特有 */
.home-navbar {
  background-color: rgba(0,0,0,0.2); backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); box-shadow: none;
}
.home-navbar:hover { background-color: rgba(0,0,0,0.3); }
.home-navbar .nav-btn {
  color: rgba(255,255,255,0.9); background-color: rgba(255,255,255,0.1);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.2);
}
.home-navbar .nav-btn:hover {
  color: #fff; background-color: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.home-navbar .nav-btn.active {
  color: #fff; background-color: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.4); font-weight: 700;
}
.home-site-title {
  color: #fff; text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
}

/* ———————— 下拉菜单额外样式 ———————— */
.nav-dropdown {
  position: relative;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%; left: 0;
  flex-direction: column;
  gap: .5rem;
  padding: .5rem 0;
  background: rgba(255,255,255,0.95);
  border-radius: 6px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  white-space: nowrap;
  z-index: 1100;
  min-width: 200px;
  max-width: 240px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.nav-dropdown:hover .dropdown-menu,
.nav-dropdown:focus-within .dropdown-menu {
  display: flex;
}
.dropdown-menu .nav-btn {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  color: #034563;
  transition: all 0.3s ease;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  box-sizing: border-box;
}
.dropdown-menu .nav-btn:hover {
  background-color: rgba(3,69,99,0.1);
  color: #000;
}
.dropdown-menu .nav-btn.active {
  background-color: rgba(3,69,99,0.9);
  color: #fff;
}
</style>








  
  
  
  
  
  
  
  
  
  
  

  