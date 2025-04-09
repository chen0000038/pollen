<template>
    <div class="home-container">
      <!-- 导航栏 -->
      <Navbar />
  
      <!-- 顶部横幅（banner） -->
      <div class="banner">
        <h1 class="banner-title">
          Do you know Melbourne is the city with the most severe pollen allergy?
        </h1>
      </div>
  
      <!-- 功能区 -->
      <section class="features-wrapper">
      <div class="features-grid">
        <!-- 板块1 -->
        <div class="feature-block">
          <h2 class="feature-subtitle">How severe is the pollen around me?</h2>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3 class="feature-title">Personal Pollen Tracker</h3>
            <p class="feature-desc">Track your pollen exposure</p>
            <router-link to="/pollentracker">
              <button class="feature-btn">Start exploring</button>
            </router-link>
          </div>
        </div>
  
        <!-- 板块2 -->
        <div class="feature-block">
          <h2 class="feature-subtitle">Seeking for a personalized solution?</h2>
          <div class="feature-card">
            <div class="feature-icon">💓</div>
            <h3 class="feature-title">Get Personalized Suggestion</h3>
            <p class="feature-desc">Personalized allergy education platform that customizes learning content based on your sepcific pollen sensitivities</p>
            <router-link to="/personalisation">
              <button class="feature-btn">Start customizing</button>
            </router-link>
          </div>
        </div>
  
        <!-- 板块3 -->
        <div class="feature-block">
          <h2 class="feature-subtitle">Learning allergen around me?</h2>
          <div class="feature-card">
            <div class="feature-icon">💡</div>
            <h3 class="feature-title">Educational Resources</h3>
            <p class="feature-desc">Learn about pollen and allergies</p>
            <router-link to="/polleninfo">
              <button class="feature-btn">Learn More</button>
            </router-link>
          </div>
        </div>
  
        <!-- 板块4 -->
        <div class="feature-block">
          <h2 class="feature-subtitle">Having an interactive game?</h2>
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h3 class="feature-title">Challenging Game</h3>
            <p class="feature-desc">Distinguish allergen with other plants</p>
            <router-link to="/game">
              <button class="feature-btn">Start game</button>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
  </template>
  
  <script setup>
  import Navbar from '../components/Navbar.vue'
  </script>
  
  <style scoped>
  /* 页面主容器：铺满整个宽度 */
  .home-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: transparent; /* 背景由伪元素提供 */
}

.home-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("/background.png") center center / cover no-repeat;
  filter: blur(8px);
  z-index: -1; /* 置于所有内容下方 */
}

.content-area {
  margin-top: 60px; /* 根据导航栏高度调整 */
  position: relative;
  z-index: 1;
  padding: 1rem;
}
  
  /* =========================
     顶部横幅（banner）
  ========================= */
  .banner {
    width: 100%;
    height: 250px; /* 根据需要调整高度 */
    background: url("../assets/back.png") center center / cover no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .banner-title {
    color: #ffffff;
    font-size: 1.5rem;
    text-align: center;
    padding: 0 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
    /* 移除 max-width 让文字容器也铺满 */
  }
  
  /* =========================
     功能卡片区域
  ========================= */
  .features-wrapper {
    width: 95%;
    padding: 1rem; /* 可根据需要调整左右内边距 */
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  /* 每个板块 */
  .feature-block {
    text-align: center;
  }
  
  .feature-subtitle {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  
  .feature-card {
    border: 1px solid #ddd;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: box-shadow 0.2s;
  }
  
  .feature-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .feature-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .feature-desc {
    color: #666;
    margin-bottom: 1rem;
  }
  
  .feature-btn {
    background-color: #2563eb;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .feature-btn:hover {
    background-color: #1d4ed8;
  }
  
  /* 响应式：窄屏下一列 */
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
  
  
  
  
  
  
  
  
  
  
  
  
  