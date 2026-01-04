// User profile storage
let userProfile = {
    targetCountry: '',
    intendedLevel: '',
    academicPerformance: '',
    studyGap: '',
    englishTestStatus: '',
    fundingPlan: '',
    completed: false
};

// Conversation state
let currentPhase = 'welcome';
let soundEnabled = true;
let conversationHistory = [];

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const chatContainer = document.getElementById('chatContainer');
const chatArea = document.getElementById('chatArea');
const quickActions = document.getElementById('quickActions');
const chatInput = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const statusText = document.getElementById('statusText');
const profileModal = document.getElementById('profileModal');
const notificationSound = document.getElementById('notificationSound');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load previous conversation if exists
    const savedProfile = localStorage.getItem('studyAbroadProfile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
    }
    
    // Auto-start chat for returning users
    if (userProfile.completed) {
        setTimeout(startChat, 500);
    }
});

// Start chat function
function startChat() {
    welcomeScreen.style.display = 'none';
    chatContainer.style.display = 'flex';
    chatInput.focus();
    
    // Show welcome message if new user
    if (!userProfile.completed) {
        showWelcomePhase();
    } else {
        showTopicSelection();
        updateStatus('Ready to help');
    }
}

// Phase 1: Welcome
function showWelcomePhase() {
    updateProgress(0, 'Starting conversation...');
    updateStatus('Getting to know you');
    
    showTyping(() => {
        addMessage('bot', `👋 Hi! I'm your Study Abroad Assistant.\n\nI can help you understand requirements, costs, scholarships, and visa expectations — based on your profile.\n\n⏱ Takes about 2–3 minutes.`);
        
        showQuickActions([
            { text: '🎓 Start Profile Setup', action: () => startProfileSetup(), type: 'primary' },
            { text: '👀 Just Exploring', action: () => showTopicSelection() }
        ]);
    });
}

function startProfileSetup() {
    updateProgress(10, 'Profile Setup - Step 1 of 6');
    updateStatus('Question 1/6');
    showCountrySelection();
}

// Profile collection functions
function showCountrySelection() {
    showTyping(() => {
        addMessage('bot', '🌍 Which country are you planning to study in?');
        
        showQuickActions([
            { text: '🇦🇺 Australia', action: () => saveAnswer('targetCountry', 'Australia', showLevelSelection) },
            { text: '🇨🇦 Canada', action: () => saveAnswer('targetCountry', 'Canada', showLevelSelection) },
            { text: '🇬🇧 UK', action: () => saveAnswer('targetCountry', 'UK', showLevelSelection) },
            { text: '🇺🇸 USA', action: () => saveAnswer('targetCountry', 'USA', showLevelSelection) },
            { text: '🇳🇿 New Zealand', action: () => saveAnswer('targetCountry', 'New Zealand', showLevelSelection) },
            { text: '🤔 Not Sure', action: () => saveAnswer('targetCountry', 'Not Sure', showLevelSelection) }
        ]);
    });
}

function showLevelSelection() {
    updateProgress(25, 'Profile Setup - Step 2 of 6');
    updateStatus('Question 2/6');
    showTyping(() => {
        addMessage('bot', '🎓 What level are you planning to study?');
        
        showQuickActions([
            { text: 'Diploma', action: () => saveAnswer('intendedLevel', 'Diploma', showAcademicPerformance) },
            { text: 'Bachelor\'s', action: () => saveAnswer('intendedLevel', 'Bachelor\'s', showAcademicPerformance) },
            { text: 'Master\'s', action: () => saveAnswer('intendedLevel', 'Master\'s', showAcademicPerformance) },
            { text: 'PhD', action: () => saveAnswer('intendedLevel', 'PhD', showAcademicPerformance) }
        ]);
    });
}

function showAcademicPerformance() {
    updateProgress(40, 'Profile Setup - Step 3 of 6');
    updateStatus('Question 3/6');
    showTyping(() => {
        addMessage('bot', '📊 What best describes your academic result?');
        
        showQuickActions([
            { text: 'Below Average', action: () => saveAnswer('academicPerformance', 'Below Average', showStudyGap) },
            { text: 'Average', action: () => saveAnswer('academicPerformance', 'Average', showStudyGap) },
            { text: 'Good', action: () => saveAnswer('academicPerformance', 'Good', showStudyGap) },
            { text: 'Strong', action: () => saveAnswer('academicPerformance', 'Strong', showStudyGap) }
        ]);
    });
}

function showStudyGap() {
    updateProgress(55, 'Profile Setup - Step 4 of 6');
    updateStatus('Question 4/6');
    showTyping(() => {
        addMessage('bot', '⏳ Do you have any gap after your last study?');
        
        showQuickActions([
            { text: 'No Gap', action: () => saveAnswer('studyGap', 'No Gap', showEnglishTestStatus) },
            { text: '1 Year', action: () => saveAnswer('studyGap', '1 Year', showEnglishTestStatus) },
            { text: '2-3 Years', action: () => saveAnswer('studyGap', '2-3 Years', showEnglishTestStatus) },
            { text: 'More than 3 Years', action: () => saveAnswer('studyGap', 'More than 3 Years', showEnglishTestStatus) }
        ]);
    });
}

function showEnglishTestStatus() {
    updateProgress(70, 'Profile Setup - Step 5 of 6');
    updateStatus('Question 5/6');
    showTyping(() => {
        addMessage('bot', '🗣️ What is your English test status?');
        
        showQuickActions([
            { text: 'IELTS/PTE Completed', action: () => saveAnswer('englishTestStatus', 'Completed', showFundingPlan) },
            { text: 'Booked/Planning', action: () => saveAnswer('englishTestStatus', 'Booked/Planning', showFundingPlan) },
            { text: 'Not Started', action: () => saveAnswer('englishTestStatus', 'Not Started', showFundingPlan) }
        ]);
    });
}

function showFundingPlan() {
    updateProgress(85, 'Profile Setup - Step 6 of 6');
    updateStatus('Question 6/6');
    showTyping(() => {
        addMessage('bot', '💰 How do you plan to fund your studies?');
        
        showQuickActions([
            { text: 'Parents/Sponsor', action: () => saveAnswer('fundingPlan', 'Parents/Sponsor', showProfileConfirmation) },
            { text: 'Education Loan', action: () => saveAnswer('fundingPlan', 'Education Loan', showProfileConfirmation) },
            { text: 'Combination', action: () => saveAnswer('fundingPlan', 'Combination', showProfileConfirmation) },
            { text: 'Not Sure Yet', action: () => saveAnswer('fundingPlan', 'Not Sure', showProfileConfirmation) }
        ]);
    });
}

function showProfileConfirmation() {
    userProfile.completed = true;
    updateProgress(100, 'Profile Complete!');
    updateStatus('Ready to help');
    
    // Save profile to localStorage
    localStorage.setItem('studyAbroadProfile', JSON.stringify(userProfile));
    
    showTyping(() => {
        addMessage('bot', `✅ Profile saved successfully!\n\nI now understand:\n• Country: ${userProfile.targetCountry}\n• Level: ${userProfile.intendedLevel}\n• Academic: ${userProfile.academicPerformance}\n\nChoose what you'd like to know:`);
        
        updateProfileDisplay();
        
        setTimeout(() => {
            showTopicSelection();
        }, 1000);
    });
}

// Topic Selection
function showTopicSelection() {
    currentPhase = 'topicSelection';
    updateStatus('Choose a topic');
    
    showTyping(() => {
        addMessage('bot', 'What would you like to understand better?');
        
        showQuickActions([
            { text: '💰 Financial Requirements', action: () => showFinancialRequirements(), type: 'primary' },
            { text: '🎓 Scholarships', action: () => showScholarships() },
            { text: '📄 Visa Expectations', action: () => showVisaExpectations() },
            { text: '🗣️ English Test Guidance', action: () => showEnglishGuidance() },
            { text: '📅 Intake & Timelines', action: () => showIntakeTimelines() },
            { text: '🤝 Talk to Counselor', action: () => showCounselorConnection() }
        ]);
    });
}

// Topic responses (simplified versions)
function showFinancialRequirements() {
    updateStatus('Financial Guidance');
    showTyping(() => {
        let message = `For ${userProfile.targetCountry} (${userProfile.intendedLevel}), you'll need to show funds for:\n\n`;
        message += `• Tuition: ${getTuitionEstimate()}\n`;
        message += `• Living: ${getLivingEstimate()}\n`;
        message += `• Total 1st year: ${getTotalEstimate()}\n\n`;
        
        if (userProfile.fundingPlan === 'Education Loan') {
            message += `💡 With an education loan, ensure documentation clearly shows loan approval and disbursement timeline.`;
        }
        
        addMessage('bot', message);
        
        showQuickActions([
            { text: '🎓 Scholarships', action: () => showScholarships() },
            { text: '📄 Visa Help', action: () => showVisaExpectations() },
            { text: '🔙 Main Menu', action: () => showTopicSelection() }
        ]);
    });
}

function showScholarships() {
    updateStatus('Scholarship Info');
    showTyping(() => {
        let message = `Scholarship opportunities for ${userProfile.intendedLevel}:\n\n`;
        
        if (userProfile.academicPerformance === 'Strong') {
            message += `🏆 Excellent! With strong academics, you're competitive for:\n`;
            message += `• University merit scholarships\n`;
            message += `• Country-specific scholarships\n`;
            message += `• Research grants (if applicable)\n\n`;
        } else {
            message += `📚 You can still find:\n`;
            message += `• Partial tuition waivers\n`;
            message += `• Early bird discounts\n`;
            message += `• Country/institution specific offers\n\n`;
        }
        
        message += `Apply 6-9 months before intake for best chances.`;
        
        addMessage('bot', message);
        
        showQuickActions([
            { text: '💰 Finances', action: () => showFinancialRequirements() },
            { text: '📅 Timeline', action: () => showIntakeTimelines() },
            { text: '🔙 Main Menu', action: () => showTopicSelection() }
        ]);
    });
}

function showVisaExpectations() {
    updateStatus('Visa Guidance');
    showTyping(() => {
        let message = `Visa requirements for ${userProfile.targetCountry}:\n\n`;
        message += `📋 Documents needed:\n`;
        message += `• Proof of admission\n`;
        message += `• Financial evidence\n`;
        message += `• English test results\n`;
        message += `• Genuine student statement\n\n`;
        
        if (userProfile.studyGap !== 'No Gap') {
            message += `📝 Important: Clearly explain your ${userProfile.studyGap.toLowerCase()} gap in your application.`;
        }
        
        addMessage('bot', message);
        
        showQuickActions([
            { text: '🗣️ English Help', action: () => showEnglishGuidance() },
            { text: '🤝 Counselor', action: () => showCounselorConnection() },
            { text: '🔙 Main Menu', action: () => showTopicSelection() }
        ]);
    });
}

function showEnglishGuidance() {
    updateStatus('English Test Help');
    showTyping(() => {
        let message = '';
        
        if (userProfile.englishTestStatus === 'Completed') {
            message += `✅ Great! Make sure scores meet university requirements.\n\n`;
        } else if (userProfile.englishTestStatus === 'Booked/Planning') {
            message += `📅 Plan your test 2-3 months before application deadlines.\n\n`;
        } else {
            message += `⏰ Start test prep now! Most students need 2-4 months.\n\n`;
        }
        
        message += `🎯 Target scores:\n`;
        message += `• Diploma/Bachelor's: IELTS 6.0-6.5\n`;
        message += `• Master's/PhD: IELTS 6.5-7.0+\n\n`;
        message += `Book through official centers only.`;
        
        addMessage('bot', message);
        
        showQuickActions([
            { text: '📅 Timeline', action: () => showIntakeTimelines() },
            { text: '🎓 Scholarships', action: () => showScholarships() },
            { text: '🔙 Main Menu', action: () => showTopicSelection() }
        ]);
    });
}

function showIntakeTimelines() {
    updateStatus('Timeline Planning');
    showTyping(() => {
        const timelines = {
            'Australia': 'Feb, Jul, Nov',
            'Canada': 'Jan, May, Sep',
            'UK': 'Jan, Sep',
            'USA': 'Jan, Aug',
            'New Zealand': 'Feb, Jul'
        };
        
        const intake = timelines[userProfile.targetCountry] || 'Varies';
        
        let message = `📅 ${userProfile.targetCountry} Intakes: ${intake}\n\n`;
        message += `⏰ Recommended schedule:\n`;
        message += `Now → Research & shortlist\n`;
        message += `+1 month → English test prep\n`;
        message += `+3 months → Applications\n`;
        message += `+6 months → Visa process\n`;
        message += `+8 months → Travel prep\n\n`;
        
        if (userProfile.englishTestStatus === 'Not Started') {
            message += `⚠️ Start English prep immediately!`;
        }
        
        addMessage('bot', message);
        
        showQuickActions([
            { text: '🤝 Counselor', action: () => showCounselorConnection() },
            { text: '🔙 Main Menu', action: () => showTopicSelection() }
        ]);
    });
}

function showCounselorConnection() {
    updateStatus('Counselor Connect');
    showTyping(() => {
        addMessage('bot', `👨‍💼 **Free Expert Consultation Available!**\n\nA study abroad counselor can:\n\n• Review your complete profile\n• Suggest best-fit universities\n• Guide application process\n• Help with visa documentation\n\nAll guidance is free!`);
        
        showQuickActions([
            { text: '📲 WhatsApp Now', action: () => connectViaWhatsApp(), type: 'primary' },
            { text: '📅 Schedule Call', action: () => scheduleCall() },
            { text: '🔙 Main Menu', action: () => showTopicSelection() }
        ]);
    });
}

function connectViaWhatsApp() {
    const phone = '+1234567890';
    const message = `Hi! I need study abroad help. My profile: ${userProfile.targetCountry}, ${userProfile.intendedLevel}, ${userProfile.academicPerformance}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    addMessage('user', 'Requested WhatsApp consultation');
    showTyping(() => {
        addMessage('bot', '✅ Counselor notified! They\'ll contact you shortly. Anything else?');
        setTimeout(showTopicSelection, 1500);
    });
}

function scheduleCall() {
    addMessage('user', 'Requested callback');
    showTyping(() => {
        addMessage('bot', '📞 A counselor will call you within 24 hours. Need immediate help? Try WhatsApp.');
        setTimeout(showTopicSelection, 1500);
    });
}

// Utility Functions
function saveAnswer(field, value, nextFunction) {
    userProfile[field] = value;
    addMessage('user', value);
    playSound();
    setTimeout(nextFunction, 500);
}

function showTyping(callback, duration = 1000) {
    typingIndicator.style.display = 'flex';
    
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        callback();
    }, duration);
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
        time: new Date().toISOString()
    });
}

function formatMessage(text) {
    // Convert line breaks to <br>
    return text.replace(/\n/g, '<br>');
}

function showQuickActions(buttons) {
    quickActions.innerHTML = '';
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `action-btn ${btn.type || ''}`;
        button.innerHTML = btn.text;
        button.onclick = btn.action;
        quickActions.appendChild(button);
    });
}

function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
}

function updateStatus(text) {
    statusText.textContent = text;
}

function playSound() {
    if (soundEnabled) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(e => console.log('Sound error:', e));
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = document.getElementById('soundIcon');
    icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

// Input handling
function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage('user', text);
    chatInput.value = '';
    
    // Handle free text input
    if (currentPhase === 'topicSelection') {
        showTyping(() => {
            addMessage('bot', 'I understand! Here are the most relevant options for you:');
            setTimeout(showTopicSelection, 500);
        });
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    } else if (event.key === '/') {
        event.preventDefault();
        showMenu();
    }
}

function showMenu() {
    addMessage('user', 'Show menu');
    showTyping(() => {
        addMessage('bot', 'Here are all available options:');
        showTopicSelection();
    });
}

// Profile modal functions
function showProfileSummary() {
    updateProfileDisplay();
    profileModal.style.display = 'flex';
}

function closeModal() {
    profileModal.style.display = 'none';
}

function updateProfileDisplay() {
    document.getElementById('profileCountry').querySelector('.value').textContent = userProfile.targetCountry || 'Not selected';
    document.getElementById('profileLevel').querySelector('.value').textContent = userProfile.intendedLevel || 'Not selected';
    document.getElementById('profileAcademic').querySelector('.value').textContent = userProfile.academicPerformance || 'Not selected';
    document.getElementById('profileGap').querySelector('.value').textContent = userProfile.studyGap || 'Not selected';
    document.getElementById('profileEnglish').querySelector('.value').textContent = userProfile.englishTestStatus || 'Not selected';
    document.getElementById('profileFunding').querySelector('.value').textContent = userProfile.fundingPlan || 'Not selected';
}

function editProfile() {
    closeModal();
    userProfile.completed = false;
    startProfileSetup();
}

function resetChat() {
    userProfile = {
        targetCountry: '',
        intendedLevel: '',
        academicPerformance: '',
        studyGap: '',
        englishTestStatus: '',
        fundingPlan: '',
        completed: false
    };
    localStorage.removeItem('studyAbroadProfile');
    chatArea.innerHTML = '';
    quickActions.innerHTML = '';
    showWelcomePhase();
}

// Helper functions for estimates
function getTuitionEstimate() {
    const estimates = {
        'Australia': 'AUD $20,000 - $45,000',
        'Canada': 'CAD $15,000 - $35,000',
        'UK': '£10,000 - £30,000',
        'USA': '$20,000 - $50,000',
        'New Zealand': 'NZD $20,000 - $40,000'
    };
    return estimates[userProfile.targetCountry] || 'Varies by institution';
}

function getLivingEstimate() {
    const estimates = {
        'Australia': 'AUD $20,000/year',
        'Canada': 'CAD $15,000/year',
        'UK': '£12,000/year',
        'USA': '$15,000/year',
        'New Zealand': 'NZD $15,000/year'
    };
    return estimates[userProfile.targetCountry] || 'Varies by city';
}

function getTotalEstimate() {
    // Simple calculation for demo
    const base = {
        'Australia': 'AUD $40,000',
        'Canada': 'CAD $30,000',
        'UK': '£22,000',
        'USA': '$35,000',
        'New Zealand': 'NZD $35,000'
    };
    return base[userProfile.targetCountry] || 'Varies';
}
