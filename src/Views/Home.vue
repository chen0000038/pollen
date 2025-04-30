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
          <p class="hero-subtitle">Your Essential Guide to Manage Pollen Allergies in Melbourne</p>
          <div class="hero-buttons">
            <router-link to="/pollentracker">
              <button class="primary-btn">Check Today's Pollen Level</button>
            </router-link>
            <router-link to="/simulator">
              <button class="secondary-btn">Get Personalized Advice</button>
            </router-link>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <h2 class="stats-title">The Pollen Crisis</h2>
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon">
              <img src="/Statemnt 1.png" alt="Stat Icon 1" class="stat-image" />
            </div>
            <h3 class="stat-number">31.8%<span class="stat-highlight"> | 3 in 10</span></h3>
            <p class="stat-description">Melbourne residents experience allergic rhinitis</p>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <img src="/Statemnt 2.png" alt="Stat Icon 2" class="stat-image" />
            </div>
            <h3 class="stat-number">One in four</h3>
            <p class="stat-description">People with allergic rhinitis (hay fever) also have asthma</p>
        </div>
  
          <div class="stat-card">
            <div class="stat-icon">
              <img src="/5.png" alt="Stat Icon 3" class="stat-image" />
            </div>
            <h3 class="stat-number">4 months</h3>
            <p class="stat-description">Melbourne pollen fever will last from September each year to January of the following year</p>
          </div>
        </div>
  
        <div class="scroll-indicator">
          <div class="chevron"></div>
          <div class="chevron"></div>
          <div class="chevron"></div>
        </div>
      </section>

      <section class="features-navigation">
        <div class="features-timeline">
          <div class="timeline-connector"></div>
          <router-link to="/pollentracker" class="feature-item">
            <div class="feature-bubble">
              <div class="feature-icon red">
                <img src="/icons/gauge.svg" alt="Tracker Icon" />
              </div>
            </div>
            <div class="feature-dots">
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
              </div>
            <div class="feature-text-container">
              <h3>Pollen Tracker</h3>
              
              <div class="feature-description">
                <p>Real-time Pollen Index Tracker</p>
              </div>
            </div>
          </router-link>

          <router-link to="/polleninfo" class="feature-item">
            <div class="feature-bubble">
              <div class="feature-icon brown">
                <img src="/icons/book.svg" alt="Education Icon" />
              </div>
            </div>
            <div class="feature-dots">
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
              </div>
            <div class="feature-text-container">
              <h3>Education Resource</h3>
              <div class="feature-description">
                <p>Get some Pollen Knowledge</p>
              </div>
            </div>
          </router-link>

          <router-link to="/simulator" class="feature-item">
            <div class="feature-bubble">
              <div class="feature-icon yellow">
                <img src="/icons/chart-monitor.svg" alt="Simulator Icon" />
              </div>
            </div>
            <div class="feature-dots">
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
              </div>
            <div class="feature-text-container">
              <h3>Pollen Buddy</h3>
              
              <div class="feature-description">
                <p>Personal life pollen Simulator</p>
              </div>
            </div>
          </router-link>

          <router-link to="/forecasting" class="feature-item">
            <div class="feature-bubble">
              <div class="feature-icon green">
                <img src="/icons/chart-growth.svg" alt="Forecast Icon" />
              </div>
            </div>
            <div class="feature-dots">
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
              </div>
            <div class="feature-text-container">
              <h3>Pollen Forecast</h3>
              <div class="feature-description">
                <p>Pollen index prediction</p>
              </div>
            </div>
          </router-link>

          <router-link to="/forecasting" class="feature-item">
            <div class="feature-bubble">
              <div class="feature-icon cyan">
                <img src="/icons/calendar.svg" alt="Alert Icon" />
              </div>
            </div>
            <div class="feature-dots">
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
              </div>
            <div class="feature-text-container">
              <h3>Pollen Alert</h3>
              <div class="feature-description">
                <p>Synchronize to calendar</p>
              </div>
            </div>
          </router-link>

          <router-link to="" class="feature-item">
            <div class="feature-bubble">
              <div class="feature-icon blue">
                <img src="/icons/chess-knight.svg" alt="Strategy Icon" />
              </div>
            </div>
            <div class="feature-dots">
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
              </div>
            <div class="feature-text-container">
              <h3></h3>
              
              <div class="feature-description">
                <p></p>
              </div>
            </div>
          </router-link>

          <router-link to="" class="feature-item">
            <div class="feature-bubble">
              <div class="feature-icon purple">
                <img src="/icons/chess-knight.svg" alt="Planner Icon" />
              </div>
            </div>
            <div class="feature-dots">
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
                <div class="feature-dot"></div>
              </div>
            <div class="feature-text-container">
              <h3></h3>
              
              <div class="feature-description">
                <p></p>
              </div>
            </div>
          </router-link>
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
                <h3>Melbourne Pollen Index</h3>
                <p>Access real-time and forecasted pollen data for Melbourne. Stay informed and plan ahead with our professional monitoring tools.</p>
                <div class="step-btn-group">
                  <router-link to="/pollentracker">
                    <button class="primary-btn">Today's Index</button>
                  </router-link>
                  <router-link to="/forecasting">
                    <button class="secondary-btn">Forecast</button>
                  </router-link>
                </div>
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
                <p>Choose your way to receive tailored advice for your allergy management.</p>
                <div class="step-btn-group">
                  <router-link to="/personalisation">
                    <button class="primary-btn">Allergy Profile Advice</button>
                  </router-link>
                  <router-link to="/simulator">
                    <button class="secondary-btn">Lifestyle & Environment Simulator</button>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="step-visual">
              <img src="/images/hrecommendation.jpg" alt="Personalized Advice" />
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
              <img src="/images/heducation.webp" alt="Pollen Education" />
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
              <img src="/images/hquiz.png" alt="Interactive Learning" />
            </div>
          </div>
        </div>
      </section>
  
      <section class="quick-access">
        <h2>Quick Resources for New Melbourne Residents</h2>
        <div class="resource-grid">
          <router-link to="/forecasting" class="resource-card">
            <i class="fas fa-map-marker-alt"></i>
            <h4>Forecasting</h4>
            <p>Pollen Forecasting Engine and notification</p>
          </router-link>
          <router-link to="/dashboard" class="resource-card">
            <i class="fas fa-calendar-alt"></i>
            <h4>Dashboard</h4>
            <p>.....</p>
          </router-link>
          <router-link to="/simulator" class="resource-card">
            <i class="fas fa-first-aid"></i>
            <h4>Personalization</h4>
            <p>Get personalized advice and risk alerts based on your lifestyle, protective measures, and home environment</p>
          </router-link>
          <router-link to="/route-planning" class="resource-card">
            <i class="fas fa-book-medical"></i>
            <h4>Pollen-Safe Route Planning</h4>
            <p>......</p>
          </router-link>
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
  font-size: 3.8rem;
  font-weight: 900;
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
  padding: 0.6rem 1.5rem;
  border-radius: 24px;
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

.step-details {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  color: inherit;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.resource-card i {
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.resource-card h4 {
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #05674d;
}

.resource-card p {
  color: #22b573;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
  transition: color 0.2s;
}

.resource-card:hover p {
  color: #179c5a;
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

.stats-section {
  padding: 2rem 2rem 4rem;
  background-color: #f8fafc;
  position: relative;
}

.stats-title {
  text-align: center;
  color: #2F5A43;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.stats-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
}

.stat-card {
  flex: 1;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  margin-bottom: 1rem;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2F5A43;
    margin-bottom: 0.5rem;
  line-height: 1.2;
}

.stat-highlight {
  color: #FF7F50;
}

.stat-description {
  color: #4A5568;
  font-size: 0.9rem;
  line-height: 1.4;
  max-width: 200px;
  margin: 0 auto;
}

.scroll-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 60px;
}

.chevron {
  width: 30px;
  height: 4px;
  opacity: 0;
  transform: scale(0.3);
  animation: scroll-down-anim 2s infinite;
}

.chevron:before,
.chevron:after {
  content: '';
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  background: #2F5A43;
}

.chevron:before {
  left: 0;
  transform: skewY(30deg);
}

.chevron:after {
  right: 0;
  transform: skewY(-30deg);
}

.chevron:first-child {
  animation-delay: 0s;
}

.chevron:nth-child(2) {
  animation-delay: 0.2s;
}

.chevron:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes scroll-down-anim {
  0% {
    opacity: 0;
    transform: translate3d(0, -20px, 0) scale(0.3);
  }
  50% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate3d(0, 20px, 0) scale(0.3);
  }
}

@media (max-width: 768px) {
  .stats-container {
    flex-direction: column;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .stats-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .stat-description {
    max-width: 100%;
  }

  .scroll-indicator {
    bottom: 10px;
    }
  }

.step-btn-group {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  justify-content: center;
}

.today-btn {
  background-color: #2563eb;
  color: #fff;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
}

.forecast-btn {
  background-color: #fff;
  color: #2563eb;
  border: 2px solid #2563eb;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
}

.today-btn:hover, .forecast-btn:hover {
  filter: brightness(0.95);
  transform: translateY(-2px);
}

.personal-btn {
  background-color: #2563eb;
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  margin-right: 0.5rem;
  transition: all 0.3s;
}
.simulator-btn {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  margin-left: 0.5rem;
  transition: all 0.3s;
}
.personal-btn:hover, .simulator-btn:hover {
  filter: brightness(0.95);
  transform: translateY(-2px);
}

.primary-btn, .step-btn, .personal-btn {
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.6rem 1.5rem;
  margin: 0 0.5rem;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
  cursor: pointer;
}
.primary-btn:hover, .step-btn:hover, .personal-btn:hover {
  background-color: #174bb1;
  filter: brightness(0.97);
  transform: translateY(-2px);
}
.secondary-btn, .forecast-btn {
  background-color: #fff;
  color: #2563eb;
  border: 2px solid #2563eb;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.6rem 1.5rem;
  margin: 0 0.5rem;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
  cursor: pointer;
}
.secondary-btn:hover, .forecast-btn:hover {
  background-color: #f0f6ff;
  filter: brightness(0.98);
  transform: translateY(-2px);
}

.forecast-link {
  color: #22b573;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}
.forecast-link:hover {
  text-decoration: underline;
  color: #179c5a;
}

.features-navigation {
  padding: 4rem 3rem;
  background: #ffffff;
  position: relative;
}

.features-timeline {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 4rem 0;
}

.timeline-connector {
  position: absolute;
  top: 210px; /* Adjusted to be below icons */
  left: 0;
  right: 0;
  height: 8px;
  background: #e0e0e0;
  z-index: 0;
}

.feature-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  flex: 1;
  max-width: 180px;
  z-index: 1;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

/* 设置每个项目的主色调 */
.feature-item:nth-child(1) { --feature-color: #ff6b6b; }
.feature-item:nth-child(2) { --feature-color: #d4a373; }
.feature-item:nth-child(3) { --feature-color: #ffd43b; }
.feature-item:nth-child(4) { --feature-color: #4caf50; }
.feature-item:nth-child(5) { --feature-color: #22d3ee; }
.feature-item:nth-child(6) { --feature-color: #2563eb; }
.feature-item:nth-child(7) { --feature-color: #9333ea; }

/* 图标颜色 */
.feature-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.feature-icon img {
  width: 45px;
  height: 45px;
  filter: brightness(0) invert(1);
  opacity: 1;
  transition: all 0.3s ease;
}

/* 图标颜色和内部图案样式 */
.feature-icon.red { 
  background: var(--feature-color);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}
.feature-icon.brown { 
  background: var(--feature-color);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}
.feature-icon.yellow { 
  background: var(--feature-color);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}
.feature-icon.green { 
  background: var(--feature-color);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}
.feature-icon.cyan { 
  background: var(--feature-color);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}
.feature-icon.blue { 
  background: var(--feature-color);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}
.feature-icon.purple { 
  background: var(--feature-color);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}

/* 鼠标悬停效果增强 */
.feature-item:hover .feature-icon {
  transform: scale(1.05);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.15);
}

.feature-item:hover .feature-icon img {
  transform: scale(1.1);
}

/* 标题颜色 */
.feature-text-container h3 {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
  color: var(--feature-color);
  order: -1;
  transition: color 0.3s ease;
}

/* 点的颜色 */
.feature-item:nth-child(1) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(2) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(3) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(4) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(5) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(6) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(7) .feature-dot { background: var(--feature-color); }

/* 描述框样式 */
.feature-description {
  background: #fafafa;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  width: 100%;
  text-align: center;
  position: relative;
  border: 1px solid #eee;
  margin-top: 0;
  order: 1;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.feature-description p {
  font-size: 0.85rem;
  color: var(--feature-color);
  margin: 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}

/* 鼠标悬停效果 */
.feature-item:hover .feature-bubble {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-bubble {
  width: 140px;
  height: 140px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 35px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-dots {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 0;
  height: auto;
  padding: 4px 0;
}

.feature-item:nth-child(even) .feature-dots {
  flex-direction: column;
}

.feature-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #d1a9a9;
}

.feature-item:nth-child(1) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(2) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(3) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(4) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(5) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(6) .feature-dot { background: var(--feature-color); }
.feature-item:nth-child(7) .feature-dot { background: var(--feature-color); }

@media (max-width: 1200px) {
  .features-timeline {
    flex-wrap: wrap;
    gap: 3rem;
    justify-content: center;
  }

  .timeline-connector {
    display: none;
  }

  .feature-item {
    width: calc(33.33% - 3rem);
    max-width: none;
  }

  .feature-item:nth-child(even) .feature-text-container,
  .feature-item:nth-child(odd) .feature-text-container {
    flex-direction: column;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .feature-item:nth-child(even) .feature-dots {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .feature-item {
    width: calc(50% - 3rem);
  }
}

@media (max-width: 480px) {
  .feature-item {
    width: 100%;
  }
}
  </style>
  
  
  
  
  
  
  
  
  
  
  
  
  