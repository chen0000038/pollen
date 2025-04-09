<template>
  <div class="pollen-info-container">
    <!-- 固定导航栏 -->
    <Navbar />

    <!-- 内容区：避免导航栏遮挡 -->
    <div class="content-area">
      <!-- 当尚未选择任何类别时，显示提示、三张大卡片和游戏选择框 -->
      <div v-if="!activeCategory">
        <!-- 提示信息 -->
        <div class="hint-row">
          <p style="font-size: 24px; font-weight: bold;">
            Click on any of the cards for more information about pollen
          </p>
        </div>

        <div class="category-cards">
          <!-- Grass Pollen 卡片 -->
          <div class="big-card" @click="selectCategory('grass')">
            <img src="/grass pollen.png" alt="Grass Pollen" />
            <h2>Grass Pollen</h2>
            <p>
              Learn about grass pollen, its characteristics, and its effects on
              allergies.
            </p>
          </div>
          <!-- Tree Pollen 卡片 -->
          <div class="big-card" @click="selectCategory('tree')">
            <img src="/tree pollen.png" alt="Tree Pollen" />
            <h2>Tree Pollen</h2>
            <p>Discover tree pollen and how to mitigate its effects.</p>
          </div>
          <!-- Weed Pollen 卡片 -->
          <div class="big-card" @click="selectCategory('weed')">
            <img src="/weed pollen.png" alt="Weed Pollen" />
            <h2>Weed Pollen</h2>
            <p>
              Understand weed pollen and its seasonal impact on allergy sufferers.
            </p>
          </div>
        </div>

        <!-- 游戏选择框 -->
        <div class="game-section">
          <h2>Interactive Pollen Awareness Game</h2>
          <p>
            Engage with our interactive game to learn strategies for dealing
            with pollen allergies and protecting yourself during high pollen.
          </p>
          <router-link to="/game">
            <button class="game-btn">Start Game</button>
          </router-link>
        </div>
      </div>

      <!-- 如果选择了某个类别，就显示子卡片翻转区 -->
      <div class="sub-cards-area" v-else>
        <!-- 提示信息 -->
        <div class="hint-row">
          <p style="font-size: 30px; font-weight: bold;">
            Click on any card for more details
          </p>
        </div>
        <!-- 小卡片区域，确保间距一致且居中 -->
        <div class="flip-cards-grid">
          <template v-if="activeCategory === 'grass'">
            <FlipCard
              v-for="(item, index) in grassList"
              :key="index"
              :image="item.image"
              :title="item.title"
              :description="item.description"
            />
          </template>
          <template v-else-if="activeCategory === 'tree'">
            <FlipCard
              v-for="(item, index) in treeList"
              :key="index"
              :image="item.image"
              :title="item.title"
              :description="item.description"
            />
          </template>
          <template v-else-if="activeCategory === 'weed'">
            <FlipCard
              v-for="(item, index) in weedList"
              :key="index"
              :image="item.image"
              :title="item.title"
              :description="item.description"
            />
          </template>
        </div>

        <!-- 返回按钮放置在底部 -->
        <div class="back-button-container">
          <button class="back-btn" @click="activeCategory = null">Back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import FlipCard from '../components/FlipCard.vue'

// 用于记录当前选中的类别 (grass, tree, weed)
const activeCategory = ref(null)

// 选择类别时调用，设置 activeCategory
function selectCategory(category) {
  activeCategory.value = category
}

// 草类花粉子卡片数据
const grassList = [
  {
    title: 'Ryegrass',
    description: `Description: Ryegrass is wind-pollinated, and it releases an abundance of pollen during peak flowering season. Flowers are located on stalks that are 5 to 15 centimeters (2 to 6 inches) tall, and pollination occurs from spring to fall. Ryegrass is severely allergenic and is one of the most serious of a large number of grasses that cause allergic rhinitis (hay fever) and other respiratory allergies in humans.
`,
    image: '/Ryegrass.jpg'
  },
  {
    title: 'Bermuda Grass',
    description: `The cause of Bermuda Grass allergies is pollen. The peak pollen period for Bermuda grass is from early summer through mid-autumn, but in warmer locales, the grass can create pollen all year long. The reaction to Bermuda grass pollen can range from barely noticeable to almost feeling like you have the flu, depending on the severity of your body’s immune response.
`,
    image: '/Bermuda.png'
  },
  {
    title: 'Kentucky bluegrass',
    description: `Kentucky bluegrass is a perennial found along seashores and in pasture and arable land (cropland), roadsides, forest edges, and marshes. While valued as pasture and turf grass (particularly for use in golf courses), Kentucky bluegrass is severely allergenic and sheds large amounts of wind-borne pollen from spring to fall, which can cause serious pollinosis (hay fever).
`,
    image: '/Kentucky bluegrass.jpg'
  },
  {
    title: 'Johnson grass',
    description: `Johnson grass is also an extremely invasive grass with worldwide distribution. While grass pollen can trigger or worsen asthma symptoms, those sensitized to Johnson grass also may have symptoms of allergic rhinitis (hay fever), which affects the eyes, nose, and throat. Johnson grass releases an abundance of wind-borne pollen. Although pollen season can vary year to year due to climatic-factor fluctuations, the highest concentration of grass pollen usually appears one to two months after the start of the main flowering season. With moderate allergenicity, Johnson grass pollination persists throughout the year but peaks from early summer through fall.
`,
    image: '/Johnson.png'
  }
]

// 树类花粉子卡片数据
const treeList = [
  {
    title: 'Pine',
    description:
      'While pine tree allergy is relatively uncommon, there are two main allergens of concern that come from pine trees: pine nuts and pine pollen. Pine pollen is produced when the trees reproduce in the springtime. It is possible for pollen to travel very long distances in the air. Pine nut allergies are similar to other tree nut allergies, and can cause mild, moderate, and severe allergic responses including anaphylaxis.',
    image: '/Pine.jpg'
  },
  {
    title: 'Cypress',
    description:
      'Distinguished by their aromatic, scalelike leaves, cypress trees are evergreen conifers that are cold sensitive and grown only in warmer parts of the world. Cypress trees are wind pollinated and produce pollen profusely for six to seven months of the year; allergic reactions are often severe.',
    image: '/Cypress.jpg'
  },
  {
    title: 'Birch',
    description:
      'Birch trees prefer moist, sandy and loamy soils. Annual pollen counts may vary from year to year by a factor of 400 percent. Birch trees are wind pollinated, and pollen levels are determined by the weather, diversity of local flora, and specific rhythms of pollination of particular taxa, or groups.',
    image: '/Birch.jpg'
  },
  {
    title: 'Plane trees',
    description:
      'Sycamores briefly release pollen in late winter and early spring, causing allergies in about a quarter of people, and they drip irritating hair-like fibers for extended periods of time between October and December. Hairy fibers are a major problem for sycamores because they can irritate peoples noses, throats, and eyes.',
    image: '/Plane.png'
  },
  {
    title: 'Oak',
    description:
      'Shedding substantial amounts of pollen that spreads via wind, oaks are commonly allergenic and may cause severe reactions.',
    image: '/Oak.jpg'
  },
  {
    title: 'Elm',
    description:
      'Elm pollen is a fine powder produced by the male flowers of the elm tree. The flowers are small and inconspicuous, and usually appear in early spring before the leaves have fully grown. Pollen is carried by the wind and can travel great distances.',
    image: '/Elm.png'
  },
  {
    title: 'Eucalyptus',
    description:
      'Eucalyptus oil or pollen can cause skin diseases, and pollen can cause respiratory allergic diseases. Eucalyptus pollen can cause symptoms such as asthma, hay fever and conjunctivitis.',
    image: '/Eucalyptus.png'
  },
  {
    title: 'Acacia (wattle)',
    description:
      'Exposure to A. longifolia can manifest conditions like rhinitis, conjunctivitis, and asthma among allergic individuals. To date, no potential allergens have been identified from A. longifolia. Studies have demonstrated cross-reactivity of Acacia sp. pollen with Salsola kali, Amaranthus retroflexus, Chenopodium album, Kochia scoparia, mesquite, date, and ryegrass pollen.',
    image: '/Acacia .png'
  }
]

// 杂草花粉子卡片数据
const weedList = [
  {
    title: 'Ragweed',
    description:
      'Ragweed is an annual herb that has been widely distributed across the world, where it is found in disturbed locales such as construction sites as well as amid cultivated land and riverbanks. Ragweed plants create enormous amounts of pollen, as a single plant is capable of producing millions of small pollen grains, which often travel long distances. Released spring to fall, the wind-borne pollen is highly allergenic and can induce allergic rhinitis (hay fever) and dermatitis.',
    image: '/Ragweed.jpg'
  },
  {
    title: 'Plantain',
    description:
      'Plantain has also dispersed widely throughout temperate and tropical climates, where it is common in arable land (cropland) and pastures. Common names for this pubescent perennial include buckhorn plantain, lance-leaf plantain, lanceolate plantain, ribgrass, and ribwort. Since its flowering season is similar to grasses, wind-borne pollination occurs during spring and summer, and pollen is moderately allergenic. Particularly in temperate areas of Australia, North America, and Europe, English plantain pollen is an important cause of allergic rhinitis (hay fever) and allergic conjunctivitis.',
    image: '/Plantain.png'
  },
  {
    title: 'Paterson s curse',
    description:
      'Paterson s curse is a winter annual herb. Paterson s curse affects human health. Some people are allergic to the pollen and the rough hairy texture of the leaves and stems causes skin irritation in people having close contact with the plant.',
    image: '/Paterson.png'
  },
  {
    title: 'Parthenium weed',
    description:
      'Parthenium weed can cause respiratory problems and severe dermatitis. People might not have an allergic reaction the first time they touch a plant. Allergies can develop after a few exposures. Once a reaction to parthenium weed develops, some people develop allergies to related plants such as sunflowers. This reaction can be so severe that people with the allergy may need to move away from areas infested with parthenium weed.',
    image: 'Parthenium weed.png'
  }
]
</script>

<style scoped>
.pollen-info-container {
  width: 100%;
  min-height: 100vh;
}
.content-area {
  margin-top: 60px;
  padding: 1rem;
}

/* 大卡片（类别选择） */
.category-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}
.big-card {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.big-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.big-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
.big-card h2 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}
.big-card p {
  color: #555;
  font-size: 0.95rem;
}

/* 翻转卡片保持固定大小 */
.flip-card {
  width: 250px;
  height: 300px;
  perspective: 1000px;
  cursor: pointer;
}
.flip-card-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip-card-inner.flipped {
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  box-sizing: border-box;
}
.flip-card-back {
  background-color: #f8f8f8;
  transform: rotateY(180deg);
  text-align: left;
  overflow-y: auto;
}
.flip-card-back p {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
}

/* 使用 Grid 布局，每排3张卡片，左右居中且间距一致 */
.flip-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
  justify-items: center;
  margin: 0 auto;
}

/* 返回按钮容器，放在页面底部居中显示 */
.back-button-container {
  text-align: center;
  margin-top: 1rem;
}
.back-btn {
  background-color: #eef2ff;
  padding: 0.8rem 1.8rem;  /* 内边距加大 */
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;  /* 字体变大 */
  color: #1e1e1e;
  border: none;
  cursor: pointer;
}


/* 游戏区块 */
.game-section {
  background-color: #f5f7ff;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  margin: 2rem auto;
  max-width: 900px;
}
.game-section h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.game-section p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4;
}
.game-btn {
  background-color: #2563eb;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}
.game-btn:hover {
  background-color: #1d4ed8;
}

/* 响应式：较窄屏幕下，自动变为单列或两列 */
@media (max-width: 992px) {
  .flip-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
</style>
