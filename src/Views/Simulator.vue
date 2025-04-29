<!-- AllergyRiskAssessment.vue -->
<template>
    <div class="personalisation-page">
        <Navbar />
      <div class="overview-container">
        <!-- Header with split background -->
        <div class="overview-header">
          <div class="header-left">
            <div class="header-content">
              <h1 class="overview-title">Lifestyle Simulator</h1>
              <p class="overview-subtitle">Drag all your lifestyle factors into the dropzone, then click the button to find out potential allergy risk & solution for daily life.</p>
            </div>
          </div>
          <div class="header-right"></div>
          <div class="header-image-overlay"></div>
        </div>
    
        <!-- Main content -->
        <div class="assessment-content">
          <div class="content-grid">
            <!-- Left side: Factors Grid -->
            <div class="factors-section">
                <!-- Life Style -->
              <div class="factor-category lifestyle">
                <h3 class="category-title">Life Style</h3>
                <div class="factors-container lifestyle">
                    <template v-for="item in lifestyleItems" :key="item.id">
                    <div
                      v-if="!selectedItems.find(i => i.id === item.id)"
                      class="factor-card"
                      @mousedown="startDrag($event, item)"
                    >
                      <span class="emoji-icon">{{ item.icon }}</span>
                      <p class="factor-name">{{ item.name }}</p>
                    </div>
                  </template>
                </div>
              </div>
  
                <!-- Home Environment -->
              <div class="factor-category home">
                <h3 class="category-title">Home Environment</h3>
                <div class="factors-container home">
                    <template v-for="item in homeItems" :key="item.id">
                    <div
                      v-if="!selectedItems.find(i => i.id === item.id)"
                      class="factor-card"
                      @mousedown="startDrag($event, item)"
                    >
                      <span class="emoji-icon">{{ item.icon }}</span>
                      <p class="factor-name">{{ item.name }}</p>
                    </div>
                  </template>
                </div>
              </div>
    
              <!-- Protective -->
              <div class="factor-category protective">
                <h3 class="category-title">Protective Measures</h3>
                <div class="factors-container protective">
                  <template v-for="item in protectiveItems" :key="item.id">
                    <div
                      v-if="!selectedItems.find(i => i.id === item.id)"
                      class="factor-card"
                      @mousedown="startDrag($event, item)"
                    >
                      <span class="emoji-icon">{{ item.icon }}</span>
                      <p class="factor-name">{{ item.name }}</p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
  
            <!-- Right side: Dropzone -->
            <div class="dropzone-section">
              <div class="dropzone-container">
                <div class="dropzone" ref="dropzoneRef" @dragover.prevent @drop="onDrop">
                  <!-- House with Emoji -->
                  <div class="house-container">
                    <div class="house-icon">
                      <div class="house">🏠</div>
                      <div class="house-emoji" :class="riskLevel.level">
                        {{ getRiskEmoji }}
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="selectedItems.length === 0" class="empty-dropzone">
                    <p>Drag factors here which fit your living environment</p>
                  </div>
                  <div class="selected-factors-grid">
                    <template v-for="item in selectedItems" :key="item.id">
                      <div class="selected-factor-card" :class="item.type">
                        <button class="remove-btn" @click="removeItem(item.id)">✕</button>
                        <span class="emoji-icon">{{ item.icon }}</span>
                        <p class="factor-name">{{ item.name }}</p>
                      </div>
                    </template>
                  </div>
                </div>
                </div>
      
              <!-- Button Container -->
                <div class="button-container">
                  <button @click="calculateRisk" class="assess-btn">
                    Assess My Risk Level 📊
                  </button>
                </div>
              </div>
            </div>
  
          <!-- Assessment Results -->
          <section v-if="showAssessment" class="section-container assessment-results">
            <h2 class="section-title">Your Personal Risk Assessment</h2>
            <div class="results-container">
              <!-- Risk Level -->
              <div class="risk-header">
                <span class="risk-label">Risk Level:</span>
                <span 
                  class="risk-value"
                  :class="riskLevel.level"
                >
                  {{ riskLevel.text }}
                </span>
              </div>
  
              <!-- Risk Progress Bar -->
              <div class="risk-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :class="riskLevel.level"
                :style="{ width: `${currentRiskScore}%` }"
                  />
                </div>
              </div>
  
              <!-- Quick Recommendation -->
              <div class="quick-recommendation">
                <h3>Quick Recommendation</h3>
                <p>{{ quickRecommendation }}</p>
              </div>
  
              <!-- Recommendations -->
              <div class="recommendations">
                <h3>Tailored Recommendations</h3>
                <div class="recommendations-list">
                  <div
                    v-for="(rec, idx) in filteredRecommendations"
                    :key="idx"
                    class="recommendation-card"
                    :class="rec.impact"
                  >
                    <div class="recommendation-icon">
                      <span v-if="rec.impact === 'positive'">✅</span>
                      <span v-else-if="rec.impact === 'negative'">⚠️</span>
                      <span v-else>ℹ️</span>
                    </div>
                    <div class="recommendation-content">
                      <p class="recommendation-text">
                        <span class="factor-source">{{ getFactorName(rec.forItems[0]) }}:</span> {{ rec.text }}
                      </p>
                      <div class="impact-badge" :class="rec.impact">
                        {{ rec.impact === 'positive' ? 'Reduces' : rec.impact === 'negative' ? 'Increases' : 'Neutral' }} risk by {{ Math.abs(rec.riskChange) }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </div>
        </div>
      
      <!-- 添加拖动时的虚影元素 -->
      <div v-if="isDragging" class="drag-ghost" :style="{ left: `${ghostPosition.x}px`, top: `${ghostPosition.y}px` }">
        <div class="factor-card ghost-card">
          <span class="emoji-icon">{{ draggedItem?.icon }}</span>
          <p class="factor-name">{{ draggedItem?.name }}</p>
          </div>
        </div>
      </div>
    </template>
    
  <script>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
    import Navbar from '../components/Navbar.vue'
    
  export default {
    components: {
      Navbar
    },
    setup() {
      /* ---------- Data ---------- */
      const lifestyleItems = ref([
        { id: 'running',   icon: '🏃', name: 'Running',      risk:  20, type: 'lifestyle' },
        { id: 'cycling',   icon: '🚴', name: 'Cycling',      risk:  20, type: 'lifestyle' },
        { id: 'picnic',    icon: '🧺', name: 'Picnic',       risk:  18, type: 'lifestyle' },
        { id: 'smoking',   icon: '🚬', name: 'Smoking',      risk:  10, type: 'lifestyle' }
      ]);
  
      const homeItems = ref([
        { id: 'pet',        icon: '🐾', name: 'Pet',          risk:  20, type: 'home' },
        { id: 'gardening',  icon: '🌱', name: 'Gardening',    risk:  15, type: 'home' },
        { id: 'carpet',     icon: '🟫', name: 'Carpet',       risk:  20, type: 'home' },
        { id: 'vacuuming',  icon: '💨', name: 'Vacuuming',    risk: -10, type: 'home' },
        { id: 'purifier',   icon: '♻️', name: 'Air Purifier', risk: -20, type: 'home' }
      ]);
  
      const protectiveItems = ref([
        { id: 'mask',      icon: '😷', name: 'Wear Mask',      risk: -20, type: 'protective' },
        { id: 'medicine',  icon: '💊', name: 'Medicine',        risk: -30, type: 'protective' },
        { id: 'shower',    icon: '🚿', name: 'Quick Shower',    risk: -8,  type: 'protective' },
        { id: 'eyewear',   icon: '👓', name: 'Eye Protection',  risk: -7,  type: 'protective' }
      ]);
  
      /* ---------- State ---------- */
      const selectedItems = ref([]);
      const showAssessment = ref(false);
      const currentRiskScore = ref(50);
      const currentRecommendations = ref([]);
      
      // Custom Drag and Drop
      const isDragging = ref(false);
      const draggedItem = ref(null);
      const ghostRef = ref(null);
      const dropzoneRef = ref(null);
      const ghostPosition = ref({ x: 0, y: 0 });
      const dropzoneRect = ref(null);
      
      // Auto-scroll variables
      const autoScrollActive = ref(false);
      const autoScrollSpeed = ref(0);
      const autoScrollThreshold = 100; // pixels from edge to trigger auto-scroll
      const autoScrollInterval = ref(null);
      
      // Additional refs for tracking offsets
      const initialOffsetX = ref(0);
      const initialOffsetY = ref(0);
      
      // Start dragging an item
      const startDrag = (e, item) => {
        // Prevent default behavior
        e.preventDefault();
        
        // Get the dimensions and position of the original element
        const originalCard = e.currentTarget;
        const cardRect = originalCard.getBoundingClientRect();
        
        // Calculate offset from cursor to element center
        initialOffsetX.value = e.clientX - (cardRect.left + cardRect.width/2);
        initialOffsetY.value = e.clientY - (cardRect.top + cardRect.height/2);
        
        // Set dragging state
        isDragging.value = true;
        draggedItem.value = item;
        
        // Position the ghost element exactly where the original was
        ghostPosition.value = {
          x: e.clientX,
          y: e.clientY
        };
        
        // Store dropzone position
        updateDropzoneRect();
        
        // Add global event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Start auto-scroll check
        startAutoScrollCheck();
      };
      
      // Update ghost element position - direct sync with mouse
      const updateGhostPosition = (e) => {
        // 添加轻微延迟效果，使运动更平滑
        requestAnimationFrame(() => {
        ghostPosition.value = {
          x: e.clientX,
          y: e.clientY
        };
        });
      };
      
      // Get current dropzone rectangle
      const updateDropzoneRect = () => {
        if (dropzoneRef.value) {
          const rect = dropzoneRef.value.getBoundingClientRect();
          dropzoneRect.value = {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            left: rect.left,
            right: rect.right,
            height: rect.height,
            width: rect.width
          };
        }
      };
      
      // Handle mouse movement
      const handleMouseMove = (e) => {
        if (!isDragging.value) return;
        
        // Update ghost position
        updateGhostPosition(e);
        
        // Check for auto-scrolling
        checkAutoScroll(e.clientY);
      };
      
      // Check and handle auto-scrolling
      const checkAutoScroll = (clientY) => {
        const viewportHeight = window.innerHeight;
        
        // Near top of viewport
        if (clientY < autoScrollThreshold) {
          autoScrollSpeed.value = -Math.max(1, (autoScrollThreshold - clientY) / 5);
          autoScrollActive.value = true;
        }
        // Near bottom of viewport
        else if (clientY > viewportHeight - autoScrollThreshold) {
          autoScrollSpeed.value = Math.max(1, (clientY - (viewportHeight - autoScrollThreshold)) / 5);
          autoScrollActive.value = true;
        }
        // Not near edges
        else {
          autoScrollSpeed.value = 0;
          autoScrollActive.value = false;
        }
      };
      
      // Start the auto-scroll check interval
      const startAutoScrollCheck = () => {
        if (autoScrollInterval.value) return;
        
        autoScrollInterval.value = setInterval(() => {
          if (autoScrollActive.value && autoScrollSpeed.value !== 0) {
            window.scrollBy(0, autoScrollSpeed.value);
            
            // Important: Update dropzone rect after scrolling
            updateDropzoneRect();
          }
        }, 16); // 60fps
      };
      
      // Stop the auto-scroll interval
      const stopAutoScrollCheck = () => {
        if (autoScrollInterval.value) {
          clearInterval(autoScrollInterval.value);
          autoScrollInterval.value = null;
        }
        autoScrollActive.value = false;
      };
      
      // Handle mouse up (drop)
      const handleMouseUp = (e) => {
        if (!isDragging.value) return;
        
        // 检查是否在放置区内松开
        updateDropzoneRect();
        
        const isValidDrop = checkIfOverDropzone(e.clientX, e.clientY);
        
        if (isValidDrop) {
          // 仅当元素不在selectedItems中时才添加
          if (!selectedItems.value.find(i => i.id === draggedItem.value.id)) {
            selectedItems.value.push(draggedItem.value);
          }
        }
        
        // 清理
        cleanupDragState();
      };
      
      // Clean up drag state
      const cleanupDragState = () => {
        isDragging.value = false;
        draggedItem.value = null;
        stopAutoScrollCheck();
        
        // Remove event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      // Remove item from selection
      const removeItem = (id) => {
        selectedItems.value = selectedItems.value.filter(i => i.id !== id);
      };
  
      /* ---------- Risk calculations ---------- */
      const riskScore = computed(() => {
        return currentRiskScore.value; // 直接返回存储的风险分数
      });
  
      const riskLevel = computed(() => {
        if (riskScore.value < 20) return { text: 'Very Low Risk', level: 'very-low' };
        if (riskScore.value < 40) return { text: 'Low Risk',      level: 'low' };
        if (riskScore.value < 60) return { text: 'Moderate Risk', level: 'moderate' };
        if (riskScore.value < 80) return { text: 'High Risk',     level: 'high' };
        return                        { text: 'Very High Risk',level: 'very-high' };
      });
  
      const quickRecommendation = computed(() => {
        switch (riskLevel.value.level) {
          case 'very-low':
            return 'Excellent! Your current risk level is very low. Continue your current practices and enjoy your environment.';
          case 'low':
            return 'Your current risk level is low. Continue maintaining your protective measures and monitor any changes.';
          case 'moderate':
            return 'Consider adding more protective measures such as air filters or medication. Monitor symptoms closely.';
          case 'high':
            return 'Your risk level is high. Take additional protective measures and consider consulting a healthcare provider.';
          case 'very-high':
            return 'Immediate action recommended. Implement strict protective measures and consult your healthcare provider urgently.';
          default:
            return 'Monitor your environment and take appropriate protective measures based on your risk level.';
        }
      });
  
      const recommendations = ref([
        // Lifestyle recommendations
        { 
          text: 'Avoid outdoor activities between 5-10 AM when pollen counts are highest',
          impact: 'negative', 
          riskChange: 20, 
          forItems: ['running', 'cycling']
        },
        { 
          text: 'Check forecasts and schedule afternoon outings when pollen levels drop',
          impact: 'negative', 
          riskChange: 18, 
          forItems: ['picnic']
        },
        { 
          text: 'Avoid smoking on high pollen days to prevent worsening symptoms.',
          impact: 'negative', 
          riskChange: 10, 
          forItems: ['smoking']
        },
        
        // Home Environment recommendations
        { 
          text: 'Use air purifier and vacuum twice a week',
          impact: 'negative', 
          riskChange: 20, 
          forItems: ['pet']
        },
        { 
          text: 'Garden in evenings or after rain when pollen counts are lower.',
          impact: 'negative', 
          riskChange: 15, 
          forItems: ['gardening']
        },
        { 
          text: 'Vacuuming carpets twice a day',
          impact: 'negative', 
          riskChange: 20, 
          forItems: ['carpet']
        },
        { 
          text: 'Helps reduce accumulated indoor pollen',
          impact: 'positive', 
          riskChange: -10, 
          forItems: ['vacuuming']
        },
        { 
          text: 'Actively removes airborne pollen particles',
          impact: 'positive', 
          riskChange: -20, 
          forItems: ['purifier']
        },
        
        // Protective recommendations
        { 
          text: 'Filters out airborne pollen when worn properly',
          impact: 'positive', 
          riskChange: -20, 
          forItems: ['mask']
        },
        { 
          text: 'Take medicine before symptoms start',
          impact: 'positive', 
          riskChange: -30, 
          forItems: ['medicine']
        },
        { 
          text: 'Washes pollen off skin, hair, and clothes',
          impact: 'positive', 
          riskChange: -8, 
          forItems: ['shower']
        }
      ]);
  
      const filteredRecommendations = ref([]);
  
      // Risk Assessment Functions
      const calculateRisk = () => {
        // 计算新的风险分数
        let newScore = 50;
        newScore += selectedItems.value.reduce((sum, item) => sum + item.risk, 0);
        currentRiskScore.value = Math.min(100, Math.max(0, newScore));
        
        // 更新推荐内容
        const selectedIds = selectedItems.value.map(item => item.id);
        currentRecommendations.value = recommendations.value
          .filter(rec => rec.forItems.some(itemId => selectedIds.includes(itemId)))
          .slice(0, 4);
        
        // 更新显示的推荐
        filteredRecommendations.value = currentRecommendations.value;
        
        // 显示评估结果
        showAssessment.value = true;
        
        // 添加一个短暂延迟，确保DOM已更新
        setTimeout(() => {
          // 滚动到评估结果部分
          const assessmentElement = document.querySelector('.assessment-results');
          if (assessmentElement) {
            assessmentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      };
  
      // 检查鼠标是否在放置区域内
      const checkIfOverDropzone = (clientX, clientY) => {
        if (!dropzoneRect.value) return false;
        
        const scrollY = window.scrollY;
        
        // 只关心鼠标位置
        const mouseX = clientX;
        const mouseY = clientY + scrollY;
        
        // 检查鼠标是否在放置区域内
        const isInDropzone = 
          mouseX >= dropzoneRect.value.left && 
          mouseX <= dropzoneRect.value.right &&
          mouseY >= dropzoneRect.value.top && 
          mouseY <= dropzoneRect.value.bottom;
        
        return isInDropzone;
      };
  
      // 处理放置事件
      const onDrop = (e) => {
        e.preventDefault();
        // 放置逻辑已经在handleMouseUp中处理，这里不需要额外实现
      };
  
      // Add computed property for risk emoji
      const getRiskEmoji = computed(() => {
        const score = riskScore.value;
        if (score < 20) return '😄'; // 大笑 - 极低风险
        if (score < 40) return '🙂'; // 微笑 - 低风险
        if (score < 60) return '😐'; // 平静 - 中等风险
        if (score < 80) return '😢'; // 掉眼泪 - 高风险
        return '😭';                 // 大哭 - 极高风险
      });
  
      const getFactorName = (itemId) => {
        // 在所有项目类型中查找匹配的项目
        const allItems = [
          ...lifestyleItems.value, 
          ...homeItems.value, 
          ...protectiveItems.value
        ];
        
        const item = allItems.find(i => i.id === itemId);
        return item ? item.name : itemId;
      };
  
      onMounted(() => {
        updateDropzoneRect();
        window.addEventListener('resize', updateDropzoneRect);
        window.addEventListener('scroll', updateDropzoneRect);
      });
      
      onUnmounted(() => {
        window.removeEventListener('resize', updateDropzoneRect);
        window.removeEventListener('scroll', updateDropzoneRect);
        cleanupDragState();
      });
  
      return {
        lifestyleItems,
        homeItems,
        protectiveItems,
        selectedItems,
        showAssessment,
        calculateRisk,
        isDragging,
        draggedItem,
        ghostRef,
        dropzoneRef,
        ghostPosition,
        startDrag,
        removeItem,
        riskScore,
        riskLevel,
        quickRecommendation,
        filteredRecommendations,
        autoScrollActive,
        autoScrollSpeed,
        currentRiskScore,
        getRiskEmoji,
        getFactorName,
      };
    }
  };
    </script>
    
    <style scoped>
  /* Base layout styles */
  .personalisation-page {
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
      min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #e0dcfc;
  }
  
  .overview-container {
    margin: 2.5% 2.5%;
    margin-top: 80px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 95%;
    max-width: 100%;
  }
  
  .overview-header {
      width: 100%;
    height: 220px;
    display: flex;
    position: relative;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }
  
  .header-left {
    flex: 0.45;
    height: 100%;
    padding: 2rem 3rem;
<<<<<<< HEAD
    background-color: #c7c7cc; /* 更浅的灰色背景 */
=======
    background-color: #f2d0b8; /* 更柔和、不那么明亮的浅橘色背景 */
>>>>>>> main
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    padding-top: 1.8rem; /* 进一步上移标题 */
    position: relative;
    z-index: 2;
  }
  
  .header-right {
    flex: 0.55;
    height: 100%;
    background: transparent;
    position: relative;
  }
  
  .header-image-overlay {
    position: absolute;
    right: 0;
    top: 0;
    width: 55%;
    height: 100%;
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/public/lifestyle.png');
    background-size: cover;
    background-position: center;
    z-index: 1;
  }
  
  .header-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 120%;
    max-width: 600px;
  }
  
  .overview-title {
    font-size: 2.2rem;
    font-weight: bold;
<<<<<<< HEAD
    color: #0a4987; /* 深蓝色字体，偏蓝而非偏黑 */
=======
    color: #d35400; /* 深橘色字体 */
>>>>>>> main
    margin-bottom: 1rem;
    text-align: left;
    line-height: 1.2;
    padding: 0;
  }
  
  .overview-subtitle {
    font-size: 1.15rem;
    font-weight: 400;
<<<<<<< HEAD
    color: #0d5aa0; /* 稍微浅一点的深蓝色字体 */
=======
    color: #e67e22; /* 稍微浅一点的橘色字体 */
>>>>>>> main
    text-align: left;
    line-height: 1.5;
    padding: 0;
    max-width: 110%;
    white-space: normal;
    word-spacing: -0.02em;
    letter-spacing: 0;
    width: 110%;
  }
  
  .assessment-content {
    padding: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0);
    min-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  
  /* Content Grid */
  .content-grid {
    display: grid;
    grid-template-columns: 1.3fr 1.2fr;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    width: 100%;
    box-sizing: border-box;
  }
  
  .factors-section {
    width: 100%;
    padding: 0 1.5rem 0 1rem;
  }
  
  .dropzone-section {
    width: 100%;
    padding: 0 2rem 0 0.8rem;
    margin-top: 1rem;
  }
  
  /* Factor Categories */
  .factor-category {
    margin-bottom: 1.5rem;
    width: 100%;
  }
  
  .factor-category.lifestyle .category-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0rem;
    color: #1976D2; /* 医疗蓝色 */
    position: relative;
    padding: 0.5rem 1rem;
    background-color: rgba(25, 118, 210, 0.15); /* 医疗浅蓝色背景 */
    border-radius: 15px 15px 0 0;
    border-bottom: none;
  }
  
  .factor-category.lifestyle .category-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 90%;
    height: 2px;
    background-color: rgba(25, 118, 210, 0.6); /* 医疗蓝色线条 */
  }
  
  .factor-category.home .category-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0rem;
    color: #00897B; /* 稍微深一点的绿松石色 */
    position: relative;
    padding: 0.5rem 1rem;
    background-color: rgba(0, 137, 123, 0.15); /* 稍微深一点的背景色 */
    border-radius: 15px 15px 0 0;
    border-bottom: none;
  }
  
  .factor-category.home .category-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 90%;
    height: 2px;
    background-color: rgba(0, 137, 123, 0.6); /* 稍微深一点的线条颜色 */
  }
  
  .factor-category.protective .category-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0rem;
    color: #C2185B; /* 医疗粉红色 */
    position: relative;
    padding: 0.5rem 1rem;
    background-color: rgba(194, 24, 91, 0.15); /* 医疗浅粉色背景 */
    border-radius: 15px 15px 0 0;
    border-bottom: none;
  }
  
  .factor-category.protective .category-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 90%;
    height: 2px;
    background-color: rgba(194, 24, 91, 0.6); /* 医疗粉红色线条 */
  }
  
  /* Factors Container */
  .factors-container {
    display: grid;
    grid-template-columns: repeat(5, 110px);
    gap: 0.7rem;
    width: 100%;
    min-height: 90px;
    padding: 0.8rem 1rem 0.5rem;
    box-sizing: border-box;
    justify-content: space-evenly;
  }
  
  .factors-container.lifestyle {
    background-color: rgba(25, 118, 210, 0.12); /* 医疗浅蓝色背景 */
    border: 1px solid rgba(25, 118, 210, 0.3); /* 医疗蓝色边框 */
    border-top: none;
    border-radius: 0 0 15px 15px;
  }
  
  .factors-container.home {
    background-color: rgba(0, 137, 123, 0.15); /* 稍微深一点的背景色 */
    border: 1px solid rgba(0, 137, 123, 0.28); /* 稍微深一点的边框颜色 */
    border-top: none;
    border-radius: 0 0 15px 15px;
  }
  
  .factors-container.protective {
    background-color: rgba(194, 24, 91, 0.12); /* 医疗浅粉色背景 */
    border: 1px solid rgba(194, 24, 91, 0.3); /* 医疗粉色边框 */
    border-top: none;
    border-radius: 0 0 15px 15px;
  }
  
  /* Cards Styling */
  .emoji-icon {
    font-size: 1.85rem;
    display: block;
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  
  .factor-card .emoji-icon,
  .selected-factor-card .emoji-icon {
    margin-bottom: 0.3rem;
  }
  
  /* Common card properties */
  .card-base {
    background-color: #ffffff;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .factor-card {
    background-color: #ffffff;
    composes: card-base;
    padding: 0.45rem 0.3rem 0.3rem;
    cursor: grab;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-radius 0.3s ease;
    user-select: none;
    touch-action: none;
    will-change: transform, border-radius;
    position: relative;
    z-index: 1;
    width: 110px;
    height: 90px;
    border-radius: 16px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.03);
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  
  .factor-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0);
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    z-index: -1;
  }
  
  .factor-card:hover::after {
    opacity: 1;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .factor-card:hover {
    transform: translateY(-4px);
    border-radius: 22px;
    width: 110px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 122, 255, 0.1);
  }
  
  .factor-card:active {
    cursor: grabbing;
    transform: scale(0.95);
    z-index: 10;
    width: 110px;
    border-radius: 24px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15);
  }
  
  .factor-card .factor-name {
    font-size: 0.8rem;
    color: #333;
    margin: 0;
    line-height: 1.2;
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 2.4rem;
  }
  
  .selected-factor-card {
    background-color: #ffffff;
    composes: card-base;
    position: relative;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
    padding: 0.45rem 0.3rem 0.3rem;
    width: 110px;
    height: 90px;
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-radius 0.3s ease;
    border: 1px solid rgba(0, 122, 255, 0.08);
    will-change: transform, border-radius;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  
  .selected-factor-card .factor-name {
    font-size: 0.8rem;
    color: #333;
    margin: 0;
    line-height: 1.2;
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 2.4rem;
  }
  
  /* Remove button */
  .remove-btn {
    position: absolute;
    top: -8px;
    right: -8px;
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
  
  .remove-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 59, 48, 0.4);
  }
  
  .remove-btn:hover {
    opacity: 1;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
  }
  
  .selected-factor-card:hover .remove-btn {
    opacity: 1;
  }
  
  /* Dropzone */
  .dropzone-container {
    width: 92%;
    padding: 1.5rem 0 0;
    margin: 0 auto;
    box-sizing: border-box;
  }
  
  .dropzone {
    border: 2px dashed rgba(25, 118, 210, 0.7);
    padding: 1.5rem 0.8rem;
    min-height: 420px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(25, 118, 210, 0.18);
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 1.5rem;
  }
  
  .dropzone:hover, .dropzone.highlight {
    border-color: rgba(25, 118, 210, 0.9);
    background-color: rgba(25, 118, 210, 0.25);
    transform: scale(1.01);
    box-shadow: 0 8px 24px rgba(25, 118, 210, 0.28);
  }
  
  .dropzone .highlight {
    display: none;
  }
  
  /* House styling */
  .house-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .house-icon {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .house {
    font-size: 8rem;
  }
  
  .house-emoji {
    position: absolute;
    font-size: 3rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .house-emoji.very-low { color: #2ECC71; } /* 鲜绿色 - 极低风险 */
  .house-emoji.low { color: #4CAF50; } /* 绿色 - 低风险 */
  .house-emoji.moderate { color: #FFC107; } /* 黄色 - 中等风险 */
  .house-emoji.high { color: #FF9800; } /* 橙色 - 高风险 */
  .house-emoji.very-high { color: #F44336; } /* 红色 - 极高风险 */
  
  /* Empty state */
  .empty-dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8e8e93;
    height: 100%;
    padding: 2.5rem;
    width: 100%;
    margin-top: 1rem;
    text-align: center;
  }
  
  .empty-dropzone p {
    color: #1976D2;
    font-size: 1.2rem;
    text-align: center;
    opacity: 1;
    white-space: nowrap;
    width: 100%;
    font-weight: 600;
    text-shadow: none;
    margin: 0 auto;
  }
  
  /* Drag ghost */
  .drag-ghost {
    position: fixed;
    opacity: 0.9;
    pointer-events: none;
    filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.25)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15));
    z-index: 1000;
    cursor: grabbing;
    transform: translate(-50%, -50%);
    transition: transform 0.05s ease-out;
  }
  
  .drag-ghost .ghost-card {
    background-color: rgba(255, 255, 255, 0.85);
    border: 2px dashed rgba(0, 122, 255, 0.8);
    border-radius: 22px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1);
    transform: rotate(2deg) scale(0.9);
    width: 110px;
    height: 90px;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: ghostPulse 1.5s infinite alternate;
  }
  
  @keyframes ghostPulse {
    0% {
      box-shadow: 0 8px 20px rgba(0, 122, 255, 0.15), 0 4px 8px rgba(0, 122, 255, 0.1);
      transform: rotate(1deg) scale(0.85);
    }
    100% {
      box-shadow: 0 12px 28px rgba(0, 122, 255, 0.25), 0 6px 12px rgba(0, 122, 255, 0.2);
      transform: rotate(3deg) scale(0.95);
    }
  }
  
  /* Button */
  .button-container {
    display: flex;
    justify-content: center;
    width: 92%;
    margin: 0.8rem auto 1.5rem;
    padding: 0;
    box-sizing: border-box;
  }
  
  .assess-btn {
    background-color: rgba(0, 122, 255, 0.8);
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
    min-width: 250px;
    letter-spacing: 0.5px;
    outline: none;
  }
  
  .assess-btn:focus {
    outline: none;
  }
  
  .assess-btn:hover {
    background-color: rgba(0, 113, 227, 0.9);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
  }
  
  .assess-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
    outline: none;
  }
  
  /* Results section */
  .section-container {
    margin-bottom: 1.5rem;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 122, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    width: 100%;
  }
  
  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #034563;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .assessment-results {
    margin-top: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.5s ease-in-out;
    width: 100%;
    max-width: 1200px;
    align-self: center;
    padding: 1.5rem;
    box-sizing: border-box;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .results-container {
    padding: 1.2rem;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    width: 100%;
  }
  
  /* Risk level display */
  .risk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;
    padding: 0.8rem 1.2rem;
    background-color: #f7f7f7;
    border-radius: 10px;
  }
  
  .risk-label {
    font-weight: 600;
    color: #333;
    font-size: 1.1rem;
  }
  
  .risk-value {
    font-weight: 700;
    font-size: 1.3rem;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
  }
  
  /* Color coding */
  .risk-value.very-low { 
    color: #2ECC71;
    background-color: rgba(46, 204, 113, 0.1);
  }
  
  .risk-value.low, .impact-badge.positive {
    color: #4CAF50;
    background-color: rgba(76, 175, 80, 0.1);
  }
  
  .risk-value.moderate {
    color: #FFC107;
    background-color: rgba(255, 193, 7, 0.1);
  }
  
  .risk-value.high {
    color: #FF9800;
    background-color: rgba(255, 152, 0, 0.1);
  }
  
  .risk-value.very-high, .impact-badge.negative {
    color: #F44336;
    background-color: rgba(244, 67, 54, 0.1);
  }
  
  /* Progress bar */
  .risk-progress {
    margin: 1.2rem 0;
  }
  
  .progress-bar {
    height: 12px;
    background-color: #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.8s ease-in-out;
  }
  
  .progress-fill.very-low { background-color: #2ECC71; }
  .progress-fill.low { background-color: #4CAF50; }
  .progress-fill.moderate { background-color: #FFC107; }
  .progress-fill.high { background-color: #FF9800; }
  .progress-fill.very-high { background-color: #F44336; }
  
  /* Recommendations */
  .quick-recommendation {
    margin: 1.2rem 0;
    padding: 0.8rem 1rem;
    background-color: rgba(0, 122, 255, 0.2);
    border-radius: 8px;
  }
  
  .quick-recommendation h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #0062cc;
    font-weight: 600;
  }
  
  .quick-recommendation p {
    color: #444;
    line-height: 1.5;
  }
  
  .recommendations-title {
    margin: 1.5rem 0 1rem;
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
  }
  
  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .recommendation-card {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.03);
  }
  
  .recommendation-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  }
  
  .recommendation-card.positive {
    border-left: 4px solid #4CAF50;
    background-color: rgba(76, 175, 80, 0.25);
  }
  
  .recommendation-card.negative {
    border-left: 4px solid #F44336;
    background-color: rgba(244, 67, 54, 0.25);
  }
  
  .recommendation-card.neutral {
    border-left: 4px solid #2196F3;
    background-color: rgba(33, 150, 243, 0.35);
  }
  
  .recommendation-icon {
    font-size: 1.2rem;
    margin-right: 0.8rem;
    min-width: 2rem;
    text-align: center;
  }
  
  .recommendation-content {
    flex: 1;
  }
  
  .recommendation-text {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .impact-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }
  
  .impact-badge.positive {
    color: #388E3C;
    background-color: rgba(76, 175, 80, 0.2);
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  .impact-badge.negative {
    color: #D32F2F;
    background-color: rgba(244, 67, 54, 0.2);
    border: 1px solid rgba(244, 67, 54, 0.3);
  }
  
  .impact-badge.neutral {
    color: #1976D2;
    background-color: rgba(33, 150, 243, 0.2);
    border: 1px solid rgba(33, 150, 243, 0.3);
  }
  
  /* Media Queries */
  @media (max-width: 1200px) {
    .factors-section {
      padding: 0 1rem 0 0.5rem;
    }
    
    .dropzone-section {
      padding: 0 1.5rem 0 0.5rem;
    }
    
    .content-grid {
      grid-template-columns: 1fr;
      gap: 0.8rem;
      padding: 0;
    }
    
    .factors-container {
      grid-template-columns: repeat(5, 110px);
      gap: 0.7rem;
      justify-content: space-between;
      padding: 0.5rem 0.4rem;
    }
    
    .selected-factors-grid {
      grid-template-columns: repeat(5, 110px);
      gap: 0.7rem;
      justify-content: space-between;
      padding: 0 0.4rem;
    }
    
    .factor-card, 
    .selected-factor-card {
    height: 80px;
      width: 110px;
    }
  }
  
  @media (max-width: 768px) {
    .overview-container {
      margin: 2.5% 1.5%;
      margin-top: 70px;
    }
    
    .factors-section {
      padding: 0 1rem 0 0.5rem;
    }
    
    .dropzone-section {
      padding: 0 1.2rem 0 0.5rem;
      margin-top: 0.8rem;
    }
    
    .personalisation-page {
      margin-top: 50px;
      margin-left: 0;
      margin-right: 0;
    width: 100%;
    }
    
    .overview-title {
      font-size: 2rem;
    }
    
    .overview-subtitle {
      font-size: 1rem;
    }
    
    .content-grid {
    margin: 0;
      padding: 0;
      gap: 0.5rem;
    }
    
    .category-title {
      margin-bottom: 0.6rem;
      font-size: 1.1rem;
    }
    
    .factor-category {
      margin-bottom: 1rem;
    }
    
    .factors-container {
      grid-template-columns: repeat(3, 110px);
      justify-content: space-between;
    }
    
  .selected-factors-grid {
      max-width: 400px;
      grid-template-columns: repeat(3, 110px);
    }
    
    .factor-card, 
  .selected-factor-card {
      width: 100px;
    height: 70px;
      padding: 0.4rem 0.3rem 0.2rem;
  }
  
    .emoji-icon {
      font-size: 1.6rem;
    margin-bottom: 0.3rem;
  }
  
    .factor-name,
  .selected-factor-card .factor-name {
      font-size: 0.8rem;
    }
    
  .dropzone-container {
      width: 94%;
    }
    
    .button-container {
      width: 94%;
    }
    
    .selected-factors-grid {
      width: 94%;
    }
    
    .dropzone {
      padding: 1.2rem 0.6rem;
      min-height: 350px;
    }
  }
  
  @media (max-width: 900px) {
    .factors-container {
      grid-template-columns: repeat(4, 110px);
      gap: 0.7rem;
      justify-content: space-between;
      padding: 0.5rem 0.4rem;
    }
    
    .selected-factors-grid {
      grid-template-columns: repeat(4, 110px);
      gap: 0.7rem;
      justify-content: space-between;
      padding: 0 0.4rem;
    }
  }
  
  @media (max-width: 480px) {
    .overview-container {
      margin: 1.5% 1%;
      margin-top: 60px;
    }
    
    .factors-section {
      padding: 0 0.5rem;
    }
    
    .dropzone-section {
      padding: 0 0.8rem 0 0.3rem;
      margin-top: 0.5rem;
    }
    
    .personalisation-page {
      margin-left: 0;
      margin-right: 0;
    width: 100%;
    }
    
    .assessment-content {
    padding: 0;
    }
    
  .content-grid {
      gap: 0.2rem;
      padding: 0;
    }
    
    .section-container {
      padding: 0.8rem;
    }
    
    .factor-category {
      margin-bottom: 0.8rem;
    }
    
    .category-title {
      margin-bottom: 0.4rem;
      font-size: 1rem;
      padding-bottom: 0.3rem;
    }
    
    .factors-container {
      grid-template-columns: repeat(2, 90px);
      gap: 0.4rem;
      justify-content: space-between;
      padding: 0.5rem 0;
    }
    
    .selected-factors-grid {
      max-width: 200px;
      grid-template-columns: repeat(2, 90px);
    }
    
    .factor-card, 
    .selected-factor-card {
      width: 90px;
      height: 65px;
      padding: 0.35rem 0.3rem 0.2rem;
    }
    
    .factor-name,
    .selected-factor-card .factor-name {
      font-size: 0.75rem;
      margin-top: 0.1rem;
    }
    
    .emoji-icon {
      font-size: 1.4rem;
      margin-bottom: 0.25rem;
    }
    
    .dropzone-container {
      width: 96%;
    }
    
    .button-container {
      width: 96%;
    }
    
    .selected-factors-grid {
      width: 96%;
    }
    
  .dropzone {
      padding: 0.8rem 0.4rem;
      min-height: 300px;
    }
    
    .overview-title {
      font-size: 1.8rem;
    }
    
    .overview-subtitle {
      font-size: 0.9rem;
    }
  }
  
  .factor-card:empty {
    visibility: hidden;
    box-shadow: none;
  }
  
  /* Selected Factors */
  .selected-factors-grid {
    width: 100%;
    max-width: 650px;
    display: grid;
    grid-template-columns: repeat(5, 110px);
    gap: 0.7rem;
    margin: 1rem auto 0;
    padding: 0;
    justify-content: center;
  }
  
  .selected-factor-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0);
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    z-index: -1;
  }
  
  .selected-factor-card:hover::after {
    opacity: 1;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .selected-factor-card:hover {
    transform: translateY(-3px);
    border-radius: 22px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 122, 255, 0.1);
    border-color: rgba(0, 122, 255, 0.2);
  }
  
  @media (max-width: 480px) {
    .overview-container {
      margin: 0 1%;
      width: 98%;
    }
  }
  
  .factor-source {
    font-weight: 700;
    color: #333;
    margin-right: 0.25rem;
  }
  
  @media (max-width: 960px) {
    .overview-header {
      flex-direction: column;
      height: auto;
    }
    
    .header-left, .header-right {
      flex: none;
      width: 100%;
    }
    
    .header-left {
      padding: 2rem;
      align-items: flex-start;
      padding-top: 2rem;
      background-color: #a5d6b7;
    }
    
    .header-right {
      height: 150px;
    }
    
    .header-image-overlay {
      width: 100%;
      left: 0;
      right: auto;
    }
    
    .header-content {
      padding: 0;
    }
    
    .overview-title {
      font-size: 2rem;
    }
    
    .overview-subtitle {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .header-left {
      padding: 1.5rem;
    }
    
    .header-right {
      height: 100px;
    }
    
    .overview-title {
      font-size: 1.7rem;
    }
    
    .overview-subtitle {
      font-size: 0.9rem;
    }
  }
    </style>