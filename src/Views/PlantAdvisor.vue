<template>
  <div class="min-h-screen bg-gray-50 personalisation-page">
    <Navbar />

    <div v-if="showSystemMessage" class="system-message">
      <div class="system-message-content">
        <span class="message-icon">⚠️</span>
        <span class="message-text">{{ systemMessage }}</span>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="main-container">
      <div class="section-header">
        <h1>Plant Advisor</h1>
        <p><strong>Hover</strong> the card to plant it into the bottom field and get your personalized planting recommendations.</p>
      </div>

      <!-- SECTION 1: Seasonal Plants Display -->
      <section class="bg-white py-4">
        <div class="overview-container">
          <div class="container mx-auto px-4">
            <div class="mb-6 flex justify-center">
              <div class="flex space-x-2">
                <button
                  v-for="season in seasons"
                  :key="season.id"
                  @click="setActiveSeason(season.id)"
                  :class="[ 'season-button', activeSeason===season.id
                    ? 'season-button-active'
                    : 'season-button-inactive' ]"
                >
                  {{ season.name }}
                </button>
              </div>
            </div>
            
            <h3 class="text-xl font-semibold text-center mb-6">🌱Available Plants for {{ seasons.find(s => s.id === activeSeason).name }}</h3>
            
            <div v-if="isLoading" class="loading-container">
              <div class="loading-spinner"></div>
              <p class="loading-text">Loading plants data...</p>
            </div>
            
            <div v-else-if="error" class="error-message">
              <p>{{ error }}</p>
              <button @click="fetchPlantData" class="retry-button">Retry</button>
            </div>
            
            <!-- Plants Grid: 3 per row -->
            <div v-else class="plants-grid">
              <div 
                v-for="plant in availablePlants" 
                :key="plant.name" 
                class="plant-card"
                @mouseover="hoveredPlant = plant"
                @mouseleave="hoveredPlant = null"
              >
                <div class="plant-image">
                  <img 
                    :src="plant.image" 
                    :alt="plant.name" 
                    @error="handleImageError($event, plant)" 
                  />
                </div>
                <div class="plant-content">
                  <div class="plant-header">
                    <div class="name-risk-row">
                      <h3>{{ plant.name }}</h3>
                      <div class="pollen-risk" :class="plant.pollenRiskLevel.toLowerCase()">
                        <span v-if="plant.pollenRiskLevel === 'High'" class="risk-icon">⚠️</span>
                        <span class="risk-text" :class="{ 'risk-text-high': plant.pollenRiskLevel === 'High' }">{{ plant.pollenRiskLevel }} Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="hoveredPlant && hoveredPlant.name === plant.name" class="add-button-overlay">
                  <button @click="addPlantToField(plant)" class="add-plant-button">
                    <span>Add to Field</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 2: Planting Area - Drag & Drop -->
      <section class="bg-amber-50 py-4">
        <div class="overview-container">
          <div class="container mx-auto px-4">
            <!-- Planting Field -->
            <div class="planting-field-container">
              <h3 class="field-title">Planting Field <span class="field-subtitle">- Click "Get My Recommendations" button to get your advise</span></h3>
              
              <div class="planting-grid">
                <div
                  v-for="(cell, idx) in plantingField"
                  :key="idx"
                  class="planting-cell"
                  :class="{ 'cell-planted': cell.planted }"
                >
                  <span v-if="!cell.planted" class="corner-icon top-left">🌱</span>
                  <span v-if="!cell.planted" class="corner-icon top-right">🌱</span>
                  <span v-if="!cell.planted" class="corner-icon bottom-left">🌱</span>
                  <span v-if="!cell.planted" class="corner-icon bottom-right">🌱</span>
                  
                  <div v-if="cell.planted" class="planted-content">
                    <img 
                      :src="cell.plant.image" 
                      :alt="cell.plant.name" 
                      class="planted-image" 
                      @error="handleImageError($event, cell.plant)" 
                    />
                    <button
                      @click="removePlant(idx)"
                      class="remove-button"
                    >
                      ✕
                    </button>
                    <div class="plant-label">
                      {{ cell.plant.name }}
                    </div>
                  </div>
                  <div v-else class="empty-cell">
                    <i class="fas fa-plus-circle"></i>
                    <span>Empty Slot</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-center mb-8">
              <div class="button-container">
                <button 
                  @click="generateRecommendations" 
                  class="btn-simulator btn-primary assess-btn"
                  :class="{ 'btn-disabled': plantedCount === 0 }"
                  :disabled="plantedCount === 0"
                >
                  <i class="fas fa-chart-bar mr-2"></i> Get My Recommendations 📝
                </button>
                <button 
                  @click="resetSelection" 
                  class="btn-simulator btn-secondary reset-btn"
                  :disabled="plantedCount === 0"
                  :class="{ 'btn-disabled': plantedCount === 0 }"
                >
                  Reset My Choice 🔄
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 3: Plant Information for Selected Plants -->
      <section v-if="showRecommendations" class="bg-gray-50 py-8">
        <div class="overview-container">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">Your Selected Plants Information</h2>
            <p class="text-gray-600 text-center mb-8">Details about your selected plants and how to care for them</p>
          
            <div v-if="isLoading" class="loading-container">
              <div class="loading-spinner"></div>
              <p class="loading-text">Loading recommendations...</p>
            </div>
            
            <div v-else-if="error" class="error-message">
              <p>{{ error }}</p>
              <button @click="fetchPlantData" class="retry-button">Retry</button>
            </div>
          
            <div v-else class="plants-grid">
              <div 
                v-for="plant in displayedPlants" 
                :key="plant.name" 
                class="plant-card"
              >
                <div class="plant-image">
                  <img 
                    :src="plant.image" 
                    :alt="plant.name" 
                    @error="handleImageError($event, plant)" 
                  />
                </div>
                <div class="plant-content">
                  <div class="plant-header">
                    <div class="name-risk-row">
                      <h3>{{ plant.name }}</h3>
                      <div class="pollen-risk" :class="plant.pollenRiskLevel.toLowerCase()">
                        <span v-if="plant.pollenRiskLevel === 'High'" class="risk-icon">⚠️</span>
                        <span class="risk-text" :class="{ 'risk-text-high': plant.pollenRiskLevel === 'High' }">{{ plant.pollenRiskLevel }} Risk</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="simple-info">
                    <p class="info-row"><span class="info-key">🗒️Description:</span> {{ plant.description }}</p>
                    <p class="info-row">
                      <span class="info-key" :style="plant.pollenRiskLevel === 'High' ? 'color: #dc2626;' : ''">🤧Symptoms:</span> 
                      {{ plant.symptoms }}
                    </p>
                    <p class="info-row">
                      <span class="info-key" :style="plant.pollenRiskLevel === 'High' ? 'color: #dc2626;' : ''">📅Care Instructions:</span> 
                      {{ plant.instructions }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Page Recommendations -->
  <div class="page-recommendations">
    <div class="recommendation-links">
      <router-link to="/simulator" class="recommend-btn">Go to simulator</router-link>
      <router-link to="/pollentracker" class="recommend-btn">Go to Pollen Tracker</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'

const isLoading = ref(true)
const error = ref(null)

// Current season based on date
const currentSeason = ref(getSeason())

// S3 base paths for images
const s3BasePath = 'https://tp30bucket1.s3.ap-southeast-2.amazonaws.com/Picture'

// Active season for selection - default to current season
const activeSeason = ref(getCurrentSeasonId())

// Function to get current season ID
function getCurrentSeasonId() {
const month = new Date().getMonth()
if (month >= 9 && month <= 11) return 'spring'
if (month >= 12 && month <= 2) return 'summer'
if (month >= 3 && month <= 5) return 'autumn'
return 'winter'
}

// Seasons data with updated images
const seasons = ref([
{
  id: 'spring',
  name: 'Spring',
  image: `${s3BasePath}/Spring/Spring-landscape.jpg`,
  weatherDescription: 'Mild temperatures with occasional rain showers, perfect for new growth.',
  plantingPeriod: 'September to November',
  recommendedPlants: ['Tomatoes', 'Peppers', 'Beans', 'Carrots', 'Lettuce']
},
{
  id: 'summer',
  name: 'Summer',
  image: `${s3BasePath}/Summer/Summer-landscape.jpg`,
  weatherIcon: 'fa-sun',
  weatherDescription: 'Warm to hot temperatures with longer daylight hours, good for heat-loving plants.',
  plantingPeriod: 'December to February',
  recommendedPlants: ['Basil', 'Bottlebrush', 'Cypress', 'Lemon', 'Ryegrass', 'Strawberry', 'Tomato', 'Zinnia']
},
{
  id: 'autumn',
  name: 'Autumn',
  image: `${s3BasePath}/Autumn/Autumn-landscape.jpg`,
  weatherIcon: 'fa-leaf',
  weatherDescription: 'Cooling temperatures and shorter days, ideal for cool-season crops.',
  plantingPeriod: 'March to May',
  recommendedPlants: ['Beetroot', 'Birch', 'Camellia', 'English Plantain', 'Lettuce', 'Ragweed', 'Spinach', 'Sweet Pea', 'White Cypress']
},
{
  id: 'winter',
  name: 'Winter',
  image: `${s3BasePath}/Winter/Winter-landscape.jpg`,
  weatherIcon: 'fa-snowflake',
  weatherDescription: 'Cold temperatures with possible frost or snow, limited outdoor growing.',
  plantingPeriod: 'June to August',
  recommendedPlants: ['Garlic', 'Onion', 'Snow Peas', 'Rosemary', 'Juniper', 'Cedar', 'Hazel', 'Alder']
}
])

const plantData = ref([])

async function fetchPlantData() {
isLoading.value = true
error.value = null

try {
  const response = await fetch('https://c4k5zme236.execute-api.ap-southeast-2.amazonaws.com/build-production/build')
  
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  
  const data = await response.json()
  
  if (data && data.descriptionResults && Array.isArray(data.descriptionResults)) {
    plantData.value = data.descriptionResults.map(item => {
      const plantName = item['Plant Name'].trim()
      const season = item['Season'].toLowerCase()
      const imagePath = `${s3BasePath}/${season.charAt(0).toUpperCase() + season.slice(1)}/${plantName.replace(/\s+/g, ' ')}.jpg`
      
      return {
        name: plantName,
        season: season,
        pollenRiskLevel: item['Pollen Risk Level'],
        description: item['Description'],
        symptoms: item['Symptoms'],
        instructions: item['Instruction'],
        image: imagePath
      }
    })
  } else {
    throw new Error('Invalid data format from API')
  }
} catch (err) {
  console.error('Error fetching plant data:', err)
  error.value = `Failed to load plant data: ${err.message}`
  plantData.value = []
} finally {
  isLoading.value = false
}
}

onMounted(() => {
fetchPlantData()
})

const seasonalPlants = computed(() => {
if (isLoading.value) return []

const plants = plantData.value.filter(plant => plant.season === activeSeason.value)

plants.forEach(plant => {
  if (!plant.image || !plant.image.includes(s3BasePath)) {
    const defaultImages = {
      'spring': `${s3BasePath}/Spring/Spring-landscape.jpg`,
      'summer': `${s3BasePath}/Summer/Summer-landscape.jpg`,
      'autumn': `${s3BasePath}/Autumn/Autumn-landscape.jpg`,
      'winter': `${s3BasePath}/Winter/Winter-landscape.jpg`
    }
    
    plant.image = defaultImages[plant.season] || defaultImages['spring']
  }
})

return plants
})

const availablePlants = computed(() => {
const plantedNames = plantingField.value
  .filter(cell => cell.planted)
  .map(cell => cell.plant.name)

return seasonalPlants.value.filter(plant => !plantedNames.includes(plant.name))
})

const systemMessage = ref('')
const showSystemMessage = ref(false)

const hoveredPlant = ref(null)

// Planting Area state
const maxPlants = ref(6)
const plantedCount = ref(0)
const showRecommendations = ref(false)
const plantingField = ref(
Array.from({ length: 6 }, () => ({
  planted: false,
  plant: null
}))
)

const selectedPlantDetails = computed(() => {
return plantingField.value
  .filter(cell => cell.planted)
  .map(cell => {
    return plantData.value.find(p => p.name === cell.plant.name)
  })
})

const displayedPlants = ref([])

// Functions
function getSeason() {
const month = new Date().getMonth()
if (month >= 9 && month <= 11) return 'Spring'
if (month >= 12 && month <= 2) return 'Summer'
if (month >= 3 && month <= 5) return 'Autumn'
return 'Winter'
}

function setActiveSeason(seasonId) {
if (activeSeason.value !== seasonId) {
  activeSeason.value = seasonId
  
  resetSelection()
  
  showRecommendations.value = false
}
}

function addPlantToField(plant) {
const emptyIndex = plantingField.value.findIndex(cell => !cell.planted)

if (emptyIndex !== -1) {
  plantingField.value[emptyIndex] = {
    planted: true,
    plant: plant
  }
  
  plantedCount.value++
  
  // Scroll to planting area after adding a plant
  setTimeout(() => {
    const plantingSection = document.querySelector('section.bg-amber-50')
    if (plantingSection) {
      plantingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
} else {
  systemMessage.value = 'Planting field is full! Please remove a plant before adding a new one.'
  showSystemMessage.value = true
  
  setTimeout(() => {
    showSystemMessage.value = false
  }, 3000)
}
}

function removePlant(idx) {
if (!plantingField.value[idx].planted) return

plantingField.value[idx] = {
  planted: false,
  plant: null
}

plantedCount.value--
}

function generateRecommendations() {
displayedPlants.value = [...selectedPlantDetails.value]

showRecommendations.value = true

setTimeout(() => {
  const recommendationSection = document.querySelector('section.bg-gray-50');
  if (recommendationSection) {
    recommendationSection.scrollIntoView({ behavior: 'smooth' });
  }
}, 100);
}

function resetSelection() {
// Reset the planting field
plantingField.value = Array.from({ length: 6 }, () => ({
  planted: false,
  plant: null
}))

// Reset the planted count
plantedCount.value = 0

// Reset recommendations visibility
showRecommendations.value = false
}

// Add image error handling function
function handleImageError(event, plant) {
const defaultImages = {
  'spring': `${s3BasePath}/Spring/Spring-landscape.jpg`,
  'summer': `${s3BasePath}/Summer/Summer-landscape.jpg`,
  'autumn': `${s3BasePath}/Autumn/Autumn-landscape.jpg`,
  'winter': `${s3BasePath}/Winter/Winter-landscape.jpg`
};

event.target.src = defaultImages[plant.season] || defaultImages['spring'];
}

function backToSelection() {
showRecommendations.value = false
}

function resetAll() {
// Reset the planting field
plantingField.value = Array.from({ length: 6 }, () => ({
  planted: false,
  plant: null
}))

// Reset the planted count
plantedCount.value = 0

// Reset the showRecommendations flag
showRecommendations.value = false
}
</script>

<style scoped>
/* Section header title to match Forecasting page */
.personalisation-page {
margin-top: 60px;
background-color: white;
min-height: 100vh;
}

.main-container {
width: 100%;
max-width: 100%;
padding: 2rem 1.67%;
margin: 0 auto;
box-sizing: border-box;
}

.section-header {
text-align: center;
margin-bottom: 2rem;
}

.section-header h1 {
font-size: 2.5rem;
font-weight: bold;
color: #333;
margin-bottom: 0.5rem;
}

.section-header p {
font-size: 1.2rem;
color: #666;
}

/* Plant card grid */
.plants-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 1.5rem;
margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
.plants-grid {
  grid-template-columns: repeat(2, 1fr);
}
}

@media (max-width: 640px) {
.plants-grid {
  grid-template-columns: 1fr;
}
}

/* Overview container style from Simulator */
.overview-container {
margin: 2.5% 2.5%;
background-color: #ffffff;
border-radius: 12px;
border: none;
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
overflow: hidden;
width: 95%;
max-width: 100%;
}

/* Plant card */
.plant-card {
background-color: #ffffff;
border-radius: 12px;
overflow: hidden;
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
transition: transform 0.2s ease, box-shadow 0.2s ease;
display: flex;
flex-direction: column;
height: 320px;
width: 80%; /* 缩小到原来的4/5 */
margin: 0 auto;
border: 1px solid rgba(0, 0, 0, 0.1);
position: relative;
}

.plant-card:hover {
transform: translateY(-4px);
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

/* Plant image */
.plant-image {
height: 180px;
overflow: hidden;
position: relative;
}

.plant-image img {
width: 100%;
height: 100%;
object-fit: cover;
transition: transform 0.3s ease;
}

.plant-card:hover .plant-image img {
transform: scale(1.05);
}

/* Plant content */
.plant-content {
padding: 0.8rem;
display: flex;
flex-direction: column;
flex-grow: 1;
overflow: hidden;
background-color: #c9f0c9;
}

section:first-of-type .plant-card {
height: auto;
}

section:first-of-type .plant-card .plant-image {
height: 180px;
}

section:first-of-type .plant-card .plant-content {
padding: 0.4rem 0.8rem;
min-height: 0;
}

section:first-of-type .plant-card .plant-header {
gap: 0;
margin-bottom: 0;
}

section:first-of-type .plant-card .name-risk-row {
margin: 0;
}

/* Plant header */
.plant-header {
display: flex;
flex-direction: column;
gap: 0.5rem;
text-align: left;
width: 100%;
}

.plant-header h3 {
font-size: 1rem;
font-weight: 600;
margin: 0;
color: #333;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
text-align: left;
}

/* Pollen risk indicator */
.pollen-risk {
display: flex;
align-items: center;
font-size: 0.875rem;
font-weight: 500;
text-align: right;
white-space: nowrap;
}

.pollen-risk.high {
color: #ff4d4d;
}

.risk-text-high {
font-weight: 700;
}

.pollen-risk.medium {
color: #ff9800;
}

.pollen-risk.low {
color: #4CAF50;
}

.risk-icon {
margin-right: 0.25rem;
}

/* Warning panel */
.warning-panel {
background-color: #ffeeee;
border: 1px solid #ffcccc;
border-radius: 8px;
padding: 0.5rem;
margin-top: 0.4rem;
margin-bottom: 0.5rem;
}

.warning-title {
color: #e53e3e;
font-weight: 600;
display: flex;
align-items: center;
font-size: 0.8rem;
}

.warning-icon {
margin-right: 0.5rem;
}

.warning-text {
color: #e53e3e;
font-size: 0.7rem;
margin-top: 0.2rem;
}

/* Information sections */
.simple-info {
display: flex;
flex-direction: column;
gap: 0.35rem;
margin-top: 0.6rem;
text-align: left;
}

.info-row {
margin: 0;
padding: 0;
font-size: 0.82rem;
color: #4a5568;
line-height: 1.3;
text-align: left;
}

.info-key {
font-weight: 600;
color: #3182ce;
margin-right: 0.25rem;
}

/* Drag effect */
[draggable=true] {
cursor: move;
user-select: none;
transition: transform 0.2s, box-shadow 0.2s;
}

[draggable=true]:hover {
transform: translateY(-5px);
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
}

/* Planting area styles */
.planting-field-container {
background-color: #882D17;
padding: 1.5rem;
border-radius: 16px;
border: 3px solid #882D17;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
margin-bottom: 2rem;
position: relative;
width: 80%;
margin-left: auto;
margin-right: auto;
}

.planting-field-container::before {
content: '';
position: absolute;
top: -10px;
left: 50%;
transform: translateX(-50%);
border-left: 12px solid transparent;
border-right: 12px solid transparent;
border-bottom: 12px solid #882D17;
z-index: 1;
}

.field-title {
font-size: 1.5rem;
font-weight: 600;
color: #ffffff;
text-align: center;
margin-bottom: 1.5rem;
}

.field-subtitle {
font-weight: normal;
color: #ffffff;
font-size: 1.2rem;
}

.planting-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 1.5rem;
margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
.planting-grid {
  grid-template-columns: repeat(2, 1fr);
}
}

@media (max-width: 480px) {
.planting-grid {
  grid-template-columns: 1fr;
}
}

.planting-cell {
height: 200px;
width: 80%;
background-color: #3D0C02;
border-radius: 12px;
border: 3px dashed #ffffff;
position: relative;
overflow: hidden;
transition: all 0.3s ease;
display: flex;
align-items: center;
justify-content: center;
margin: 0 auto;
}

.planting-cell:hover {
background-color: #4d1c12;
border-color: #ffffff;
transform: scale(1.03);
box-shadow: 0 6px 18px rgba(183, 110, 0, 0.25);
}

.planting-cell.cell-planted {
border-style: solid;
background-color: #4d1c12;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.planted-content {
width: 100%;
height: 100%;
position: relative;
}

.planted-image {
width: 100%;
height: 100%;
object-fit: cover;
}

.remove-button {
position: absolute;
top: 4px;
right: 4px;
width: 24px;
height: 24px;
border-radius: 50%;
background-color: #ff3b30;
color: white;
border: none;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
font-size: 12px;
opacity: 0;
transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
outline: none;
}

.remove-button:focus {
outline: none;
box-shadow: 0 0 0 2px rgba(255, 59, 48, 0.4);
}

.remove-button:hover {
opacity: 1;
transform: scale(1.1);
box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
}

.planted-content:hover .remove-button {
opacity: 1;
}

.plant-label {
position: absolute;
bottom: 0;
left: 0;
right: 0;
padding: 0.5rem;
background-color: rgba(0, 0, 0, 0.7);
color: white;
font-size: 0.875rem;
text-align: center;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.empty-cell {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
color: #ffffff;
text-align: center;
padding: 1rem;
transition: transform 0.2s ease;
}

.empty-cell i {
font-size: 2rem;
margin-bottom: 0.5rem;
color: #ffffff;
}

.empty-cell span {
font-size: 0.875rem;
font-weight: 500;
color: #ffffff;
}

/* Simulator-like buttons */
.btn-simulator {
padding: 1rem 2.5rem;
background-color: rgba(0, 122, 255, 0.8);
color: white;
font-size: 1.2rem;
font-weight: 600;
border: none;
border-radius: 15px;
cursor: pointer;
transition: all 0.3s ease;
box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
min-width: 250px;
letter-spacing: 0.5px;
outline: none;
}

.btn-simulator:hover {
background-color: rgba(0, 113, 227, 0.9);
transform: translateY(-3px);
box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
}

.btn-simulator:active {
transform: translateY(1px);
box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
outline: none;
}

.btn-primary {
background-color: rgba(0, 122, 255, 0.8);
}

.btn-secondary {
background-color: rgba(255, 153, 0, 0.8);
box-shadow: 0 4px 15px rgba(255, 153, 0, 0.3);
}

.btn-secondary:hover {
background-color: rgba(255, 140, 0, 0.9);
box-shadow: 0 8px 20px rgba(255, 153, 0, 0.4);
}

.btn-secondary:active {
box-shadow: 0 2px 8px rgba(255, 153, 0, 0.3);
}

.btn-disabled {
opacity: 0.6;
cursor: not-allowed;
pointer-events: none;
}

/* Button container */
.button-container {
display: flex;
justify-content: center;
gap: 1rem;
width: 80%;
margin: 0.8rem auto 1.5rem;
padding: 0;
box-sizing: border-box;
}

/* Specific button styles from simulator */
.assess-btn {
min-width: 250px;
}

.reset-btn {
min-width: 220px;
}

/* Styling for season buttons */
.season-button {
padding: 0.6rem 1.2rem;
border-radius: 20px;
font-size: 1rem;
font-weight: 500;
transition: all 0.3s ease;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
cursor: pointer;
border: none;
min-width: 110px;
position: relative;
overflow: hidden;
}

.season-button::before {
content: '';
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(255, 255, 255, 0.1);
opacity: 0;
transform: translateY(100%);
transition: all 0.3s ease;
}

.season-button:hover::before {
transform: translateY(0);
opacity: 1;
}

.season-button-active {
background-color: #2f855a;
color: white;
box-shadow: 0 4px 12px rgba(47, 133, 90, 0.4);
transform: translateY(-2px);
}

.season-button-active:hover {
background-color: #276749;
box-shadow: 0 6px 15px rgba(47, 133, 90, 0.5);
}

.season-button-inactive {
background-color: #f3f4f6;
color: #4b5563;
}

.season-button-inactive:hover {
background-color: #e5e7eb;
transform: translateY(-1px);
box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.season-button:focus {
outline: none;
box-shadow: 0 4px 12px rgba(47, 133, 90, 0.4);
}

.corner-icon {
position: absolute;
font-size: 1.2rem;
z-index: 2;
}

.top-left {
top: 25%;
left: 25%;
transform: translate(-50%, -50%);
}

.top-right {
top: 25%;
right: 25%;
transform: translate(50%, -50%);
}

.bottom-left {
bottom: 25%;
left: 25%;
transform: translate(-50%, 50%);
}

.bottom-right {
bottom: 25%;
right: 25%;
transform: translate(50%, 50%);
}

.planting-cell {
position: relative;
}

.name-risk-row {
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
}

.name-risk-row h3 {
flex: 1;
margin-right: 10px;
}

section:first-of-type {
margin-bottom: 0.5rem;
}

section:nth-of-type(2) {
margin-top: 0.5rem;
}

.add-button-overlay {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
border-radius: 12px;
}

.add-plant-button {
background-color: #4CAF50;
color: white;
border: none;
padding: 10px 20px;
border-radius: 20px;
font-weight: bold;
cursor: pointer;
transition: all 0.3s ease;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-plant-button:hover {
background-color: #45a049;
transform: scale(1.05);
box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.plant-card {
position: relative;
}

.system-message {
position: fixed;
top: 80px;
left: 0;
right: 0;
display: flex;
justify-content: center;
z-index: 1000;
animation: slideDown 0.3s ease-out forwards;
}

.system-message-content {
background-color: #f8d7da;
color: #721c24;
border: 1px solid #f5c6cb;
border-radius: 8px;
padding: 12px 20px;
display: flex;
align-items: center;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
max-width: 80%;
}

.message-icon {
font-size: 20px;
margin-right: 12px;
}

.message-text {
font-size: 16px;
font-weight: 500;
}

@keyframes slideDown {
from {
  transform: translateY(-20px);
  opacity: 0;
}
to {
  transform: translateY(0);
  opacity: 1;
}
}

.loading-container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 200px;
width: 100%;
}

.loading-spinner {
width: 50px;
height: 50px;
border: 5px solid rgba(0, 122, 255, 0.2);
border-radius: 50%;
border-top-color: rgba(0, 122, 255, 0.8);
animation: spin 1s ease-in-out infinite;
margin-bottom: 20px;
}

@keyframes spin {
to {
  transform: rotate(360deg);
}
}

.loading-text {
font-size: 16px;
color: #666;
}

.error-message {
background-color: #fee2e2;
border: 1px solid #ef4444;
border-radius: 8px;
padding: 20px;
margin: 20px 0;
text-align: center;
color: #b91c1c;
}

.retry-button {
background-color: #ef4444;
color: white;
border: none;
padding: 8px 16px;
border-radius: 4px;
margin-top: 10px;
cursor: pointer;
transition: background-color 0.3s;
}

.retry-button:hover {
background-color: #dc2626;
}

/* Page Recommendations */
.page-recommendations {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 1.2rem 1.5rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--apple-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
              0 4px 16px rgba(0, 122, 255, 0.1);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin: 1rem 2rem;
}

.page-recommendations:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}

.recommendation-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}

.recommend-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: rgba(0, 122, 255, 0.8);
  color: white;
  border: none;
  border-radius: 980px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3),
              0 2px 6px rgba(0, 122, 255, 0.2);
  min-width: 120px;
  text-align: center;
}

.recommend-btn:hover {
  transform: scale(1.02);
  background-color: rgba(0, 113, 227, 0.9);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4),
              0 3px 8px rgba(0, 122, 255, 0.3);
}

@media (max-width: 480px) {
  .recommendation-links {
    flex-direction: column;
    align-items: stretch;
  }
  
  .recommend-btn {
    width: 100%;
  }
}
</style>
