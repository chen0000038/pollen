<template>
  <div class="game-container">
    <Navbar />
    <div class="petals-animation"></div>
    <div class="game-title">
      <h2>Welcome to the Pollen Quiz!</h2>
      <p class="intro-text">
        Test your knowledge about <span class="highlighted">pollen</span> and see how much you've learned!
      </p>
    </div>

    <div class="game-content">
      <div class="scoreboard">
        <p class="score">
          <i class="fas fa-trophy"></i>
          Score: {{ score }}/{{ maxScore }}
        </p>
        <p class="round">
          <i class="fas fa-sync-alt"></i>
          Round: {{ currentRound }} / {{ maxRounds }}
        </p>
      </div>

      <transition name="fade">
        <div v-if="!gameEnded">
          <div v-if="roundType === 'image'" class="round-container">
            <h1>
              Select the correct image for
              <span class="highlight">{{ targetType }}</span> pollen
            </h1>
            <div class="images">
              <div 
                v-for="(img, index) in images" 
                :key="index" 
                class="image-card-wrapper"
              >
                <div 
                  class="image-card"
                  @click="checkImageAnswer(img)"
                  :class="{'highlight-correct': answerChosen && img.id === correctImage.id}"
                >
                  <img :src="img.src" alt="pollen image" />
                </div>
                <p v-if="answerChosen && img.id === correctImage.id" class="image-correct-text">
                  This is the correct answer
                </p>
              </div>
            </div>

            <p 
              v-if="resultMessage" 
              class="result-message"
              :class="isAnswerCorrect ? 'correct-text' : 'wrong-text'"
            >
              {{ resultMessage }}
            </p>

            <button v-if="answerChosen" @click="nextRound" class="next-btn">
              Next Round
            </button>
          </div>

          <!-- 选择题回合 -->
          <div v-else-if="roundType === 'quiz'" class="round-container">
            <h1>{{ currentQuiz.question }}</h1>
            <div class="options">
              <button 
                v-for="(option, index) in currentQuiz.options" 
                :key="index" 
                @click="selectQuizOption(index)"
                :disabled="answerChosen"
                :class="{'highlight-correct': answerChosen && index === currentQuiz.correctIndex}"
              >
                {{ option }}
              </button>
            </div>

            <p 
              v-if="resultMessage" 
              class="result-message"
              :class="isAnswerCorrect ? 'correct-text' : 'wrong-text'"
            >
              {{ resultMessage }}
            </p>
            <p v-if="answerChosen" class="quiz-tip">
              Tip: {{ currentQuiz.tip }}
            </p>
            <button v-if="answerChosen" @click="nextRound" class="next-btn">
              Next Round
            </button>
          </div>
        </div>
        <div v-else class="final-score">
          <h2>Game Over</h2>
          <p>Your final score is: {{ score }}/{{ maxScore }}</p>
          <p class="evaluation">Evaluation: {{ finalEvaluation }}</p>
          <button @click="restartGame" class="restart-btn">Play Again</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import confetti from 'canvas-confetti'

const pollenImages = [
  { id: 1, src: '/Ryegrass.jpg', type: 'grass' },
  { id: 2, src: '/weed pollen.png', type: 'weed' },
  { id: 3, src: '/Pine.jpg', type: 'tree' },
  { id: 4, src: '/Ragweed.jpg', type: 'weed' },
  { id: 5, src: '/Cypress.jpg', type: 'tree' },
  { id: 6, src: '/Bermuda.png', type: 'grass' },
  { id: 7, src: '/Other1.jpg', type: 'other' },
  { id: 8, src: '/Other2.jpg', type: 'other' },
  { id: 9, src: '/Other3.jpg', type: 'other' },
  { id: 10, src: '/Other4.jpg', type: 'other' },
  { id: 11, src: '/Other5.jpg', type: 'other' },
  { id: 12, src: '/Other6.jpg', type: 'other' },
  { id: 13, src: '/Other7.png', type: 'other' }
]

const quizQuestions = [
  {
    question: "Which method is most effective in reducing indoor pollen exposure?",
    options: [
      "Opening windows widely",
      "Using air purifiers with HEPA filters",
      "Keeping fans on high speed",
      "Washing windows daily"
    ],
    correctIndex: 1,
    tip: "HEPA filters are designed to capture small particles like pollen."
  },
  {
    question: "What should you do after spending time outdoors on high pollen days?",
    options: [
      "Take a shower and change clothes",
      "Immediately go to sleep",
      "Ignore the pollen",
      "Drink lots of water"
    ],
    correctIndex: 0,
    tip: "Showering and changing clothes helps remove pollen from your skin and hair."
  }
]

const currentRound = ref(1)
const maxRounds = 5
const score = ref(0)
const gameEnded = ref(false)
const maxScore = computed(() => maxRounds * 10)

const answerChosen = ref(false)
const isAnswerCorrect = ref(false)
const resultMessage = ref('')
const targetType = ref('')
const images = ref([])
const correctImage = ref({})

const currentQuiz = ref({})

const roundType = computed(() => {
  return currentRound.value % 2 === 1 ? 'image' : 'quiz'
})

const finalEvaluation = computed(() => {
  if (score.value <= 10) {
    return "Keep learning! You might need to review the pollen knowledge."
  } else if (score.value <= 30) {
    return "Good job! You're getting there. A bit more practice, and you'll be a pollen expert!"
  } else if (score.value <= 40) {
    return "Great work! You have a solid understanding of pollen."
  } else {
    return "Outstanding! You are a pollen expert!"
  }
})

function setupRound() {
  answerChosen.value = false
  resultMessage.value = ''
  isAnswerCorrect.value = false

  if (roundType.value === 'image') {
    setupImageRound()
  } else {
    setupQuizRound()
  }
}

function setupImageRound() {
  const types = ['tree', 'grass', 'weed']
  targetType.value = types[Math.floor(Math.random() * types.length)]
  const correctCandidates = pollenImages.filter(img => img.type === targetType.value)
  const incorrectCandidates = pollenImages.filter(img => img.type !== targetType.value)

  if (correctCandidates.length === 0 || incorrectCandidates.length < 2) {
    console.error('Not enough images for the round.')
    return
  }

  const randomCorrect = correctCandidates[Math.floor(Math.random() * correctCandidates.length)]
  correctImage.value = randomCorrect

  function getRandomItems(arr, count) {
    const copy = [...arr]
    const result = []
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * copy.length)
      result.push(copy[idx])
      copy.splice(idx, 1)
    }
    return result
  }
  const randomIncorrects = getRandomItems(incorrectCandidates, 2)

  const tempArray = [randomCorrect, ...randomIncorrects]
  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]]
  }
  images.value = tempArray
}

function setupQuizRound() {
  const quizIndex = currentRound.value === 2 ? 0 : currentRound.value === 4 ? 1 : 0
  currentQuiz.value = quizQuestions[quizIndex]
}

function checkImageAnswer(selectedImage) {
  if (answerChosen.value) return

  if (selectedImage.type === targetType.value) {
    score.value += 10
    isAnswerCorrect.value = true
    resultMessage.value = 'Correct! You chose the right image.'
    triggerConfetti()
  } else {
    isAnswerCorrect.value = false
    resultMessage.value = 'Wrong choice.'
  }
  answerChosen.value = true
}

function selectQuizOption(index) {
  if (answerChosen.value) return

  if (index === currentQuiz.value.correctIndex) {
    score.value += 10
    isAnswerCorrect.value = true
    resultMessage.value = 'Correct! Good job.'
    triggerConfetti()
  } else {
    isAnswerCorrect.value = false
    resultMessage.value = 'Wrong answer.'
  }
  answerChosen.value = true
}

function nextRound() {
  if (currentRound.value < maxRounds) {
    currentRound.value++
    setupRound()
  } else {
    gameEnded.value = true
  }
}

function restartGame() {
  currentRound.value = 1
  score.value = 0
  gameEnded.value = false
  setupRound()
}

function triggerConfetti() {
  const duration = 2000
  const end = Date.now() + duration

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval)
      return
    }
    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 360,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    })
  }, 200)
}

onMounted(() => {
  setupRound()
})
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  overflow: hidden;
  padding-top: 70px;
}

.game-title {
  text-align: center;
  margin: 0 auto 15px;
  color: #4d4d4d;
}
.game-title h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}
.intro-text {
  font-size: 1.1rem;
  color: #555;
}
.highlighted {
  color: #e91e63;
  font-weight: bold;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.game-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  padding: 10px 20px 40px;
  color: #333;
}


.scoreboard {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 10px;
  transition: transform 0.3s;
}
.scoreboard:hover {
  transform: scale(1.02);
}
.score,
.round {
  font-size: 1.4rem;
  font-weight: bold;
  background: linear-gradient(to right, #fdfcfb, #e2d1c3);
  border: 2px solid #e6e3e3;
  border-radius: 8px;
  padding: 10px 20px;
  min-width: 80px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.score i,
.round i {
  margin-right: 8px;
  color: #ffa300;
  font-size: 1.3em;
}

.round-container {
  max-width: 800px;
  margin: 20px auto 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(3px);
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s, box-shadow 0.3s;
}
.round-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}
.round-container h1 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}


.images {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}
.image-card-wrapper {
  display: inline-block;
  text-align: center;
}
.image-card {
  width: 200px;
  height: 150px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.4s, box-shadow 0.4s;
}
.image-card:hover {
  transform: rotate(2deg) scale(1.05);
  box-shadow: 0 12px 16px rgba(0, 0, 0, 0.15);
}
.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-correct-text {
  font-size: 0.9rem;
  color: #388e3c;
  margin-top: 5px;
}


.options button {
  padding: 12px 15px;
  font-size: 18px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(to right, #3178c6, #25b7c4);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 10px auto;
  display: block;
  width: 80%;
  text-align: center;
}
.options button:hover {
  background: linear-gradient(to right, #25b7c4, #3178c6);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.highlight-correct {
  background-color: #4caf50 !important;
  border: 3px solid #388e3c;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transform: scale(1.02);
}
.result-message {
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 600;
}
.correct-text {
  color: #4caf50;
}
.wrong-text {
  color: #f44336;
}
.highlight {
  color: #e91e63;
  text-transform: capitalize;
}


.next-btn,
.restart-btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  background: linear-gradient(to right, #ffa13d, #fe5f75);
  color: #fff;
  transition: background-color 0.3s, box-shadow 0.3s;
}
.next-btn:hover,
.restart-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}


.quiz-tip {
  font-size: 1rem;
  margin-bottom: 20px;
  font-style: italic;
}


.final-score {
  max-width: 800px;
  margin: 20px auto 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(3px);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}
.final-score:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}
.final-score h2 {
  margin-top: 0;
  font-size: 1.8rem;
}
.evaluation {
  font-size: 1.2rem;
  margin-top: 10px;
  color: #4caf50;
}
</style>


  
  
  
  
  
  
  
  
  
  
  
  
  