<template>
  <div class="personalisation-container">
    <Navbar />

    <!--  main title -->
    <div class="banner">
      <h1 class="banner-title">
        Select the choice which fit you the most and get your personalized pollen solution
      </h1>
    </div>

    <!-- Form section for user input -->
    <div class="form-section">
      <form @submit.prevent="submitForm">
        <!-- Dropdown selection groups -->
        <div class="dropdown-container">
          <div class="dropdown-group">
            <label for="role">Your Role</label>
            <select id="role" v-model="selectedRole" required placeholder="Please Select">
              <option value="" disabled hidden>I am a</option>
              <option value="parent">parent/carer</option>
              <option value="allergy">Person with allergy</option>
              <option value="new resident">New Melbourne residence</option>
              <option value="probably allergic">Probably with allergy</option>
            </select>
          </div>
          <div class="dropdown-group">
            <label for="condition">Known Allergy</label>
            <select id="condition" v-model="selectedCondition" required placeholder="Please Select">
              <option value="" disabled hidden>I want to know more about</option>
              <option value="hayfever">allergic rhinitis (hay fever)</option>
              <option value="asthma">Asthma</option>
              <option value="conjunctivitis">Allergic conjunctivitis</option>
            </select>
          </div>
        </div>
        
        <!-- Submit button -->
        <button type="submit" class="submit-btn">
          Get Your Personalized Pollen Solution
        </button>

        <!-- Emergency notice box -->
        <div class="emergency-box">
          <span class="warning-icon">❗</span>
          <span class="emergency-text">Note: In case of emergency, contact Triple Zero (000)</span>
        </div>
      </form>
    </div>

    <!-- Results section - shown after form submission -->
    <div class="result-section" v-if="showResults">
      <div class="result-box">
        <h2>Your Personalized Pollen Solution</h2>
        <p><strong>Role:</strong> {{ submittedRole || 'N/A' }}</p>
        <p><strong>Condition:</strong> {{ submittedCondition || 'N/A' }}</p>

        <!-- Dynamic suggestions based on user selection -->
        <div class="suggestions" v-if="suggestions.length">
          <h3>Advice for You:</h3>
          <ul>
            <li v-for="(suggestion, index) in suggestions" :key="index">
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Navigation recommendations -->
    <div class="page-recommendations">
      <div class="recommendation-links" style="display: flex; justify-content: space-between; align-items: center; padding-left: 2rem; padding-right: 2rem;">
        <router-link to="/forecasting" class="recommend-btn">Go to Forecast</router-link>
        <router-link to="/allergytracker" class="recommend-btn">Go to Allergy Tracker</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import required Vue components and functions
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'

// Reactive state variables for form handling
const selectedRole = ref('')
const selectedCondition = ref('')
const showResults = ref(false)
const submittedRole = ref('')
const submittedCondition = ref('')

// Computed property that returns personalized suggestions based on user selections
const suggestions = computed(() => {
if (submittedRole.value === 'parent' && submittedCondition.value === 'hayfever') {
  return [
    "The allergens were minimized. Keep Windows closed in your home and car during spring, summer and early fall when pollen counts are high.",
    "If you grow flowers at home, research which plants do not cause hay fever.",
    "Use filters in vacuum cleaners and air conditioners to reduce the amount of allergens in the air."
  ]
} else if (submittedRole.value === 'parent' && submittedCondition.value === 'asthma') {
  return [
    "Changing the ventilation, heating and cooling systems in your home can improve air quality for people with asthma.",
    "Keep an eye on the daily pollen index and avoid outdoor activities during peak times.Tip: You can check local pollen concentrations and types on our website Pollen Map",
    "Be familiar with the emergency treatment process of asthma attack, carry the emergency inhaler with you, and master the use of it."
  ]
} else if (submittedRole.value === 'parent' && submittedCondition.value === 'conjunctivitis') {
  return [
    "Keep allergy eye drops or oral medications (over-the-counter or prescription) at home and on your person.",
    "Manage eye rubbing behavior. Repeated eye rubbing can worsen symptoms. Cut the person's nails short and apply gentle pressure with a tissue.",
    "Providing people with conjunctivitis with foods rich in vitamins and minerals can help strengthen the immune system and reduce inflammation in the body."
  ]
} else if (submittedRole.value === 'allergy' && submittedCondition.value === 'hayfever') {
  return [
    "Wear a mask when you go outside to protect yourself from pollen. Change your clothes as soon as you enter the house and avoid touching your nose.",
    "Nasal douches, saline nasal sprays or rinses can relieve hay fever. They clear mucus and allergens from the nasal passages. They are safe and can often help relieve symptoms.",
    "Stay indoors when it is windy, pollen levels are high, or during and after thunderstorms. You can check today's pollen count on the Pollen Forecaster website"
  ]
} else if (submittedRole.value === 'allergy' && submittedCondition.value === 'asthma') {
  return [
    "If possible, avoid going outside during thunderstorms from October to December, especially gusty winds before the storm.",
    "Clean frequently and wipe dust with a damp cloth to avoid pollen buildup.",
    "Take your asthma medication regularly every day and carry an emergency inhaler with you."
  ]
} else if (submittedRole.value === 'allergy' && submittedCondition.value === 'conjunctivitis') {
  return [
    "For cold compresses, wash your eyes with cold water, an ice pack, and a cold compress. Do wash after coming back from going out and apply a cold compress before going to bed.",
    "Wear protective goggles when you go outside to prevent allergens from entering your eyes.",
    "Maintain hygiene, take good care of personal items, such as towels, and do not share with others to avoid cross infection."
  ]
} else if (submittedRole.value === 'new resident' && submittedCondition.value === 'hayfever') {
  return [
    "Wash sheets and pillows frequently, and do not hang clothes or sheets outside to dry.",
    "Purchase over-the-counter (OTC) medications through a pharmacy at home to prepare for the relief caused by discomfort.",
    "Keep records. Record your allergies daily to create an allergy map of your new environment."
  ]
} else if (submittedRole.value === 'new resident' && submittedCondition.value === 'asthma') {
  return [
    "Treat 'don't know' as 'high risk' and open the protection mode in advance. For uncertain environments, use universal asthma control drugs first and observe the response.",
    "Familiar with the environment, know the nearest medical resources (hospital/pharmacy), understand the local pollen situation.",
    "Consult a map to find out where parks are located near your home and avoid areas with high pollen levels."
  ]
} else if (submittedRole.value === 'new resident' && submittedCondition.value === 'conjunctivitis') {
  return [
    "Clean the environment of your new home, including air conditioning filters, to prevent pollen buildup from causing allergic conjunctivitis.",
    "Using a humidifier at home can also help relieve dry eyes, especially if the environment is dry. If the eyes are dry, allergic conjunctivitis may worsen; Therefore, maintaining a moist environment may help protect the eyes from excessive inflammation. Humidifiers are very effective in air-conditioned or hot rooms.",
    "Keep protective tools, sterile wipes, eye drops, eye masks and tissues handy."
  ]
} else if (submittedRole.value === 'probably allergic' && submittedCondition.value === 'hayfever') {
  return [
    "Determine which allergens you are most likely to be exposed to and see if the symptoms fit the profile (especially 'itchy nose, sneezing, watery nose') to make a preliminary judgment about yourself.",
    "Avoid early morning (6-10 o 'clock) and windy weather when pollen concentration is high.",
    "Basic protection. Fixed window ventilation time, wear protective equipment when going out."
  ]
} else if (submittedRole.value === 'probably allergic' && submittedCondition.value === 'asthma') {
  return [
    "Make lifestyle changes, prioritize good sleep and relaxation, and stay within a healthy weight range. Forget the junk food, eat more fresh fruits, vegetables and lean meats, and get more exercise.",
    "It's important for everyone to stay away from smoke, and breathing in other people's smoke can also harm your health.",
    "Notice and control symptoms, pay attention to the triggers and symptoms of asthma attacks, and act quickly if you notice something unusual. Although carrying an inhaler is essential."
  ]
} else if (submittedRole.value === 'probably allergic' && submittedCondition.value === 'conjunctivitis') {
  return [
    "If symptoms do not go away after trying home remedies and over-the-counter medications, you should see a doctor about allergic conjunctivitis. If you experience severe discomfort, pain, vision problems, or severe redness of the eyes, seek medical attention.",
    "Sunglasses and a hat with a brim should be worn to protect your eyes from the sun. This helps prevent UV damage to your eyes.",
    "Hydration is essential to prevent and treat conjunctivitis. You should drink at least eight glasses of water a day to keep your body hydrated and reduce dry eye symptoms. It's also important to avoid caffeine and alcohol, as they can cause dehydration and exacerbate dry eye symptoms. You can also add hydrating foods like watermelon, cucumber, and celery to your diet. These foods have a high water content, which helps keep the body hydrated."
  ]
}
return []
})


function submitForm() {
  console.log('Selected Role:', selectedRole.value)
  console.log('Selected Condition:', selectedCondition.value)
  
  // Store the submitted values to use for computing suggestions
  submittedRole.value = selectedRole.value
  submittedCondition.value = selectedCondition.value
  
  // Show results only after form submission
  showResults.value = true
}
</script>

<style scoped>
/* Main container styles */
.personalisation-container {
  width: 100%;
  min-height: 100vh;
}

/* Banner section styles */
.banner {
  width: 100%;
  height: 200px;
  background: url("/personalisation-bg.jpg") center center / cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  padding-bottom: 30px;
}
.banner-title {
  color: #0c0e10;
  font-size: 1.75rem;
  text-align: center;
  padding: 0 1rem;
  margin-bottom: 20px;
}

/* Form section styles */
.form-section {
  width: 100%;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Form styles */
form {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 900px;
  box-sizing: border-box;
}

/* Dropdown container styles */
.dropdown-container {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

/* Dropdown group styles */
.dropdown-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
}
.dropdown-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}
.dropdown-group select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.submit-btn:hover {
  background-color: #1d4ed8;
}

/* Results section styles */
.result-section {
  width: 100%;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.result-box {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;
  text-align: left;
}
.result-box h2 {
  margin-bottom: 1rem;
  color: #0a6ac3;
}
.result-box p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.suggestions {
  margin-top: 1rem;
}
.suggestions h3 {
  color: #2563eb;
  margin-bottom: 0.5rem;
}
.suggestions ul {
  padding-left: 1.5rem;
}
.suggestions li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

/* Emergency box styles */
.emergency-box {
  background-color: transparent;
  color: #666;
  padding: 0.5rem 0;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  border: none;
}

.warning-icon {
  color: #dc3545;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.emergency-text {
  color: #dc3545;
  font-style: italic;
  font-weight: 600;
}

/* Navigation recommendations styles */
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
</style>



