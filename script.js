// Enhanced User profile storage
let userProfile = {
    targetCountry: '',
    intendedLevel: '',
    academicPerformance: '',
    studyGap: '',
    englishTestStatus: '',
    fundingPlan: '',
    completed: false,
    lastUpdated: null,
    conversationId: generateConversationId()
};

// Application State
let currentPhase = 'welcome';
let soundEnabled = true;
let muteEnabled = false;
let conversationHistory = [];
let messageCount = 0;
let sessionStartTime = null;
let sessionTimer = null;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const chatContainer = document.getElementById('chatContainer');
const chatArea = document.getElementById('chatArea');
const actionButtons = document.getElementById('actionButtons');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const profileCount = document.getElementById('profileCount');
const statusText = document.getElementById('statusText');
const sessionTimerElement = document.getElementById('sessionTimer');
const messageCountElement = document.getElementById('messageCount');
const completionFill = document.getElementById('completionFill');
const completionText = document.getElementById('completionText');
const profileModal = document.getElementById('profileModal');
const helpModal = document.getElementById('helpModal');
const quickNavModal = document.getElementById('quickNavModal');
const notificationSound = document.getElementById('notificationSound');
const clickSound = document.getElementById('clickSound');
const muteBtn = document.getElementById('muteBtn');

// Utility Functions
function generateConversationId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function updateCompletion() {
    const fields = ['targetCountry', 'intendedLevel', 'academicPerformance', 'studyGap', 'englishTestStatus', 'fundingPlan'];
    const completedFields = fields.filter(field => userProfile[field] && userProfile[field].trim() !== '').length;
    const percentage = Math.round((completedFields / fields.length) * 100);
    
    completionFill.style.width = `${percentage}%`;
    completionText.textContent = `${percentage}% Complete`;
    profileCount.textContent = `Profile: ${completedFields}/6`;
    
    return percentage;
}

function updateMessageCount() {
    messageCount++;
    messageCountElement.textContent = `Messages: ${messageCount}`;
}

function startSessionTimer() {
    sessionStartTime = Date.now();
    
    if (sessionTimer) clearInterval(sessionTimer);
    
    sessionTimer = setInterval(() => {
        const elapsed = Date.now() - sessionStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        sessionTimerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load previous conversation if exists
    const savedProfile = localStorage.getItem('studyAbroadProfile');
    if (savedProfile) {
        try {
            userProfile = JSON.parse(savedProfile);
            userProfile.conversationId = generateConversationId(); // New ID for new session
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
    
    // Auto-start chat for returning users
    if (userProfile.completed) {
        setTimeout(() => {
            startChat();
            startSessionTimer();
        }, 800);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

// Keyboard Shortcuts
function handleKeyboardShortcuts(event) {
    // Escape key closes modals
    if (event.key === 'Escape') {
        closeModal();
        closeHelp();
        closeQuickNav();
    }
    
    // Number keys for quick selection (1-9)
    if (event.key >= '1' && event.key <= '9' && !event.ctrlKey && !event.metaKey) {
        const index = parseInt(event.key) - 1;
        const buttons = actionButtons.querySelectorAll('.action-btn');
        if (buttons[index]) {
            buttons[index].click();
            event.preventDefault();
        }
    }
    
    // Space bar to quickly advance
    if (event.key === ' ' && currentPhase.includes('Selection')) {
        const primaryBtn = actionButtons.querySelector('.action-btn.primary');
        if (primaryBtn) {
            primaryBtn.click();
            event.preventDefault();
        }
    }
}

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
    
    startSessionTimer();
}

// Phase 1: Welcome
function showWelcomePhase() {
    updateProgress(0, 'Starting conversation...');
    updateStatus('Getting to know you');
    currentPhase = 'welcome';

    setTimeout(() => {
        addMessage('bot', `🎓 **Welcome to Your Study Abroad Assistant!**\n\nI'm here to guide you through everything you need to know about studying abroad.\n\n✨ **Here's what we'll do:**\n1. Answer 6 quick questions about your plans\n2. Get personalized advice based on your profile\n3. Explore topics that matter to you\n\n⏱ **Takes just 2-3 minutes**\n\nReady to begin?`);

        showActionButtons([
            { text: '🚀 Start Profile Setup', action: () => startProfileSetup(), type: 'primary', icon: 'fas fa-rocket' },
            { text: '🔍 Browse Topics First', action: () => showTopicSelection(), icon: 'fas fa-search' },
            { text: '📚 View Sample Advice', action: () => showSampleAdvice(), icon: 'fas fa-eye' }
        ]);
    }, 500);
}

function showSampleAdvice() {
    addMessage('bot', `📋 **Sample Personalized Advice**\n\nHere's what you'll get after completing your profile:\n\n**For a Master's in Canada with Good academics:**\n• Estimated tuition: CAD $20,000-$35,000/year\n• Living costs: CAD $15,000-$20,000/year\n• Scholarship opportunities available\n• Visa processing: 8-12 weeks\n\n**Ready to get your personalized advice?**`);
    
    showActionButtons([
        { text: '✅ Start My Profile', action: () => startProfileSetup(), type: 'primary', icon: 'fas fa-user-check' },
        { text: '🔙 Back to Welcome', action: () => showWelcomePhase(), icon: 'fas fa-arrow-left' }
    ]);
}

function startProfileSetup() {
    updateProgress(10, 'Step 1 of 6: Country Selection');
    updateStatus('Select your target country');
    currentPhase = 'country';
    showCountrySelection();
}

// Enhanced Profile Collection Functions
function showCountrySelection() {
    addMessage('bot', '🌍 **First, which country are you planning to study in?**\n\n*Select the country where you plan to pursue your education. This helps tailor visa, financial, and timeline information specifically for that destination.*');

    showActionButtons([
        { text: '🇦🇺 Australia', action: () => saveAnswer('targetCountry', 'Australia', showLevelSelection), icon: 'fas fa-sun' },
        { text: '🇨🇦 Canada', action: () => saveAnswer('targetCountry', 'Canada', showLevelSelection), icon: 'fas fa-maple-leaf' },
        { text: '🇬🇧 United Kingdom', action: () => saveAnswer('targetCountry', 'UK', showLevelSelection), icon: 'fas fa-landmark' },
        { text: '🇺🇸 United States', action: () => saveAnswer('targetCountry', 'USA', showLevelSelection), icon: 'fas fa-flag-usa' },
        { text: '🇳🇿 New Zealand', action: () => saveAnswer('targetCountry', 'New Zealand', showLevelSelection), icon: 'fas fa-mountain' },
        { text: '🤔 Not Sure Yet', action: () => saveAnswer('targetCountry', 'Not Sure', showLevelSelection), icon: 'fas fa-question' }
    ]);
}

function showLevelSelection() {
    updateProgress(25, 'Step 2 of 6: Study Level');
    updateStatus('Select your study level');
    currentPhase = 'level';

    addMessage('bot', '🎓 **What level of study are you planning?**\n\n*This helps determine admission requirements, duration, and appropriate scholarship opportunities.*');

    showActionButtons([
        { text: 'Diploma / Certificate', action: () => saveAnswer('intendedLevel', 'Diploma', showAcademicPerformance), icon: 'fas fa-certificate' },
        { text: 'Bachelor\'s Degree', action: () => saveAnswer('intendedLevel', 'Bachelor\'s', showAcademicPerformance), icon: 'fas fa-user-graduate' },
        { text: 'Master\'s Degree', action: () => saveAnswer('intendedLevel', 'Master\'s', showAcademicPerformance), icon: 'fas fa-graduation-cap' },
        { text: 'PhD / Doctorate', action: () => saveAnswer('intendedLevel', 'PhD', showAcademicPerformance), icon: 'fas fa-user-graduate' }
    ]);
}

function showAcademicPerformance() {
    updateProgress(40, 'Step 3 of 6: Academic Performance');
    updateStatus('Describe your academic results');
    currentPhase = 'academic';

    addMessage('bot', '📊 **How would you describe your academic performance?**\n\n*This helps identify suitable universities and scholarship opportunities.*');

    showActionButtons([
        { text: 'Below Average', action: () => saveAnswer('academicPerformance', 'Below Average', showStudyGap), icon: 'fas fa-chart-line-down' },
        { text: 'Average', action: () => saveAnswer('academicPerformance', 'Average', showStudyGap), icon: 'fas fa-chart-line' },
        { text: 'Good', action: () => saveAnswer('academicPerformance', 'Good', showStudyGap), icon: 'fas fa-chart-line-up' },
        { text: 'Strong / Excellent', action: () => saveAnswer('academicPerformance', 'Strong', showStudyGap), icon: 'fas fa-star' }
    ]);
}

function showStudyGap() {
    updateProgress(55, 'Step 4 of 6: Study Gap');
    updateStatus('Any gap after last study?');
    currentPhase = 'gap';

    addMessage('bot', '⏳ **Have you had any gap after your last study?**\n\n*This information is important for visa applications and university admissions.*');

    showActionButtons([
        { text: 'No Gap (Continued directly)', action: () => saveAnswer('studyGap', 'No Gap', showEnglishTestStatus), icon: 'fas fa-check-circle' },
        { text: '1 Year Gap', action: () => saveAnswer('studyGap', '1 Year', showEnglishTestStatus), icon: 'fas fa-calendar' },
        { text: '2-3 Years Gap', action: () => saveAnswer('studyGap', '2-3 Years', showEnglishTestStatus), icon: 'fas fa-calendar-alt' },
        { text: 'More than 3 Years Gap', action: () => saveAnswer('studyGap', 'More than 3 Years', showEnglishTestStatus), icon: 'fas fa-calendar-times' }
    ]);
}

function showEnglishTestStatus() {
    updateProgress(70, 'Step 5 of 6: English Test Status');
    updateStatus('English test status');
    currentPhase = 'english';

    addMessage('bot', '🗣️ **What is your English test situation?**\n\n*English proficiency requirements vary by university and country.*');

    showActionButtons([
        { text: 'IELTS/PTE Completed', action: () => saveAnswer('englishTestStatus', 'Completed', showFundingPlan), icon: 'fas fa-check-double' },
        { text: 'Test Booked / Planning', action: () => saveAnswer('englishTestStatus', 'Booked', showFundingPlan), icon: 'fas fa-calendar-check' },
        { text: 'Not Started Yet', action: () => saveAnswer('englishTestStatus', 'Not Started', showFundingPlan), icon: 'fas fa-clock' }
    ]);
}

function showFundingPlan() {
    updateProgress(85, 'Step 6 of 6: Funding Plan');
    updateStatus('How will you fund studies?');
    currentPhase = 'funding';

    addMessage('bot', '💰 **How do you plan to fund your studies?**\n\n*Financial planning is crucial for both admission and visa processes.*');

    showActionButtons([
        { text: 'Parents / Family Sponsor', action: () => saveAnswer('fundingPlan', 'Family Sponsor', showProfileConfirmation), icon: 'fas fa-users' },
        { text: 'Education Loan', action: () => saveAnswer('fundingPlan', 'Education Loan', showProfileConfirmation), icon: 'fas fa-university' },
        { text: 'Combination of Sources', action: () => saveAnswer('fundingPlan', 'Combination', showProfileConfirmation), icon: 'fas fa-balance-scale' },
        { text: 'Not Sure / Exploring Options', action: () => saveAnswer('fundingPlan', 'Exploring', showProfileConfirmation), icon: 'fas fa-question-circle' }
    ]);
}

function showProfileConfirmation() {
    userProfile.completed = true;
    userProfile.lastUpdated = new Date().toISOString();
    updateProgress(100, 'Profile Complete!');
    updateStatus('Ready to explore topics');
    currentPhase = 'confirmation';

    localStorage.setItem('studyAbroadProfile', JSON.stringify(userProfile));

    addMessage('bot', `🎉 **Profile Successfully Saved!**\n\n✅ **Your Profile Summary:**\n• **Country:** ${userProfile.targetCountry}\n• **Study Level:** ${userProfile.intendedLevel}\n• **Academic:** ${userProfile.academicPerformance}\n• **Study Gap:** ${userProfile.studyGap}\n• **English Test:** ${userProfile.englishTestStatus}\n• **Funding:** ${userProfile.fundingPlan}\n\n✨ **With this profile, I can now provide you with personalized advice tailored specifically to your situation.**\n\nWhat would you like to explore first?`);

    updateProfileDisplay();
    updateCompletion();

    setTimeout(() => {
        showTopicSelection();
    }, 1200);
}

// Enhanced Topic Selection
function showTopicSelection() {
    updateProgress(100, 'Ready to help!');
    updateStatus('Choose a topic');
    currentPhase = 'topics';

    addMessage('bot', '📚 **What would you like to understand better?**\n\n*Choose any topic to get personalized guidance based on your profile.*');

    showActionButtons([
        { text: '💰 Financial Requirements', action: () => showFinancialRequirements(), type: 'primary', icon: 'fas fa-money-check-alt' },
        { text: '🎓 Scholarships & Funding', action: () => showScholarships(), icon: 'fas fa-award' },
        { text: '📄 Visa & Documentation', action: () => showVisaExpectations(), icon: 'fas fa-file-contract' },
        { text: '🗣️ English Test Guidance', action: () => showEnglishGuidance(), icon: 'fas fa-language' },
        { text: '📅 Timeline Planning', action: () => showIntakeTimelines(), icon: 'fas fa-calendar-day' },
        { text: '🤝 Talk to Counselor', action: () => showCounselorConnection(), icon: 'fas fa-headset' },
        { text: '📊 Compare Countries', action: () => showCountryComparison(), icon: 'fas fa-globe-americas' }
    ]);
}

// Enhanced Topic Response Functions
function showFinancialRequirements() {
    updateStatus('Financial Guidance');
    currentPhase = 'financial';

    const country = userProfile.targetCountry || 'your chosen country';
    const level = userProfile.intendedLevel || 'your study level';
    const funding = userProfile.fundingPlan || 'your funding plan';

    let message = `💰 **Financial Requirements for ${country}**\n\n`;
    message += `For ${level} studies in ${country}, here's what you need to know:\n\n`;
    
    // Country-specific financial estimates
    const estimates = getFinancialEstimates(country, level);
    message += `📈 **Estimated Costs (1st Year):**\n`;
    message += `• Tuition Fees: ${estimates.tuition}\n`;
    message += `• Living Expenses: ${estimates.living}\n`;
    message += `• Health Insurance: ${estimates.insurance}\n`;
    message += `• **Total Required: ${estimates.total}**\n\n`;
    
    // Funding-specific advice
    message += `💡 **For your ${funding} plan:**\n`;
    message += getFundingAdvice(funding);
    
    message += `\n⚡ **Pro Tips:**\n`;
    message += `• Start financial documentation early\n`;
    message += `• Keep funds in account for at least 3 months\n`;
    message += `• Consider currency exchange rates\n`;

    addMessage('bot', message);

    showActionButtons([
        { text: '🎓 Scholarship Options', action: () => showScholarships(), icon: 'fas fa-award' },
        { text: '📄 Visa Documentation', action: () => showVisaExpectations(), icon: 'fas fa-file-alt' },
        { text: '📅 Timeline Planning', action: () => showIntakeTimelines(), icon: 'fas fa-calendar' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function getFinancialEstimates(country, level) {
    const estimates = {
        'Australia': {
            'Diploma': { tuition: 'AUD $15,000-$25,000', living: 'AUD $20,000', insurance: 'AUD $3,000', total: 'AUD $38,000-$48,000' },
            'Bachelor\'s': { tuition: 'AUD $20,000-$35,000', living: 'AUD $22,000', insurance: 'AUD $3,500', total: 'AUD $45,500-$60,500' },
            'Master\'s': { tuition: 'AUD $22,000-$40,000', living: 'AUD $22,000', insurance: 'AUD $3,500', total: 'AUD $47,500-$65,500' },
            'PhD': { tuition: 'AUD $20,000-$35,000', living: 'AUD $22,000', insurance: 'AUD $3,500', total: 'AUD $45,500-$60,500' }
        },
        'Canada': {
            'Diploma': { tuition: 'CAD $12,000-$22,000', living: 'CAD $15,000', insurance: 'CAD $1,000', total: 'CAD $28,000-$38,000' },
            'Bachelor\'s': { tuition: 'CAD $18,000-$30,000', living: 'CAD $16,000', insurance: 'CAD $1,200', total: 'CAD $35,200-$47,200' },
            'Master\'s': { tuition: 'CAD $20,000-$35,000', living: 'CAD $16,000', insurance: 'CAD $1,200', total: 'CAD $37,200-$52,200' },
            'PhD': { tuition: 'CAD $8,000-$20,000', living: 'CAD $16,000', insurance: 'CAD $1,200', total: 'CAD $25,200-$37,200' }
        }
    };
    
    return estimates[country]?.[level] || estimates['Canada']['Master\'s'];
}

function getFundingAdvice(funding) {
    switch(funding) {
        case 'Family Sponsor':
            return `• Prepare sponsor's financial documents\n• Show stable income history (6-12 months)\n• Provide relationship proof documents\n`;
        case 'Education Loan':
            return `• Get loan sanction letter early\n• Show repayment capability\n• Understand disbursement process\n`;
        case 'Combination':
            return `• Document each source clearly\n• Show total meets requirements\n• Ensure consistency across documents\n`;
        default:
            return `• Start exploring options now\n• Consider scholarships and loans\n• Plan for at least 3 months preparation\n`;
    }
}

function showScholarships() {
    updateStatus('Scholarship Information');
    currentPhase = 'scholarships';

    const academic = userProfile.academicPerformance || 'your academic level';
    const country = userProfile.targetCountry || 'selected country';

    let message = `🎓 **Scholarship Opportunities**\n\n`;
    message += `Based on your ${academic} academic profile for ${country}:\n\n`;
    
    // Academic-based opportunities
    if (academic === 'Strong') {
        message += `🏆 **You're highly competitive for:**\n`;
        message += `• University merit scholarships (up to 100% tuition)\n`;
        message += `• Government-funded scholarships\n`;
        message += `• Research assistantships (for Master's/PhD)\n`;
    } else if (academic === 'Good') {
        message += `🌟 **Good opportunities available:**\n`;
        message += `• Partial tuition waivers (25-75%)\n`;
        message += `• Department-specific scholarships\n`;
        message += `• Early bird application discounts\n`;
    } else {
        message += `📚 **Still options to explore:**\n`;
        message += `• University bursaries and grants\n`;
        message += `• Country-specific scholarships\n`;
        message += `• External funding organizations\n`;
    }
    
    message += `\n📅 **Application Timeline:**\n`;
    message += `• Research: Now - 12 months before\n`;
    message += `• Applications: 6-9 months before intake\n`;
    message += `• Results: 3-6 months before intake\n`;
    
    message += `\n💡 **Key Tips:**\n`;
    message += `• Apply to multiple scholarships\n`;
    message += `• Tailor each application\n`;
    message += `• Highlight unique achievements\n`;

    addMessage('bot', message);

    showActionButtons([
        { text: '💰 Financial Planning', action: () => showFinancialRequirements(), icon: 'fas fa-calculator' },
        { text: '📅 Application Timeline', action: () => showIntakeTimelines(), icon: 'fas fa-calendar' },
        { text: '🌍 Compare Countries', action: () => showCountryComparison(), icon: 'fas fa-globe' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function showVisaExpectations() {
    updateStatus('Visa Guidance');
    currentPhase = 'visa';

    const country = userProfile.targetCountry || 'selected country';
    const gap = userProfile.studyGap || 'No Gap';
    const funding = userProfile.fundingPlan || 'funding plan';

    let message = `📄 **Visa Requirements for ${country}**\n\n`;
    message += `Key documents and requirements:\n\n`;
    
    message += `📋 **Essential Documents:**\n`;
    message += `1. Valid passport (6+ months validity)\n`;
    message += `2. University offer letter (unconditional)\n`;
    message += `3. Proof of financial capability\n`;
    message += `4. English proficiency test results\n`;
    message += `5. Academic transcripts & certificates\n`;
    message += `6. Genuine Temporary Entrant (GTE) statement\n`;
    message += `7. Health insurance proof\n`;
    message += `8. Police clearance certificate\n\n`;
    
    if (gap !== 'No Gap') {
        message += `⚠️ **Important for ${gap} study gap:**\n`;
        message += `• Provide detailed gap explanation\n`;
        message += `• Show relevant activities/certifications\n`;
        message += `• Connect gap to future study plans\n\n`;
    }
    
    message += `⏱️ **Processing Times:**\n`;
    message += `• ${getVisaProcessingTime(country)}\n\n`;
    
    message += `✅ **Success Tips:**\n`;
    message += `• Apply 3-4 months before course start\n`;
    message += `• Ensure all documents are consistent\n`;
    message += `• Prepare for potential interview\n`;

    addMessage('bot', message);

    showActionButtons([
        { text: '🗣️ English Test Help', action: () => showEnglishGuidance(), icon: 'fas fa-language' },
        { text: '💰 Financial Proof', action: () => showFinancialRequirements(), icon: 'fas fa-file-invoice-dollar' },
        { text: '🤝 Counselor Support', action: () => showCounselorConnection(), icon: 'fas fa-headset' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function getVisaProcessingTime(country) {
    const times = {
        'Australia': '4-12 weeks (standard), 2-4 weeks (priority)',
        'Canada': '8-16 weeks (study permit), 4-8 weeks (SDS)',
        'UK': '3-6 weeks (standard), 5 days (priority)',
        'USA': '3-5 months (F-1 visa), includes interview',
        'New Zealand': '4-8 weeks (standard processing)'
    };
    return times[country] || 'Varies - check official immigration website';
}

function showEnglishGuidance() {
    updateStatus('English Test Help');
    currentPhase = 'english_guidance';

    const status = userProfile.englishTestStatus || 'Not Started';
    const level = userProfile.intendedLevel || 'your study level';

    let message = `🗣️ **English Test Guidance**\n\n`;
    
    // Status-specific advice
    message += getEnglishStatusAdvice(status);
    
    message += `\n📊 **Score Requirements for ${level}:**\n`;
    message += getEnglishScoreRequirements(level);
    
    message += `\n📅 **Test Planning:**\n`;
    message += `• Test preparation: 2-4 months\n`;
    message += `• Booking: 4-6 weeks in advance\n`;
    message += `• Results: 2-4 weeks after test\n`;
    message += `• Validity: 2 years for most tests\n\n`;
    
    message += `💡 **Preparation Tips:**\n`;
    message += `• Take practice tests regularly\n`;
    message += `• Focus on weakest sections\n`;
    message += `• Consider coaching if needed\n`;

    addMessage('bot', message);

    showActionButtons([
        { text: '📅 Timeline Planning', action: () => showIntakeTimelines(), icon: 'fas fa-calendar' },
        { text: '🎓 University Requirements', action: () => showScholarships(), icon: 'fas fa-university' },
        { text: '📚 Study Resources', action: () => showStudyResources(), icon: 'fas fa-book' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function getEnglishStatusAdvice(status) {
    switch(status) {
        case 'Completed':
            return `✅ **Great! You've completed your English test.**\n\nNext steps:\n• Ensure scores meet university requirements\n• Check if any universities require additional tests\n• Keep test results valid for visa application\n`;
        case 'Booked':
            return `📅 **Good planning! Test is booked/planned.**\n\nImportant:\n• Stick to your preparation schedule\n• Take mock tests to gauge readiness\n• Have backup test dates if needed\n`;
        default:
            return `⏰ **Start your English test preparation now!**\n\nWhy it's urgent:\n• Test dates fill up quickly\n• You might need multiple attempts\n• Scores affect university options\n`;
    }
}

function getEnglishScoreRequirements(level) {
    const requirements = {
        'Diploma': 'IELTS 5.5-6.0 / PTE 46-50 / TOEFL 60-78',
        'Bachelor\'s': 'IELTS 6.0-6.5 / PTE 50-58 / TOEFL 78-90',
        'Master\'s': 'IELTS 6.5-7.0 / PTE 58-65 / TOEFL 90-100',
        'PhD': 'IELTS 7.0-7.5 / PTE 65-73 / TOEFL 100-110'
    };
    return requirements[level] || 'IELTS 6.0-6.5 / PTE 50-58 / TOEFL 78-90';
}

function showIntakeTimelines() {
    updateStatus('Timeline Planning');
    currentPhase = 'timeline';

    const country = userProfile.targetCountry || 'selected country';
    const englishStatus = userProfile.englishTestStatus || 'Not Started';

    let message = `📅 **Intake Timeline for ${country}**\n\n`;
    
    message += `🎯 **Main Intake Periods:**\n`;
    message += getIntakePeriods(country);
    
    message += `\n⏰ **Recommended Timeline (for next available intake):**\n`;
    message += getRecommendedTimeline(englishStatus);
    
    message += `\n⚠️ **Critical Deadlines:**\n`;
    message += `• University applications: 4-6 months before intake\n`;
    message += `• Scholarship applications: 6-8 months before\n`;
    message += `• Visa application: 3-4 months before\n`;
    message += `• Travel arrangements: 1-2 months before\n`;

    addMessage('bot', message);

    showActionButtons([
        { text: '🤝 Get Expert Help', action: () => showCounselorConnection(), icon: 'fas fa-headset' },
        { text: '🗣️ English Test Plan', action: () => showEnglishGuidance(), icon: 'fas fa-language' },
        { text: '📋 Checklist', action: () => showChecklist(), icon: 'fas fa-tasks' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function getIntakePeriods(country) {
    const intakes = {
        'Australia': '• February (Main)\n• July (Mid-year)\n• November (Limited)',
        'Canada': '• September (Fall - Main)\n• January (Winter)\n• May (Spring/Summer)',
        'UK': '• September/October (Main)\n• January (Winter - Limited)',
        'USA': '• August/September (Fall)\n• January (Spring - Limited)',
        'New Zealand': '• February (Main)\n• July (Mid-year)'
    };
    return intakes[country] || 'Varies - check specific university websites';
}

function getRecommendedTimeline(englishStatus) {
    const baseTimeline = `• Now: Research & shortlist universities\n• +1 month: Contact universities & professors\n• +2 months: Prepare application documents\n• +3 months: Submit applications\n• +4 months: Receive offers & decide\n• +5 months: Apply for visa\n• +6 months: Make travel arrangements\n• +7 months: Depart for studies\n`;
    
    if (englishStatus === 'Not Started') {
        return `• **Immediate:** Start English test prep\n• +2 months: Take English test\n${baseTimeline}`;
    } else if (englishStatus === 'Booked') {
        return `• **Ongoing:** English test preparation\n• +1 month: Take English test\n${baseTimeline}`;
    } else {
        return baseTimeline;
    }
}

function showCountryComparison() {
    updateStatus('Country Comparison');
    
    addMessage('bot', `🌍 **Country Comparison Overview**\n\nHere's a quick comparison of popular study destinations:\n\n` +
        `🇦🇺 **Australia**\n• Tuition: AUD $20,000-$45,000/year\n• Living: AUD $20,000-$25,000/year\n• Work: 40 hrs/fortnight during studies\n• PR: Possible after graduation\n\n` +
        `🇨🇦 **Canada**\n• Tuition: CAD $15,000-$35,000/year\n• Living: CAD $15,000-$20,000/year\n• Work: 20 hrs/week during studies\n• PR: PGWP pathway available\n\n` +
        `🇬🇧 **UK**\n• Tuition: £10,000-£30,000/year\n• Living: £12,000-£15,000/year\n• Work: 20 hrs/week during term\n• PSW: 2 years after graduation\n\n` +
        `🇺🇸 **USA**\n• Tuition: $20,000-$50,000/year\n• Living: $15,000-$25,000/year\n• Work: On-campus only initially\n• OPT: 1-3 years after graduation\n`);
    
    showActionButtons([
        { text: '🇦🇺 Australia Details', action: () => showCountryDetails('Australia'), icon: 'fas fa-info-circle' },
        { text: '🇨🇦 Canada Details', action: () => showCountryDetails('Canada'), icon: 'fas fa-info-circle' },
        { text: '🇬🇧 UK Details', action: () => showCountryDetails('UK'), icon: 'fas fa-info-circle' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function showCountryDetails(country) {
    const details = {
        'Australia': `🇦🇺 **Study in Australia Details**\n\n` +
            `🎓 **Education Quality:**\n• World-class universities\n• Practical, industry-focused programs\n• Strong research opportunities\n\n` +
            `💰 **Costs:**\n• Tuition: AUD $20,000-$45,000/year\n• Living: AUD $20,000-$25,000/year\n• Health Insurance: AUD $3,000/year\n\n` +
            `💼 **Work Rights:**\n• 40 hours per fortnight during studies\n• Unlimited hours during holidays\n• Post-study work: 2-4 years\n\n` +
            `🛂 **Visa Process:**\n• Genuine Temporary Entrant requirement\n• Financial proof required\n• Health checks mandatory`,
        
        'Canada': `🇨🇦 **Study in Canada Details**\n\n` +
            `🎓 **Education Quality:**\n• Affordable quality education\n• Co-op programs available\n• Strong industry connections\n\n` +
            `💰 **Costs:**\n• Tuition: CAD $15,000-$35,000/year\n• Living: CAD $15,000-$20,000/year\n• Health Insurance: CAD $600-$1,200/year\n\n` +
            `💼 **Work Rights:**\n• 20 hours/week during studies\n• Full-time during breaks\n• PGWP: Up to 3 years after graduation\n\n` +
            `🛂 **Visa Process:**\n• Study Permit required\n• Proof of funds mandatory\n• May require biometrics`,
        
        'UK': `🇬🇧 **Study in UK Details**\n\n` +
            `🎓 **Education Quality:**\n• Historic universities\n• 1-year Master's programs\n• Strong research reputation\n\n` +
            `💰 **Costs:**\n• Tuition: £10,000-£30,000/year\n• Living: £12,000-£15,000/year\n• Health Surcharge: £470/year\n\n` +
            `💼 **Work Rights:**\n• 20 hours/week during term\n• Full-time during holidays\n• Graduate Route: 2 years work\n\n` +
            `🛂 **Visa Process:**\n• CAS required from university\n• Financial evidence needed\n• Healthcare surcharge payable`
    };
    
    addMessage('bot', details[country] || 'Country details not available.');
    
    showActionButtons([
        { text: '🏠 Back to Comparison', action: () => showCountryComparison(), icon: 'fas fa-arrow-left' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function showStudyResources() {
    addMessage('bot', `📚 **Study Resources & Preparation**\n\n` +
        `🌐 **Official Test Websites:**\n• IELTS: ielts.org\n• PTE: pearsonpte.com\n• TOEFL: ets.org/toefl\n\n` +
        `📖 **Preparation Platforms:**\n• British Council (free resources)\n• IDP Education (practice tests)\n• Magoosh (test preparation)\n\n` +
        `📱 **Mobile Apps:**\n• IELTS Prep App\n• PTE Practice Test\n• TOEFL Go! Official App\n\n` +
        `💡 **Study Tips:**\n• Practice daily (30-60 minutes)\n• Focus on weak areas\n• Take timed practice tests\n• Join study groups`);
    
    showActionButtons([
        { text: '🗣️ Back to English Guidance', action: () => showEnglishGuidance(), icon: 'fas fa-arrow-left' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function showChecklist() {
    addMessage('bot', `📋 **Study Abroad Preparation Checklist**\n\n` +
        `✅ **Phase 1: Research (3-6 months before)**\n• Research countries & universities\n• Check admission requirements\n• Explore scholarship options\n\n` +
        `✅ **Phase 2: Preparation (2-4 months before)**\n• Take English proficiency test\n• Prepare academic documents\n• Contact professors (if needed)\n\n` +
        `✅ **Phase 3: Application (1-3 months before)**\n• Submit university applications\n• Apply for scholarships\n• Prepare financial documents\n\n` +
        `✅ **Phase 4: Visa (2-3 months before)**\n• Accept university offer\n• Pay tuition deposit\n• Apply for student visa\n• Arrange accommodation\n\n` +
        `✅ **Phase 5: Pre-departure (1 month before)**\n• Book flights\n• Arrange insurance\n• Pack essentials\n• Attend pre-departure briefing`);
    
    showActionButtons([
        { text: '📅 Back to Timeline', action: () => showIntakeTimelines(), icon: 'fas fa-arrow-left' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function showCounselorConnection() {
    updateStatus('Counselor Connection');
    currentPhase = 'counselor';

    addMessage('bot', `🤝 **Free Expert Consultation Available!**\n\n` +
        `Our certified study abroad counselors can help you with:\n\n` +
        `✅ **University Selection:**\n• Best-fit universities based on your profile\n• Course & program recommendations\n• Application strategy\n\n` +
        `✅ **Application Support:**\n• SOP & LOR guidance\n• Document review & preparation\n• Application form assistance\n\n` +
        `✅ **Visa Assistance:**\n• Document checklist\n• Financial planning guidance\n• Mock visa interviews\n\n` +
        `✅ **Post-Admission:**\n• Accommodation assistance\n• Pre-departure briefing\n• Airport pickup arrangements\n\n` +
        `✨ **All services are completely free!**\n\n` +
        `Choose how you'd like to connect:`);

    showActionButtons([
        { text: '📱 WhatsApp Consultation', action: () => connectViaWhatsApp(), type: 'primary', icon: 'fab fa-whatsapp' },
        { text: '📞 Schedule Video Call', action: () => scheduleVideoCall(), icon: 'fas fa-video' },
        { text: '📧 Email Consultation', action: () => emailConsultation(), icon: 'fas fa-envelope' },
        { text: '📍 Visit Office', action: () => visitOffice(), icon: 'fas fa-map-marker-alt' },
        { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
    ]);
}

function connectViaWhatsApp() {
    const phone = '+12345678900';
    const profileSummary = `Country: ${userProfile.targetCountry || 'Not selected'}\nLevel: ${userProfile.intendedLevel || 'Not selected'}\nAcademic: ${userProfile.academicPerformance || 'Not selected'}\nGap: ${userProfile.studyGap || 'Not selected'}\nEnglish: ${userProfile.englishTestStatus || 'Not selected'}\nFunding: ${userProfile.fundingPlan || 'Not selected'}`;
    
    const message = `Hello! I need study abroad consultation. Here's my profile:\n\n${profileSummary}\n\nPlease connect me with a counselor.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    addMessage('user', 'Requested WhatsApp consultation');
    playSound('click');
    
    setTimeout(() => {
        addMessage('bot', `✅ **Connecting you with a counselor...**\n\n` +
            `• A counselor will contact you within 15 minutes\n` +
            `• Please keep your phone nearby\n` +
            `• Have your academic documents ready\n\n` +
            `In the meantime, you can continue exploring other topics.`);
        
        // Open WhatsApp in new tab
        window.open(url, '_blank');
        
        setTimeout(() => showTopicSelection(), 2000);
    }, 800);
}

function scheduleVideoCall() {
    addMessage('user', 'Requested video call booking');
    playSound('click');
    
    setTimeout(() => {
        addMessage('bot', `📅 **Video Call Booking**\n\n` +
            `Our booking system is opening in a new window.\n\n` +
            `You can choose:\n` +
            `• Date & time that works for you\n` +
            `• Counselor specialization\n` +
            `• Consultation duration (30/60 mins)\n\n` +
            `All video consultations are free!`);
        
        // Simulate booking system
        setTimeout(() => {
            window.open('#', '_blank');
            showTopicSelection();
        }, 1500);
    }, 500);
}

function emailConsultation() {
    const email = 'counselor@studyabroad.com';
    const subject = `Study Abroad Consultation - ${userProfile.targetCountry || 'General'} Inquiry`;
    const body = `Dear Counselor,\n\nI am interested in studying abroad and would like to schedule a consultation.\n\nMy Profile:\n- Target Country: ${userProfile.targetCountry || 'Not decided'}\n- Study Level: ${userProfile.intendedLevel || 'Not decided'}\n- Academic Performance: ${userProfile.academicPerformance || 'Not specified'}\n- Study Gap: ${userProfile.studyGap || 'None'}\n- English Test Status: ${userProfile.englishTestStatus || 'Not started'}\n- Funding Plan: ${userProfile.fundingPlan || 'Exploring options'}\n\nPlease contact me to schedule a consultation.\n\nBest regards,\n[Your Name]`;
    
    addMessage('user', 'Requested email consultation');
    playSound('click');
    
    setTimeout(() => {
        addMessage('bot', `📧 **Email Consultation**\n\n` +
            `You can email us at: **${email}**\n\n` +
            `Suggested subject: "${subject}"\n\n` +
            `A counselor will respond within 24 hours.\n\n` +
            `Would you like to copy the email template to your clipboard?`);
        
        showActionButtons([
            { text: '📋 Copy Email Template', action: () => copyToClipboard(body), type: 'primary', icon: 'fas fa-copy' },
            { text: '📤 Open Email Client', action: () => window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`), icon: 'fas fa-envelope' },
            { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
        ]);
    }, 500);
}

function visitOffice() {
    addMessage('user', 'Requested office visit information');
    playSound('click');
    
    setTimeout(() => {
        addMessage('bot', `📍 **Office Visit Information**\n\n` +
            `**Main Office:**\n` +
            `Study Abroad Consultants Ltd.\n` +
            `123 Education Street\n` +
            `Knowledge City, EC1A 1BB\n` +
            `United Kingdom\n\n` +
            `**Contact:**\n` +
            `📞 +44 20 7123 4567\n` +
            `📧 office@studyabroad.com\n` +
            `🌐 www.studyabroad-consultants.com\n\n` +
            `**Office Hours:**\n` +
            `Monday-Friday: 9:00 AM - 6:00 PM\n` +
            `Saturday: 10:00 AM - 4:00 PM\n` +
            `Sunday: Closed\n\n` +
            `**Before Visiting:**\n` +
            `• Please book an appointment\n` +
            `• Bring your academic documents\n` +
            `• Allow 1-2 hours for consultation`);
        
        showActionButtons([
            { text: '📅 Book Appointment', action: () => scheduleVideoCall(), icon: 'fas fa-calendar-check' },
            { text: '🗺️ Get Directions', action: () => window.open('https://maps.google.com'), icon: 'fas fa-directions' },
            { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
        ]);
    }, 500);
}

// Utility Functions
function saveAnswer(field, value, nextFunction) {
    userProfile[field] = value;
    addMessage('user', value);
    playSound('notification');
    updateCompletion();
    
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
    
    // Save to history
    conversationHistory.push({
        sender,
        text,
        time: new Date().toISOString(),
        phase: currentPhase
    });
    
    updateMessageCount();
}

function formatMessage(text) {
    // Convert markdown-like formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/✅/g, '<span style="color: #4CAF50;">✅</span>')
        .replace(/⚠️/g, '<span style="color: #FF9800;">⚠️</span>')
        .replace(/💡/g, '<span style="color: #2196F3;">💡</span>')
        .replace(/📅/g, '<span style="color: #3F51B5;">📅</span>')
        .replace(/💰/g, '<span style="color: #4CAF50;">💰</span>');
}

function showActionButtons(buttons) {
    actionButtons.innerHTML = '';
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `action-btn ${btn.type || ''}`;
        button.innerHTML = `
            ${btn.icon ? `<i class="${btn.icon} btn-icon"></i>` : ''}
            <span class="btn-text">${btn.text}</span>
        `;
        button.onclick = btn.action;
        actionButtons.appendChild(button);
    });
}

function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
}

function updateStatus(text) {
    statusText.textContent = text;
}

function playSound(type = 'notification') {
    if (muteEnabled) return;
    
    const sound = type === 'click' ? clickSound : notificationSound;
    sound.currentTime = 0;
    sound.play().catch(e => console.log('Sound error:', e));
}

// Modal Functions
function showProfileSummary() {
    updateProfileDisplay();
    profileModal.style.display = 'flex';
}

function showHelp() {
    helpModal.style.display = 'flex';
}

function closeModal() {
    profileModal.style.display = 'none';
}

function closeHelp() {
    helpModal.style.display = 'none';
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
    
    updateCompletion();
}

function editProfile() {
    closeModal();
    userProfile.completed = false;
    startProfileSetup();
}

function shareProfile() {
    const profileText = `My Study Abroad Profile:\n\n` +
        `🌍 Country: ${userProfile.targetCountry || 'Not selected'}\n` +
        `🎓 Level: ${userProfile.intendedLevel || 'Not selected'}\n` +
        `📊 Academic: ${userProfile.academicPerformance || 'Not selected'}\n` +
        `⏳ Gap: ${userProfile.studyGap || 'Not selected'}\n` +
        `🗣️ English: ${userProfile.englishTestStatus || 'Not selected'}\n` +
        `💰 Funding: ${userProfile.fundingPlan || 'Not selected'}\n\n` +
        `Generated by Study Abroad Chat Assistant`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Study Abroad Profile',
            text: profileText,
            url: window.location.href
        });
    } else {
        copyToClipboard(profileText);
        alert('Profile copied to clipboard!');
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        addMessage('bot', '✅ Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// New Features
function toggleMute() {
    muteEnabled = !muteEnabled;
    const icon = muteBtn.querySelector('i');
    icon.className = muteEnabled ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    addMessage('bot', muteEnabled ? '🔇 Sounds muted' : '🔊 Sounds enabled');
}

function exportChat() {
    const chatData = {
        profile: userProfile,
        conversation: conversationHistory,
        timestamp: new Date().toISOString(),
        sessionDuration: sessionTimerElement.textContent
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `study-abroad-chat-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addMessage('bot', '📥 Chat history exported successfully!');
}

function scrollToTop() {
    chatArea.scrollTop = 0;
    playSound('click');
}

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
    playSound('click');
}

function clearMessages() {
    if (confirm('Clear all messages? This cannot be undone.')) {
        chatArea.innerHTML = '';
        addMessage('bot', '🗑️ Messages cleared. Conversation continues...');
    }
}

function toggleQuickNav() {
    quickNavModal.style.display = 'flex';
}

function closeQuickNav() {
    quickNavModal.style.display = 'none';
}

function jumpToPhase(phase) {
    closeQuickNav();
    
    switch(phase) {
        case 'welcome':
            resetChat();
            break;
        case 'country':
            startProfileSetup();
            break;
        case 'level':
            if (!userProfile.targetCountry) {
                addMessage('bot', 'Please complete country selection first.');
                startProfileSetup();
            } else {
                showLevelSelection();
            }
            break;
        case 'topics':
            showTopicSelection();
            break;
        case 'financial':
            showFinancialRequirements();
            break;
        case 'scholarships':
            showScholarships();
            break;
        case 'visa':
            showVisaExpectations();
            break;
        case 'counselor':
            showCounselorConnection();
            break;
    }
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
            lastUpdated: null,
            conversationId: generateConversationId()
        };
        
        localStorage.removeItem('studyAbroadProfile');
        chatArea.innerHTML = '';
        actionButtons.innerHTML = '';
        conversationHistory = [];
        messageCount = 0;
        messageCountElement.textContent = 'Messages: 0';
        
        if (sessionTimer) {
            clearInterval(sessionTimer);
            sessionTimer = null;
        }
        
        sessionStartTime = Date.now();
        sessionTimerElement.textContent = '00:00';
        startSessionTimer();
        
        showWelcomePhase();
    }
}
