<template>
    <div class="home-container">
      <Navbar />
  
      <div class="banner">
        <video autoplay muted loop playsinline>
          <source src="/pollenallergy.mp4" type="video/mp4">
        </video>
        <div class="banner-content">
          <h1 class="banner-title">
            Do you know Melbourne is the city with the most severe pollen allergy?
          </h1>
          <router-link to="/pollentracker">
            <button class="start-exploring-btn">Start Exploring</button>
          </router-link>
        </div>
      </div>
  
      <section class="features-wrapper">
      <div class="features-grid">
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
  
        <div class="feature-block">
          <h2 class="feature-subtitle">Seeking for a personalized solution?</h2>
          <div class="feature-card">
            <div class="feature-icon">💓</div>
            <h3 class="feature-title">Get Personalized Suggestion</h3>
            <p class="feature-desc">Personalized allergy education platform</p>
            <router-link to="/personalisation">
              <button class="feature-btn">Start customizing</button>
            </router-link>
          </div>
        </div>
  
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
  .home-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: transparent;
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
  z-index: -1;
}

.content-area {
  margin-top: 60px;
  position: relative;
  z-index: 1;
  padding: 1rem;
}
  

  .banner {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-top: 0;
  }
  
  .banner video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }
  
  .banner::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
  }
  
  .banner-content {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    margin-top: -100px;
    width: 100%;
    padding: 0 2rem;
  }
  
  .banner-title {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.4rem;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5),
                 0 0 10px rgba(0, 0, 0, 0.3);
    line-height: 1.3;
    font-weight: 600;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  
  @media (min-width: 768px) {
    .banner-title {
      font-size: 1.6rem;
    }
  }
  
  @media (min-width: 1024px) {
    .banner-title {
      font-size: 1.8rem;
    }
  }
  
  .start-exploring-btn {
    padding: 1rem 2.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    background-color: transparent;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .start-exploring-btn:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .features-wrapper {
    width: 100%;
    padding: 2rem;
    margin: 0 auto;
    max-width: 1400px;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 0 auto;
  }
  
  .feature-block {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .feature-subtitle {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #2563eb;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .feature-card {
    border: 1px solid #ddd;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: box-shadow 0.2s;
    background-color: rgba(245, 240, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    width: 100%;
    max-width: 550px;
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
  
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
  
  
  
  
  
  
  
  
  
  
  
  
  