<template>
  <div class="personalisation-page">
    <!-- Header -->
    <Navbar />

    <!-- Main Content Container -->
    <div class="main-container">
      <div class="section-header">
        <h1>Personalised Pollen Dashboard</h1>
        <p>Customised pollen information for you</p>
      </div>

      <!-- Two-column dashboard layout -->
      <div class="forecast-dashboard">
        <!-- 7-Day Cards Section (Left Column) -->
        <section class="forecast-cards-section">
          <h2 class="section-title">7-Day Pollen Forecast</h2>
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

        <!-- Forecast Line Chart (Right Column) -->
        <section class="forecast-chart-section">
          <h2 class="section-title">Pollen Index Trend</h2>
          <div class="chart-controls">
            <button 
              v-for="option in forecastOptions" 
              :key="option.value"
              :class="['forecast-option', { active: selectedForecastOption === option.value }]"
              @click="selectedForecastOption = option.value"
            >
              {{ option.label }}
            </button>
          </div>
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
          <div v-else-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-else class="chart-container" ref="forecastChartContainer" style="position: relative; height:400px; width:100%">
            <canvas ref="forecastChart"></canvas>
          </div>
        </section>
      </div>

      <!-- Pollen Contributors (原本在下方，现在移到前面) -->
      <section class="pollen-contributors-section">
        <h2 class="section-title">Pollen Source Distribution</h2>
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else class="donut-charts-container">
          <div class="donut-chart-wrapper">
            <h3>Tree Pollen Sources</h3>
            <div class="chart-container" style="position: relative; height:300px; width:100%">
              <canvas ref="treeDonutChart"></canvas>
            </div>
          </div>
          <div class="donut-chart-wrapper">
            <h3>Grass Pollen Sources</h3>
            <div class="chart-container" style="position: relative; height:300px; width:100%">
              <canvas ref="grassDonutChart"></canvas>
            </div>
          </div>
          <div class="donut-chart-wrapper">
            <h3>Weed Pollen Sources</h3>
            <div class="chart-container" style="position: relative; height:300px; width:100%">
              <canvas ref="weedDonutChart"></canvas>
            </div>
          </div>
        </div>
      </section>

      <!-- Two-column layout for Seasonal and Monthly -->
      <div class="trends-dashboard">
        <!-- Seasonal Comparison (左侧) -->
        <section class="seasonal-comparison-section">
          <h2 class="section-title">Seasonal Pollen Comparison</h2>
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

        <!-- Monthly Trends (右侧) -->
        <section class="monthly-trends-section">
          <h2 class="section-title">Monthly Trend Analysis</h2>
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
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import Navbar from '../components/Navbar.vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

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
    const forecastChart = ref(null)
    const forecastChartInstance = ref(null)
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
          // Set index to -2 so that the today card (index 0) appears in the middle (position 2)
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
      if (selectedForecastOption.value === '14days') days = 14
      if (selectedForecastOption.value === '30days') days = 30
      
      // 获取今天的日期字符串
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      
      // 找到今天在数据中的索引
      const todayIndex = forecastData.value.findIndex(day => day.Date === todayStr)
      
      // 如果找到今天的数据，从今天开始取指定天数
      if (todayIndex >= 0) {
        return forecastData.value.slice(todayIndex, todayIndex + days)
      }
      
      // 如果找不到今天的数据，则使用原来的逻辑
      return forecastData.value.slice(0, days)
    })

    // Week forecast (first 7 days)
    const weekForecast = computed(() => {
      if (!forecastData.value.length) return []
      
      // 获取今天的日期字符串 YYYY-MM-DD
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      
      // 找到今天在数据中的索引
      const todayIndex = forecastData.value.findIndex(day => day.Date === todayStr)
      
      // 如果找到今天，从今天开始取7天；否则从第一天开始取
      if (todayIndex >= 0) {
        return forecastData.value.slice(todayIndex, todayIndex + 7)
      } else {
        return forecastData.value.slice(0, 7)
      }
    })

    // Format date from YYYY-MM-DD to DD/MM
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getDate()}/${date.getMonth() + 1}`
    }

    // Check if card is today's card
    const isTodayCard = (dateString) => {
      return dateString === todayDate.value
    }

    // Get CSS class based on pollen index
    const getPollenIndexClass = (index) => {
      if (index >= 7) return 'very-high'
      if (index >= 5) return 'high'
      if (index >= 3) return 'moderate'
      return 'low'
    }

    // Get CSS class based on risk level
    const getRiskClass = (risk) => {
      if (!risk) return ''
      return risk.toLowerCase().replace(' ', '-')
    }

    // Get color based on risk level
    const getRiskColor = (risk) => {
      if (!risk) return '#888888'
      const riskLow = risk.toLowerCase()
      if (riskLow === 'low') return '#4CAF50'
      if (riskLow === 'moderate') return '#FFA500'
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
      // 允许翻到第一张卡片位于最左侧位置（索引0在position 0）
      if (currentCardIndex.value > -2) {
        currentCardIndex.value--
      }
    }

    // Initialize charts
    const initCharts = () => {
      isLoading.value = false // Ensure loading is complete before chart init
      
      // Defer chart initialization to next tick and add delay to ensure DOM is fully ready
      setTimeout(() => {
        nextTick(() => {
          try {
            // Initialize forecast line chart if data exists
            if (forecastChart.value && forecastData.value.length > 0) {
              initForecastChart()
            }
            
            // Initialize monthly trends chart if data exists
            if (monthlyChart.value && trendData.value.length > 0) {
              initMonthlyChart()
            }
            
            // Initialize donut charts if data exists
            if (treeDonutChart.value && grassDonutChart.value && weedDonutChart.value && plantData.value.length > 0) {
              initDonutCharts()
            }
            
            // Initialize seasonal bar chart if data exists
            if (seasonalChart.value && seasonalData.value.length > 0) {
              initSeasonalChart()
            }
          } catch (err) {
            console.error('Error initializing charts:', err)
          }
        })
      }, 300) // Small delay to ensure DOM is ready
    }

    // Initialize forecast line chart
    const initForecastChart = () => {
      if (!forecastChart.value) return
      
      try {
        if (forecastChartInstance.value) {
          forecastChartInstance.value.destroy()
        }
        
        const ctx = forecastChart.value.getContext('2d')
        if (!ctx) return
        
        const days = formattedForecastData.value.map(day => day.Date)
        // 将原始索引值(0-10)转换为离散的刻度值(1.5:Low, 2.0:Medium, 2.5:High)
        const discreteIndices = formattedForecastData.value.map(day => {
          const index = day['Pollen Index (0-10)']
          if (index >= 5) return 2.5 // High
          if (index >= 3) return 2.0 // Medium
          return 1.5 // Low
        })
        
        // 创建离散索引对应的原始标签
        const indexLabels = discreteIndices.map(index => {
          if (index === 2.5) return 'High'
          if (index === 2.0) return 'Medium'
          return 'Low'
        })
        
        forecastChartInstance.value = new Chart(ctx, {
          type: 'line',
          data: {
            labels: days,
            datasets: [{
              label: 'Pollen Level',
              data: discreteIndices,
              borderColor: 'rgba(0, 122, 255, 0.8)',
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
              tension: 0, // 设置为0使线条成为折线而不是曲线
              fill: true,
              pointBackgroundColor: discreteIndices.map(index => {
                if (index === 2.5) return '#FF4D4D'   // High
                if (index === 2.0) return '#FFA500'   // Medium
                return '#4CAF50'                    // Low
              }),
              pointRadius: 8,
              pointHoverRadius: 10,
              borderWidth: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    // 转换离散值为文本标签
                    let level = 'Unknown'
                    if (context.raw === 2.5) level = 'High'
                    else if (context.raw === 2.0) level = 'Medium'
                    else if (context.raw === 1.5) level = 'Low'
                    
                    const index = context.dataIndex
                    const day = formattedForecastData.value[index]
                    return `Overall Level: ${level}`
                  },
                  afterLabel: function(context) {
                    const index = context.dataIndex
                    const day = formattedForecastData.value[index]
                    return [
                      `Tree: ${day['Tree Risk Level'] || 'N/A'}`,
                      `Weed: ${day['Weed Risk Level'] || 'N/A'}`,
                      `Grass: ${day['Grass Risk Level'] || 'N/A'}`,
                      `Allergens: ${day['Main Allergens'] || 'N/A'}`,
                      `Action Plan: ${day['Action Plan'] || 'N/A'}`
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
                display: false  // 不显示图例
              }
            },
            scales: {
              y: {
                min: 0.75,   // 还原到之前接受的设置
                max: 3.25,   // 还原到之前接受的设置
                title: {
                  display: false,  // 保持不显示标题
                  text: 'Overall Pollen Level'
                },
                ticks: {
                  callback: function(value) {
                    if (value === 1.5) return 'Low'     // 底部1/3位置
                    if (value === 2.0) return 'Medium'  // 中间位置
                    if (value === 2.5) return 'High'    // 上部1/3位置
                    return ''
                  },
                  color: function(context) {
                    const value = context.tick.value
                    if (value === 2.5) return '#FF4D4D'     // High
                    if (value === 2.0) return '#FFA500'     // Medium
                    if (value === 1.5) return '#4CAF50'     // Low
                    return '#888888'
                  },
                  font: {
                    weight: 'bold',
                    size: 14
                  }
                },
                grid: {
                  color: function(context) {
                    if (context.tick.value === 1.5 || 
                        context.tick.value === 2.0 || 
                        context.tick.value === 2.5) {
                      return 'rgba(0, 0, 0, 0.2)';
                    }
                    return 'rgba(0, 0, 0, 0.05)';
                  },
                  lineWidth: function(context) {
                    if (context.tick.value === 1.5 || 
                        context.tick.value === 2.0 || 
                        context.tick.value === 2.5) {
                      return 1;
                    }
                    return 0.5;
                  }
                }
              },
              x: {
                title: {
                  display: false,  // 不显示X轴标题
                  text: 'Date'
                }
              }
            }
          }
        })
      } catch (err) {
        console.error('Error initializing forecast chart:', err)
      }
    }

    // Initialize monthly trends chart
    const initMonthlyChart = () => {
      if (!monthlyChart.value) return
      
      try {
        if (monthlyChartInstance.value) {
          monthlyChartInstance.value.destroy()
        }
        
        const ctx = monthlyChart.value.getContext('2d')
        if (!ctx) return
        
        const months = trendData.value.map(item => item.Month)
        
        // 根据风险级别文本直接转换为数值
        const convertRiskTextToLevel = (riskText) => {
          if (riskText === 'Low') return 1
          if (riskText === 'Moderate') return 2
          if (riskText === 'High' || riskText === 'Very High') return 3  // Very High归为High
          return 1 // 默认为Low
        }

        // 使用API中返回的风险级别文本值
        const overallConcentrations = trendData.value.map(item => 
          convertRiskTextToLevel(item['Overall Pollen Risk Level']))
        const treeConcentrations = trendData.value.map(item => 
          convertRiskTextToLevel(item['Tree Pollen Risk Level']))
        const grassConcentrations = trendData.value.map(item => 
          convertRiskTextToLevel(item['Grass Pollen Risk Level']))
        const weedConcentrations = trendData.value.map(item => 
          convertRiskTextToLevel(item['Weed Pollen Risk Level']))
        
        // 获取原始数据用于tooltip显示
        const originalOverall = trendData.value.map(item => item['Overall Pollen Concentration (grains/m_)'])
        const originalTree = trendData.value.map(item => item['Tree Pollen Concentration (grains/m_)'])
        const originalGrass = trendData.value.map(item => item['Grass Pollen Concentration (grains/m_)'])
        const originalWeed = trendData.value.map(item => item['Weed Pollen Month Concentration (grains/m_)'])
        
        // 获取原始风险级别文本用于tooltip
        const originalOverallRisk = trendData.value.map(item => item['Overall Pollen Risk Level'])
        const originalTreeRisk = trendData.value.map(item => item['Tree Pollen Risk Level'])
        const originalGrassRisk = trendData.value.map(item => item['Grass Pollen Risk Level'])
        const originalWeedRisk = trendData.value.map(item => item['Weed Pollen Risk Level'])
        
        monthlyChartInstance.value = new Chart(ctx, {
          type: 'line',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Overall Pollen',
                data: overallConcentrations,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0, // 设置为0使线条成为直线
                fill: true,
                pointBackgroundColor: overallConcentrations.map(level => {
                  if (level === 3) return '#FF4D4D'      // High
                  if (level === 2) return '#FFA500'      // Medium
                  return '#4CAF50'                       // Low
                }),
                pointRadius: 8,
                pointHoverRadius: 10,
                borderWidth: 3,
                originalData: originalOverall, // 保存原始数据用于tooltip
                // 保存其他花粉类型数据用于tooltip
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
                callbacks: {
                  label: function(context) {
                    const level = context.raw // 1=Low, 2=Moderate, 3=High
                    const index = context.dataIndex
                    
                    // 使用API返回的原始风险级别文本
                    const riskText = context.dataset.originalRiskLevels[index]
                    
                    // 获取风险级别对应的颜色
                    const getRiskColor = (riskText) => {
                      if (riskText === 'High' || riskText === 'Very High') return '🟥'  // 红色方块
                      if (riskText === 'Moderate') return '🟧'  // 橙色方块
                      if (riskText === 'Low') return '🟩'  // 绿色方块
                      return '⬜'  // 默认白色
                    }
                    
                    // 返回各花粉类型风险等级，前面添加色块，不显示具体数字
                    return [
                      `${getRiskColor(riskText)} ${riskText}`
                    ]
                  },
                  afterLabel: function(context) {
                    const index = context.dataIndex
                    const dataset = context.dataset
                    
                    // 使用API返回的原始风险级别文本
                    const treeRisk = dataset.originalTreeRiskLevels[index]
                    const grassRisk = dataset.originalGrassRiskLevels[index]
                    const weedRisk = dataset.originalWeedRiskLevels[index]
                    
                    // 获取风险级别对应的颜色
                    const getRiskColor = (riskText) => {
                      if (riskText === 'High' || riskText === 'Very High') return '🟥'  // 红色方块
                      if (riskText === 'Moderate') return '🟧'  // 橙色方块
                      if (riskText === 'Low') return '🟩'  // 绿色方块
                      return '⬜'  // 默认白色
                    }
                    
                    // 返回各花粉类型风险等级，前面添加色块，不显示具体数字
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
        
        const seasons = seasonalData.value.map(item => item.Season)
        
        // 将浓度值转换为离散的三个风险级别的数值(1=Low, 2=Medium, 3=High)
        const convertToRiskLevel = (value) => {
          if (value < 20) return 1  // Low = 1
          if (value >= 20 && value <= 50) return 2  // Medium = 2
          return 3  // High = 3
        }
        
        // 转换数据为离散级别
        const overallRisk = seasonalData.value.map(item => 
          convertToRiskLevel(item['Overall Pollen Concentration (grains/m_)']))
        const treeRisk = seasonalData.value.map(item => 
          convertToRiskLevel(item['Tree Pollen Concentration (grains/m_)']))
        const grassRisk = seasonalData.value.map(item => 
          convertToRiskLevel(item['Grass Pollen Concentration (grains/m_)']))
        const weedRisk = seasonalData.value.map(item => 
          convertToRiskLevel(item['Weed Pollen Month Concentration (grains/m_)']))
          
        // 保存原始数据用于tooltip
        const originalOverall = seasonalData.value.map(item => item['Overall Pollen Concentration (grains/m_)'])
        const originalTree = seasonalData.value.map(item => item['Tree Pollen Concentration (grains/m_)'])
        const originalGrass = seasonalData.value.map(item => item['Grass Pollen Concentration (grains/m_)'])
        const originalWeed = seasonalData.value.map(item => item['Weed Pollen Month Concentration (grains/m_)'])
        
        seasonalChartInstance.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: seasons,
            datasets: [
              {
                label: 'Overall Pollen',
                data: overallRisk,
                backgroundColor: 'rgba(75, 192, 192, 0.8)', // 固定颜色
                borderWidth: 1,
                originalData: originalOverall
              },
              {
                label: 'Tree Pollen',
                data: treeRisk,
                backgroundColor: 'rgba(54, 162, 235, 0.8)', // 固定颜色
                borderWidth: 1,
                originalData: originalTree
              },
              {
                label: 'Grass Pollen',
                data: grassRisk,
                backgroundColor: 'rgba(255, 206, 86, 0.8)', // 固定颜色
                borderWidth: 1,
                originalData: originalGrass
              },
              {
                label: 'Weed Pollen',
                data: weedRisk,
                backgroundColor: 'rgba(255, 99, 132, 0.8)', // 固定颜色
                borderWidth: 1,
                originalData: originalWeed
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const datasetLabel = context.dataset.label || ''
                    const level = context.raw // 1=Low, 2=Medium, 3=High
                    const index = context.dataIndex
                    
                    // 获取原始数值
                    const originalValue = context.dataset.originalData[index]
                    
                    // 确定风险级别文本
                    let riskText = 'N/A'
                    if (level === 1) riskText = 'Low'
                    else if (level === 2) riskText = 'Medium' 
                    else if (level === 3) riskText = 'High'
                    
                    return `${datasetLabel}: ${originalValue} grains/m² (Risk: ${riskText})`
                  }
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

    // Watch for changes in forecast option to update chart
    watch(selectedForecastOption, () => {
      if (!isLoading.value && forecastData.value.length > 0) {
        nextTick(() => {
          setTimeout(() => {
            initForecastChart()
          }, 50)
        })
      }
    })

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
      if (index >= 3) return 'Moderate'
      return 'Low'
    }

    return {
      forecastData,
      trendData,
      plantData,
      seasonalData,
      isLoading,
      error,
      selectedForecastOption,
      forecastOptions,
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
      forecastChart,
      monthlyChart,
      treeDonutChart,
      grassDonutChart,
      weedDonutChart,
      seasonalChart
    }
  }
}
</script>

<style scoped>
.personalisation-page {
  margin-top: 60px;
  background-color: rgba(227, 231, 255, 0.4);
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
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  padding: 0;
}

.forecast-cards-section {
  flex: 1;
  min-width: 45%;
  max-width: 50%;
  background: linear-gradient(135deg, rgba(224, 232, 255, 0.8) 0%, rgba(235, 240, 255, 0.9) 100%);
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 2rem;
  margin-left: 0;
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
  height: 423px !important; /* 设置固定高度以与卡片对齐 */
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
  margin-bottom: 3rem;
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
  margin: 0 5%;
  height: 480px;
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

/* Restore Forecast card styles for stacking */
.forecast-card {
  position: absolute;
  width: 100%;
  max-width: 433px; /* 原来宽度的2/3 */
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 1.5rem; /* Adjust padding */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* Adjust gap */
  transition: all 0.5s ease;
  box-sizing: border-box;
  transform-origin: center center;
  height: auto; /* Allow height to adjust to content */
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-top: none;
}

/* Card positions */
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
  width: 100px; /* 翻页箭头宽度增加一倍 */
  height: 100px; /* 翻页箭头高度增加一倍 */
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  border: none;
  font-size: 3rem; /* 增大箭头字体 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  pointer-events: auto;
  color: #333;
  outline: none; /* 去掉点击时的黑边 */
}

.control-button:hover:not(:disabled) {
  background-color: rgba(0, 122, 255, 0.2);
  transform: scale(1.1); /* 移除translateY以保持简单缩放效果 */
}

.control-button:active:not(:disabled) {
  transform: scale(1.2); /* 点击时添加轻微弹出效果 */
  transition: all 0.1s ease;
}

.control-button:disabled {
  opacity: 0.3;
  cursor: default;
}

/* Re-apply other necessary styles */
.forecast-card.low,
.forecast-card.moderate,
.forecast-card.high,
.forecast-card.very-high {
  border-left: none; /* Removed side border */
}

.today-card {
  border: 2px solid #0066cc !important; 
}

/* Remove scrollbar styles */
.cards-container::-webkit-scrollbar,
.cards-container::-webkit-scrollbar-track,
.cards-container::-webkit-scrollbar-thumb {
  display: none;
}

/* Keep PollenTracker style card content */
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
  flex-wrap: wrap; /* Allow wrapping if needed */
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

/* Risk Indicator styles */
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

/* 添加分隔线 */
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

/* 风险填充区域 */
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

/* Detailed Risk Levels */
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

/* Allergens and Action Plan */
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

/* Responsive adjustments */
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
    height: 450px; /* Adjust height if needed */
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

/* Two-column layout for Seasonal and Monthly */
.trends-dashboard {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  margin-bottom: 3rem;
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
</style>
