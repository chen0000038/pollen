<template>
  <div class="pollen-info-container">
    <Navbar />
    <div class="content-area">
      <!-- Main category selection -->
      <div v-if="!activeCategory">
        <div class="hint-row">
          <p style="font-size: 24px; font-weight: bold;">
            Click on any of the cards for more information about pollen
          </p>
        </div>

        <!-- Category selection cards for different types of pollen -->
        <div class="category-cards">
          <div class="big-card" @click="selectCategory('grass')">
            <img src="/grass pollen.png" alt="Grass Pollen" />
            <h2>Grass Pollen</h2>
            <p>
              Learn about grass pollen, its characteristics, and its effects on
              allergies.
            </p>
          </div>
          <div class="big-card" @click="selectCategory('tree')">
            <img src="/tree pollen.png" alt="Tree Pollen" />
            <h2>Tree Pollen</h2>
            <p>Discover tree pollen and how to mitigate its effects.</p>
          </div>
          <div class="big-card" @click="selectCategory('weed')">
            <img src="/weed pollen.png" alt="Weed Pollen" />
            <h2>Weed Pollen</h2>
            <p>
              Understand weed pollen and its seasonal impact on allergy sufferers.
            </p>
          </div>
        </div>

        <!-- Interactive game section to learn about pollen -->
        <div class="game-section">
          <h2>Interactive Pollen Awareness Game</h2>
          <p>
            Engage with interactive game to learn strategies against pollen allergies and protecting yourself during high pollen.
          </p>
          <router-link to="/game">
            <button class="game-btn">Start Game</button>
          </router-link>
        </div>
      </div>

      <!-- Detailed view when a category is selected -->
      <div class="sub-cards-area" v-else>
        <div class="hint-row">
          <p style="font-size: 30px; font-weight: bold;">
            Click on any card for more <span style="color: #4CAF50;">{{ activeCategory }}</span> details
          </p>
        </div>
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

        <div class="back-button-container">
          <button class="back-btn" @click="activeCategory = null">Back</button>
        </div>
      </div>
    </div>
    <!-- Page Recommendations in navigation order -->
    <div class="page-recommendations">
      <div class="recommendation-links" style="display: flex; justify-content: space-between; align-items: center; padding-left: 2rem; padding-right: 2rem;">
        <router-link to="/forecasting" class="recommend-btn">Go to Forecast</router-link>
        <router-link to="/allergytracker" class="recommend-btn">Go to Allergy Tracker</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import necessary Vue components and functions
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import FlipCard from '../components/FlipCard.vue'

// State management for active category
const activeCategory = ref(null)
const router = useRouter()

// Function to handle category selection
function selectCategory(category) {
  activeCategory.value = category
}

// Function to reset category selection
function resetCategory() {
  activeCategory.value = null
}

// Lifecycle hooks and event listeners
onMounted(() => {
  // Add click event listeners to navbar links
  const navLinks = document.querySelectorAll('.navbar a')
  navLinks.forEach(link => {
    link.addEventListener('click', resetCategory)
  })
  
  // Check URL parameters for initial category selection
  const params = new URLSearchParams(window.location.search)
  const typeParam = params.get('type')
  if (typeParam && ['tree', 'grass', 'weed'].includes(typeParam)) {
    selectCategory(typeParam)
    window.scrollTo(0, 0)
  }
})

// Cleanup event listeners before component unmount
onBeforeUnmount(() => {
  const navLinks = document.querySelectorAll('.navbar a')
  navLinks.forEach(link => {
    link.removeEventListener('click', resetCategory)
  })
})

// Watch for route changes to reset category
watch(() => router.currentRoute.value.path, () => {
  resetCategory()
})

// Watch for query parameter changes to update category
watch(() => router.currentRoute.value.query, (newQuery) => {
  if (newQuery.type && ['tree', 'grass', 'weed'].includes(newQuery.type)) {
    selectCategory(newQuery.type)
    window.scrollTo(0, 0)
  }
}, { immediate: true })

// Data arrays for different types of pollen information
const grassList = [
  {
    title: 'Ryegrass',
    description: `Description: Ryegrass is wind-pollinated, and it releases an abundance of pollen during peak flowering season. Flowers are located on stalks that are 5 to 15 centimeters (2 to 6 inches) tall, and pollination occurs from spring to fall. Ryegrass is severely allergenic and is one of the most serious of a large number of grasses that cause allergic rhinitis (hay fever) and other respiratory allergies in humans.
`,
    image: '/Ryegrass.jpg'
  },
  {
    title: 'Bermuda Grass',
    description: `The cause of Bermuda Grass allergies is pollen. The peak pollen period for Bermuda grass is from early summer through mid-autumn, but in warmer locales, the grass can create pollen all year long. The reaction to Bermuda grass pollen can range from barely noticeable to almost feeling like you have the flu, depending on the severity of your body's immune response.
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
    title: 'She Oak',
    description:
      'She-oak (Casuarina/Allocasuarina spp.) is a slender, evergreen tree characterized by drooping, needle-like branchlets and inconspicuous, catkin-like male flowers. In Melbourne it begins to shed fine, powdery pollen in late winter, with flowering and pollen release running roughly from August through October, and airborne counts typically peak in September and early October. The tiny (20–30 µm) wind-borne grains can travel long distances—especially from populations along riverbanks and coastal edges—and frequently trigger sneezing, nasal congestion, itchy or watery eyes, throat irritation, and may exacerbate asthma in sensitive individuals.',
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
/* Main container styles */
.pollen-info-container {
  width: 100%;
  min-height: 100vh;
}

/* Content area layout */
.content-area {
  margin-top: 60px;
  padding: 1rem;
}

/* Category cards grid layout */
.category-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

/* Individual category card styles */
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

/* Flip card styles for detailed information */
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
  background-color: #ffffff;
  transform: rotateY(180deg);
  text-align: left;
  overflow-y: auto;
}
.flip-card-back p {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
}

.flip-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
  justify-items: center;
  margin: 0 auto;
}

.back-button-container {
  text-align: center;
  margin-top: 1rem;
}
.back-btn {
  background-color: #eef2ff;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #1e1e1e;
  border: none;
  cursor: pointer;
}

/* Game section styles */
.game-section {
  background-color: #ffffff;
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

/* Page recommendations styles */
.page-recommendations {
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
  margin: 1rem 2rem;
}

.page-recommendations:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2),
              0 6px 20px rgba(0, 122, 255, 0.15);
}

.page-recommendations h3 {
  margin-bottom: 1.2rem;
  font-size: 24px;
  color: #1D1D1F;
  font-weight: 600;
}

.recommendation-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.recommend-btn {
  display: inline-block;
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

.recommend-btn:hover {
  transform: scale(1.02);
  background-color: rgba(0, 113, 227, 0.9);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4),
              0 3px 8px rgba(0, 122, 255, 0.3);
}

/* Responsive design for different screen sizes */
@media (max-width: 992px) {
  .flip-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.search-container {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  width: 250px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-error {
  color: #ef4444;
  margin-top: 5px;
  font-size: 14px;
  font-weight: 500;
}
</style>
