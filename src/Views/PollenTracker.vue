<template>
  <div class="pollen-tracker-page">
    <!-- Part 1: Header -->
    <Navbar />

    <!-- Part 2: Pollen Overview -->
    <section class="overview-container">
      <!-- Header with background image -->
      <div class="overview-header">
        <h1 class="overview-slogan">Greater Melbourne Pollen Daily Report</h1>
      </div>

      <!-- Personal Pollen Tracker Search -->
      <div class="personal-tracker-search">
        <h2>Suburb Pollen Tracker</h2>
        <div class="tracker-input">
          <input
            type="text"
            v-model.trim="suburbInput"
            placeholder="Search pollen level of specific suburbs in Greater Melbourne e.g. Clayton"
            @input="searchSuburb"
          />
          <p v-if="inputError" class="input-error">{{ inputError }}</p>
          <button @click="handleTrackNow" :disabled="!isValidInput || isLoading">
            <span v-if="!isLoading">Track Now</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </div>

        <!-- Suggestions List -->
        <ul class="suggestions" v-if="suburbSuggestions.length > 0">
          <li
            v-for="(suggestion, idx) in suburbSuggestions"
            :key="idx"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion.LocalizedName }} ({{ suggestion.Country.LocalizedName }})
          </li>
        </ul>
      </div>
      
      <!-- Pollen cards container -->
      <div class="part2-overview">
        <!-- Melbourne Overall Pollen Level Card -->
        <div class="overall-pollen-card">
          <h2 class="overall-title">
            <span>{{ currentLocation }}</span> Overall Pollen Level
          </h2>
          <div class="overall-level-text" :class="getOverallRiskLevel().toLowerCase()">
            {{ getOverallRiskLevel() }}
          </div>
        </div>

        <div class="pollen-card" v-for="(pollen, index) in overviewPollenData" :key="index">
          <div class="card-header">
            <div class="pollen-emoji">{{ getPollenEmoji(pollen.title) }}</div>
            <h3>{{ pollen.title }}</h3>
          </div>
          <div class="risk-indicator">
            <div class="risk-bar" :class="pollen.riskLevel.toLowerCase()">
              <div class="fill"></div>
            </div>
            <div class="risk-text" :class="pollen.riskLevel.toLowerCase()">
              {{ pollen.riskLevel.toUpperCase() }} RISK
            </div>
          </div>
          <div class="common-types">
            <strong>Common types:</strong> {{ pollen.commonTypes }}
          </div>
          <div class="learn-more-link">
            <router-link :to="'/polleninfo?type=' + getPollenCategory(pollen.title)" class="pollen-link">Learn more {{ getPollenCategory(pollen.title) }} types?</router-link>
          </div>
          <div class="action-advice">
            <strong>Action:</strong> {{ pollen.actionAdvice }}
          </div>
        </div>
      </div>
    </section>

    <div class="main-lower-container">
      <!-- Part 3: Melbourne Suburb Pollen Map -->
      <section class="part3-map">
        <div class="tableauPlaceholder" id="viz1743854171827" style="position: relative">
          <noscript>
            <a href="#">
              <img
                alt="Dashboard 1"
                src="https://public.tableau.com/static/images/me/melbourne_pollen_map/Dashboard1/1_rss.png"
                style="border: none"
              />
            </a>
          </noscript>
          <object class="tableauViz" style="display:none;">
            <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
            <param name="embed_code_version" value="3" />
            <param
              name="path"
              value="views/melbourne_pollen_map/Dashboard1?:language=en-US&:embed=true&:sid=&:redirect=auth"
            />
            <param name="toolbar" value="yes" />
            <param
              name="static_image"
              value="https://public.tableau.com/static/images/me/melbourne_pollen_map/Dashboard1/1.png"
            />
            <param name="animate_transition" value="yes" />
            <param name="display_static_image" value="yes" />
            <param name="display_spinner" value="yes" />
            <param name="display_overlay" value="yes" />
            <param name="display_count" value="yes" />
            <param name="language" value="en-US" />
          </object>
        </div>
      </section>

      <div class="right-container">
        <!-- Part 5: Allergy Resources -->
        <section class="part5-allergy-resources">
          <h2>Allergy Resources</h2>
          <p>Undersanding Pollen Allergen</p>
          <router-link to="/polleninfo" class="learn-more-btn">
            Learn More
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'

// Assets
import logo from '/logo.png'

// AccuWeather API key
const ACCUWEATHER_API_KEY = 'kdrg7WkUvLGa02xEDoJNx2KxdUpQIGo5'

// Suburb list
const suburbList = ref([])

// Load suburb list
const loadSuburbList = async () => {
  try {
    const response = await fetch('/suburblist.txt')
    const text = await response.text()
    suburbList.value = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  } catch (error) {
    console.error('Error loading suburb list:', error)
  }
}

// Risk level color
const getRiskColor = (level) => {
  switch (level.toLowerCase()) {
    case 'low':
      return 'green'
    case 'moderate':
    case 'medium':
      return 'orange'
    case 'high':
      return 'red'
    case 'unknown':
      return '#888888'
    default:
      return '#888888'
  }
}

// Helper function to map Category -> risk/advice
function mapCategoryToRisk(category) {
  if (!category) {
    return {
      riskLevel: 'unknown',
      actionAdvice: 'Unable to determine risk level. Check back later.'
    }
  }

  const cat = category.toLowerCase()
  if (cat === 'low' || cat === 'good') {
    return {
      riskLevel: 'low',
      actionAdvice: 'Minimal exposure concerns. Outdoor activities safe.'
    }
  } else if (cat === 'moderate') {
    return {
      riskLevel: 'moderate',
      actionAdvice: 'Take precautions if sensitive. Consider antihistamines.'
    }
  } else if (cat === 'high' || cat === 'unhealthy' || cat === 'hazardous') {
    return {
      riskLevel: 'high',
      actionAdvice: 'Limit outdoor exposure. Consider wearing a mask if sensitive.'
    }
  } else {
    return {
      riskLevel: 'unknown',
      actionAdvice: 'Unable to determine risk level. Check back later.'
    }
  }
}

export default {
  name: 'PollenTrackerView',
  components: {
    Navbar
  },
  setup() {
    // Logo
    const logoUrl = logo

    // Pollen Overview Data (Part 2)
    const overviewPollenData = ref([
      {
        title: 'Tree Pollen',
        riskLevel: 'low',
        commonTypes: 'Cypress, Oak, Olive, Birch',
        actionAdvice: ''
      },
      {
        title: 'Grass Pollen',
        riskLevel: 'moderate',
        commonTypes: 'Ryegrass, Bermuda grass',
        actionAdvice: ''
      },
      {
        title: 'Weed Pollen',
        riskLevel: 'high',
        commonTypes: 'Plantain, Nettle, Ragweed',
        actionAdvice: ''
      }
    ])

    // Personal Tracker Data (Part 4)
    const suburbInput = ref('')
    const suburbSuggestions = ref([])
    const personalPollenData = ref([])
    const inputError = ref('')
    const isValidInput = ref(false)
    const selectedLocationKey = ref(null)
    const isLoading = ref(false)
    const currentLocation = ref('Melbourne City')

    // Fetch overview pollen data for Melbourne (locationKey=26216)
    const fetchMelbournePollenData = async () => {
      try {
        const url = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/26216?apikey=${ACCUWEATHER_API_KEY}&details=true&language=en-us&metric=true`
        const response = await axios.get(url)
        const forecast = response.data.DailyForecasts[0]
        if (forecast && Array.isArray(forecast.AirAndPollen)) {
          forecast.AirAndPollen.forEach((item) => {
            const mapping = mapCategoryToRisk(item.Category)
            if (item.Name.toLowerCase() === 'tree') {
              const treeData = overviewPollenData.value.find(p => p.title.toLowerCase().includes('tree'))
              if (treeData) {
                treeData.riskLevel = mapping.riskLevel
                treeData.actionAdvice = mapping.actionAdvice
              }
            } else if (item.Name.toLowerCase() === 'grass') {
              const grassData = overviewPollenData.value.find(p => p.title.toLowerCase().includes('grass'))
              if (grassData) {
                grassData.riskLevel = mapping.riskLevel
                grassData.actionAdvice = mapping.actionAdvice
              }
            } else if (item.Name.toLowerCase() === 'ragweed') {
              const weedData = overviewPollenData.value.find(p => p.title.toLowerCase().includes('weed'))
              if (weedData) {
                weedData.riskLevel = mapping.riskLevel
                weedData.actionAdvice = mapping.actionAdvice
              }
            }
          })
        } else {
          setAllPollensToUnknown()
        }
      } catch (error) {
        console.error('Error fetching Melbourne pollen data:', error)
        setAllPollensToUnknown()
      }
    }

    const setAllPollensToUnknown = () => {
      overviewPollenData.value.forEach(pollen => {
        pollen.riskLevel = 'unknown'
        pollen.actionAdvice = 'Unable to determine risk level. Check back later.'
      })
    }

    // Search suburb using Autocomplete API
    const searchSuburb = async () => {
      inputError.value = ''
      
      if (!suburbInput.value || suburbInput.value.trim() === '') {
        inputError.value = 'Please enter a suburb name'
        isValidInput.value = false
        suburbSuggestions.value = []
        return
      }
      
      if (suburbInput.value.length < 2) {
        inputError.value = 'Please enter at least 2 characters'
        isValidInput.value = false
        suburbSuggestions.value = []
        return
      }
      
      const url = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${ACCUWEATHER_API_KEY}&q=${suburbInput.value}&language=en-us`
      try {
        const response = await axios.get(url)
        // First filter for Victoria, Australia
        const victoriaLocations = response.data.filter(location => 
          location.Country?.ID === 'AU' && 
          location.AdministrativeArea?.ID === 'VIC'
        )
        
        // Then filter for Melbourne suburbs using the suburblist
        const melbourneSuburbs = new Set(suburbList.value.map(suburb => suburb.toLowerCase()))
        suburbSuggestions.value = victoriaLocations.filter(location => 
          melbourneSuburbs.has(location.LocalizedName.toLowerCase())
        )
        
        if (suburbSuggestions.value.length === 0) {
          inputError.value = 'No matching suburbs found in Melbourne'
        } else {
          isValidInput.value = true
        }
      } catch (error) {
        console.error('Error searching suburbs:', error)
        inputError.value = 'Error searching suburbs. Please try again.'
        suburbSuggestions.value = []
        isValidInput.value = false
      }
    }

    // User selects a suggestion
    const selectSuggestion = async (suggestion) => {
      suburbSuggestions.value = []
      // Only show Victoria in the display text
      suburbInput.value = `${suggestion.LocalizedName}, Victoria`
      isValidInput.value = true
      inputError.value = ''
      // Store the selected location key
      selectedLocationKey.value = suggestion.Key
    }

    // Track Now button click
    const handleTrackNow = async () => {
      if (!isValidInput.value) {
        inputError.value = 'Please select a valid suburb from the list'
        return
      }

      // If there are suggestions and no location key selected yet, use the first suggestion
      if (suburbSuggestions.value.length > 0 && !selectedLocationKey.value) {
        selectSuggestion(suburbSuggestions.value[0])
      }
      
      // Fetch data only if a location key is selected
      if (selectedLocationKey.value) {
        isLoading.value = true
        try {
          await fetchPersonalPollenData(selectedLocationKey.value)
          // Update current location name
          currentLocation.value = suburbInput.value.split(',')[0]
        } finally {
          isLoading.value = false
        }
      }
    }

    // Fetch personal pollen data for user-chosen suburb
    const fetchPersonalPollenData = async (locationKey) => {
      try {
        const url = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&details=true&language=en-us&metric=true`
        const response = await axios.get(url)
        const forecast = response.data.DailyForecasts[0]
        if (forecast && Array.isArray(forecast.AirAndPollen)) {
          forecast.AirAndPollen.forEach((item) => {
            const mapping = mapCategoryToRisk(item.Category)
            if (item.Name.toLowerCase() === 'tree') {
              const treeData = overviewPollenData.value.find(p => p.title.toLowerCase().includes('tree'))
              if (treeData) {
                treeData.riskLevel = mapping.riskLevel
                treeData.actionAdvice = mapping.actionAdvice
                document.querySelector('.pollen-card:nth-child(2)').classList.add('card-updating')
                setTimeout(() => {
                  document.querySelector('.pollen-card:nth-child(2)').classList.remove('card-updating')
                }, 500)
              }
            } else if (item.Name.toLowerCase() === 'grass') {
              const grassData = overviewPollenData.value.find(p => p.title.toLowerCase().includes('grass'))
              if (grassData) {
                grassData.riskLevel = mapping.riskLevel
                grassData.actionAdvice = mapping.actionAdvice
                document.querySelector('.pollen-card:nth-child(3)').classList.add('card-updating')
                setTimeout(() => {
                  document.querySelector('.pollen-card:nth-child(3)').classList.remove('card-updating')
                }, 500)
              }
            } else if (item.Name.toLowerCase() === 'ragweed') {
              const weedData = overviewPollenData.value.find(p => p.title.toLowerCase().includes('weed'))
              if (weedData) {
                weedData.riskLevel = mapping.riskLevel
                weedData.actionAdvice = mapping.actionAdvice
                document.querySelector('.pollen-card:nth-child(4)').classList.add('card-updating')
                setTimeout(() => {
                  document.querySelector('.pollen-card:nth-child(4)').classList.remove('card-updating')
                }, 500)
              }
            }
          })
          document.querySelector('.overall-pollen-card').classList.add('card-updating')
          setTimeout(() => {
            document.querySelector('.overall-pollen-card').classList.remove('card-updating')
          }, 500)
        }
      } catch (error) {
        console.error('Error fetching personal pollen data:', error)
      }
    }

    // On mounted
    onMounted(() => {
      loadSuburbList()
      fetchMelbournePollenData()
      // Initialize Tableau
      const divElement = document.getElementById('viz1743854171827')
      if (divElement) {
        const vizElement = divElement.getElementsByTagName('object')[0]
        if (divElement.offsetWidth > 800) {
          vizElement.style.minWidth = '420px'
          vizElement.style.maxWidth = '650px'
          vizElement.style.width = '100%'
          vizElement.style.minHeight = '830px'
          vizElement.style.maxHeight = '1150px'
          vizElement.style.height = divElement.offsetWidth * 1.0 + 'px'
          vizElement.style.margin = '0 auto'
        } else if (divElement.offsetWidth > 500) {
          vizElement.style.minWidth = '420px'
          vizElement.style.maxWidth = '650px'
          vizElement.style.width = '100%'
          vizElement.style.minHeight = '830px'
          vizElement.style.maxHeight = '1150px'
          vizElement.style.height = divElement.offsetWidth * 1.0 + 'px'
          vizElement.style.margin = '0 auto'
        } else {
          vizElement.style.width = '100%'
          vizElement.style.height = '970px'
          vizElement.style.margin = '0 auto'
        }
        const scriptElement = document.createElement('script')
        scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js'
        vizElement.parentNode.insertBefore(scriptElement, vizElement)
      }
    })

    const getOverallRiskLevel = () => {
      if (!overviewPollenData.value.length) return 'Low';
      
      const riskValues = overviewPollenData.value.map(pollen => {
        switch (pollen.riskLevel.toLowerCase()) {
          case 'high': return 3;
          case 'moderate': return 2;
          case 'low': return 1;
          case 'unknown': return 0;
          default: return 0;
        }
      });
      
      if (riskValues.every(val => val === 0)) {
        return 'Unknown';
      }
      
      const validValues = riskValues.filter(val => val > 0);
      if (validValues.length === 0) return 'Unknown';
      
      const sum = validValues.reduce((acc, val) => acc + val, 0);
      const average = sum / validValues.length;
      
      const roundedAverage = Math.round(average);
      
      switch (roundedAverage) {
        case 3: return 'High';
        case 2: return 'Moderate';
        case 1: return 'Low';
        default: return 'Unknown';
      }
    }

    const getPollenEmoji = (title) => {
      switch (title.toLowerCase()) {
        case 'tree pollen':
          return '🌳';
        case 'grass pollen':
          return '🌱';
        case 'weed pollen':
          return '🌿';
        default:
          return '❓';
      }
    }

    const getPollenCategory = (title) => {
      switch (title.toLowerCase()) {
        case 'tree pollen':
          return 'tree';
        case 'grass pollen':
          return 'grass';
        case 'weed pollen':
          return 'weed';
        default:
          return 'unknown';
      }
    }

    return {
      logoUrl,
      overviewPollenData,
      suburbInput,
      suburbSuggestions,
      personalPollenData,
      getRiskColor,
      searchSuburb,
      handleTrackNow,
      selectSuggestion,
      loadSuburbList,
      getOverallRiskLevel,
      getPollenEmoji,
      inputError,
      isValidInput,
      selectedLocationKey,
      getPollenCategory,
      isLoading,
      currentLocation
    }
  }
}
</script>

<style scoped>
/* ========== Part 1: Header ========== */
.part1-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  align-items: center;
  padding: 0 2rem;
}

.logo-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.web-logo {
  height: 65px;
  width: auto;
}

.site-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #000000;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-item {
  text-decoration: none;
  padding: 0.3rem 0.6rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #000000;
  transition: color 0.2s ease;
}

.nav-item:hover {
  color: #4c4b4b;
}

/* Add margin-top to the content to account for fixed navbar */
.pollen-tracker-page {
  margin-top: 60px;
}

/* ========== Part 2: Pollen Overview ========== */
.overview-container {
  position: relative;
  margin: 1rem 2rem 1rem 2rem;
  padding: 0;
  width: auto;
  max-width: none;
  background-color: #ffffff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--apple-border);
  box-shadow: 0 4px 24px var(--apple-shadow);
  border-radius: 20px;
}

.overview-header {
  width: 100%;
  height: 200px;
  background-image: url('/public/melcity.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 20px 20px 0 0;
}

.overview-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
  border-radius: 20px 20px 0 0;
}

.overview-slogan {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 2;
  text-align: center;
  padding: 0 2rem;
}

.part2-overview {
  display: flex;
  flex-wrap: nowrap;
  padding: 1.5rem;
  gap: 1.5rem;
}

.overall-pollen-card,
.pollen-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 1.2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--apple-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
              0 4px 16px rgba(0, 122, 255, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.overall-pollen-card {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.pollen-card {
  flex: 1;
  min-width: 250px;
}

.overall-pollen-card:hover,
.pollen-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}

.overall-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 1.2rem;
  text-align: center;
  line-height: 1.3;
}

.overall-title span {
  color: rgba(0, 122, 255, 0.8);
}

.overall-level-text {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-top: 0.6rem; 
}

.overall-level-text.high {
  color: #ff4d4d;
}

.overall-level-text.moderate {
  color: #ffa500;
}

.overall-level-text.low {
  color: #4CAF50;
}

.overall-level-text.unknown {
  color: #888888;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.card-header h3 {
  font-size: 1.3rem;
  font-weight: bold;
}

.pollen-emoji {
  font-size: 2rem;
}

.risk-indicator {
  position: relative;
  margin: 1.5rem 0 3rem 0;
}

.risk-bar {
  height: 10px;
  background-color: rgba(200, 200, 200, 0.7);
  border-radius: 5px;
  position: relative;
}

/* Divider lines */
.risk-bar::before,
.risk-bar::after {
  content: '';
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2;
}

.risk-bar::before {
  left: 33.33%;
  transform: translateX(-50%);
}

.risk-bar::after {
  left: 66.66%;
  transform: translateX(-50%);
}

/* Risk fill area */
.risk-bar .fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 4px 0 0 4px;
  z-index: 1;
}

.risk-bar.high .fill {
  width: 100%;
  background-color: #ff4d4d;
  border-radius: 4px;
}

.risk-bar.moderate .fill {
  width: 66.67%;
  background-color: #ffa500;
}

.risk-bar.low .fill {
  width: 33.33%;
  background-color: #4CAF50;
}

.risk-bar.unknown .fill {
  width: 100%;
  background-color: #888888;
  opacity: 0.5;
  border-radius: 4px;
}

.risk-text {
  position: absolute;
  right: 0;
  bottom: -30px;  /* Adjusted for larger font */
  font-size: 1.1rem;  /* Increased from 0.9rem */
  font-weight: 600;
}

.risk-text.high {
  color: #ff4d4d;
}

.risk-text.moderate {
  color: #ffa500;
}

.risk-text.low {
  color: #4CAF50;
}

.risk-text.unknown {
  color: #888888;
}

.common-types {
  font-size: 1rem;
  margin-top: 1.5rem;
}

.action-advice {
  font-size: 1rem;
  margin-top: 0.8rem;
  padding: 0.8rem;
}

.learn-more-link {
  margin: 0.8rem 0;
  text-align: center;
}

.pollen-link {
  font-size: 1rem;
  text-decoration: none;
  color: #0070c9;
  font-weight: 500;
  transition: color 0.2s ease;
  display: inline-block;
  padding: 0.3rem 0;
  border-bottom: 1px dashed #0070c9;
}

.pollen-link:hover {
  color: #005b9f;
  border-bottom: 1px solid #005b9f;
}

.main-lower-container {
  display: flex;
  margin: 1rem 2rem;
  gap: 1.5rem;
}

.part3-map {
  flex: 2;
  min-width: 300px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--apple-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
              0 4px 16px rgba(0, 122, 255, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.part3-map:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}

/* ========== Right Container (Parts 4 + 5) ========== */
.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Part 4: Personal Pollen Tracker */
.part4-personal-tracker {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--apple-border);
  box-shadow: 0 4px 24px var(--apple-shadow);
  margin-bottom: 2rem;
}

.part4-personal-tracker h2 {
  margin-bottom: 1.5rem;
  font-size: 24px;
}

.tracker-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
}

.tracker-input input {
  width: 100%;
  padding: 16px;
  border: 2px solid rgba(0, 122, 255, 0.3);
  border-radius: 12px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-sizing: border-box;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
}

.tracker-input input:focus {
  outline: none;
  border-color: rgba(0, 122, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
}

.tracker-input input::placeholder {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  font-style: italic;
}

.tracker-input button {
  width: 100%;
  padding: 12px 24px;
  background-color: rgba(0, 122, 255, 0.8);
  color: white;
  border: none;
  border-radius: 980px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3),
              0 2px 6px rgba(0, 122, 255, 0.2);
}

.tracker-input button:hover {
  transform: scale(1.02);
  background-color: rgba(0, 113, 227, 0.9);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4),
              0 3px 8px rgba(0, 122, 255, 0.3);
}

.tracker-input button:disabled {
  background-color: rgba(0, 122, 255, 0.4);
  cursor: not-allowed;
  transform: none;
}

.input-error {
  color: #ff4d4d;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  text-align: left;
}

.suggestions {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  border: 1px solid var(--apple-border);
  border-radius: 12px;
  max-height: 200px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.suggestions li {
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.suggestions li:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

.personal-results {
  margin-top: 10px;
}

.personal-risk-item {
  margin-bottom: 10px;
}

.risk-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 6px;
  border-radius: 50%;
}

/* Part 5: Allergy Resources */
.part5-allergy-resources {
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
}

.part5-allergy-resources:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}

.part5-allergy-resources h2 {
  margin-bottom: 0.8rem;
  font-size: 24px;
  color: #1D1D1F;
  font-weight: 600;
}

.part5-allergy-resources p {
  margin-bottom: 1.2rem;
  font-size: 16px;
  color: #1D1D1F;
}

.learn-more-btn {
  display: inline-block;
  margin-top: 1.2rem;
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
}

.learn-more-btn:hover {
  transform: scale(1.02);
  background-color: rgba(0, 113, 227, 0.9);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4),
              0 3px 8px rgba(0, 122, 255, 0.3);
}

.tableauPlaceholder {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  backdrop-filter: blur(5px);
  padding: 10px;
  border: 1px solid rgba(221, 221, 221, 0.5);
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Override Tableau object styles */
.tableauViz {
  width: 100% !important;
  margin: 0 auto !important;
}

.personal-tracker-search {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  padding: 0.8rem 1.2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--apple-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 
              0 4px 16px rgba(0, 122, 255, 0.1);
  margin: 1rem 1.5rem 0.5rem 1.5rem;
}

.personal-tracker-search h2 {
  margin-bottom: 0.8rem;
  font-size: 24px;
  text-align: center;
  color: #1D1D1F;
  font-weight: 600;
}

.tracker-input {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  width: 100%;
}

.tracker-input input {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(0, 122, 255, 0.3);
  border-radius: 12px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-sizing: border-box;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
}

.suggestions {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem 0;
  border: 1px solid var(--apple-border);
  border-radius: 12px;
  max-height: 180px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.suggestions li {
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.suggestions li:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

@keyframes cardUpdate {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 24px var(--apple-shadow);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 32px rgba(0, 122, 255, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 24px var(--apple-shadow);
  }
}

.card-updating {
  animation: cardUpdate 0.5s ease-in-out;
}

/* Loading spinner styles */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

button:disabled {
  background-color: rgba(0, 122, 255, 0.4);
  cursor: not-allowed;
  transform: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:disabled .loading-spinner {
  border-top-color: rgba(255, 255, 255, 0.6);
}
</style>
