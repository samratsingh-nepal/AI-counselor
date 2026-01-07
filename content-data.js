// content-data.js - Updated to load from JSON
let studyAbroadContent = {};

async function loadStudyAbroadData() {
  try {
    const response = await fetch('study-abroad-content.json');
    studyAbroadContent = await response.json();
    console.log('Study abroad content loaded successfully');
  } catch (error) {
    console.error('Error loading study abroad content:', error);
    // Fallback to default data if needed
    studyAbroadContent = {}; // You could include a basic fallback structure here
  }
}

// Load the data when the page loads
document.addEventListener('DOMContentLoaded', loadStudyAbroadData);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { studyAbroadContent, loadStudyAbroadData };
}
