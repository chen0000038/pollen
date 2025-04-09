<template>
    <div class="flip-card" @click="toggleFlip">
      <div class="flip-card-inner" :class="{ flipped: isFlipped }">
        <div class="flip-card-front">
          <img :src="image" alt="Card Image" loading="lazy" />
        </div>
        <div class="flip-card-back">
          <h2 class="back-title">{{ title }}</h2>
          <div class="back-description">
            <p>{{ description }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const props = defineProps({
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  })
  const isFlipped = ref(false)
  function toggleFlip() {
    isFlipped.value = !isFlipped.value
  }
  </script>
  
  <style scoped>
  .flip-card {
    width: 100%;
    aspect-ratio: 5 / 6;
    perspective: 1000px;
    cursor: pointer;
  }
  .flip-card-inner {
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    position: relative;
  }
  .flipped {
    transform: rotateY(180deg);
  }
  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    backface-visibility: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1rem;
    box-sizing: border-box;
  }
  .flip-card-front {
    background-color: #fff;
  }
  .flip-card-front img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  .flip-card-back {
    background-color: #f8f8f8;
    transform: rotateY(180deg);
    text-align: left;
    overflow-y: auto;
  }
  .flip-card-back .back-title {
    text-align: center;
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .flip-card-back .back-description {
    flex: 1;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.4;
  }
  </style>
  
  
  
  