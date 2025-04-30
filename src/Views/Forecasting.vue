<template>
  <div class="personalisation-page">
    <!-- Header -->
    <Navbar />

    <!-- Main Content Container -->
    <div class="main-container">
      <div class="section-header">
        <h1>Melbourne Pollen Forecast</h1>
        <p>Daily Melbourne pollen levels and personalized allergy management</p>
      </div>

      <!-- Two-column dashboard layout -->
      <div class="forecast-dashboard">
        <!-- 7-Day Cards Section-->
        <section class="forecast-cards-section">
          <h2 class="section-title">Melbourne 7-Day Pollen Forecast</h2>

          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
          <div v-else-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-else class="cards-container">
            <div class="stacked-cards-wrapper">
              <div 
                v-for="(day, index) in weekForecast" 
                :key="index"
                class="forecast-card"
                :class="[
                  getPollenIndexClass(day['Pollen Index (0-10)']),
                  getCardPositionClass(index, currentCardIndex),
                  { 'today-card': isTodayCard(day.Date) }
                ]"
                :style="getCardStyle(index, currentCardIndex)"
              >
                <div class="card-header">
                  <div class="pollen-emoji">📅</div>
                  <h3>
                    <span class="weekday">{{ day.Weekday }}</span>
                    <span class="date">{{ formatDate(day.Date) }}</span>
                    <span v-if="isTodayCard(day.Date)" class="today-tag">Today</span>
                  </h3>
                </div>
                
                <div class="risk-indicator">
                  <div class="risk-label">Overall Pollen Risk:</div>
                  <div class="risk-bar" :class="getPollenIndexClass(day['Pollen Index (0-10)'])">
                    <div class="fill"></div>
                  </div>
                  <div class="risk-text" :class="getPollenIndexClass(day['Pollen Index (0-10)'])">
                    {{ getPollenIndexText(day['Pollen Index (0-10)']) }} RISK
                  </div>
                </div>
                
                <div class="card-risk-levels-detailed">
                  <div class="risk-level">
                    <span class="risk-icon">🌳</span>
                    <span class="risk-type">Tree</span>
                    <span class="risk-text-detailed" :class="getRiskClass(day['Tree Risk Level'])">
                      {{ day['Tree Risk Level'] || 'N/A' }}
                    </span>
                  </div>
                  <div class="risk-level">
                    <span class="risk-icon">🌿</span>
                    <span class="risk-type">Weed</span>
                    <span class="risk-text-detailed" :class="getRiskClass(day['Weed Risk Level'])">
                      {{ day['Weed Risk Level'] || 'N/A' }}
                    </span>
                  </div>
                  <div class="risk-level">
                    <span class="risk-icon">🌱</span>
                    <span class="risk-type">Grass</span>
                    <span class="risk-text-detailed" :class="getRiskClass(day['Grass Risk Level'])">
                      {{ day['Grass Risk Level'] || 'N/A' }}
                    </span>
                  </div>
                </div>
                
                <div class="card-allergens">
                  <div class="allergens-label">Main Allergens:</div>
                  <div class="allergens-text">{{ day['Main Allergens'] || 'N/A' }}</div>
                </div>
                <div class="card-action">
                  <div class="action-label">Action Plan:</div>
                  <div class="action-text">{{ day['Action Plan'] || 'N/A' }}</div>
                </div>
                <button class="gcal-button" @click="addToGoogleCalendar(day)">
                  <span class="gcal-icon">🗓️</span>
                  Add to Google Calendar for today
                </button>
                <button v-if="isTodayCard(day.Date)" class="calendar-button" @click="exportWeekToCalendar" style="margin-top:0.5rem;">
                  <span class="calendar-icon">📅</span>
                  Export 7-day forecast to calendar
                </button>
              </div>
            </div>
            <div class="stacked-card-controls">
              <button class="control-button prev" @click="prevCard">
                &lsaquo;
              </button>
              <button class="control-button next" @click="nextCard">
                &rsaquo;
              </button>
            </div>
          </div>
        </section>

        <!-- Pollen Risk Level Info-->
        <section class="pollen-level-info-section">
          <h2 class="section-title">Understanding Pollen Levels</h2>
          <p class="pollen-info-subtitle">Pollen concentration measured in grains per cubic meter (grains/m³)</p>
          
          <div class="risk-levels-container">
            <!-- Low Risk -->
            <div class="risk-level-card low">
              <div class="risk-level-header">
                <h3>Low</h3>
                <span class="concentration">0-20 grains/m³</span>
          </div>
              <ul class="risk-level-details">
                <li>Minimal symptoms for most allergy sufferers</li>
                <li>Safe for outdoor activities</li>
              </ul>
          </div>
            
            <!-- Moderate Risk -->
            <div class="risk-level-card medium">
              <div class="risk-level-header">
                <h3>Medium</h3>
                <span class="concentration">20-50 grains/m³</span>
          </div>
              <ul class="risk-level-details">
                <li>Symptoms may be noticeable</li>
                <li>Take precautions when outdoors</li>
              </ul>
      </div>

            <!-- High Risk -->
            <div class="risk-level-card high">
              <div class="risk-level-header">
                <h3>High</h3>
                <span class="concentration">above 50 grains/m³</span>
        </div>
              <ul class="risk-level-details">
                <li>Symptoms may be severe</li>
                <li>Avoid outdoor activities if sensitive</li>
              </ul>
          </div>
        </div>
      </section>
      </div>

      <!-- Two-column layout for Seasonal and Monthly -->
      <div class="trends-dashboard">
        <!-- Seasonal Comparison  -->
        <section class="seasonal-comparison-section">
          <div class="chart-header">
            <h2 class="section-title">Melbourne Seasonal Pollen Risk by Type</h2>
            <div class="location-info">
              <span class="location-icon">📍</span>
              <span class="location-text">Melbourne, Australia</span>
            </div>
            <div class="key-insight">
              <span class="insight-label">Key Insight:</span>
              <span class="insight-text">Melbourne's pollen peak seasons are Spring and Summer.</span>
            </div>
          </div>
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
          <div v-else-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-else class="chart-container" ref="seasonalChartContainer" style="position: relative; height:400px; width:100%">
            <canvas ref="seasonalChart"></canvas>
          </div>
        </section>

        <!-- Monthly Trends  -->
        <section class="monthly-trends-section">
          <div class="chart-header">
            <h2 class="section-title">Melbourne Monthly Pollen Risk Trend</h2>
            <div class="location-info">
              <span class="location-icon">📍</span>
              <span class="location-text">Melbourne, Australia</span>
            </div>
            <div class="key-insight">
              <span class="insight-label">Key Insight:</span>
              <span class="insight-text">Pollen risk in Melbourne peaks from October to January, with lowest levels during winter months (May to August).</span>
            </div>
          </div>
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
          <div v-else-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-else class="chart-container" ref="monthlyChartContainer" style="position: relative; height:400px; width:100%">
            <canvas ref="monthlyChart"></canvas>
          </div>
        </section>
      </div>

      <!-- Pollen Contributors -->
      <section class="pollen-contributors-section">
        <div class="chart-header contributors-header">
          <h2 class="section-title">Major Allergen Sources in Melbourne</h2>
          <div class="location-info">
            <span class="location-icon">📍</span>
            <span class="location-text">Melbourne, Australia</span>
          </div>
          <div class="key-insight">
            <span class="insight-label">Key Insights:</span>
            <span class="insight-text">In Melbourne, Cypress/Cedar, Ryegrass, and Plantain are the dominant allergen sources for trees, grasses, and weeds respectively, representing the main triggers for seasonal allergies.</span>
          </div>
        </div>
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else class="donut-charts-container">
          <div class="donut-chart-wrapper">
            <h3 class="distribution-title">Tree Pollen Distribution</h3>
            <div class="chart-container" style="position: relative; height:300px; width:100%">
              <canvas ref="treeDonutChart"></canvas>
            </div>
          </div>
          <div class="donut-chart-wrapper">
            <h3 class="distribution-title">Grass Pollen Distribution</h3>
            <div class="chart-container" style="position: relative; height:300px; width:100%">
              <canvas ref="grassDonutChart"></canvas>
            </div>
          </div>
          <div class="donut-chart-wrapper">
            <h3 class="distribution-title">Weed Pollen Distribution</h3>
            <div class="chart-container" style="position: relative; height:300px; width:100%">
              <canvas ref="weedDonutChart"></canvas>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import Navbar from '../components/Navbar.vue'
import axios from 'axios'
import { Chart } from 'chart.js/auto'

export default {
  name: 'PersonalisationView',
  components: {
    Navbar
  },
  setup() {
    // Data references
    const forecastData = ref([])
    const trendData = ref([])
    const plantData = ref([])
    const seasonalData = ref([])
    const isLoading = ref(true)
    const error = ref(null)

    // Today's date in YYYY-MM-DD format
    const todayDate = computed(() => {
      const today = new Date()
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    })
    
    // Find today's index in the forecast data
    const todayCardIndex = computed(() => {
      if (!weekForecast.value.length) return 0
      const index = weekForecast.value.findIndex(day => day.Date === todayDate.value)
      return index >= 0 ? index : 2 // Default to middle card if today not found
    })

    // Chart references
    const monthlyChart = ref(null)
    const monthlyChartInstance = ref(null)
    const treeDonutChart = ref(null)
    const treeDonutChartInstance = ref(null)
    const grassDonutChart = ref(null)
    const grassDonutChartInstance = ref(null)
    const weedDonutChart = ref(null)
    const weedDonutChartInstance = ref(null)
    const seasonalChart = ref(null)
    const seasonalChartInstance = ref(null)

    // UI state
    const selectedForecastOption = ref('7days')
    const forecastOptions = [
      { label: '7 Days', value: '7days' },
      { label: '14 Days', value: '14days' },
      { label: '30 Days', value: '30days' }
    ]

    // Card carousel state
    const currentCardIndex = ref(0)
    
    // Set initial card index to show today's card in the middle
    const initCardIndex = () => {
      nextTick(() => {
        if (weekForecast.value.length > 0) {

          currentCardIndex.value = -2
        }
      })
    }

    // Fetch data from API
    const fetchData = async () => {
      isLoading.value = true
      error.value = null
      try {
        const response = await axios.get('https://c4k5zme236.execute-api.ap-southeast-2.amazonaws.com/build-production/build')
        forecastData.value = response.data.forecastResults
        trendData.value = response.data.trendResults
        plantData.value = response.data.plantResults
        seasonalData.value = response.data.seasonalResults
        
        // After data is loaded, initialize charts and set today's card
        initCharts()
        initCardIndex()
      } catch (err) {
        console.error('Error fetching data:', err)
        error.value = 'Failed to load data, please try again later.'
        isLoading.value = false
      }
    }

    // Format data for charts
    const formattedForecastData = computed(() => {
      if (!forecastData.value.length) return []
      
      let days = 7
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      const todayIndex = forecastData.value.findIndex(day => day.Date === todayStr)
      
      if (todayIndex >= 0) {
        return forecastData.value.slice(todayIndex, todayIndex + days)
      }
      
      return forecastData.value.slice(0, days)
    })

    const weekForecast = computed(() => {
      if (!forecastData.value.length) return []
      
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      
      const todayIndex = forecastData.value.findIndex(day => day.Date === todayStr)
      
      if (todayIndex >= 0) {
        return forecastData.value.slice(todayIndex, todayIndex + 7)
      } else {
        return forecastData.value.slice(0, 7)
      }
    })

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = monthNames[date.getMonth()]
      
      const day = date.getDate()
      let suffix = 'th'
      if (day % 10 === 1 && day !== 11) {
        suffix = 'st'
      } else if (day % 10 === 2 && day !== 12) {
        suffix = 'nd'
      } else if (day % 10 === 3 && day !== 13) {
        suffix = 'rd'
      }
      
      return `${month} ${day}${suffix}`
    }

    // Check if card is today's card
    const isTodayCard = (dateString) => {
      return dateString === todayDate.value
    }

    const getPollenIndexClass = (index) => {
      if (index >= 7) return 'very-high'
      if (index >= 5) return 'high'
      if (index >= 3) return 'medium'
      return 'low'
    }

    const getRiskClass = (risk) => {
      if (!risk) return ''
      return risk.toLowerCase().replace(' ', '-')
    }

    // Get color based on risk level
    const getRiskColor = (risk) => {
      if (!risk) return '#888888'
      const riskLow = risk.toLowerCase()
      if (riskLow === 'low') return '#4CAF50'
      if (riskLow === 'moderate' || riskLow === 'medium') return '#FFA500'
      if (riskLow === 'high') return '#FF4D4D'
      if (riskLow === 'very high') return '#9C27B0'
      return '#888888'
    }

    // Get card position class based on index
    const getCardPositionClass = (cardIndex, currentIndex) => {
      const relativePosition = cardIndex - currentIndex
      if (relativePosition < 0) return 'card-left'
      if (relativePosition > 4) return 'card-right'
      return `card-position-${relativePosition}`
    }
    
    // Get card style based on position
    const getCardStyle = (cardIndex, currentIndex) => {
      const relativePosition = cardIndex - currentIndex
      
      // Only show cards in the visible range (0-4)
      if (relativePosition < 0 || relativePosition > 4) {
        return { display: 'none' }
      }
      
      // Adjust z-index to make center card on top
      const zIndex = relativePosition === 2 ? 5 : 
                    (relativePosition === 1 || relativePosition === 3) ? 4 : 3
      
      return { zIndex }
    }

    // Card carousel navigation
    const nextCard = () => {
      // Allow cycling through all cards
      if (currentCardIndex.value < weekForecast.value.length - 3) {
        currentCardIndex.value++
      }
    }

    const prevCard = () => {
      if (currentCardIndex.value > -2) {
        currentCardIndex.value--
      }
    }

    const initCharts = () => {
      isLoading.value = false
      setTimeout(() => {
        nextTick(() => {
          try {
            if (monthlyChart.value && trendData.value.length > 0) {
              initMonthlyChart()
            }

            if (treeDonutChart.value && grassDonutChart.value && weedDonutChart.value && plantData.value.length > 0) {
              initDonutCharts()
            }
            
            if (seasonalChart.value && seasonalData.value.length > 0) {
              initSeasonalChart()
            }
          } catch (err) {
            console.error('Error initializing charts:', err)
          }
        })
      }, 300)
    }

    const initMonthlyChart = () => {
      if (!monthlyChart.value) return
      
      try {
        if (monthlyChartInstance.value) {
          monthlyChartInstance.value.destroy()
        }
        
        const ctx = monthlyChart.value.getContext('2d')
        if (!ctx) return
        
        const months = trendData.value.map(item => item.Month)
        
        const convertRiskTextToLevel = (riskText) => {
          if (riskText === 'Low') return 1
          if (riskText === 'Moderate' || riskText === 'Medium') return 2
          if (riskText === 'High' || riskText === 'Very High') return 3 
          return 1
        }

        const overallConcentrations = trendData.value.map(item => 
          convertRiskTextToLevel(item['Overall Pollen Risk Level']))
        const treeConcentrations = trendData.value.map(item => 
          convertRiskTextToLevel(item['Tree Pollen Risk Level']))
        const grassConcentrations = trendData.value.map(item => 
          convertRiskTextToLevel(item['Grass Pollen Risk Level']))
        const weedConcentrations = trendData.value.map(item => 
          convertRiskTextToLevel(item['Weed Pollen Risk Level']))
        
        const originalOverall = trendData.value.map(item => item['Overall Pollen Concentration (grains/m_)'])
        const originalTree = trendData.value.map(item => item['Tree Pollen Concentration (grains/m_)'])
        const originalGrass = trendData.value.map(item => item['Grass Pollen Concentration (grains/m_)'])
        const originalWeed = trendData.value.map(item => item['Weed Pollen Month Concentration (grains/m_)'])
        
        const originalOverallRisk = trendData.value.map(item => 
          item['Overall Pollen Risk Level'] === 'Moderate' ? 'Medium' : item['Overall Pollen Risk Level'])
        const originalTreeRisk = trendData.value.map(item => 
          item['Tree Pollen Risk Level'] === 'Moderate' ? 'Medium' : item['Tree Pollen Risk Level'])
        const originalGrassRisk = trendData.value.map(item => 
          item['Grass Pollen Risk Level'] === 'Moderate' ? 'Medium' : item['Grass Pollen Risk Level'])
        const originalWeedRisk = trendData.value.map(item => 
          item['Weed Pollen Risk Level'] === 'Moderate' ? 'Medium' : item['Weed Pollen Risk Level'])
        
        monthlyChartInstance.value = new Chart(ctx, {
          type: 'line',
          data: {
            labels: months,
            datasets: [
              {
                label: '', 
                data: overallConcentrations,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0,
              fill: true,
                pointBackgroundColor: overallConcentrations.map(level => {
                  if (level === 3) return '#FF4D4D'      // High
                  if (level === 2) return '#FFA500'      // Medium
                  return '#4CAF50'                       // Low
              }),
              pointRadius: 8,
              pointHoverRadius: 10,
                borderWidth: 3,
                originalData: originalOverall,
                treeData: treeConcentrations,
                grassData: grassConcentrations,
                weedData: weedConcentrations,
                originalTreeData: originalTree,
                originalGrassData: originalGrass,
                originalWeedData: originalWeed,
                originalRiskLevels: originalOverallRisk,
                originalTreeRiskLevels: originalTreeRisk,
                originalGrassRiskLevels: originalGrassRisk,
                originalWeedRiskLevels: originalWeedRisk
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                displayColors: false,
                callbacks: {
                  title: function(context) {
                    const index = context[0].dataIndex;
                    const month = months[index];
                    return `${month} Pollen Risk`;
                  },
                  label: function(context) {
                    const level = context.raw // 1=Low, 2=Medium, 3=High
                    const index = context.dataIndex
 
                    let riskText = context.dataset.originalRiskLevels[index]
                    if (riskText === 'Very High') {
                      riskText = 'High'
                    }

                    const getRiskColor = (riskText) => {
                      if (riskText === 'High' || riskText === 'Very High') return '🟥'  
                      if (riskText === 'Medium') return '🟧'  
                      if (riskText === 'Low') return '🟩' 
                      return '⬜' 
                    }
                    
                    return `${getRiskColor(riskText)} Overall: ${riskText}`
                  },
                  afterLabel: function(context) {
                    const index = context.dataIndex
                    const dataset = context.dataset
                    
                    let treeRisk = dataset.originalTreeRiskLevels[index]
                    let grassRisk = dataset.originalGrassRiskLevels[index]
                    let weedRisk = dataset.originalWeedRiskLevels[index]
                    
                    if (treeRisk === 'Very High') treeRisk = 'High'
                    if (grassRisk === 'Very High') grassRisk = 'High'
                    if (weedRisk === 'Very High') weedRisk = 'High'

                    const getRiskColor = (riskText) => {
                      if (riskText === 'High' || riskText === 'Very High') return '🟥' 
                      if (riskText === 'Medium') return '🟧' 
                      if (riskText === 'Low') return '🟩' 
                      return '⬜' 
                    }
                    
                    return [
                      `${getRiskColor(treeRisk)} Tree Pollen: ${treeRisk}`,
                      `${getRiskColor(grassRisk)} Grass Pollen: ${grassRisk}`,
                      `${getRiskColor(weedRisk)} Weed Pollen: ${weedRisk}`
                    ]
                  }
                },
                titleFont: {
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 13
                },
                padding: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              },
              legend: {
                display: false 
              }
            },
            scales: {
              y: {
                min: 0,
                max: 4,
                title: {
                  display: true,
                  text: 'Pollen Risk Level' 
                },
                ticks: {
                  callback: function(value) {
                    if (value === 1) return 'Low'
                    if (value === 2) return 'Medium'
                    if (value === 3) return 'High'
                    return ''
                  },
                  color: function(context) {
                    const value = context.tick.value
                    if (value === 3) return '#FF4D4D'     // High
                    if (value === 2) return '#FFA500'     // Medium
                    if (value === 1) return '#4CAF50'     // Low
                    return '#888888'
                  },
                  font: {
                    weight: 'bold',
                    size: 14
                  }
                },
                grid: {
                  color: function(context) {
                    if (context.tick.value === 1 || 
                        context.tick.value === 2 || 
                        context.tick.value === 3) {
                      return 'rgba(0, 0, 0, 0.2)';
                    }
                    return 'rgba(0, 0, 0, 0.05)';
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Month'
                }
              }
            }
          }
        })
      } catch (err) {
        console.error('Error initializing monthly trends chart:', err)
      }
    }

    // Initialize donut charts for pollen contributors
    const initDonutCharts = () => {
      try {
        // Tree pollen donut chart
        if (!treeDonutChart.value) return
        
        if (treeDonutChartInstance.value) {
          treeDonutChartInstance.value.destroy()
        }
        
        const treeCtx = treeDonutChart.value.getContext('2d')
        if (!treeCtx) return
        
        const treeContributors = plantData.value
          .filter(item => item['Tree Pollen Contributors'])
          .map(item => ({
            name: item['Tree Pollen Contributors'],
            value: item['Percentage (%)']
          }))
        
        treeDonutChartInstance.value = new Chart(treeCtx, {
          type: 'doughnut',
          data: {
            labels: treeContributors.map(item => item.name),
            datasets: [{
              data: treeContributors.map(item => item.value),
              backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(255, 205, 86, 0.8)',
                'rgba(201, 203, 207, 0.8)',
                'rgba(0, 162, 235, 0.8)'
              ],
              borderWidth: 1,
              hoverOffset: 25,
              hoverBorderWidth: 3,
              hoverBorderColor: '#ffffff',
              hoverBackgroundColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(201, 203, 207, 1)',
                'rgba(0, 162, 235, 1)'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              animateScale: true,
              animateRotate: true,
              duration: 500,
              easing: 'easeOutBounce'
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.formattedValue;
                    return `${label}: ${value}%`;
                  }
                },
                padding: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 14
                },
                displayColors: false
              },
              legend: {
                position: 'right'
              }
            },
            cutout: '60%',
            radius: '90%'
          }
        })

        // Weed pollen donut chart
        if (weedDonutChartInstance.value) {
          weedDonutChartInstance.value.destroy()
        }
        
        const weedCtx = weedDonutChart.value.getContext('2d')
        if (!weedCtx) return
        
        const weedContributors = plantData.value
          .filter(item => item['Weed Pollen Contributors'])
          .map(item => ({
            name: item['Weed Pollen Contributors'],
            value: item['Percentage (%).1']
          }))
        
        weedDonutChartInstance.value = new Chart(weedCtx, {
          type: 'doughnut',
          data: {
            labels: weedContributors.map(item => item.name),
            datasets: [{
              data: weedContributors.map(item => item.value),
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
              ],
              borderWidth: 1,
              hoverOffset: 25,
              hoverBorderWidth: 3,
              hoverBorderColor: '#ffffff',
              hoverBackgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              animateScale: true,
              animateRotate: true,
              duration: 500,
              easing: 'easeOutBounce'
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.formattedValue;
                    return `${label}: ${value}%`;
                  }
                },
                padding: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 14
                },
                displayColors: false
              },
              legend: {
                position: 'right'
              }
            },
            cutout: '60%',
            radius: '90%'
          }
        })

        // Grass pollen donut chart
        if (grassDonutChartInstance.value) {
          grassDonutChartInstance.value.destroy()
        }
        
        const grassCtx = grassDonutChart.value.getContext('2d')
        if (!grassCtx) return
        
        const grassContributors = plantData.value
          .filter(item => item['Grass Pollen Contributors'])
          .map(item => ({
            name: item['Grass Pollen Contributors'],
            value: item['Percentage (%).2']
          }))
        
        grassDonutChartInstance.value = new Chart(grassCtx, {
          type: 'doughnut',
          data: {
            labels: grassContributors.map(item => item.name),
            datasets: [{
              data: grassContributors.map(item => item.value),
              backgroundColor: [
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 99, 132, 0.8)'
              ],
              borderWidth: 1,
              hoverOffset: 25,
              hoverBorderWidth: 3,
              hoverBorderColor: '#ffffff',
              hoverBackgroundColor: [
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              animateScale: true,
              animateRotate: true,
              duration: 500,
              easing: 'easeOutBounce'
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.formattedValue;
                    return `${label}: ${value}%`;
                  }
                },
                padding: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 14
                },
                displayColors: false
              },
              legend: {
                position: 'right'
              }
            },
            cutout: '60%',
            radius: '90%'
          }
        })
      } catch (err) {
        console.error('Error initializing donut charts:', err)
      }
    }

    // Initialize seasonal bar chart
    const initSeasonalChart = () => {
      if (!seasonalChart.value) return
      
      try {
        if (seasonalChartInstance.value) {
          seasonalChartInstance.value.destroy()
        }
        
        const ctx = seasonalChart.value.getContext('2d')
        if (!ctx) return

        const hardcodedSeasonalData = [
          {
            Season: "Summer",
            "Overall Pollen Risk Level": "High",
            "Overall Pollen Concentration (grains/m_)": 160,
            "Tree Pollen Risk Level": "High",
            "Tree Pollen Concentration (grains/m_)": 15,
            "Grass Pollen Risk Level": "High",
            "Grass Pollen Concentration (grains/m_)": 95,
            "Weed Pollen Risk Level": "High",
            "Weed Pollen Month Concentration (grains/m_)": 50
          },
          {
            Season: "Autumn",
            "Overall Pollen Risk Level": "Low",
            "Overall Pollen Concentration (grains/m_)": 43,
            "Tree Pollen Risk Level": "Low",
            "Tree Pollen Concentration (grains/m_)": 13,
            "Grass Pollen Risk Level": "Low",
            "Grass Pollen Concentration (grains/m_)": 20,
            "Weed Pollen Risk Level": "Low",
            "Weed Pollen Month Concentration (grains/m_)": 10
          },
          {
            Season: "Winter",
            "Overall Pollen Risk Level": "Low",
            "Overall Pollen Concentration (grains/m_)": 40,
            "Tree Pollen Risk Level": "Low",
            "Tree Pollen Concentration (grains/m_)": 20,
            "Grass Pollen Risk Level": "Low",
            "Grass Pollen Concentration (grains/m_)": 10,
            "Weed Pollen Risk Level": "Low",
            "Weed Pollen Month Concentration (grains/m_)": 10
          },
          {
            Season: "Spring",
            "Overall Pollen Risk Level": "High",
            "Overall Pollen Concentration (grains/m_)": 210,
            "Tree Pollen Risk Level": "High",
            "Tree Pollen Concentration (grains/m_)": 90,
            "Grass Pollen Risk Level": "High",
            "Grass Pollen Concentration (grains/m_)": 90,
            "Weed Pollen Risk Level": "Moderate",
            "Weed Pollen Month Concentration (grains/m_)": 30
          }
        ];
        
        const seasons = hardcodedSeasonalData.map(item => item.Season)
        
        const convertRiskTextToLevel = (riskText) => {
          if (!riskText) return 1
          if (riskText === 'Low') return 1
          if (riskText === 'Moderate' || riskText === 'Medium') return 2
          if (riskText === 'High' || riskText === 'Very High') return 3
          return 1
        }
        
        const overallRisk = hardcodedSeasonalData.map(item => 
          convertRiskTextToLevel(item['Overall Pollen Risk Level']))
        const treeRisk = hardcodedSeasonalData.map(item => 
          convertRiskTextToLevel(item['Tree Pollen Risk Level']))
        const grassRisk = hardcodedSeasonalData.map(item => 
          convertRiskTextToLevel(item['Grass Pollen Risk Level']))
        const weedRisk = hardcodedSeasonalData.map(item => 
          convertRiskTextToLevel(item['Weed Pollen Risk Level']))
          
        const originalOverall = hardcodedSeasonalData.map(item => item['Overall Pollen Concentration (grains/m_)'])
        const originalTree = hardcodedSeasonalData.map(item => item['Tree Pollen Concentration (grains/m_)'])
        const originalGrass = hardcodedSeasonalData.map(item => item['Grass Pollen Concentration (grains/m_)'])
        const originalWeed = hardcodedSeasonalData.map(item => item['Weed Pollen Month Concentration (grains/m_)'])

        const riskLevelsOverall = hardcodedSeasonalData.map(item => {
          let risk = item['Overall Pollen Risk Level']
          if (risk === 'Very High') return 'High'
          if (risk === 'Moderate') return 'Medium'
          return risk
        })
        
        const riskLevelsTree = hardcodedSeasonalData.map(item => {
          let risk = item['Tree Pollen Risk Level']
          if (risk === 'Very High') return 'High'
          if (risk === 'Moderate') return 'Medium'
          return risk
        })
        
        const riskLevelsGrass = hardcodedSeasonalData.map(item => {
          let risk = item['Grass Pollen Risk Level']
          if (risk === 'Very High') return 'High'
          if (risk === 'Moderate') return 'Medium'
          return risk
        })
        
        const riskLevelsWeed = hardcodedSeasonalData.map(item => {
          let risk = item['Weed Pollen Risk Level']
          if (risk === 'Very High') return 'High'
          if (risk === 'Moderate') return 'Medium'
          return risk
        })
        
        seasonalChartInstance.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: seasons,
            datasets: [
              {
                label: 'Tree Pollen',
                data: treeRisk,
                backgroundColor: 'rgba(54, 162, 235, 0.8)', 
                borderWidth: 1,
                originalData: originalTree,
                riskLevels: riskLevelsTree
              },
              {
                label: 'Grass Pollen',
                data: grassRisk,
                backgroundColor: 'rgba(255, 206, 86, 0.8)', 
                borderWidth: 1,
                originalData: originalGrass,
                riskLevels: riskLevelsGrass
              },
              {
                label: 'Weed Pollen',
                data: weedRisk,
                backgroundColor: 'rgba(255, 99, 132, 0.8)', 
                borderWidth: 1,
                originalData: originalWeed,
                riskLevels: riskLevelsWeed
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                displayColors: false,
                callbacks: {
                  title: function(context) {
                    const season = context[0].label;
                    return `${season} Pollen Risk`;
                  },
                  label: function(context) {
                    const datasetIndex = context.datasetIndex;
                    const index = context.dataIndex;
                    const datasetLabel = context.chart.data.datasets[datasetIndex].label;
                    const riskLevel = context.chart.data.datasets[datasetIndex].riskLevels[index];
                    
                    const getRiskColor = (riskText) => {
                      if (riskText === 'High') return '🟥';
                      if (riskText === 'Medium') return '🟧'; 
                      if (riskText === 'Low') return '🟩'; 
                      return '⬜'; 
                    };
                    
                    return `${getRiskColor(riskLevel)} ${datasetLabel}: ${riskLevel}`;
                  }
                },
                titleFont: {
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 13
                },
                padding: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              },
              legend: {
                display: true, 
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  padding: 20
                }
              }
            },
            scales: {
              y: {
                min: 0,
                max: 4,
                title: {
                  display: true,
                  text: 'Pollen Risk Level' 
                },
                ticks: {
                  callback: function(value) {
                    if (value === 1) return 'Low'
                    if (value === 2) return 'Medium'
                    if (value === 3) return 'High'
                    return ''
                  },
                  color: function(context) {
                    const value = context.tick.value
                    if (value === 3) return '#FF4D4D'     // High
                    if (value === 2) return '#FFA500'     // Medium
                    if (value === 1) return '#4CAF50'     // Low
                    return '#888888'
                  },
                  font: {
                    weight: 'bold',
                    size: 14
                  }
                },
                grid: {
                  color: function(context) {
                    if (context.tick.value === 1 || 
                        context.tick.value === 2 || 
                        context.tick.value === 3) {
                      return 'rgba(0, 0, 0, 0.2)';
                    }
                    return 'rgba(0, 0, 0, 0.05)';
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Season'
                }
              }
            }
          }
        })
      } catch (err) {
        console.error('Error initializing seasonal bar chart:', err)
      }
    }

    // Initialize
    onMounted(() => {
      nextTick(() => {
        fetchData()
      })
    })

    // New function to get pollen index text
    const getPollenIndexText = (index) => {
      if (index >= 7) return 'Very High'
      if (index >= 5) return 'High'
      if (index >= 3) return 'Medium'
      return 'Low'
    }

    // Add new refs for share functionality
    const shareLink = ref('')
    const copyStatus = ref('Copy')
    
    // Add new function to generate share link
    const generateShareLink = () => {
      if (!weekForecast.value.length) return
      
      const today = weekForecast.value.find(day => isTodayCard(day.Date))
      if (!today) return
      
      // Create a URL with the forecast data
      const baseUrl = window.location.origin + '/forecast'
      const params = new URLSearchParams({
        date: today.Date,
        index: today['Pollen Index (0-10)'],
        risk: getPollenIndexText(today['Pollen Index (0-10)']),
        tree: today['Tree Risk Level'] || 'N/A',
        grass: today['Grass Risk Level'] || 'N/A',
        weed: today['Weed Risk Level'] || 'N/A',
        allergens: today['Main Allergens'] || 'N/A',
        action: today['Action Plan'] || 'N/A'
      })
      
      shareLink.value = `${baseUrl}?${params.toString()}`
    }
    
    // Add function to copy to clipboard
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareLink.value)
        copyStatus.value = 'Copied!'
        setTimeout(() => {
          copyStatus.value = 'Copy'
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
        copyStatus.value = 'Failed'
      }
    }

    const exportToCalendar = (day) => {
      const pad = (n) => String(n).padStart(2, '0')
      const dateObj = new Date(day.Date)
      const y = dateObj.getFullYear()
      const m = pad(dateObj.getMonth() + 1)
      const d = pad(dateObj.getDate())
      const dt = `${y}${m}${d}`
      const summary = `Pollen Alert: ${getPollenIndexText(day['Pollen Index (0-10)'])}`
      const description = `Pollen Index: ${day['Pollen Index (0-10)']} (${getPollenIndexText(day['Pollen Index (0-10)'])})\\nTree: ${day['Tree Risk Level'] || 'N/A'}\\nGrass: ${day['Grass Risk Level'] || 'N/A'}\\nWeed: ${day['Weed Risk Level'] || 'N/A'}\\nAllergens: ${day['Main Allergens'] || 'N/A'}\\nAction: ${day['Action Plan'] || 'N/A'}`
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${summary}\nDESCRIPTION:${description}\nDTSTART;VALUE=DATE:${dt}\nDTEND;VALUE=DATE:${dt}\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([ics], { type: 'text/calendar' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pollen-forecast-${day.Date}.ics`
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    }


    const addToGoogleCalendar = (day) => {
      const pad = (n) => String(n).padStart(2, '0')
      const dateObj = new Date(day.Date)
      const y = dateObj.getFullYear()
      const m = pad(dateObj.getMonth() + 1)
      const d = pad(dateObj.getDate())

      const start = `${y}${m}${d}`

      const endObj = new Date(dateObj)
      endObj.setDate(endObj.getDate() + 1)
      const endY = endObj.getFullYear()
      const endM = pad(endObj.getMonth() + 1)
      const endD = pad(endObj.getDate())
      const end = `${endY}${endM}${endD}`
      const title = `Pollen Alert: ${getPollenIndexText(day['Pollen Index (0-10)'])}`
      const details = `Pollen Index: ${day['Pollen Index (0-10)']} (${getPollenIndexText(day['Pollen Index (0-10)'])})%0A` +
        `Tree: ${day['Tree Risk Level'] || 'N/A'}%0A` +
        `Grass: ${day['Grass Risk Level'] || 'N/A'}%0A` +
        `Weed: ${day['Weed Risk Level'] || 'N/A'}%0A` +
        `Allergens: ${day['Main Allergens'] || 'N/A'}%0A` +
        `Action: ${day['Action Plan'] || 'N/A'}`
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${details}`
      window.open(url, '_blank')
    }


    const exportWeekToCalendar = () => {
      if (!weekForecast.value.length) return
      const pad = (n) => String(n).padStart(2, '0')
      let events = ''
      weekForecast.value.forEach(day => {
        const dateObj = new Date(day.Date)
        const y = dateObj.getFullYear()
        const m = pad(dateObj.getMonth() + 1)
        const d = pad(dateObj.getDate())
        const dt = `${y}${m}${d}`
        const summary = `Pollen Alert: ${getPollenIndexText(day['Pollen Index (0-10)'])}`
        const description = `Pollen Index: ${day['Pollen Index (0-10)']} (${getPollenIndexText(day['Pollen Index (0-10)'])})\\nTree: ${day['Tree Risk Level'] || 'N/A'}\\nGrass: ${day['Grass Risk Level'] || 'N/A'}\\nWeed: ${day['Weed Risk Level'] || 'N/A'}\\nAllergens: ${day['Main Allergens'] || 'N/A'}\\nAction: ${day['Action Plan'] || 'N/A'}`
        events += `BEGIN:VEVENT\nSUMMARY:${summary}\nDESCRIPTION:${description}\nDTSTART;VALUE=DATE:${dt}\nDTEND;VALUE=DATE:${dt}\nEND:VEVENT\n`
      })
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\n${events}END:VCALENDAR`
      const blob = new Blob([ics], { type: 'text/calendar' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pollen-forecast-week.ics`
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    }

    return {
      forecastData,
      trendData,
      plantData,
      seasonalData,
      isLoading,
      error,
      formattedForecastData,
      weekForecast,
      formatDate,
      getPollenIndexClass,
      getRiskClass,
      getPollenIndexText,
      isTodayCard,
      getCardPositionClass,
      getCardStyle,
      currentCardIndex,
      todayCardIndex,
      nextCard,
      prevCard,
      
      // Chart refs
      monthlyChart,
      treeDonutChart,
      grassDonutChart,
      weedDonutChart,
      seasonalChart,
      shareLink,
      copyStatus,
      generateShareLink,
      copyToClipboard,
      exportToCalendar,
      addToGoogleCalendar,
      exportWeekToCalendar
    }
  }
}
</script>

<style scoped>
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

.forecast-dashboard {
  display: grid;
  grid-template-columns: 65% 35%;
  gap: 20px;
  margin-bottom: 2rem;
}

.forecast-cards-section {
  width: 100%;
  background: linear-gradient(135deg, rgba(224, 232, 255, 0.8) 0%, rgba(235, 240, 255, 0.9) 100%);
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 2rem;
}

.forecast-chart-section {
  flex: 1;
  min-width: 45%;
  margin-bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(209, 213, 219, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.forecast-chart-section .chart-container {
  flex-grow: 1;
  height: 423px !important; 
}

.forecast-chart-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

section {
  margin-bottom: 0.25rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(209, 213, 219, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}

.chart-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.forecast-option {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background-color: rgba(209, 213, 219, 0.5);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.forecast-option.active {
  background-color: rgba(0, 122, 255, 0.8);
  color: white;
}

.forecast-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-container {
  height: 400px;
  width: 100%;
  max-width: 90%;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}

.donut-charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 90%;
  margin: 0 auto;
}

.donut-chart-wrapper {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.donut-chart-wrapper h3 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

/* Loading and error styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 122, 255, 0.3);
  border-radius: 50%;
  border-top-color: rgba(0, 122, 255, 0.8);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #ff4d4d;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

/* Cards container for stacked layout */
.cards-container {
  position: relative;
  padding: 2rem 0;
  margin: 0 auto;
  height: 550px;
  width: 90%;
  max-width: 700px;
  overflow: visible;
}

/* Stacked card wrapper */
.stacked-cards-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  perspective: 1000px;
}


.forecast-card {
  position: absolute;
  width: 100%;
  max-width: 433px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  transition: all 0.5s ease;
  box-sizing: border-box;
  transform-origin: center center;
  height: auto;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-top: none;
}


.card-position-0 {
  transform: translateX(-65%) scale(0.8);
  opacity: 0.7;
  z-index: 1;
}

.card-position-1 {
  transform: translateX(-35%) scale(0.9);
  opacity: 0.85;
  z-index: 2;
}

.card-position-2 {
  transform: translateX(0) scale(1);
  opacity: 1;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.card-position-3 {
  transform: translateX(35%) scale(0.9);
  opacity: 0.85;
  z-index: 2;
}

.card-position-4 {
  transform: translateX(65%) scale(0.8);
  opacity: 0.7;
  z-index: 1;
}

.card-left {
  transform: translateX(-100%) scale(0.7);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

.card-right {
  transform: translateX(100%) scale(0.7);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

/* Card controls */
.stacked-card-controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  pointer-events: none;
  padding: 0 1rem;
  z-index: 10;
  box-sizing: border-box;
}

.control-button {
  width: 100px; 
  height: 100px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  border: none;
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  pointer-events: auto;
  color: #333;
  outline: none;
}

.control-button:hover:not(:disabled) {
  background-color: rgba(0, 122, 255, 0.2);
  transform: scale(1.1);
}

.control-button:active:not(:disabled) {
  transform: scale(1.2);
  transition: all 0.1s ease;
}

.control-button:disabled {
  opacity: 0.3;
  cursor: default;
}


.forecast-card.low,
.forecast-card.moderate,
.forecast-card.high,
.forecast-card.very-high {
  border-left: none;
}

.today-card {
  border: 2px solid #0066cc !important; 
}


.cards-container::-webkit-scrollbar,
.cards-container::-webkit-scrollbar-track,
.cards-container::-webkit-scrollbar-thumb {
  display: none;
}


.card-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.pollen-emoji {
  font-size: 1.8rem;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.weekday {
  font-weight: 700;
}

.date {
  font-size: 1rem;
  color: #555;
}

.today-tag {
  background-color: #0066cc;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: auto; 
}


.risk-indicator {
  position: relative;
  margin: 0.8rem 0 2rem 0;
}

.risk-label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #333;
  font-size: 0.85rem;
}

.risk-type {
  font-size: 0.75rem;
  color: #555;
  display: block;
  margin-top: 0.1rem;
  margin-bottom: 0.2rem;
  font-weight: 600;
}

.risk-bar {
  height: 10px;
  background-color: rgba(200, 200, 200, 0.7);
  border-radius: 5px;
  position: relative;
}


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


.risk-bar .fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 4px 0 0 4px;
  z-index: 1;
}

.risk-bar.low .fill {
  width: 33.33%;
  background-color: #4CAF50;
}

.risk-bar.moderate .fill {
  width: 66.67%;
  background-color: #FFA500;
}

.risk-bar.high .fill {
  width: 100%;
  background-color: #FF4D4D;
  border-radius: 4px;
}

.risk-bar.very-high .fill {
  width: 100%;
  background-color: #9C27B0;
  border-radius: 4px;
}

.risk-text {
  position: absolute;
  right: 0;
  bottom: -20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.risk-text.low { color: #4CAF50; }
.risk-text.moderate { color: #FFA500; }
.risk-text.high { color: #FF4D4D; }
.risk-text.very-high { color: #9C27B0; }


.card-risk-levels-detailed {
  display: flex;
  justify-content: space-around;
  padding: 0.6rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
}

.risk-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  text-align: center;
}

.risk-icon {
  font-size: 1.4rem;
}

.risk-text-detailed {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.risk-text-detailed.low { color: #4CAF50; }
.risk-text-detailed.moderate { color: #FFA500; }
.risk-text-detailed.high { color: #FF4D4D; }
.risk-text-detailed.very-high { color: #9C27B0; }


.card-allergens, .card-action {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.allergens-label, .action-label {
  font-weight: 600;
  margin-bottom: 0.2rem;
  color: #333;
}

.allergens-text, .action-text {
  color: #555;
  line-height: 1.3;
}


@media (max-width: 1200px) {
  .forecast-dashboard,
  .trends-dashboard {
    gap: 1.5rem;
  }
  
  .forecast-card {
    max-width: 400px;
  }
}

@media (max-width: 992px) {
  .forecast-dashboard,
  .trends-dashboard {
    flex-direction: column;
  }
  
  .forecast-cards-section,
  .forecast-chart-section,
  .seasonal-comparison-section,
  .monthly-trends-section {
    min-width: 100%;
    max-width: 100%;
  }
  
  .forecast-card {
    max-width: 366px;
    padding: 1.2rem;
  }
}

@media (max-width: 768px) {
  .cards-container {
    height: 450px;
  }
  .forecast-card {
    max-width: 333px; 
    padding: 1rem;
  }
   .card-position-0 {
     transform: translateX(-55%) scale(0.8);
   }
   .card-position-4 {
     transform: translateX(55%) scale(0.8);
   }
}

@media (max-width: 576px) {
  .cards-container {
    height: 400px;
  }
  .forecast-card {
    max-width: 90%;
    padding: 0.8rem;
  }
  .card-position-0, .card-position-4 {
     display: none;
   }
   .card-position-1 {
     transform: translateX(-25%) scale(0.9);
   }
   .card-position-3 {
     transform: translateX(25%) scale(0.9);
   }
   .risk-indicator {
     margin-bottom: 1.5rem;
   }
   .control-button {
     width: 80px;
     height: 80px;
     font-size: 2.5rem;
   }
}


.trends-dashboard {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 0;
}

.seasonal-comparison-section,
.monthly-trends-section {
  flex: 1;
  min-width: 45%;
  margin-left: 0;
  margin-right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(209, 213, 219, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.seasonal-comparison-section:hover,
.monthly-trends-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}


.share-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.3);
  border-radius: 12px;
  color: #0066cc;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-button:hover {
  background-color: rgba(0, 122, 255, 0.2);
  transform: translateY(-2px);
}

.share-icon {
  font-size: 1.2rem;
}

.share-link-container {
  margin-top: 0.8rem;
  display: flex;
  gap: 0.5rem;
}

.share-link-input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.9);
  cursor: text;
}

.copy-button {
  padding: 0.6rem 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.copy-button:hover {
  background-color: #0052a3;
  transform: translateY(-2px);
}

/* Responsive adjustments for share section */
@media (max-width: 576px) {
  .share-link-container {
    flex-direction: column;
  }
  
  .copy-button {
    width: 100%;
  }
}

/* Share button styles */
.calendar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(0, 200, 83, 0.1);
  border: 1px solid rgba(0, 200, 83, 0.3);
  border-radius: 12px;
  color: #009688;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}
.calendar-button:hover {
  background-color: rgba(0, 200, 83, 0.2);
  transform: translateY(-2px);
}
.calendar-icon {
  font-size: 1.2rem;
}

.gcal-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(66, 133, 244, 0.1);
  border: 1px solid rgba(66, 133, 244, 0.3);
  border-radius: 12px;
  color: #4285F4;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}
.gcal-button:hover {
  background-color: rgba(66, 133, 244, 0.2);
  transform: translateY(-2px);
}
.gcal-icon {
  font-size: 1.2rem;
}

/* Pollen Level Info Section */
.pollen-level-info-section {
  width: 100%;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 245, 230, 0.8) 0%, rgba(255, 250, 240, 0.9) 100%);
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.pollen-level-info-section .section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.pollen-info-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.risk-levels-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.risk-level-card {
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.risk-level-card.low {
  background-color: rgba(76, 175, 80, 0.15);
  border-left: 5px solid #4CAF50;
}

.risk-level-card.moderate {
  background-color: rgba(255, 152, 0, 0.15);
  border-left: 5px solid #FF9800;
}

.risk-level-card.high {
  background-color: rgba(244, 67, 54, 0.15);
  border-left: 5px solid #F44336;
}

.risk-level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.risk-level-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.risk-level-card.low .risk-level-header h3 {
  color: #4CAF50;
}

.risk-level-card.medium .risk-level-header h3 {
  color: #FF9800;
}

.risk-level-card.high .risk-level-header h3 {
  color: #F44336;
}

.concentration {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 3px 0;
  border-radius: 0;
  color: #555;
}


.risk-level-card.low .concentration {
  color: #4CAF50;
}

.risk-level-card.medium .concentration {
  color: #FF9800;
}

.risk-level-card.high .concentration {
  color: #F44336;
}

.risk-level-details {
  list-style-type: disc;
  padding-left: 20px;
  margin: 0;
}

.risk-level-card.low .risk-level-details li::marker {
  color: #4CAF50;
}

.risk-level-card.medium .risk-level-details li::marker {
  color: #FF9800;
}

.risk-level-card.high .risk-level-details li::marker {
  color: #F44336;
}

.risk-level-details li {
  margin-bottom: 5px;
  font-size: 0.95rem;
}

@media (max-width: 1024px) {
  .forecast-dashboard {
    grid-template-columns: 1fr;
  }
  
  .risk-levels-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .risk-levels-container {
    grid-template-columns: 1fr;
  }
}

.trends-dashboard {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 0;
}

.seasonal-comparison-section,
.monthly-trends-section {
  flex: 1;
  min-width: 45%;
  margin-left: 0;
  margin-right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(209, 213, 219, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.seasonal-comparison-section:hover,
.monthly-trends-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}

.chart-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  text-align: center;
  width: 100%;
  align-items: center;
}

.chart-header .section-title {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  text-align: center;
}

.location-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.location-icon {
  font-size: 1rem;
  margin-right: 0.25rem;
  color: #4285F4;
}

.location-text {
  font-size: 0.85rem;
  color: #666;
}

.key-insight {
  background-color: #D4E6FF;
  border-left: 4px solid #1976D2;
  padding: 0.8rem 1rem;
  border-radius: 0 4px 4px 0;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
}

.insight-label {
  font-weight: 600;
  color: #333;
  margin-right: 0.5rem;
}

.insight-text {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
  text-align: center;
}

.distribution-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.contributors-header {
  margin-bottom: 2rem;
}

.contributors-header .key-insight {
  margin-bottom: 0;
}

.distribution-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.donut-chart-wrapper {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.donut-chart-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.risk-text.moderate, 
.risk-text-detailed.moderate,
.risk-value.moderate {
  color: #FFA500;
}

.risk-bar.moderate .fill {
  width: 66.67%;
  background-color: #FFA500;
}


.risk-text.medium, 
.risk-text-detailed.medium,
.risk-value.medium {
  color: #FFA500;
}

.risk-bar.medium .fill {
  width: 66.67%;
  background-color: #FFA500;
}

.risk-level-card.moderate,
.risk-level-card.medium {
  background-color: rgba(255, 152, 0, 0.15);
  border-left: 5px solid #FF9800;
}
</style>