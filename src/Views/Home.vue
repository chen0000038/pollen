<template>
    <div class="home-container">
      <Navbar />
      <section class="hero-section">
        <div class="video-background">
          <video autoplay muted loop playsinline>
            <source src="/background.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        <div class="hero-content">
          <h1>Melbourne Pollen Monitor</h1>
          <p class="hero-subtitle">Your Essential Guide to Managing Pollen Allergies in Melbourne</p>
          <div class="hero-buttons">
            <router-link to="/pollentracker">
              <button class="primary-btn">Check Today's Pollen Level</button>
            </router-link>
            <router-link to="/personalisation">
              <button class="secondary-btn">Get Personalized Advice</button>
            </router-link>
          </div>
        </div>
      </section>

      <section class="journey-section">
        <div class="journey-header">
          <h2>Your Journey to Better Health in Melbourne</h2>
          <p>Follow these steps to manage your pollen allergies effectively</p>
        </div>
  
        <div class="journey-path">
          <div class="journey-step">
            <div class="step-content left">
              <div class="step-details">
                <h3>Check Current Pollen Levels</h3>
                <p>Get real-time pollen index to Melbourne's unique climate.</p>
                <router-link to="/pollentracker">
                  <button class="step-btn">View Pollen Map</button>
                </router-link>
              </div>
            </div>
            <div class="step-visual">
              <img src="/images/pollen-tracker.jpg" alt="Melbourne Pollen Map" />
            </div>
            <div class="full-chevron-arrows green">
              <div class="full-chevron"></div>
              <div class="full-chevron"></div>
              <div class="full-chevron"></div>
            </div>
          </div>
  
          <div class="journey-step reverse">
            <div class="step-content right">
              <div class="step-details">
                <h3>Get Personalized Recommendations</h3>
                <p>Receive tailored advice based on your allergy profile.</p>
                <router-link to="/personalisation">
                  <button class="step-btn">Personalize Now</button>
                </router-link>
              </div>
            </div>
            <div class="step-visual">
              <img src="/images/personalized.jpg" alt="Personalized Advice" />
            </div>
            <div class="full-chevron-arrows blue">
              <div class="full-chevron"></div>
              <div class="full-chevron"></div>
              <div class="full-chevron"></div>
            </div>
          </div>
  
          <div class="journey-step">
            <div class="step-content left">
              <div class="step-details">
                <h3>Learn About Melbourne's Pollen</h3>
                <p>Understand common allergens in Melbourne and how to identify them.</p>
                <router-link to="/polleninfo">
                  <button class="step-btn">Start Learning</button>
                </router-link>
              </div>
            </div>
            <div class="step-visual">
              <img src="/images/education.jpg" alt="Pollen Education" />
            </div>
            <div class="full-chevron-arrows orange">
              <div class="full-chevron"></div>
              <div class="full-chevron"></div>
              <div class="full-chevron"></div>
            </div>
          </div>
  
          <div class="journey-step reverse">
            <div class="step-content right">
              <div class="step-details">
                <h3>Practice & Engage</h3>
                <p>Test your knowledge about Melbourne's pollen types through interactive activities.</p>
                <router-link to="/game">
                  <button class="step-btn">Try Activities</button>
                </router-link>
              </div>
            </div>
            <div class="step-visual">
              <img src="/images/interactive.jpg" alt="Interactive Learning" />
            </div>
          </div>
        </div>
      </section>
  
      <section class="quick-access">
        <h2>Quick Resources for New Melbourne Residents</h2>
        <div class="resource-grid">
          <div class="resource-card">
            <i class="fas fa-map-marker-alt"></i>
            <h4>Forecasting</h4>
            <p>Pollen Forecasting Engine and notification</p>
          </div>
          <div class="resource-card">
            <i class="fas fa-calendar-alt"></i>
            <h4>Dashboard</h4>
            <p>Health Impact Dashboard</p>
          </div>
          <div class="resource-card">
            <i class="fas fa-first-aid"></i>
            <h4>Personalizationo</h4>
            <p>......</p>
          </div>
          <div class="resource-card">
            <i class="fas fa-book-medical"></i>
            <h4>Pollen-Safe Route Planning</h4>
            <p>......</p>
          </div>
        </div>
      </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
</script>

<style scoped>
.home-container {
  width: 100%;
  background-color: #f8fafc;
}

.hero-section {
  height: 53vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.video-background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-btn, .secondary-btn {
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.primary-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.secondary-btn {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.journey-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.journey-header {
  text-align: center;
  margin-bottom: 4rem;
}

.journey-header h2 {
  font-size: 2.5rem;
  color: #1a365d;
  margin-bottom: 1rem;
}

.journey-path {
  position: relative;
}

.journey-step {
  display: flex;
  align-items: center;
  margin-bottom: 6rem;
  position: relative;
}

.journey-step.reverse {
  flex-direction: row-reverse;
}

.step-content {
  flex: 1;
  padding: 2rem;
  position: relative;
}

.step-number {
  width: 50px;
  height: 50px;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.step-details h3 {
  font-size: 1.8rem;
  color: #1a365d;
  margin-bottom: 1rem;
}

.step-visual {
  flex: 1;
  padding: 2rem;
}

.step-visual img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.full-chevron-arrows {
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 80px;
  height: 120px;
}

.full-chevron {
  width: 100%;
  height: 5px;
  position: relative;
  opacity: 0;
  animation: fadeInChevron 2s infinite;
}

.full-chevron::before,
.full-chevron::after {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  background: currentColor;
  top: 0;
}

.full-chevron::before {
  left: 0;
  transform: skewY(35deg);
}

.full-chevron::after {
  right: 0;
  transform: skewY(-35deg);
}

.full-chevron:nth-child(1) {
  animation-delay: 0s;
}

.full-chevron:nth-child(2) {
  animation-delay: 0.2s;
}

.full-chevron:nth-child(3) {
  animation-delay: 0.4s;
}

.full-chevron-arrows.green .full-chevron {
  color: #4CAF50;
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
}

.full-chevron-arrows.blue .full-chevron {
  color: #2196F3;
  filter: drop-shadow(0 2px 4px rgba(33, 150, 243, 0.3));
}

.full-chevron-arrows.orange .full-chevron {
  color: #FF8C69;
  filter: drop-shadow(0 2px 4px rgba(255, 140, 105, 0.3));
}

@keyframes fadeInChevron {
  0% {
    opacity: 0;
    transform: translateY(-15px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(15px);
  }
}

.journey-step:last-child .full-chevron-arrows {
  display: none;
}

.step-btn {
  background-color: #2563eb;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quick-access {
  background-color: #f1f5f9;
  padding: 4rem 2rem;
  text-align: center;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto 0;
}

.resource-card {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-5px);
}

.resource-card i {
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .journey-step {
    flex-direction: column;
  }

  .journey-step.reverse {
    flex-direction: column;
  }

  .full-chevron-arrows {
    bottom: -120px;
    width: 60px;
    height: 90px;
    gap: 12px;
  }

  .full-chevron {
    height: 4px;
  }

  .step-content {
    order: 2;
  }

  .step-visual {
    order: 1;
  }
}

.journey-step:hover .full-chevron {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  opacity: 1 !important;
}
</style>
  
  
  
  
  
  
  
  
  
  
  
  
  