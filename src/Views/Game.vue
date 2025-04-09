<template>
    <div class="game-container">
      <!-- 固定导航栏 -->
      <Navbar />
  
      <!-- 背景覆盖层 -->
      <div class="overlay"></div>
  
      <!-- 游戏主要内容 -->
      <div class="game-content">
        <!-- 顶部积分与轮次统计 -->
        <div class="scoreboard">
          <p>Score: {{ score }}</p>
          <p>Round: {{ currentRound }} / {{ maxRounds }}</p>
        </div>
  
        <!-- 游戏进行中 -->
        <div v-if="!gameEnded">
          <!-- 图片选择轮：用统一的 round-container 包裹 -->
          <div v-if="roundType === 'image'" class="round-container">
            <h1>Select the correct image for <span class="highlight">{{ targetType }}</span> pollen</h1>
            <div class="images">
              <div 
                v-for="(img, index) in images" 
                :key="index" 
                class="image-card"
                @click="checkImageAnswer(img)"
              >
                <img :src="img.src" alt="pollen image" />
              </div>
            </div>
            <p v-if="resultMessage" class="result-message">{{ resultMessage }}</p>
            <button v-if="answerChosen" @click="nextRound" class="next-btn">Next Round</button>
          </div>
  
          <!-- 知识问答轮：同样用 round-container 包裹 -->
          <div v-else-if="roundType === 'quiz'" class="round-container">
            <h1>{{ currentQuiz.question }}</h1>
            <div class="options">
              <button 
                v-for="(option, index) in currentQuiz.options" 
                :key="index" 
                @click="selectQuizOption(index)"
                :disabled="answerChosen"
              >
                {{ option }}
              </button>
            </div>
            <p v-if="resultMessage" class="result-message">{{ resultMessage }}</p>
            <p v-if="answerChosen" class="quiz-tip">Tip: {{ currentQuiz.tip }}</p>
            <button v-if="answerChosen" @click="nextRound" class="next-btn">Next Round</button>
          </div>
        </div>
  
        <!-- 游戏结束，显示最终得分与评价 -->
        <div v-else class="final-score">
          <h2>Game Over</h2>
          <p>Your final score is: {{ score }}</p>
          <p class="evaluation">Evaluation: {{ finalEvaluation }}</p>
          <button @click="restartGame" class="restart-btn">Play Again</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import Navbar from '../components/Navbar.vue'
  import confetti from 'canvas-confetti'
  
  /* ===== 数据定义 ===== */
  // 针对图片选择轮的图片数据，每个图片具有对应的 pollen 类型
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
  
  // 针对知识问答轮的题目数据
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
  
  /* ===== 状态变量 ===== */
  const currentRound = ref(1)
  const maxRounds = 5
  const score = ref(0)
  const gameEnded = ref(false)
  
  // 当前轮次是否已作答
  const answerChosen = ref(false)
  // 本轮反馈信息
  const resultMessage = ref('')
  // 图片选择轮中目标 pollen 类型（tree, grass, weed）
  const targetType = ref('')
  // 图片选择轮中展示的图片数组
  const images = ref([])
  // 知识问答轮当前题目
  const currentQuiz = ref({})
  
  /* ===== 计算属性 ===== */
  // 轮次类型：奇数轮为图片选择，偶数轮为知识问答
  const roundType = computed(() => {
    return currentRound.value % 2 === 1 ? 'image' : 'quiz'
  })
  
  // 根据最终得分生成评价信息
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
  
  /* ===== 轮次初始化 ===== */
  function setupRound() {
    answerChosen.value = false
    resultMessage.value = ''
  
    if (roundType.value === 'image') {
      setupImageRound()
    } else {
      setupQuizRound()
    }
  }
  
  // 图片选择轮：随机选择一个目标 pollen 类型，并构建出包含一张正确图片和两张错误图片的数组
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
  
    // 合并正确和错误图片，并打乱顺序
    const tempArray = [randomCorrect, ...randomIncorrects]
    for (let i = tempArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]]
    }
    images.value = tempArray
  }
  
  // 知识问答轮：根据当前轮次（如第2轮用 quizQuestions[0]，第4轮用 quizQuestions[1]）设置题目
  function setupQuizRound() {
    const quizIndex = currentRound.value === 2 ? 0 : currentRound.value === 4 ? 1 : 0
    currentQuiz.value = quizQuestions[quizIndex]
  }
  
  /* ===== 回答处理 ===== */
  // 图片选择轮答案判断
  function checkImageAnswer(selectedImage) {
    if (answerChosen.value) return  // 防止重复作答
  
    if (selectedImage.type === targetType.value) {
      score.value += 10
      resultMessage.value = 'Correct! You chose the right image.'
      triggerConfetti()
    } else {
      resultMessage.value = 'Wrong choice.'
    }
    answerChosen.value = true
  }
  
  // 知识问答轮答案选择
  function selectQuizOption(index) {
    if (answerChosen.value) return
  
    if (index === currentQuiz.value.correctIndex) {
      score.value += 10
      resultMessage.value = 'Correct! Good job.'
      triggerConfetti()
    } else {
      resultMessage.value = 'Wrong answer.'
    }
    answerChosen.value = true
  }
  
  /* ===== 下一轮与重启 ===== */
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
  
  /* ===== 彩带动画 ===== */
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
  /* 主容器背景及上内边距，避免固定导航栏遮挡 */
  .game-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: url('/background.jpg') center/cover no-repeat;
    overflow: hidden;
    padding-top: 70px;
  }
  

  
  /* 游戏主要内容 */
  .game-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    padding: 20px;
    color: #333;
  }
  
  /* 积分与轮次显示 */
  .scoreboard {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  /* 统一的容器，用于图片选择和问答轮 */
  .round-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(3px);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* 标题字体稍大 */
  .round-container h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  /* 图片展示：所有图片在一排显示 */
  .images {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 20px;
    margin-bottom: 20px;
  }
  .image-card {
    width: 200px;
    height: 150px;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    background-color: #fff;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .image-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  .image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 问答轮选项按钮 */
  .options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
  .options button {
    padding: 10px 15px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    background-color: #3178c6;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .options button:hover {
    background-color: #265a8f;
  }
  
  /* 结果反馈 */
  .result-message {
    font-size: 1.2rem;
    margin-bottom: 20px;
    font-weight: 600;
  }
  
  /* 高亮文字 */
  .highlight {
    color: #e91e63;
    text-transform: capitalize;
  }
  
  /* 按钮 */
  .next-btn,
  .restart-btn {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 6px;
    background-color: #3178c6;
    color: #fff;
    transition: background-color 0.3s;
  }
  .next-btn:hover,
  .restart-btn:hover {
    background-color: #265a8f;
  }
  
  /* 知识问答提示 */
  .quiz-tip {
    font-size: 1rem;
    margin-bottom: 20px;
    font-style: italic;
  }
  
  /* 游戏结束提示区域，与 round-container 风格保持一致 */
  .final-score {
    max-width: 800px;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(3px);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  .final-score h2 {
    margin-top: 0;
    font-size: 1.5rem;
  }
  .evaluation {
    font-size: 1.2rem;
    margin-top: 10px;
    color: #4caf50;
  }
  </style>
  
  
  
  
  
  
  
  
  
  
  
  