<template>
    <!-- Allergy Tracker Main Container -->
    <div class="allergytracker-container">
        <Navbar />
        <div class="main-content mt-12 max-w-3xl mx-auto px-4">

            <!-- Allergy Type Selection Section -->
            <div class="section">
                <h1 class="text-4xl font-bold text-center mb-2">Select Your Allergy Type</h1>
                <p class="text-center text-gray-500 mb-8">
                    Choose your allergy type to see detailed information and recommendations.
                </p>

                <!-- Allergy Type Buttons -->
                <div class="w-full mb-12" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
                    <button
                        v-for="(allergy, key) in allergyTypes"
                        :key="key"
                        class="allergy-btn-card"
                        :class="{ selected: selectedAllergy === key }"
                        @click="selectAllergy(key)"
                    >
                        <div class="allergy-icon-card" :class="allergy.iconClass">{{ allergy.icon }}</div>
                        <div class="allergy-title">{{ allergy.title }}</div>
                        <div class="allergy-desc">{{ allergy.description }}</div>
                    </button>
                </div>

                <!-- Allergy Information Card -->
                <div v-if="selectedAllergy" class="allergy-info-card enlarged-card mb-12" ref="infoCardRef">
                    <div class="card-content">
                        <h3 class="card-title">
                            {{ allergyLabel }} Information
                        </h3>
                        <div class="image-container enlarged-image-container">
                            <img 
                                :src="`/allergyRe/${selectedAllergy.charAt(0).toUpperCase() + selectedAllergy.slice(1)}.png`" 
                                :alt="`${allergyLabel} information`"
                                class="allergy-image enlarged-allergy-image"
                            />
                        </div>
                        <div class="info-text">
                            <!-- Allergy Info Text by Type -->
                            <p v-if="selectedAllergy === 'hayfever'">
                                Hay fever, also known as allergic rhinitis, is an allergic response to airborne substances such as pollen. 
                                Symptoms include sneezing, runny nose, and itchy eyes.
                            </p>
                            <p v-else-if="selectedAllergy === 'asthma'">
                                Asthma is a condition that affects your airways, making it difficult to breathe. 
                                It can be triggered by various allergens and environmental factors.
                            </p>
                            <p v-else-if="selectedAllergy === 'eczema'">
                                Eczema is a condition that causes inflamed, itchy, cracked, and rough skin. 
                                It can be triggered by various allergens and environmental factors.
                            </p>
                            <p v-else-if="selectedAllergy === 'pet'">
                                Pet allergies are allergic reactions to proteins found in an animal's skin cells, saliva, or urine. 
                                Common symptoms include sneezing, runny nose, and itchy eyes.
                            </p>
                            <p v-else-if="selectedAllergy === 'dust'">
                                Dust allergies are reactions to dust mites and other particles found in dust. 
                                Symptoms can include sneezing, runny nose, and itchy eyes.
                            </p>
                            <p v-else-if="selectedAllergy === 'mold'">
                                Mold allergies are reactions to mold spores in the air. 
                                Symptoms can include sneezing, runny nose, and itchy eyes.
                            </p>
                        </div>
                        <!-- Tip to select symptoms -->
                        <div v-if="!selectedSymptom" class="scroll-tip">
                          Please continue to select your symptoms below 👇
                        </div>
                    </div>
                </div>
            </div>

            <!-- Symptom Selection Section -->
            <div class="section">
                <h2 class="text-4xl font-bold text-center mb-2">Select Your Symptoms</h2>
                <p class="text-center text-gray-500 mb-8">
                    Choose the symptoms you are experiencing to get personalized information.
                </p>

                <!-- Symptom Buttons -->
                <div class="w-full mb-8" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
                    <button
                        v-for="(symptom, key) in symptoms"
                        :key="key"
                        class="symptom-btn-card"
                        :class="{ 
                            selected: selectedSymptom === key,
                            disabled: !selectedAllergy 
                        }"
                        :disabled="!selectedAllergy"
                        @click="selectSymptom(key)"
                    >
                        <span class="symptom-icon-card" :class="symptom.iconClass">{{ symptom.icon }}</span>
                        <span class="symptom-label">{{ symptom.title }}</span>
                    </button>
                </div>

                <!-- Symptom Information Card -->
                <div v-if="selectedSymptom" class="symptom-card enlarged-card mb-12">
                    <div class="card-content">
                        <h3 class="card-title">
                            {{ symptomLabel }} Information
                        </h3>
                        <div class="image-container enlarged-image-container">
                            <video 
                                v-if="symptomData[selectedSymptom]?.video" 
                                :src="symptomData[selectedSymptom].video" 
                                autoplay
                                loop
                                muted
                                playsinline
                                class="allergy-image enlarged-allergy-image"
                            >
                            </video>
                        </div>
                        <div class="info-text">
                            <p>{{ symptomData[selectedSymptom]?.description }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center gap-6 mb-10 action-btns-wrapper">
                <button class="action-btn clear-btn" @click="clearAll">Clear All</button>
            </div>
        </div>
        <!-- Recommendation Links -->
        <div class="page-recommendations">
            <div class="recommendation-links">
                <router-link to="/polleninfo" class="recommend-btn">Go to Education Resource</router-link>
                <router-link to="/simulator" class="recommend-btn">Go to Simulator</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
// Import Vue composition API and Navbar component
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import Navbar from '../components/Navbar.vue'

// State for selected allergy and symptom
const selectedAllergy = ref('')
const selectedSymptom = ref('')
const showResultCard = ref(false)
const infoCardRef = ref(null)

// Allergy types data
const allergyTypes = {
    hayfever: {
        title: 'Hay Fever',
        description: 'Seasonal allergic rhinitis caused by pollen',
        icon: '🌱',
        iconClass: 'text-green-500'
    },
    asthma: {
        title: 'Asthma',
        description: 'Respiratory condition affecting airways',
        icon: '🫁',
        iconClass: 'text-blue-500'
    },
    eczema: {
        title: 'Eczema',
        description: 'Inflammatory skin condition',
        icon: '✋',
        iconClass: 'text-red-400'
    },
    pet: {
        title: 'Pet Allergies',
        description: 'Allergic reactions to animal dander',
        icon: '🐾',
        iconClass: 'text-purple-500'
    },
    dust: {
        title: 'Dust Allergies',
        description: 'Reactions to dust mites and particles',
        icon: '🏠',
        iconClass: 'text-yellow-500'
    },
    mold: {
        title: 'Mold Allergies',
        description: 'Allergic responses to mold spores',
        icon: '👥',
        iconClass: 'text-teal-500'
    }
}

// Symptom types data
const symptoms = {
    runny_nose: {
        title: 'Runny Nose',
        icon: '🤧',
        iconClass: 'text-green-400'
    },
    headache: {
        title: 'Headache',
        icon: '🤕',
        iconClass: 'text-blue-400'
    },
    itchy_eyes: {
        title: 'Itchy Eyes',
        icon: '👀',
        iconClass: 'text-yellow-400'
    },
    sneezing: {
        title: 'Sneezing',
        icon: '🤧',
        iconClass: 'text-gray-400'
    },
    coughing: {
        title: 'Coughing',
        icon: '😷',
        iconClass: 'text-gray-500'
    },
    skin_rash: {
        title: 'Skin Rash',
        icon: '🤲',
        iconClass: 'text-pink-400'
    },
    short_breath: {
        title: 'Shortness of Breath',
        icon: '😮‍💨',
        iconClass: 'text-blue-300'
    },
    wheezing: {
        title: 'Wheezing',
        icon: '🌬️',
        iconClass: 'text-teal-400'
    }
}

// Symptom details data
const symptomData = {
    runny_nose: {
        description: "A runny nose (rhinorrhea) is a common symptom of allergies where excess mucus is produced in the nasal passages. This can be triggered by various allergens including pollen, dust, and pet dander.",
        video: "/symptoms/runny nose.mp4"
    },
    headache: {
        description: "Allergy-related headaches often occur due to sinus pressure and inflammation. They can be triggered by various allergens and are commonly associated with sinus congestion.",
        video: "/symptoms/headache.mp4"
    },
    itchy_eyes: {
        description: "Itchy eyes (allergic conjunctivitis) is a common allergic reaction where the eyes become irritated and itchy. This is often accompanied by redness and watering of the eyes.",
        video: "/symptoms/eye.mp4"
    },
    sneezing: {
        description: "Sneezing is a reflex action triggered by irritation in the nasal passages. In allergies, it's often caused by exposure to allergens like pollen, dust, or pet dander.",
        video: "/symptoms/sneezing.mp4"
    },
    coughing: {
        description: "Allergy-related coughing is often caused by postnasal drip or throat irritation. It can be triggered by various allergens and may be worse at night.",
        video: "/symptoms/coughing.mp4"
    },
    skin_rash: {
        description: "Allergic skin rashes can appear as red, itchy patches on the skin. They are often caused by direct contact with allergens or as a systemic reaction to allergens.",
        video: "/symptoms/skin rash.mp4"
    },
    short_breath: {
        description: "Shortness of breath in allergies can be caused by airway inflammation or asthma-like symptoms. It's important to seek medical attention if this symptom is severe.",
        video: "/symptoms/shortness of breath.mp4"
    },
    wheezing: {
        description: "Wheezing is a high-pitched whistling sound made while breathing. It's often associated with asthma or allergic reactions affecting the airways.",
        video: "/symptoms/wheezing.mp4"
    }
}

// Computed label for selected allergy
const allergyLabel = computed(() => {
    return allergyTypes[selectedAllergy.value]?.title || ''
})

// Computed label for selected symptom
const symptomLabel = computed(() => {
    return symptoms[selectedSymptom.value]?.title || ''
})

// Handle allergy selection
function selectAllergy(key) {
    selectedAllergy.value = key
    selectedSymptom.value = '' 
    // Scroll to info card after selection
    nextTick(() => {
        if (infoCardRef.value) {
            infoCardRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    })
}

// Handle symptom selection
function selectSymptom(key) {
    if (!selectedAllergy.value) return
    selectedSymptom.value = key
}

// Not used, but can be used for future submit logic
function handleSubmit() {
    showResultCard.value = true
}

// Clear all selections
function clearAll() {
    selectedAllergy.value = ''
    selectedSymptom.value = ''
    showResultCard.value = false
}

// Placeholder for scroll event logic
function handleScroll() {

}

// Add/remove scroll event listeners
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>



<style scoped>
/* Main page container styles */
.allergytracker-page {
    margin-top: 60px;
    background-color: white;
    min-height: 100vh;
}

.main-content {
    margin-top: 5rem;
}

/* Allergy type button styles */
.allergy-btn-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    background: #f8fafc;
    border: 2px solid #e5e7eb;
    border-radius: 18px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
    transition: all 0.2s;
    cursor: pointer;
    padding: 1rem 0.5rem 1rem;
}
.allergy-btn-card.selected {
    border-color: #3b82f6;
    background: #e0edff;
    box-shadow: 0 6px 24px rgba(59,130,246,0.1);
}
.allergy-icon-card { font-size: 2.8rem; margin-bottom: 1.1rem; }
.allergy-title   { font-weight: bold; font-size: 1.25rem; text-align: center; margin-bottom: .5rem; }
.allergy-desc    { color: #64748b; font-size: 1rem; text-align: center; }

/* Symptom button styles */
.symptom-btn-card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 56px;
    background: #f8fafc;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: all 0.2s;
    cursor: pointer;
    padding: 0.7rem 1.2rem;
    font-size: 1.08rem;
}
.symptom-btn-card.selected {
    border-color: #3b82f6;
    background: #e0edff;
    box-shadow: 0 4px 16px rgba(59,130,246,0.1);
}
.symptom-btn-card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.symptom-icon-card { font-size: 1.5rem; margin-right: 0.7rem; }
.symptom-label     { font-weight: 500; }

/* Allergy info card styles */
.allergy-info-card {
    width: 100%;
    max-width: 800px;
    margin: 2rem auto;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
}

.card-content {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.card-title {
    font-size: 2rem;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    margin: 0;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
}

.image-container {
    width: 100%;
    height: 400px;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
}

.allergy-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1.5rem;
    transition: transform 0.3s ease;
}

.allergy-image:hover {
    transform: scale(1.02);
}

.info-text {
    color: #4a5568;
    font-size: 1.2rem;
    line-height: 1.8;
    text-align: center;
    padding: 1rem 2rem;
    background: #f8fafc;
    border-radius: 12px;
}

.info-text p {
    margin: 0;
}

/* Hide modal overlay and close button (not used) */
.modal-overlay,
.close-button {
    display: none;
}

/* Enlarged card styles */
.enlarged-card {
    max-width: 1100px;
    min-height: 520px;
    margin: 3rem auto;
    border-radius: 32px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.13);
    border: 2.5px solid #e0e7ef;
}
.enlarged-image-container {
    height: 480px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 6px 24px rgba(0,0,0,0.08);
    border: 1.5px solid #e0e7ef;
}
.enlarged-allergy-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 2.5rem;
    transition: transform 0.3s ease;
}
.enlarged-allergy-image:hover {
    transform: scale(1.04);
}

/* Action button styles */
.action-btn {
    font-size: 1.15rem;
    font-weight: 600;
    padding: 0.7rem 2.2rem;
    border-radius: 10px;
    border: none;
    outline: none;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    cursor: pointer;
}
.clear-btn {
    background: #f3f4f6;
    color: #374151;
}
.clear-btn:hover {
    background: #e5e7eb;
}
.submit-btn {
    background: #2563eb;
    color: #fff;
}
.submit-btn:disabled {
    background: #a5b4fc;
    color: #e0e7ef;
    cursor: not-allowed;
}

.action-btns-wrapper {
    margin-top: 2rem;
}

/* Symptom info card styles */
.symptom-card {
    width: 100%;
    max-width: 800px;
    margin: 2rem auto;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
}

.symptom-card video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1.5rem;
    transition: transform 0.3s ease;
}

.symptom-card video:hover {
    transform: scale(1.02);
}

.section {
    margin-bottom: 3rem;
}

/* Recommendation button styles */
.recommend-btn {
    display: inline-block;
    padding: 12px 32px;
    background-color: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 1.1rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(59,130,246,0.13);
}
.recommend-btn:hover {
    background-color: #2563eb;
    transform: scale(1.04);
}

.page-recommendations {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 0 auto;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 1.2rem 1.5rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--apple-border, #e5e7eb);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
              0 4px 16px rgba(0, 122, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.recommendation-links {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 2rem;
  padding-right: 2rem;
}

/* Tip bar styles */
.scroll-tip {
  text-align: center;
  margin: 1.5rem 0 0.5rem 0;
  font-size: 1.15rem;
  color: #bd3508;
  font-weight: 500;
  animation: bounce 1.2s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(8px);}
}
</style>
  
  
