// User profile storage
let userProfile = {
    targetCountry: '',
    intendedLevel: '',
    academicPerformance: '',
    studyGap: '',
    englishTestStatus: '',
    fundingPlan: '',
    completed: false,
    lastUpdated: null
};

// Application State
let currentTopic = null;
let isTopicBarCollapsed = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const chatContainer = document.getElementById('chatContainer');
const chatArea = document.getElementById('chatArea');
const topicNavBar = document.getElementById('topicNavBar');
const topicButtons = document.getElementById('topicButtons');
const topicContent = document.getElementById('topicContent');
const topicToggleIcon = document.getElementById('topicToggleIcon');
const toggleTopicsBtn = document.getElementById('toggleTopicsBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const statusText = document.getElementById('statusText');
const profileModal = document.getElementById('profileModal');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load previous conversation if exists
    const savedProfile = localStorage.getItem('studyAbroadProfile');
    if (savedProfile) {
        try {
            userProfile = JSON.parse(savedProfile);
            if (userProfile.completed) {
                setTimeout(startChat, 500);
            }
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
});

// Start chat function
function startChat() {
    welcomeScreen.style.display = 'none';
    chatContainer.style.display = 'flex';
    
    if (!userProfile.completed) {
        showWelcomePhase();
    } else {
        showTopicSelection();
        updateStatus('Choose a topic');
    }
}

// Phase 1: Welcome
function showWelcomePhase() {
    updateProgress(0, 'Starting conversation...');
    updateStatus('Getting to know you');

    setTimeout(() => {
        addMessage('bot', `👋 **Welcome to Your Study Abroad Assistant!**\n\nI'm here to guide you through everything you need to know about studying abroad.\n\n✨ **Here's what we'll do:**\n1. Answer 6 quick questions about your plans\n2. Get personalized advice based on your profile\n3. Explore topics that matter to you\n\n⏱ **Takes just 2-3 minutes**\n\nReady to begin?`);

        // Show only start button in chat area
        chatArea.innerHTML += `
            <div class="message bot-message">
                <div class="message-content">
                    <strong>Choose how to proceed:</strong>
                </div>
            </div>
        `;
        
        showTopicButtons([
            { text: 'Start Profile Setup', icon: 'fas fa-rocket', action: () => startProfileSetup(), primary: true }
        ]);
    }, 500);
}

function startProfileSetup() {
    updateProgress(10, 'Step 1 of 6: Country Selection');
    updateStatus('Select your target country');
    showCountrySelection();
}

// Profile Collection Functions
function showCountrySelection() {
    addMessage('bot', '🌍 **First, which country are you planning to study in?**');
    
    showTopicButtons([
        { text: 'Australia 🇦🇺', icon: 'fas fa-flag', action: () => saveAnswer('targetCountry', 'Australia', showLevelSelection) },
        { text: 'Canada 🇨🇦', icon: 'fas fa-flag', action: () => saveAnswer('targetCountry', 'Canada', showLevelSelection) },
        { text: 'UK 🇬🇧', icon: 'fas fa-flag', action: () => saveAnswer('targetCountry', 'UK', showLevelSelection) },
        { text: 'USA 🇺🇸', icon: 'fas fa-flag', action: () => saveAnswer('targetCountry', 'USA', showLevelSelection) },
        { text: 'New Zealand 🇳🇿', icon: 'fas fa-flag', action: () => saveAnswer('targetCountry', 'New Zealand', showLevelSelection) },
        { text: 'Not Sure 🤔', icon: 'fas fa-question', action: () => saveAnswer('targetCountry', 'Not Sure', showLevelSelection) }
    ]);
}

function showLevelSelection() {
    updateProgress(25, 'Step 2 of 6: Study Level');
    updateStatus('Select your study level');
    
    addMessage('bot', '🎓 **What level of study are you planning?**');
    
    showTopicButtons([
        { text: 'Diploma / Certificate', icon: 'fas fa-certificate', action: () => saveAnswer('intendedLevel', 'Diploma', showAcademicPerformance) },
        { text: 'Bachelor\'s Degree', icon: 'fas fa-user-graduate', action: () => saveAnswer('intendedLevel', 'Bachelor\'s', showAcademicPerformance) },
        { text: 'Master\'s Degree', icon: 'fas fa-graduation-cap', action: () => saveAnswer('intendedLevel', 'Master\'s', showAcademicPerformance) },
        { text: 'PhD / Doctorate', icon: 'fas fa-user-graduate', action: () => saveAnswer('intendedLevel', 'PhD', showAcademicPerformance) }
    ]);
}

function showAcademicPerformance() {
    updateProgress(40, 'Step 3 of 6: Academic Performance');
    updateStatus('Describe your academic results');
    
    addMessage('bot', '📊 **How would you describe your academic performance?**');
    
    showTopicButtons([
        { text: 'Below Average', icon: 'fas fa-chart-line-down', action: () => saveAnswer('academicPerformance', 'Below Average', showStudyGap) },
        { text: 'Average', icon: 'fas fa-chart-line', action: () => saveAnswer('academicPerformance', 'Average', showStudyGap) },
        { text: 'Good', icon: 'fas fa-chart-line-up', action: () => saveAnswer('academicPerformance', 'Good', showStudyGap) },
        { text: 'Strong / Excellent', icon: 'fas fa-star', action: () => saveAnswer('academicPerformance', 'Strong', showStudyGap) }
    ]);
}

function showStudyGap() {
    updateProgress(55, 'Step 4 of 6: Study Gap');
    updateStatus('Any gap after last study?');
    
    addMessage('bot', '⏳ **Have you had any gap after your last study?**');
    
    showTopicButtons([
        { text: 'No Gap', icon: 'fas fa-check-circle', action: () => saveAnswer('studyGap', 'No Gap', showEnglishTestStatus) },
        { text: '1 Year', icon: 'fas fa-calendar', action: () => saveAnswer('studyGap', '1 Year', showEnglishTestStatus) },
        { text: '2-3 Years', icon: 'fas fa-calendar-alt', action: () => saveAnswer('studyGap', '2-3 Years', showEnglishTestStatus) },
        { text: 'More than 3 Years', icon: 'fas fa-calendar-times', action: () => saveAnswer('studyGap', 'More than 3 Years', showEnglishTestStatus) }
    ]);
}

function showEnglishTestStatus() {
    updateProgress(70, 'Step 5 of 6: English Test Status');
    updateStatus('English test status');
    
    addMessage('bot', '🗣️ **What is your English test situation?**');
    
    showTopicButtons([
        { text: 'IELTS/PTE Completed', icon: 'fas fa-check-double', action: () => saveAnswer('englishTestStatus', 'Completed', showFundingPlan) },
        { text: 'Test Booked / Planning', icon: 'fas fa-calendar-check', action: () => saveAnswer('englishTestStatus', 'Booked', showFundingPlan) },
        { text: 'Not Started Yet', icon: 'fas fa-clock', action: () => saveAnswer('englishTestStatus', 'Not Started', showFundingPlan) }
    ]);
}

function showFundingPlan() {
    updateProgress(85, 'Step 6 of 6: Funding Plan');
    updateStatus('How will you fund studies?');
    
    addMessage('bot', '💰 **How do you plan to fund your studies?**');
    
    showTopicButtons([
        { text: 'Parents / Family Sponsor', icon: 'fas fa-users', action: () => saveAnswer('fundingPlan', 'Family Sponsor', showProfileConfirmation) },
        { text: 'Education Loan', icon: 'fas fa-university', action: () => saveAnswer('fundingPlan', 'Education Loan', showProfileConfirmation) },
        { text: 'Combination of Sources', icon: 'fas fa-balance-scale', action: () => saveAnswer('fundingPlan', 'Combination', showProfileConfirmation) },
        { text: 'Not Sure / Exploring', icon: 'fas fa-question-circle', action: () => saveAnswer('fundingPlan', 'Exploring', showProfileConfirmation) }
    ]);
}

function showProfileConfirmation() {
    userProfile.completed = true;
    userProfile.lastUpdated = new Date().toISOString();
    updateProgress(100, 'Profile Complete!');
    updateStatus('Ready to explore topics');
    
    localStorage.setItem('studyAbroadProfile', JSON.stringify(userProfile));
    
    addMessage('bot', `🎉 **Profile Successfully Saved!**\n\n✅ **Your Profile Summary:**\n• **Country:** ${userProfile.targetCountry}\n• **Study Level:** ${userProfile.intendedLevel}\n• **Academic:** ${userProfile.academicPerformance}\n• **Study Gap:** ${userProfile.studyGap}\n• **English Test:** ${userProfile.englishTestStatus}\n• **Funding:** ${userProfile.fundingPlan}\n\n✨ **With this profile, I can now provide you with personalized advice.**`);
    
    updateProfileDisplay();
    
    setTimeout(() => {
        showTopicSelection();
    }, 1500);
}

// Topic Selection - Show in navigation bar
function showTopicSelection() {
    updateProgress(100, 'Ready to help!');
    updateStatus('Choose a topic');
    
    // Clear previous topic content
    topicContent.innerHTML = '';
    topicContent.classList.remove('active');
    
    // Show topic navigation bar
    topicNavBar.classList.remove('collapsed');
    topicToggleIcon.className = 'fas fa-chevron-down';
    isTopicBarCollapsed = false;
    
    // Clear any active topic buttons
    const allTopicBtns = document.querySelectorAll('.topic-btn');
    allTopicBtns.forEach(btn => btn.classList.remove('active'));
    
    // Add message explaining the interface
    addMessage('bot', `📚 **What would you like to understand better?**\n\n*Choose any topic from the navigation bar below to get personalized guidance.*`);
    
    // Show topic buttons in the navigation bar
    showTopicNavButtons([
        { id: 'financial', text: 'Financial Requirements', icon: '💰', action: () => showTopic('financial') },
        { id: 'scholarships', text: 'Scholarships', icon: '🎓', action: () => showTopic('scholarships') },
        { id: 'visa', text: 'Visa Expectations', icon: '📄', action: () => showTopic('visa') },
        { id: 'english', text: 'English Test Help', icon: '🗣️', action: () => showTopic('english') },
        { id: 'timeline', text: 'Timeline Planning', icon: '📅', action: () => showTopic('timeline') },
        { id: 'counselor', text: 'Talk to Counselor', icon: '🤝', action: () => showTopic('counselor') }
    ]);
}

// Show topic content
function showTopic(topicId) {
    currentTopic = topicId;
    
    // Collapse topic navigation bar
    topicNavBar.classList.add('collapsed');
    topicToggleIcon.className = 'fas fa-chevron-up';
    isTopicBarCollapsed = true;
    
    // Update active button
    const allTopicBtns = document.querySelectorAll('.topic-btn');
    allTopicBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.topic === topicId) {
            btn.classList.add('active');
        }
    });
    
    // Show topic content area
    topicContent.classList.add('active');
    topicContent.innerHTML = '';
    
    // Generate topic content
    const topicContentHTML = generateTopicContent(topicId);
    topicContent.innerHTML = topicContentHTML;
    
    // Update status
    updateStatus(`${getTopicName(topicId)} • Viewing`);
}

function generateTopicContent(topicId) {
    const topicData = getTopicData(topicId);
    
    return `
        <div class="topic-content-header">
            <h3><span class="topic-icon">${topicData.icon}</span> ${topicData.title}</h3>
            <button class="topic-back-btn" onclick="backToTopics()">
                <i class="fas fa-arrow-left"></i> Back to Topics
            </button>
        </div>
        
        <div class="topic-content-body">
            ${topicData.content}
            
            <div class="topic-note">
                <p><i class="fas fa-lightbulb"></i> <strong>Personalized Advice:</strong> This guidance is tailored based on your profile information.</p>
            </div>
            
            <div class="topic-actions">
                ${topicData.actions}
            </div>
        </div>
    `;
}

function getTopicData(topicId) {
    const topics = {
        'financial': {
            icon: '💰',
            title: 'Financial Requirements',
            content: generateFinancialContent(),
            actions: `
                <button class="topic-action-btn" onclick="showTopic('scholarships')">
                    <i class="fas fa-award"></i>
                    <span>Explore Scholarships</span>
                </button>
                <button class="topic-action-btn primary" onclick="showTopic('counselor')">
                    <i class="fas fa-headset"></i>
                    <span>Talk to Financial Advisor</span>
                </button>
            `
        },
        'scholarships': {
            icon: '🎓',
            title: 'Scholarship Opportunities',
            content: generateScholarshipContent(),
            actions: `
                <button class="topic-action-btn" onclick="showTopic('financial')">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>View Financial Requirements</span>
                </button>
                <button class="topic-action-btn primary" onclick="showTopic('counselor')">
                    <i class="fas fa-headset"></i>
                    <span>Get Scholarship Help</span>
                </button>
            `
        },
        'visa': {
            icon: '📄',
            title: 'Visa Expectations',
            content: generateVisaContent(),
            actions: `
                <button class="topic-action-btn" onclick="showTopic('english')">
                    <i class="fas fa-language"></i>
                    <span>English Test Requirements</span>
                </button>
                <button class="topic-action-btn primary" onclick="showTopic('counselor')">
                    <i class="fas fa-headset"></i>
                    <span>Visa Consultation</span>
                </button>
            `
        },
        'english': {
            icon: '🗣️',
            title: 'English Test Guidance',
            content: generateEnglishContent(),
            actions: `
                <button class="topic-action-btn" onclick="showTopic('timeline')">
                    <i class="fas fa-calendar"></i>
                    <span>Timeline Planning</span>
                </button>
                <button class="topic-action-btn primary" onclick="showTopic('counselor')">
                    <i class="fas fa-headset"></i>
                    <span>Get Test Prep Help</span>
                </button>
            `
        },
        'timeline': {
            icon: '📅',
            title: 'Timeline Planning',
            content: generateTimelineContent(),
            actions: `
                <button class="topic-action-btn" onclick="showTopic('english')">
                    <i class="fas fa-language"></i>
                    <span>English Test Schedule</span>
                </button>
                <button class="topic-action-btn primary" onclick="showTopic('counselor')">
                    <i class="fas fa-headset"></i>
                    <span>Create Personalized Plan</span>
                </button>
            `
        },
        'counselor': {
            icon: '🤝',
            title: 'Counselor Connection',
            content: generateCounselorContent(),
            actions: `
                <button class="topic-action-btn" onclick="connectViaWhatsApp()">
                    <i class="fab fa-whatsapp"></i>
                    <span>Connect on WhatsApp</span>
                </button>
                <button class="topic-action-btn primary" onclick="scheduleVideoCall()">
                    <i class="fas fa-video"></i>
                    <span>Schedule Video Call</span>
                </button>
            `
        }
    };
    
    return topics[topicId];
}

function generateFinancialContent() {
    const country = userProfile.targetCountry || 'your chosen country';
    const level = userProfile.intendedLevel || 'your study level';
    const funding = userProfile.fundingPlan || 'your funding plan';
    
    return `
        <div class="topic-section">
            <h4><i class="fas fa-money-check-alt"></i> Estimated Costs for ${country}</h4>
            <p>For ${level} studies in ${country}, here's a breakdown of expected costs:</p>
            
            <ul class="topic-list">
                <li><strong>Tuition Fees:</strong> ${getTuitionEstimate(country, level)}</li>
                <li><strong>Living Expenses:</strong> ${getLivingEstimate(country)}</li>
                <li><strong>Health Insurance:</strong> ${getInsuranceEstimate(country)}</li>
                <li><strong>Miscellaneous:</strong> ${getMiscEstimate(country)}</li>
            </ul>
            
            <p><strong>Total First Year Estimate:</strong> ${getTotalEstimate(country, level)}</p>
        </div>
        
        <div class="topic-section">
            <h4><i class="fas fa-hand-holding-usd"></i> Funding Requirements</h4>
            <p>Based on your ${funding} plan:</p>
            <p>${getFundingAdvice(funding)}</p>
        </div>
        
        <div class="topic-section">
            <h4><i class="fas fa-lightbulb"></i> Key Considerations</h4>
            <ul class="topic-list">
                <li>Start financial documentation 3-4 months before application</li>
                <li>Maintain funds in account for at least 3 months</li>
                <li>Consider currency exchange rate fluctuations</li>
                <li>Include emergency funds (10-15% of total)</li>
            </ul>
        </div>
    `;
}

function generateScholarshipContent() {
    const academic = userProfile.academicPerformance || 'your academic level';
    const level = userProfile.intendedLevel || 'your study level';
    
    return `
        <div class="topic-section">
            <h4><i class="fas fa-award"></i> Opportunities for ${academic} Academics</h4>
            <p>Based on your ${academic} academic profile at ${level} level:</p>
            
            <ul class="topic-list">
                ${getScholarshipOpportunities(academic, level)}
            </ul>
        </div>
        
        <div class="topic-section">
            <h4><i class="fas fa-calendar-alt"></i> Application Timeline</h4>
            <p>Critical deadlines for scholarship applications:</p>
            
            <ul class="topic-list">
                <li><strong>6-8 months before intake:</strong> Research and identify scholarships</li>
                <li><strong>5-7 months before:</strong> Prepare application documents</li>
                <li><strong>4-6 months before:</strong> Submit applications</li>
                <li><strong>3-4 months before:</strong> Follow up and prepare for interviews</li>
                <li><strong>2-3 months before:</strong> Receive results and accept offers</li>
            </ul>
        </div>
        
        <div class="topic-section">
            <h4><i class="fas fa-tips"></i> Application Tips</h4>
            <ul class="topic-list">
                <li>Apply to at least 5-7 scholarships to increase chances</li>
                <li>Tailor each application to the specific scholarship criteria</li>
                <li>Highlight unique achievements and experiences</li>
                <li>Get strong letters of recommendation</li>
                <li>Submit applications well before deadlines</li>
            </ul>
        </div>
    `;
}

function generateVisaContent() {
    const country = userProfile.targetCountry || 'selected country';
    const gap = userProfile.studyGap || 'No Gap';
    
    return `
        <div class="topic-section">
            <h4><i class="fas fa-file-contract"></i> Visa Requirements for ${country}</h4>
            <p>Essential documents you'll need to prepare:</p>
            
            <ul class="topic-list">
                <li><strong>Valid passport</strong> (minimum 6 months validity)</li>
                <li><strong>University offer letter</strong> (unconditional admission)</li>
                <li><strong>Proof of financial capability</strong> (bank statements, loan sanction)</li>
                <li><strong>English proficiency test results</strong> (IELTS/PTE/TOEFL)</li>
                <li><strong>Academic transcripts and certificates</strong> (attested if required)</li>
                <li><strong>Statement of Purpose (SOP)</strong> explaining study intentions</li>
                <li><strong>Health insurance proof</strong> (as per country requirements)</li>
                <li><strong>Police clearance certificate</strong> (background check)</li>
                <li><strong>Visa application form</strong> with photographs</li>
            </ul>
        </div>
        
        ${gap !== 'No Gap' ? `
        <div class="topic-section">
            <h4><i class="fas fa-clock"></i> Important: Study Gap Explanation</h4>
            <p>Since you have a ${gap.toLowerCase()} study gap, you need to provide a clear explanation:</p>
            <ul class="topic-list">
                <li>Document all activities during the gap period</li>
                <li>Show how these activities connect to your future studies</li>
                <li>Provide certificates for any courses/training completed</li>
                <li>Explain career development during this period</li>
                <li>Show consistency in your academic and career journey</li>
            </ul>
        </div>
        ` : ''}
        
        <div class="topic-section">
            <h4><i class="fas fa-hourglass-half"></i> Processing Timeline</h4>
            <p><strong>${getVisaProcessingTime(country)}</strong></p>
            <p>Recommendation: Apply 3-4 months before your course start date.</p>
        </div>
    `;
}

function generateEnglishContent() {
    const status = userProfile.englishTestStatus || 'Not Started';
    const level = userProfile.intendedLevel || 'your study level';
    
    return `
        <div class="topic-section">
            <h4><i class="fas fa-language"></i> Your Current Status: ${status}</h4>
            <p>${getEnglishStatusMessage(status)}</p>
            
            <ul class="topic-list">
                ${getEnglishActionItems(status)}
            </ul>
        </div>
        
        <div class="topic-section">
            <h4><i class="fas fa-chart-line"></i> Score Requirements for ${level}</h4>
            <p>Typical English test requirements:</p>
            
            <ul class="topic-list">
                <li><strong>IELTS:</strong> ${getIELTSRequirement(level)}</li>
                <li><strong>PTE:</strong> ${getPTERequirement(level)}</li>
                <li><strong>TOEFL iBT:</strong> ${getTOEFLRequirement(level)}</li>
                <li><strong>Duolingo:</strong> ${getDuolingoRequirement(level)} (accepted by many universities)</li>
            </ul>
            
            <p><em>Note: Some universities may have higher requirements for competitive programs.</em></p>
        </div>
        
        <div class="topic-section">
            <h4><i class="fas fa-calendar-check"></i> Test Planning Timeline</h4>
            <ul class="topic-list">
                <li><strong>Preparation:</strong> 2-4 months (depending on current level)</li>
                <li><strong>Test Booking:</strong> 4-6 weeks in advance (seats fill quickly)</li>
                <li><strong>Test Results:</strong> 2-4 weeks after test date</li>
                <li><strong>Validity:</strong> 2 years for most tests</li>
                <li><strong>Retake Planning:</strong> Allow 1-2 months between attempts if needed</li>
            </ul>
        </div>
    `;
}

function generateTimelineContent() {
    const country = userProfile.targetCountry || 'selected country';
    const englishStatus = userProfile.englishTestStatus || 'Not Started';
    
    return `
        <div class="topic-section">
            <h4><i class="fas fa-calendar-day"></i> Intake Timeline for ${country}</h4>
            <p>Main intake periods:</p>
            <p><strong>${getIntakePeriods(country)}</strong></p>
            
            <p>Recommended schedule for the next available intake:</p>
            
            <ul class="topic-list">
                ${getTimelineSteps(englishStatus)}
            </ul>
        </div>
        
        <div class="topic-section">
            <h4><i class="fas fa-tasks"></i> Critical Checklist</h4>
            
            <ul class="topic-list">
                <li><input type="checkbox"> Research and shortlist universities (Now)</li>
                <li><input type="checkbox"> Contact potential supervisors (if PhD/Masters research)</li>
                <li><input type="checkbox"> Prepare for English test (${englishStatus === 'Not Started' ? 'Start now!' : 'Ongoing'})</li>
                <li><input type="checkbox"> Take English test (Schedule based on intake)</li>
                <li><input type="checkbox"> Request academic transcripts and recommendations</li>
                <li><input type="checkbox"> Prepare Statement of Purpose (SOP)</li>
                <li><input type="checkbox"> Submit university applications (4-6 months before intake)</li>
                <li><input type="checkbox"> Apply for scholarships (parallel with applications)</li>
                <li><input type="checkbox"> Accept offer and pay deposit (2-3 months before intake)</li>
                <li><input type="checkbox"> Apply for student visa (3-4 months before intake)</li>
                <li><input type="checkbox"> Arrange accommodation (2-3 months before)</li>
                <li><input type="checkbox"> Book flights and plan arrival (1-2 months before)</li>
            </ul>
        </div>
    `;
}

function generateCounselorContent() {
    return `
        <div class="topic-section">
            <h4><i class="fas fa-headset"></i> Free Expert Consultation</h4>
            <p>Our certified study abroad counselors can help you with:</p>
            
            <ul class="topic-list">
                <li><strong>University Selection:</strong> Best-fit universities based on your profile</li>
                <li><strong>Application Strategy:</strong> Maximize your admission chances</li>
                <li><strong>Document Review:</strong> SOP, LOR, and resume feedback</li>
                <li><strong>Visa Guidance:</strong> Complete document checklist and mock interviews</li>
                <li><strong>Financial Planning:</strong> Scholarship and funding advice</li>
                <li><strong>Timeline Management:</strong> Personalized schedule creation</li>
                <li><strong>Post-Admission Support:</strong> Accommodation, travel, and settling in</li>
            </ul>
            
            <p><strong>All consultations are completely free!</strong> Choose your preferred method of communication:</p>
        </div>
        
        <div class="topic-section">
            <h4><i class="fas fa-comments"></i> Why Get Professional Help?</h4>
            <ul class="topic-list">
                <li>✅ <strong>Save Time:</strong> Avoid common mistakes and streamline the process</li>
                <li>✅ <strong>Increase Success:</strong> Higher admission and visa approval rates</li>
                <li>✅ <strong>Personalized Strategy:</strong> Tailored to your specific profile</li>
                <li>✅ <strong>Stress Reduction:</strong> Expert guidance at every step</li>
                <li>✅ <strong>Cost-Effective:</strong> Avoid expensive application mistakes</li>
            </ul>
        </div>
    `;
}

// Helper functions for content generation
function getTuitionEstimate(country, level) {
    const estimates = {
        'Australia': {
            'Diploma': 'AUD $15,000 - $25,000/year',
            'Bachelor\'s': 'AUD $20,000 - $35,000/year',
            'Master\'s': 'AUD $22,000 - $40,000/year',
            'PhD': 'AUD $20,000 - $35,000/year'
        },
        'Canada': {
            'Diploma': 'CAD $12,000 - $22,000/year',
            'Bachelor\'s': 'CAD $18,000 - $30,000/year',
            'Master\'s': 'CAD $20,000 - $35,000/year',
            'PhD': 'CAD $8,000 - $20,000/year'
        }
    };
    
    return estimates[country]?.[level] || 'Varies by institution - check university websites';
}

function getLivingEstimate(country) {
    const estimates = {
        'Australia': 'AUD $20,000 - $25,000/year',
        'Canada': 'CAD $15,000 - $20,000/year',
        'UK': '£12,000 - £15,000/year',
        'USA': '$15,000 - $25,000/year',
        'New Zealand': 'NZD $15,000 - $20,000/year'
    };
    
    return estimates[country] || 'Varies by city - typically $15,000-$25,000/year';
}

function getInsuranceEstimate(country) {
    const estimates = {
        'Australia': 'AUD $3,000/year',
        'Canada': 'CAD $600 - $1,200/year',
        'UK': '£470/year (IHS surcharge)',
        'USA': '$1,500 - $2,500/year',
        'New Zealand': 'NZD $500 - $1,000/year'
    };
    
    return estimates[country] || 'Typically $1,000-$3,000/year';
}

function getMiscEstimate(country) {
    return 'Books, supplies, transportation: $2,000 - $4,000/year';
}

function getTotalEstimate(country, level) {
    // Simplified total calculation
    return 'Approximately 10-15% higher than the sum of individual estimates';
}

function getFundingAdvice(funding) {
    switch(funding) {
        case 'Family Sponsor':
            return 'You will need to provide bank statements showing sufficient funds, proof of relationship with sponsor, and evidence of stable income. Most countries require funds to be in the account for 3-6 months before application.';
        case 'Education Loan':
            return 'Obtain a loan sanction letter from a recognized bank. Ensure the loan covers tuition and living expenses. Some countries require proof of loan disbursement. Check if your chosen country accepts education loans for visa purposes.';
        case 'Combination':
            return 'Clearly document each funding source. Provide bank statements for personal funds, loan sanction letter, and sponsor documents if applicable. Ensure the total from all sources meets or exceeds the required amount.';
        default:
            return 'Start exploring funding options immediately. Consider: education loans from banks, government scholarships, university scholarships, and part-time work options (check work rights in your chosen country).';
    }
}

function getScholarshipOpportunities(academic, level) {
    let opportunities = '';
    
    if (academic === 'Strong') {
        opportunities = `
            <li><strong>Merit Scholarships:</strong> Full or partial tuition waivers from universities</li>
            <li><strong>Government Scholarships:</strong> Country-specific programs (e.g., Chevening, Fulbright)</li>
            <li><strong>Research Scholarships:</strong> For Master's and PhD students with research proposals</li>
            <li><strong>Teaching Assistantships:</strong> Stipend + tuition waiver for qualified students</li>
        `;
    } else if (academic === 'Good') {
        opportunities = `
            <li><strong>Partial Scholarships:</strong> 25-75% tuition reduction from universities</li>
            <li><strong>Departmental Scholarships:</strong> Awards based on specific academic strengths</li>
            <li><strong>Early Bird Discounts:</strong> Apply early for tuition reductions</li>
            <li><strong>External Scholarships:</strong> Private organizations and foundations</li>
        `;
    } else {
        opportunities = `
            <li><strong>University Bursaries:</strong> Need-based financial assistance</li>
            <li><strong>Country Scholarships:</strong> Programs targeting specific nationalities</li>
            <li><strong>Field-Specific Awards:</strong> Scholarships for particular study areas</li>
            <li><strong>Minority Scholarships:</strong> Awards for underrepresented groups</li>
        `;
    }
    
    return opportunities;
}

function getVisaProcessingTime(country) {
    const times = {
        'Australia': '4-12 weeks (standard processing)',
        'Canada': '8-16 weeks (Study Permit), 4-8 weeks (SDS stream)',
        'UK': '3-6 weeks (standard), 5 working days (priority)',
        'USA': '3-5 months (includes interview scheduling)',
        'New Zealand': '4-8 weeks (standard processing)'
    };
    
    return times[country] || 'Varies - check official immigration website';
}

function getEnglishStatusMessage(status) {
    switch(status) {
        case 'Completed':
            return 'Great! You have completed your English test. Make sure your scores meet the requirements of your target universities.';
        case 'Booked':
            return 'You have booked your test. Stick to your preparation schedule and consider taking practice tests.';
        default:
            return 'You need to start English test preparation immediately. Most students require 2-4 months of preparation.';
    }
}

function getEnglishActionItems(status) {
    switch(status) {
        case 'Completed':
            return `
                <li>Check if your scores meet university requirements</li>
                <li>Consider retaking if scores are borderline</li>
                <li>Ensure test validity covers application and visa periods</li>
                <li>Keep original test report safe</li>
            `;
        case 'Booked':
            return `
                <li>Follow a structured study plan</li>
                <li>Take regular practice tests</li>
                <li>Focus on weakest sections</li>
                <li>Consider professional coaching if needed</li>
            `;
        default:
            return `
                <li>Take a diagnostic test to assess current level</li>
                <li>Create a 3-4 month study plan</li>
                <li>Book test dates for 2-3 months from now</li>
                <li>Consider group classes or online courses</li>
            `;
    }
}

function getIELTSRequirement(level) {
    const requirements = {
        'Diploma': 'Overall 5.5 - 6.0 (no band less than 5.0)',
        'Bachelor\'s': 'Overall 6.0 - 6.5 (no band less than 5.5)',
        'Master\'s': 'Overall 6.5 - 7.0 (no band less than 6.0)',
        'PhD': 'Overall 7.0 - 7.5 (no band less than 6.5)'
    };
    
    return requirements[level] || 'Overall 6.0 - 6.5';
}

function getPTERequirement(level) {
    const requirements = {
        'Diploma': '46 - 50 overall',
        'Bachelor\'s': '50 - 58 overall',
        'Master\'s': '58 - 65 overall',
        'PhD': '65 - 73 overall'
    };
    
    return requirements[level] || '50 - 58 overall';
}

function getTOEFLRequirement(level) {
    const requirements = {
        'Diploma': '60 - 78 iBT',
        'Bachelor\'s': '78 - 90 iBT',
        'Master\'s': '90 - 100 iBT',
        'PhD': '100 - 110 iBT'
    };
    
    return requirements[level] || '78 - 90 iBT';
}

function getDuolingoRequirement(level) {
    const requirements = {
        'Diploma': '85 - 95',
        'Bachelor\'s': '95 - 105',
        'Master\'s': '105 - 115',
        'PhD': '115 - 125'
    };
    
    return requirements[level] || '95 - 105';
}

function getIntakePeriods(country) {
    const intakes = {
        'Australia': 'February (Main), July (Mid-year), November (Limited)',
        'Canada': 'September (Fall - Main), January (Winter), May (Spring/Summer)',
        'UK': 'September/October (Main), January (Winter - Limited)',
        'USA': 'August/September (Fall), January (Spring - Limited)',
        'New Zealand': 'February (Main), July (Mid-year)'
    };
    
    return intakes[country] || 'Varies - check specific university websites';
}

function getTimelineSteps(englishStatus) {
    let steps = `
        <li><strong>Now:</strong> Research universities and programs</li>
        <li><strong>+1 month:</strong> Contact professors (for research programs)</li>
        <li><strong>+2 months:</strong> Prepare application documents</li>
        <li><strong>+3 months:</strong> Submit applications</li>
        <li><strong>+4 months:</strong> Receive offers and decide</li>
        <li><strong>+5 months:</strong> Apply for visa</li>
        <li><strong>+6 months:</strong> Make travel arrangements</li>
        <li><strong>+7 months:</strong> Depart for studies</li>
    `;
    
    if (englishStatus === 'Not Started') {
        steps = `
            <li><strong>Immediate:</strong> Start English test preparation</li>
            <li><strong>+2 months:</strong> Take English test</li>
            ${steps}
        `;
    } else if (englishStatus === 'Booked') {
        steps = `
            <li><strong>Ongoing:</strong> English test preparation</li>
            <li><strong>+1 month:</strong> Take English test</li>
            ${steps}
        `;
    }
    
    return steps;
}

function getTopicName(topicId) {
    const names = {
        'financial': 'Financial Requirements',
        'scholarships': 'Scholarships',
        'visa': 'Visa Expectations',
        'english': 'English Test Help',
        'timeline': 'Timeline Planning',
        'counselor': 'Counselor Connection'
    };
    
    return names[topicId] || 'Topic';
}

// Utility Functions
function saveAnswer(field, value, nextFunction) {
    userProfile[field] = value;
    addMessage('user', value);
    
    setTimeout(nextFunction, 400);
}

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-content">${formatMessage(text)}</div>
        <div class="message-time">${time}</div>
    `;

    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function formatMessage(text) {
    return text.replace(/\n/g, '<br>');
}

function showTopicButtons(buttons) {
    // Clear existing buttons
    topicButtons.innerHTML = '';
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `topic-btn ${btn.primary ? 'active' : ''}`;
        button.innerHTML = `
            <span class="topic-icon">${btn.icon}</span>
            <span class="topic-text">${btn.text}</span>
        `;
        button.onclick = btn.action;
        topicButtons.appendChild(button);
    });
}

function showTopicNavButtons(buttons) {
    topicButtons.innerHTML = '';
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'topic-btn';
        button.dataset.topic = btn.id;
        button.innerHTML = `
            <span class="topic-icon">${btn.icon}</span>
            <span class="topic-text">${btn.text}</span>
        `;
        button.onclick = btn.action;
        topicButtons.appendChild(button);
    });
}

function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
}

function updateStatus(text) {
    statusText.textContent = text;
}

// Navigation Functions
function backToTopics() {
    topicContent.classList.remove('active');
    topicNavBar.classList.remove('collapsed');
    topicToggleIcon.className = 'fas fa-chevron-down';
    isTopicBarCollapsed = false;
    currentTopic = null;
    updateStatus('Choose a topic');
}

function toggleTopicBar() {
    if (currentTopic) {
        // If viewing a topic, go back to topics
        backToTopics();
    } else {
        // Toggle collapse state
        isTopicBarCollapsed = !isTopicBarCollapsed;
        topicNavBar.classList.toggle('collapsed');
        topicToggleIcon.className = isTopicBarCollapsed ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
    }
}

// Counselor Functions
function connectViaWhatsApp() {
    const phone = '+12345678900';
    const profileSummary = `Country: ${userProfile.targetCountry || 'Not selected'}\nLevel: ${userProfile.intendedLevel || 'Not selected'}\nAcademic: ${userProfile.academicPerformance || 'Not selected'}\nGap: ${userProfile.studyGap || 'Not selected'}\nEnglish: ${userProfile.englishTestStatus || 'Not selected'}\nFunding: ${userProfile.fundingPlan || 'Not selected'}`;
    
    const message = `Hello! I need study abroad consultation. Here's my profile:\n\n${profileSummary}\n\nPlease connect me with a counselor.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    
    addMessage('user', 'Requested WhatsApp consultation');
    setTimeout(() => {
        addMessage('bot', '✅ **Connecting you with a counselor...**\n\nA counselor will contact you within 15 minutes.');
    }, 500);
}

function scheduleVideoCall() {
    addMessage('user', 'Requested video call booking');
    
    setTimeout(() => {
        addMessage('bot', '📅 **Video Call Booking**\n\nOur booking system is opening in a new window. You can choose a convenient time for your free consultation.');
        
        // Simulate opening booking system
        setTimeout(() => {
            window.open('#', '_blank');
        }, 1000);
    }, 500);
}

// Modal Functions
function showProfileSummary() {
    updateProfileDisplay();
    profileModal.style.display = 'flex';
}

function closeModal() {
    profileModal.style.display = 'none';
}

function updateProfileDisplay() {
    const fields = [
        { id: 'profileCountry', value: userProfile.targetCountry },
        { id: 'profileLevel', value: userProfile.intendedLevel },
        { id: 'profileAcademic', value: userProfile.academicPerformance },
        { id: 'profileGap', value: userProfile.studyGap },
        { id: 'profileEnglish', value: userProfile.englishTestStatus },
        { id: 'profileFunding', value: userProfile.fundingPlan }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            const valueElement = element.querySelector('.value');
            valueElement.textContent = field.value || 'Not selected';
        }
    });
}

function editProfile() {
    closeModal();
    userProfile.completed = false;
    startProfileSetup();
}

function resetChat() {
    if (confirm('Start a new conversation? Your current profile and messages will be reset.')) {
        userProfile = {
            targetCountry: '',
            intendedLevel: '',
            academicPerformance: '',
            studyGap: '',
            englishTestStatus: '',
            fundingPlan: '',
            completed: false,
            lastUpdated: null
        };
        
        localStorage.removeItem('studyAbroadProfile');
        chatArea.innerHTML = '';
        topicButtons.innerHTML = '';
        topicContent.innerHTML = '';
        topicContent.classList.remove('active');
        topicNavBar.classList.remove('collapsed');
        showWelcomePhase();
    }
}
