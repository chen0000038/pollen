<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/" class="logo-link">
          <img src="/logo.png" alt="Logo" class="logo" />
          <span class="site-title">Melbourne Pollen Monitor</span>
        </router-link>
      </div>
      <div class="navbar-right">
        <router-link to="/" class="nav-btn">Home</router-link>
        <router-link to="/pollentracker" class="nav-btn">Pollen Tracker</router-link>
        <router-link to="/personalisation" class="nav-btn">Personalisation</router-link>
        <router-link to="/polleninfo" class="nav-btn">Education Resources</router-link>
        <router-link to="/game" class="nav-btn">Game</router-link>
      </div>
    </div>
  </nav>
</template>

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
  height: 65px;
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
</style>

  
  
  
  
  
  
  
  
  
  
  

  