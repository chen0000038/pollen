<template>
  <div class="flip-card-container">
    <!-- 固定位置容器 -->
    <div class="flip-card">
      <!-- 翻转区域 -->
      <div class="flip-card-inner" :class="{ flipped: isFlipped }" @click="handleCardClick">
        <!-- 正面 -->
        <div class="flip-card-front">
          <div class="card-title-container">
            <h3 class="card-title">{{ title }}</h3>
          </div>
          <div class="card-image-container">
            <img :src="image" :alt="title" class="card-image" />
            <div class="magnifier-icon" @click.stop="openModal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff">
                <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.08 5.59 12.28 3 8.99 3 5.7 3 2.9 5.59 2.9 8.39c0 2.8 2.8 5.39 6.09 5.39 1.61 0 3.08-.59 4.2-1.56l.27.28v.79l4.25 4.25c.39.39 1.02.39 1.41 0 .39-.39.39-1.03 0-1.42L15.5 14zM8.99 5c2.21 0 4 1.79 4 3.39 0 1.6-1.79 3.39-4 3.39-2.21 0-4-1.79-4-3.39C4.99 6.79 6.78 5 8.99 5zm.51 1h-1v2h-2v1h2v2h1v-2h2v-1h-2V6z"/>
              </svg>
            </div>
          </div>
        </div>
        <!-- 背面 -->
        <div class="flip-card-back">
          <div class="description-container">
            <p class="card-description">{{ description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 全屏模态层 -->
  <Teleport to="body">
    <div v-if="modalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content">
        <img :src="image" :alt="title" class="modal-image" />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
})

const isFlipped = ref(false)
const modalOpen = ref(false)

function handleCardClick(event) {
  // 如果点击的是放大镜图标，不触发翻转
  if (!event.target.closest('.magnifier-icon')) {
    isFlipped.value = !isFlipped.value
  }
}

function openModal(event) {
  event.stopPropagation()
  modalOpen.value = true
  // 防止页面滚动
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  modalOpen.value = false
  // 恢复页面滚动
  document.body.style.overflow = ''
}
</script>

<style scoped>
.flip-card-container {
  width: 250px;
  height: 320px;
  margin: 1rem;
  perspective: 1000px;
  display: inline-block;
  vertical-align: top;
}

.flip-card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.flip-card-back {
  transform: rotateY(180deg);
  background: #f8f8f8;
  display: flex;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
}

.card-title-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  position: relative;
  z-index: 1;
}

.card-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-image-container {
  position: relative;
  height: calc(100% - 40px); /* 减去标题高度 */
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.magnifier-icon {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.3s;
}

.magnifier-icon:hover {
  background: rgba(0, 0, 0, 0.8);
}

.card-description {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: left;
}

/* 模态层样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
}

.modal-content {
  max-width: 95vw;
  max-height: 95vh;
  position: relative;
}

.modal-image {
  width: auto;
  height: auto;
  min-width: 50vw;
  max-width: 95vw;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}
</style>







  
  
  
  