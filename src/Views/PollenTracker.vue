<template>
    <div class="pollen-tracker-page">
      <!-- Part 1: Header -->
      <nav class="navbar">
        <div class="navbar-container">
          <!-- 左侧：Logo 和标题放在一起 -->
          <div class="navbar-left">
            <router-link to="/" class="logo-link">
              <img src="/logo.png" alt="Logo" class="logo" />
              <span class="site-title">Melbourne Pollen Monitor</span>
            </router-link>
          </div>
          <!-- 右侧：导航按钮 -->
          <div class="navbar-right">
            <router-link to="/" class="nav-btn">Home</router-link>
            <router-link to="/pollentracker" class="nav-btn">Pollen Tracker</router-link>
            <router-link to="/personalisation" class="nav-btn">Personalisation</router-link>
            <router-link to="/polleninfo" class="nav-btn">Education Resources</router-link>
            <router-link to="/game" class="nav-btn">Game</router-link>
          </div>
        </div>
      </nav>
  
      <!-- Part 2: Pollen Overview -->
      <section class="part2-overview">
        <div class="pollen-card" v-for="(pollen, index) in overviewPollenData" :key="index">
          <div class="card-header">
            <img :src="pollen.icon" alt="Pollen Icon" class="pollen-icon" />
            <h3>{{ pollen.title }}</h3>
          </div>
          <div class="risk-level" :style="{ backgroundColor: getRiskColor(pollen.riskLevel) }">
            {{ pollen.riskLevel.toUpperCase() }} RISK
          </div>
          <div class="common-types">
            <strong>Common types:</strong> {{ pollen.commonTypes }}
          </div>
          <div class="action-advice">
            <p>{{ pollen.actionAdvice }}</p>
          </div>
        </div>
      </section>
  
      <!-- 下面第三、四、五部分并排布局 -->
      <div class="main-lower-container">
        <!-- Part 3: Melbourne Suburb Pollen Map (left side) -->
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
  
        <!-- 右侧容器：包含第四部分和第五部分 -->
        <div class="right-container">
          <!-- Part 4: Personal Pollen Tracker -->
          <section class="part4-personal-tracker">
            <h2>Personal Pollen Tracker</h2>
            <div class="tracker-input">
              <input
                type="text"
                v-model="suburbInput"
                placeholder="Search suburbs e.g. Clayton"
                @input="searchSuburb"
              />
              <button @click="handleTrackNow">Track Now</button>
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
  
            <!-- 第四部分输出：个人花粉结果 -->
            <div class="personal-results" v-if="personalPollenData.length > 0">
              <div
                class="personal-risk-item"
                v-for="(item, i) in personalPollenData"
                :key="i"
              >
                <strong>{{ item.title }}: </strong>
                <span
                  class="risk-dot"
                  :style="{ backgroundColor: getRiskColor(item.riskLevel) }"
                ></span>
                <span>{{ item.riskLevel }}</span>
                <div class="action-advice">
                  <p>{{ item.actionAdvice }}</p>
                </div>
              </div>
            </div>
          </section>
  
          <!-- Part 5: Allergy Resources -->
          <section class="part5-allergy-resources">
            <h2>Allergy Resources</h2>
            <p>Undersanding Pollen Allergen</p>
            <router-link to="/plant-allergen" class="learn-more-btn">
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
  
  // Assets
  import logo from '/logo.png'
  import treeIcon from '/tree-icon.svg'
  import grassIcon from '/grass-icon.svg'
  import weedIcon from '/weed-icon.svg'
  
  // AccuWeather API key
  const ACCUWEATHER_API_KEY = 'lvpmHARVErhdkbJDqm7zBMtpDQdtNziU'
  
  // Helper function to map Category -> risk/advice
  function mapCategoryToRisk(category) {
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
        riskLevel: 'low',
        actionAdvice: 'Minimal exposure concerns. Outdoor activities safe.'
      }
    }
  }
  
  export default {
    name: 'PollenTrackerView',
    setup() {
      // Logo
      const logoUrl = logo
  
      // Pollen Overview Data (Part 2)
      const overviewPollenData = ref([
        {
          title: 'Tree Pollen',
          icon: treeIcon,
          riskLevel: 'low',
          commonTypes: 'Cypress, Oak, Olive, Birch',
          actionAdvice: ''
        },
        {
          title: 'Grass Pollen',
          icon: grassIcon,
          riskLevel: 'moderate',
          commonTypes: 'Ryegrass, Bermuda grass',
          actionAdvice: ''
        },
        {
          title: 'Weed Pollen',
          icon: weedIcon,
          riskLevel: 'high',
          commonTypes: 'Plantain, Nettle, Ragweed',
          actionAdvice: ''
        }
      ])
  
      // Personal Tracker Data (Part 4)
      const suburbInput = ref('')
      const suburbSuggestions = ref([])
      const personalPollenData = ref([])
  
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
          default:
            return 'gray'
        }
      }
  
      // Fetch overview pollen data for Melbourne (locationKey=26216)
      const fetchMelbournePollenData = async () => {
        try {
          const url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/26216?apikey=${ACCUWEATHER_API_KEY}&details=true&language=en-us&metric=true`
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
          }
        } catch (error) {
          console.error('Error fetching Melbourne pollen data:', error)
        }
      }
  
      // Search suburb using Autocomplete API
      const searchSuburb = async () => {
        if (!suburbInput.value) {
          suburbSuggestions.value = []
          return
        }
        const url = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${ACCUWEATHER_API_KEY}&q=${suburbInput.value}&language=en-us`
        try {
          const response = await axios.get(url)
          suburbSuggestions.value = response.data
        } catch (error) {
          console.error('Error searching suburbs:', error)
        }
      }
  
      // "Track Now" button click
      const handleTrackNow = () => {
        // Optionally implement auto-selection logic
      }
  
      // User selects a suggestion
      const selectSuggestion = async (suggestion) => {
        suburbSuggestions.value = []
        suburbInput.value = `${suggestion.LocalizedName} (${suggestion.Country.LocalizedName})`
        await fetchPersonalPollenData(suggestion.Key)
      }
  
      // Fetch personal pollen data for user-chosen suburb
      const fetchPersonalPollenData = async (locationKey) => {
        try {
          const url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&details=true&language=en-us&metric=true`
          const response = await axios.get(url)
          const forecast = response.data.DailyForecasts[0]
          if (forecast && Array.isArray(forecast.AirAndPollen)) {
            // Default to low risk
            const treeObj = {
              title: 'Tree Pollen',
              riskLevel: 'low',
              actionAdvice: 'Minimal exposure concerns. Outdoor activities safe.'
            }
            const grassObj = {
              title: 'Grass Pollen',
              riskLevel: 'low',
              actionAdvice: 'Minimal exposure concerns. Outdoor activities safe.'
            }
            const weedObj = {
              title: 'Weed Pollen',
              riskLevel: 'low',
              actionAdvice: 'Minimal exposure concerns. Outdoor activities safe.'
            }
            forecast.AirAndPollen.forEach((item) => {
              const mapping = mapCategoryToRisk(item.Category)
              if (item.Name.toLowerCase() === 'tree') {
                treeObj.riskLevel = mapping.riskLevel
                treeObj.actionAdvice = mapping.actionAdvice
              } else if (item.Name.toLowerCase() === 'grass') {
                grassObj.riskLevel = mapping.riskLevel
                grassObj.actionAdvice = mapping.actionAdvice
              } else if (item.Name.toLowerCase() === 'ragweed') {
                weedObj.riskLevel = mapping.riskLevel
                weedObj.actionAdvice = mapping.actionAdvice
              }
            })
            personalPollenData.value = [treeObj, grassObj, weedObj]
          }
        } catch (error) {
          console.error('Error fetching personal pollen data:', error)
        }
      }
  
      // On mounted
      onMounted(() => {
        fetchMelbournePollenData()
        // Initialize Tableau
        const divElement = document.getElementById('viz1743854171827')
        if (divElement) {
          const vizElement = divElement.getElementsByTagName('object')[0]
          if (divElement.offsetWidth > 800) {
            vizElement.style.minWidth = '420px'
            vizElement.style.maxWidth = '650px'
            vizElement.style.width = '100%'
            vizElement.style.minHeight = '587px'
            vizElement.style.maxHeight = '887px'
            vizElement.style.height = divElement.offsetWidth * 0.75 + 'px'
          } else if (divElement.offsetWidth > 500) {
            vizElement.style.minWidth = '420px'
            vizElement.style.maxWidth = '650px'
            vizElement.style.width = '100%'
            vizElement.style.minHeight = '587px'
            vizElement.style.maxHeight = '887px'
            vizElement.style.height = divElement.offsetWidth * 0.75 + 'px'
          } else {
            vizElement.style.width = '100%'
            vizElement.style.height = '727px'
          }
          const scriptElement = document.createElement('script')
          scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js'
          vizElement.parentNode.insertBefore(scriptElement, vizElement)
        }
      })
  
      return {
        logoUrl,
        overviewPollenData,
        suburbInput,
        suburbSuggestions,
        personalPollenData,
        getRiskColor,
        searchSuburb,
        handleTrackNow,
        selectSuggestion
      }
    }
  }
  </script>
  
  <style scoped>
  /* ========== Part 1: Header ========== */
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
  }
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 2rem;
  }
  
  .navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
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
    color: #000000;
  }
  
  .navbar-right {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-btn {
    text-decoration: none;
    padding: 0.3rem 0.6rem;
    font-weight: 600;
    font-size: 0.95rem;
    color: #000000;
    transition: color 0.2s ease;
  }
  
  .nav-btn:hover {
    color: #4c4b4b;
  }
  
  /* Add margin-top to the content to account for fixed navbar */
  .pollen-tracker-page {
    margin-top: 60px;
  }
  
  /* ========== Part 2: Pollen Overview ========== */
  .part2-overview {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin: 2rem;
  }
  
  .pollen-card {
    flex: 1;
    min-width: 280px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--apple-border);
    box-shadow: 0 4px 24px var(--apple-shadow);
    transition: transform 0.2s ease;
  }
  
  .pollen-card:hover {
    transform: translateY(-4px);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .pollen-icon {
    height: 60px;
    margin-right: 1rem;
  }
  
  .risk-level {
    color: white;
    text-align: center;
    font-weight: 600;
    margin: 1rem 0;
    padding: 8px;
    border-radius: 12px;
    font-size: 14px;
    letter-spacing: 0.02em;
  }
  
  .common-types {
    margin: 1rem 0;
    font-size: 14px;
    color: var(--apple-gray);
  }
  
  .action-advice {
    font-size: 14px;
    color: #1D1D1F;
    line-height: 1.4;
  }
  
  /* ========== Main Lower Container (Parts 3, 4, 5) ========== */
  .main-lower-container {
    display: flex;
    margin: 2rem;
    gap: 2rem;
  }
  
  /* ========== Part 3: Map (left side) ========== */
  .part3-map {
    flex: 2;
    min-width: 300px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--apple-border);
    box-shadow: 0 4px 24px var(--apple-shadow);
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
    background-color: rgba(255, 255, 255, 0.3);
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
  }
  
  .tracker-input input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--apple-border);
    border-radius: 12px;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
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
  }
  
  .tracker-input button:hover {
    transform: scale(1.02);
    background-color: rgba(0, 113, 227, 0.9);
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
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--apple-border);
    box-shadow: 0 4px 24px var(--apple-shadow);
    text-align: center;
  }
  
  .part5-allergy-resources h2 {
    margin-bottom: 1.5rem;
    font-size: 24px;
  }
  
  .part5-allergy-resources p {
    margin-bottom: 1.5rem;
    font-size: 16px;
    color: #1D1D1F;
  }
  
  .learn-more-btn {
    display: inline-block;
    margin-top: 1.5rem;
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
  }
  
  .learn-more-btn:hover {
    transform: scale(1.02);
    background-color: rgba(0, 113, 227, 0.9);
  }
  
  .tableauPlaceholder {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    backdrop-filter: blur(5px);
    padding: 10px;
    border: 1px solid rgba(221, 221, 221, 0.5);
  }
  </style>
  